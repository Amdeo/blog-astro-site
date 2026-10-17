---
title: 'Graphify 的抽取链路：结构关系、模型推断和关系证据怎么分开'
published: 2026-04-09
updated: 2026-10-17
description: '追踪 Graphify 的抽取与建图链路：三类置信标签和分数到底代表什么。'
tags: ['AI', '知识图谱', 'Claude Code', 'Python', '工具']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://github.com/safishamsi/graphify'
licenseName: 'MIT'
licenseUrl: 'https://github.com/safishamsi/graphify/blob/main/LICENSE'
---

读知识图谱时，图里连上的边不一定是事实，边上的分数也不一定是概率。Graphify 把关系分成三类标签，并要求每条边标出来源文件。[2][5] 沿着这些字段往回查，比直接相信一张连线图更可靠。

这篇沿代码看一遍链路：哪些部分是确定性的结构抽取，哪些部分依赖模型，以及标签和分数各自的真实含义。

> 取材说明：所有引文固定到 graphify 提交 `91f4d120`。文中“实际执行”限于我在本地离线跑通的部分（schema 校验函数、已提交输出文件的统计），没有安装或运行完整的 Graphify，也没有调用模型。

<!--more-->

## 链路和它的输入依赖

架构文档给出的流水线是七个阶段：

```text
detect() → extract() → build_graph() → cluster() → analyze() → report() → export()
```

每个阶段是独立模块里的一个函数，阶段之间用普通 Python dict 和 NetworkX 图通信。[2] 这条链上真正的分叉点在第 2 步。

`extract()` 只处理代码：按后缀分派到各语言提取器（`.py .js .ts .tsx .go .rs .java .c .h .cpp .cc .cxx .hpp .rb .cs .kt .kts .scala .php`），用 tree-sitter 解析 AST，不调用模型。[3] 同一个文件里的 `collect_files()` 也只收集这些后缀，并跳过路径中任何以点开头的目录段（`.git` 之类不会进来）。[3]

文档、论文、图片不走这条函数，它们由 skill 交给 Claude 子代理抽取。`skill.md` 里的子代理提示词按文件类型分工：代码文件只抽“AST 找不到的语义边”，不要重复抽 import；图片要用视觉理解它是什么（截图抽布局决策、图表抽指标与结论、白板抽想法和箭头，不确定的读法标 AMBIGUOUS）。[7]

这条分叉决定了一件事：**代码路径可以在没有模型的情况下离线复跑，文档与图片路径不行**。README 自己也承认这个分层——`--watch` 在代码文件保存时即时重建（只跑 AST，不调模型），文档或图片变更则只提醒你去跑 `--update` 重走模型那一遍。[1]

## 节点与边的 schema

`validate.py` 是构图前的门，它强制节点必填 `id`、`label`、`file_type`、`source_file`（`file_type` 只能是 `code|document|paper|image`），边必填 `source`、`target`、`relation`、`confidence`、`source_file`（`confidence` 只能是 `EXTRACTED|INFERRED|AMBIGUOUS`）。[5]

边上的 **`source_file`** 是必填字段，而 `source_location`（形如 `L42`）不是这份校验器强制要求的字段。[2][5] 因此，schema 合格最多保证记录了来源路径，不保证每条关系都有准确行号，更不保证该行真的支持这条关系。复核时仍须打开源文件检查上下文。

我用仓库里的 `validate.py` 原文件离线跑了三组样例：

```text
== case A: schema-conformant extraction ==
errors: []
assert_valid: passed

== case B: invented confidence label ==
  - Edge 0 has invalid confidence 'PROBABLY' - must be one of ['AMBIGUOUS', 'EXTRACTED', 'INFERRED']

== case C: edge to an external/stdlib node never emitted as a node ==
  - Edge 1 target 'ext_urllib3_PoolManager' does not match any node id
```

第三组有个后续值得注意：构图层 `build_from_json()` 会把这类 “does not match any node id” 的错误过滤掉，直接跳过这条边，而不是让整次运行失败——因为指向标准库或外部依赖的悬空边本来就是预期情况。[4] 所以校验器和构图层是两道不同的门：前者报给你看，后者容忍并丢弃。排查 import 边为何没有进入图时，应把这种跳过逻辑列入检查。

## 三类标签的实际含义

架构文档对三者的定义写得很短：[2]

| 标签 | 含义 |
| --- | --- |
| `EXTRACTED` | 关系在源文件里显式存在：import、直接调用、引用、“see §3.2” |
| `INFERRED` | 合理推断：调用图第二遍、上下文共现、共享数据结构 |
| `AMBIGUOUS` | 不确定，标记待人工复核，而不是删掉 |

代码路径里的 `INFERRED` 值得单独说清楚，因为它和“模型猜的”不是一回事。`extract.py` 的注释写得很直白：第二遍解析把文件级 import 提升成类级边——

```text
auth.py --imports_from--> models.py          （太直白，被过滤掉）
DigestAuth --uses--> Response [INFERRED]     （跨文件，才有信息量）
```

也就是说，这类 `INFERRED` 表示“两个实体之间确实存在跨文件的结构关联（import 链加类名解析），但没有直接调用语句”。它是确定性规则跑出来的，不是模型判断。[3]

## 分数不是概率

这里要分开读三种分数：提取器的权重、模型自评，以及报告的排序分数。

**代码路径的 `weight` 是常量。** 每个语言的提取器在构造 INFERRED 的 `calls` 边时都写死 `"weight": 0.8`，EXTRACTED 的 import 边则是 `"weight": 1.0`。[3] 仓库提交的 `worked/httpx/graph.json` 可以印证：144 个节点、330 条边，其中 174 条 EXTRACTED、156 条 INFERRED，随便抽一条 INFERRED 边长这样——

```json
{
  "relation": "uses",
  "confidence": "INFERRED",
  "source_file": "worked/httpx/raw/client.py",
  "source_location": "L6",
  "weight": 0.8
}
```

0.8 是每个提取器里都一样的字面量，不是“八成的把握”。[3][8]

**模型路径的 `confidence_score` 是自评分档。** `skill.md` 要求模型自己给分，档位是写死的：EXTRACTED 必须 1.0；INFERRED 落在 0.4–0.9（强结构推断 0.8–0.9、合理但不确定 0.6–0.7、弱推断 0.4–0.5）；AMBIGUOUS 是 0.1–0.3。[7] 这是被规定出来的分档，不是校准过的概率，拿它当阈值开关会误导自己。

**“意外连接”的分数是手工加权和。** `analyze.py` 的 `_surprise_score()` 把一条跨文件边拆成几个加分项：置信度（AMBIGUOUS +3 / INFERRED +2 / EXTRACTED +1）、跨文件类型 +2、跨顶层目录 +2、跨 Leiden 社区 +1、peripheral 节点连到 hub +1，`semantically_similar_to` 再乘 1.5。[6] 它的用途是排序给人看，所以“不确定的边”反而加分最高——分数越高表示越值得人工看一眼，不是越可信。

这一点在报告里也能看到：`worked/httpx/GRAPH_REPORT.md` 的 Suggested Questions 直接生成“Are the 12 inferred relationships involving Client ... actually correct?”这类问题，把 INFERRED 边当成待验证项交回读者。[9]

## 图存下来长什么样

导出物包括 `graph.html`、`obsidian/`、`wiki/`、`GRAPH_REPORT.md`、`graph.json` 和缓存目录。[1] 持久化那份 `graph.json` 是无向图（顶层 `"directed": false`），方向信息保存在每条边的 `_src` / `_tgt` 属性上——因为 NetworkX 的无向图会丢方向，而展示函数还需要它。[4]

我核对了仓库里提交的那份：节点属性有 `community`、`file_type`、`source_file`、`source_location` 等，边的属性有 `_src`、`_tgt`、`confidence`、`relation`、`source_file`、`source_location`、`weight`。[8]

顺带一个仓库自带的诚实样本：`worked/httpx/` 是合成的 6 文件 Python 库，提取结果是 53% EXTRACTED / 47% INFERRED / 0% AMBIGUOUS，token 成本 0——因为语料全是代码，走的正是无模型的 AST 路径。[9] 该目录的 README 也不打圆场：合成语料约 1x，“6 个文件本来就装得进上下文，这里的收益是结构清晰，不是压缩”。[10]

## 头条数字怎么读

README 最显眼的数字是每条查询少 71.5 倍 token。[1] 同一份 README 的对照表给出了它的边界：52 个文件（代码加论文加图片）是 71.5x，4 个文件是 5.4x，6 文件合成语料约 1x，并写明“token 减少量随语料规模放大”。[1]

这是项目方报告的案例结果。`worked/` 目录提供了输入与输出，但不同案例的复跑依赖不同：混合材料的语义抽取依赖代理和模型，前面的纯代码 AST 路径则不需要模型。本文两种路径都没有完整重跑，因此不提供压缩比的独立验证。

## 验证范围与资料版本

- **修订日期：2026-10-17。** 原发布日期保留；删去场景枚举、技术栈罗列和结尾的口号式收束。
- **取材版本：** graphify 提交 `91f4d120b630ee35c79bf3c75ccd186870a808f9`（2026-05-14）。README、ARCHITECTURE、各模块源码与 worked 样例的引文均来自该提交。
- **实际执行：** 使用该提交的 `graphify/validate.py` 离线运行三组 schema 样例，结果摘录在上文；解析仓库提交的 `worked/httpx/graph.json` 做属性与置信标签统计。这些离线检查不联网、不调用模型。
- **未验证：** tree-sitter 的 AST 提取与跨文件解析、Leiden 聚类、模型侧抽取与 `confidence_score` 的实际取值、可视化与 MCP/Wiki 输出，以及任何 token 压缩比。文中没有宣称跑通过真实项目。

## Sources

[1] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/README.md — graphify README @91f4d12
[2] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/ARCHITECTURE.md — graphify ARCHITECTURE.md @91f4d12
[3] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/graphify/extract.py — graphify/extract.py @91f4d12
[4] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/graphify/build.py — graphify/build.py @91f4d12
[5] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/graphify/validate.py — graphify/validate.py @91f4d12
[6] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/graphify/analyze.py — graphify/analyze.py @91f4d12
[7] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/graphify/skill.md — graphify/skill.md @91f4d12
[8] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/worked/httpx/graph.json — worked/httpx/graph.json @91f4d12
[9] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/worked/httpx/GRAPH_REPORT.md — worked/httpx/GRAPH_REPORT.md @91f4d12
[10] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/worked/httpx/README.md — worked/httpx/README.md @91f4d12

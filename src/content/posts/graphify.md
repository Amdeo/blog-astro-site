---
title: 'Graphify：把一堆文件整理成一张能问的知识图谱'
published: 2026-04-09
updated: 2026-10-17
description: '把文件夹里的代码、笔记、论文和截图整理成可浏览的知识图谱。'
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

Graphify 是给 Claude Code 使用的技能，也就是一套让助手完成特定任务的操作说明。它把文件夹里的代码、笔记、论文和截图整理成一张知识图谱：[1] 图上的点表示概念、人物或代码里的对象，线表示它们有什么关系。

如果你攒了不少资料，单个文件都能打开，却很难看出它们之间的联系，这种图就可能有用。装好相关环境后，在 Claude Code 里用 `/graphify` 指向资料目录，它会按技能流程处理。[1] 它不是独立的聊天应用，也不是保证把资料读对的事实核查器。

<!--more-->

## 一个资料文件夹会发生什么

假设你有一个 `raw/` 文件夹：几篇论文 PDF、一些 markdown 笔记、几张截图，还有一小段代码。

在 Claude Code 的对话里输入下面的技能调用；这不是在普通终端里执行的命令：[1]

```text
/graphify ./raw
```

按文档描述，它先查看文件夹内容，抽取对象与关系，再把它们连成图，并把联系紧密的节点分组，最后生成报告和可视文件。[2] 这些分组在项目里叫「社区」，不是指真实的人群。

文档列出的输出目录叫 `graphify-out/`，主要内容如下：[1]

```text
graphify-out/
├── graph.html       可交互的图：点节点、搜索、按社区过滤
├── obsidian/        给笔记应用 Obsidian 打开的目录
├── GRAPH_REPORT.md  文字报告：核心节点、意外连接、建议问题
├── graph.json       持久化的图，几周后还能直接查
└── cache/           只对改动过的文件重跑抽取
```

拿到这堆东西以后，你能做三类事：

- 打开 `graph.html`，或看报告列出的核心节点，从联系较多的对象开始认识资料。[1] 连接多可以作为阅读线索，但不自动等于最重要。
- 报告把跨文件的关系单独排出来，比如某个超时配置和一个 URL 类型之间的关联，并且标出它来自哪个文件的哪一行，你可以顺着回去核对上下文。[9]
- 用 `/graphify query "..."` 从相关节点出发走一层邻域来回答，用 `/graphify path "A" "B"` 找两个概念之间的最短路径。[1]

仓库里自带一个小样本可以看出它长什么样：一个 6 文件的 Python 库，生成 144 个节点、330 条边，分成 6 个社区。[8][9]

## 代码是自己解析的，文档和图片要模型读懂

图谱里的关系有两条主要来源。理解这个区别，有助于判断每条关系该怎样回查。

代码部分使用 tree-sitter 这类语法解析工具，按代码结构寻找导入和调用等关系，不依靠模型阅读代码来猜。[3] 依赖准备好后，这条抽取路径不需要调用模型；本文没有实跑完整抽取。

文档、论文、图片没有固定语法可解析，这部分交给 Claude 子代理去读：从文字里抽出概念和引用关系；图片则用视觉理解它到底是什么，截图看布局，图表看指标，白板看想法和箭头。[7]

这个分界也体现在自动同步上：代码文件保存时即时重建（只跑语法树，不需要模型），文档或图片变了只提醒你手动跑一次 `--update`。[1]

所以，如果你的资料以代码为主，产出比较可预测；如果以论文和截图为主，抽取质量取决于模型读得准不准，需要你回过头核对。

## 怎么分清“找到的”和“推出来的”

Graphify 生成的每条边都带一个标签：[1][2]

| 标签 | 含义 |
| --- | --- |
| `EXTRACTED` | 关系在源文件里明写着，比如 import、直接调用、引用、“see §3.2” |
| `INFERRED` | 合理推断，比如调用图的第二遍、上下文里一起出现、共享数据结构 |
| `AMBIGUOUS` | 不确定，标出来等人工复核，而不是直接删掉 |

这些标签说明工具认为关系是怎样得到的，不是事实正确的认证。特别是模型参与抽取的资料，即使标为 `EXTRACTED`，也应回到原文件核对是否真的写了这件事。

有一类容易误会：代码路径里的 `INFERRED` 不都是“模型猜的”。第二遍解析会把文件级的 import 提升成类级的关系，这类边是确定性规则跑出来的。[3] 真正依赖模型判断的推断，主要出现在文档和图片那一路。

## 它还能怎么接进工作流

已有图谱之后，还可以按文档配置代码变动后的自动更新，或者把内容生成百科式文章，方便沿着文件阅读。[1] 它也支持启动本地查询服务，让其他 AI 助手访问图谱。[1] 这些属于进一步集成，不是第一次认识和使用图谱的前置条件。

## 什么时候值得用

如果只有几份短资料，直接搜索和阅读可能更省事。资料较多、跨文件关系难以记住时，图谱更值得尝试；不要为了处理两篇笔记先搭一套复杂流程。

项目还宣传过减少模型输入量的效果，但小样本说明自己也强调：少量文件本来就能放进上下文，收益主要是结构清晰，不是压缩。[10] 应先看图谱能否帮你找到有用关系，再判断维护它是否值得。

## 怎样开始

前置要求是 Claude Code 和 Python 3.10 以上。[1]

```bash
pip install graphifyy && graphify install
```

上面是文档安装示例，本文未执行。Python 包索引 PyPI 上的包名是 `graphifyy`，命令仍然是 `graphify`。[1] 环境准备好后，先用一小份可分享的资料，在 Claude Code 中调用 `/graphify .`，再检查报告中的关系能否回到原文件得到支持。

<details>
<summary>核验范围与资料版本</summary>

- 取材固定到 graphify 提交 `91f4d120b630ee35c79bf3c75ccd186870a808f9`（2026-05-14），README、架构文档、各模块源码与 worked 样例的引文都来自该提交。
- 实际执行：离线运行了仓库自带的 schema 校验函数，用三组样例分别验证合法输入、伪造置信标签、指向不存在节点的边，结果与预期一致；[5] 并解析了仓库提交的 `worked/httpx/graph.json`，确认 144 节点、330 条边，其中 174 条 EXTRACTED、156 条 INFERRED。[8] 这些检查不联网、不调用模型。
- 未验证：tree-sitter 的实际抽取与跨文件解析、聚类、模型侧的抽取与自评分、`graph.html` 与 wiki/MCP 输出，以及任何 token 压缩比。本文没有安装或完整运行 Graphify，也没有调用模型。

</details>

## Sources

[1] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/README.md — graphify README @91f4d12
[2] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/ARCHITECTURE.md — graphify ARCHITECTURE.md @91f4d12
[3] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/graphify/extract.py — graphify/extract.py @91f4d12
[5] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/graphify/validate.py — graphify/validate.py @91f4d12
[7] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/graphify/skill.md — graphify/skill.md @91f4d12
[8] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/worked/httpx/graph.json — worked/httpx/graph.json @91f4d12
[9] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/worked/httpx/GRAPH_REPORT.md — worked/httpx/GRAPH_REPORT.md @91f4d12
[10] https://raw.githubusercontent.com/safishamsi/graphify/91f4d120b630ee35c79bf3c75ccd186870a808f9/worked/httpx/README.md — worked/httpx/README.md @91f4d12

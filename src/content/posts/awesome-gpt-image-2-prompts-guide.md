---
title: 'Awesome GPT Image 2 Prompts：462 条可复用的图像提示词案例库'
published: 2026-10-19
description: '开源 GPT Image 2 提示词案例库：462 条带预览图与来源，复制即用'
tags: ['提示词工程', 'AI 工具', '开源项目', 'GPT Image 2']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://evolink.ai/gpt-image-2-prompts'
---

用 GPT Image 2 做一张电商主图或者电影海报，卡住人的通常不是模型，而是那句提示词怎么写。**Awesome GPT Image 2 Prompts** 是一个开源的提示词案例库，把 462 条整理好的案例按电商、广告、人像、海报、角色、UI 等场景摊开，每条都给出完整提示词、预览图和原作者来源，复制下来改几个词就能用。[2][6]

它本身不生成图片，也不是一个可以安装的软件：仓库里放的是提示词文本、参考图和一套维护脚本。适合做跨境主图、品牌海报、社媒配图的运营和设计师，也适合想把提示词当数据处理、批量复用或接进自己工作流的开发者。[2][4]

<!--more-->

## 主题概览

这个库由 EvoLinkAI 维护——EvoLink 的官方组织账号，一家提供图像模型 API 的服务商；主体是 GitHub 上的公开仓库，另外配了一个可以按图浏览的网页画廊。仓库创建于 2026 年 4 月，本次查询时 17,320 star，采用 CC0-1.0 许可。[3][10]

它解决的是"看过就找不到"的问题。高质量的图像提示词散落在 X、Reddit 和各类教程里，收藏夹存不住，也没有来源标注。这个库把案例做成带编号、带来源、带预览图的条目，并写明了新增一条案例要满足什么条件，所以它更像一份可以长期维护的资料，而不是一次性的合集。[2][4]

需要先讲清楚一点：它提供的是提示词和参考图，不提供模型额度。真正出图仍然要用 ChatGPT、OpenAI API 或者服务商的 playground，这一点和提示词优化器、绘图客户端那类工具不一样。

## 核心技术

### 462 条案例是怎么编号的

README 是唯一的权威入口，全部案例按英文 README 的显示顺序编号为 Case 1 到 Case 462，要求连续且不重复；各语言版本沿用同一套编号与顺序。[4]

分类和数量也写在 README 里，合计正好 462 条：[2]

| 分类 | 案例数 |
| --- | --- |
| 电商 E-commerce | 16 |
| 广告创意 Ad Creative | 33 |
| 人像摄影 Portrait & Photography | 140 |
| 海报插画 Poster & Illustration | 170 |
| 角色设计 Character Design | 20 |
| UI 与社媒 mockup | 52 |
| 对比与社区示例 Comparison | 31 |

人像和海报是最厚的两块，分别 140 条和 170 条。做电商主图的人能用的只有 16 条，数量不多但主题集中，翻一遍就能判断有没有覆盖自己的品类。

### 一条案例长什么样

每个分类在 cases/ 下有一个归档页，条目是固定格式：三级标题写编号、作品名、来源链接和原作者，下面跟预览图，再接一个标注为 Prompt 的代码块，里面是完整的提示词正文。[6]

```
### Case 52: [Convenience Store Neon Portrait](https://x.com/.../status/...) (by [@BubbleBrain](https://x.com/BubbleBrain))
```

也就是说，一条案例同时带着"长什么样"（预览图）和"怎么写出来的"（提示词）以及"谁写的"（来源），三者都不缺，这也是它比截图合集好用的地方。

### 把提示词当成可审计的数据维护

这部分是它和普通提示词收藏最大的差别。仓库的维护文档定义了新增案例的准入条件：必须有公开来源 URL、作者名与主页、可复用的完整提示词、分类与标题、可安全发布的媒体、去重键（通常是来源 URL），以及语义复核结论为"选定或高置信"；被推迟、存疑、重复或只有展示价值的候选不会进入公开分区。[4]

配套有三样东西：data/ingested_tweets.json 是公开的来源 URL 注册表，用来去重和溯源；docs/update-log.md 按批次记录每次新增；scripts/verify_prompt_repo.py 是一个便携校验脚本，检查 README 集合是否齐全、标题与锚点顺序、菜单链接是否同步、各语言版本的案例数是否一致、引用的本地媒体是否存在、JSON 是否可读。[4][7]

换句话说，这个库真正的价值不只在 462 条案例，还在"怎么让一个多人维护的提示词库不烂掉"：编号唯一、来源可查、批量更新有日志、发布前有校验。团队要自建内部提示词库时，这套流程比案例本身更值得抄。[4][5]

## 实践应用

### 从分类页找到能用的那条

最直接的用法是按分类浏览：做电商看电商分区，做人像看人像分区，README 里每个分类都标了案例数和归档页入口；网页画廊可以按图筛，看到合适的构图再回到案例页复制提示词。[2][8]

复制之后通常要做两件事：把提示词里的主体、品牌名、尺寸等占位信息换成自己的；再按需要补上光线、材质、版式约束。案例本身给的是可复用的结构，不是必须逐字照抄的咒语。

### 把案例库当数据集用

要在自己的流程里批量使用，可以把分类归档页解析成结构化条目。下面这段脚本在我本地跑过，读取 cases/ 下的英文归档页，输出每条案例的编号、标题、来源链接和作者：[6]

```python
import re
from pathlib import Path

CASES = re.compile(
    r"^###\s+Case\s+(\d+):\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:\(by\s+\[@([^\]]+)\]\([^)]*\)\))?",
    re.M,
)

for f in sorted(Path("cases").glob("case-*.md")):
    rows = CASES.findall(f.read_text(encoding="utf-8"))
    print(f.stem, len(rows))
```

实际跑下来，7 个分类页一共解析出 832 条带来源链接的条目，按编号去重后是 455 个，例如广告创意页的前两条是 Case 90「4-Panel Japanese Digital Ad Banner Grid」和 Case 112「Anime Character Brand Identity & Merch Board」。条目数比编号多，是因为归档页里同一编号会出现多次、也保留了历史条目，所以程序化取数时建议按来源 URL 去重，或者直接以 README 的 462 条主命名空间为准。[4][6]

### 用 API 出图

提示词是纯文本，粘到 ChatGPT 里可以直接用；要接进程序，走的是 OpenAI 兼容的图像接口 `/v1/images/generations`。[2] 下面是文档形态的请求示例，我本机没有 GPT Image 2 额度，没有实际执行：

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-image-2", "prompt": "<粘贴案例里的提示词>"}'
```

服务商的画廊页也提供在线试跑，案例可以按同一个提示词直接带进 playground，适合先验证一句提示词的效果再决定要不要写进代码。[8]

### 写提示词时可以借用的几条经验

官网 FAQ 的几条建议比较实用：描述版式意图而不只是主体；限定配色、质感和光线，让画面看起来是有意为之；把文字渲染当成"尽力而为"，需要精确文字时准备后期修图。[8]

## 使用边界

- 仓库内容是 CC0-1.0，可以自由取用；但案例图片和提示词的原始权利仍归原作者，README 也明示无法保证每条案例都准确署名。[2][10]
- 案例多来自公开社区，是整理而非原创生产。仓库自称只组织公开可访问的提示词与示例图，不主张第三方原创内容的所有权。[2]
- 它由 API 服务商维护，README 与官网带指向 EvoLink playground 的推广链接。当资料库用没问题，但要清楚它同时是商业方的内容运营。[8]
- 更新节奏以公开记录为准：更新日志最后一批是 2026 年 6 月 30 日，仓库最后一次推送是 2026 年 7 月 18 日（2026-10-19 查询）。视频里"每天更新""最近加了 42 个案例"属于发布当时的说法。[3][5][9]
- 本文的脚本只解析仓库 markdown，不含图像生成；我没有 GPT Image 2 额度，API 示例未实际执行，出图效果也没有验证。

## Sources

[2] https://raw.githubusercontent.com/Evolink-AI/awesome-gpt-image-2-API-Prompts/main/README.md — 仓库 README.md（英文权威入口）
[3] https://api.github.com/repos/Evolink-AI/awesome-gpt-image-2-API-Prompts — GitHub API 仓库元数据
[4] https://raw.githubusercontent.com/Evolink-AI/awesome-gpt-image-2-API-Prompts/main/docs/maintenance.md — docs/maintenance.md（维护与验收规则）
[5] https://raw.githubusercontent.com/Evolink-AI/awesome-gpt-image-2-API-Prompts/main/docs/update-log.md — docs/update-log.md（更新日志）
[6] https://raw.githubusercontent.com/Evolink-AI/awesome-gpt-image-2-API-Prompts/main/cases/portrait.md — cases/portrait.md（人像分类归档页）
[7] https://raw.githubusercontent.com/Evolink-AI/awesome-gpt-image-2-API-Prompts/main/scripts/verify_prompt_repo.py — scripts/verify_prompt_repo.py（仓库校验脚本）
[8] https://evolink.ai/gpt-image-2-prompts — EvoLink 官方画廊页：GPT Image 2 Prompts
[9] https://www.douyin.com/video/7694627058198007067 — 视频来源：抖音公开作品 7694627058198007067
[10] https://raw.githubusercontent.com/Evolink-AI/awesome-gpt-image-2-API-Prompts/main/LICENSE — LICENSE（CC0 1.0）

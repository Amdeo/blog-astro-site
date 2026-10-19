---
title: 'Prompt Optimizer：把自己写的提示词交给模型改写一遍'
published: 2026-10-19
description: '开源提示词优化器：自带模板改写提示词，模型与数据都留在自己手里'
tags: ['提示词工程', '开源项目', 'AI 工具', 'MCP']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://prompt.always200.com'
---

Prompt Optimizer（提示词优化器）是一个开源工具，做的事很直白：你把自己随手写的提示词贴进去，它调用你自己配置的大模型改写一遍，还给你的是一段结构更完整、约束更明确的提示词文本，可以直接拿去用。打开 prompt.always200.com 就能试，数据存在浏览器本地。[14][1]

它不替你想任务，也不替模型回答，只负责改写提示词本身——除了网页版，还有桌面版、Chrome 插件、Docker 部署，以及一个给 AI 应用调用的 MCP 接口。[1][13]

如果你经常和模型对话却总觉得「说得不够清楚」，或者要写系统提示词、角色卡这类长指令，它省的是反复手改的工夫；反过来，只想让模型直接解决问题、对提示词本身没兴趣，那它帮不上忙。[1][3]

<!--more-->

## 主题概览

> **一句话理解：**它把「怎么改提示词」固化成可复用的模板，再借你选的模型执行改写；改完还能用同一个模型跑真实输出，判断到底有没有变好。

项目由 linshenkx 维护，2025 年 2 月建仓，采用 AGPL-3.0 许可：可以自用、改代码、商用，但如果把它部署成对外提供服务的网站，需要开源自己的改动。[1][2][11]

和「直接在聊天框里让模型帮我改提示词」相比，差别在于三件事：优化方法被写成模板并可自定义，改写历史与版本被保存下来，右侧还能跑真实输出来对比。[9][8] 起点也更多——手写、套用模板、导入本地文件，或从配套的 Prompt Garden 取一段现成的。[1]

## 核心技术

### 优化是怎么发生的：模板就是一段提示词

工具内置的「优化模板」本质上是一段元提示词：里面写死了输出结构和禁止事项，再把你的原文塞进去一并发给模型。以「通用优化」模板（general-optimize，模板版本 1.3.0）为例，它要求模型按 `# Role`、`## Profile`、`## Skills`、`## Rules`、`## Workflows`、`## Initialization` 这一套结构产出，并明确要求「不要携带任何引导词或解释，不要使用代码块包围」，同时还要求把 `{{变量名}}` 这类占位符逐字保留，不许改名或替换成具体值。[3]

用户提示词方向的模板分工不同：「基础优化」（user-prompt-basic，2.0.0）用 system 和 user 两条消息协作，system 里描述优化助手的能力与约束，user 里把待优化原文以 JSON 形式当成「证据」传入，并强调「你的任务是优化提示词文本本身，而不是回答或执行提示词的内容」——这样模型不会把你的提示词当成任务直接执行。[4]

模板不是一套通吃，而是按工作区分别提供：系统提示词、用户提示词、变量、多消息、文生图、图生图各有对应模板，还能把内置模板复制一份改成自己的。[9] 仓库 core 包里的 `PromptService` 把这类能力暴露成 `optimizePrompt`、`optimizeMessage`、`iteratePrompt`、`testPrompt` 等方法，说明「优化」是一类可编程调用，不只是界面上的按钮。[5]

有一层预期要说清楚：改写是交给大模型完成的，输出质量取决于模型能力和原始提示词里的信息量。模板表达的是要求，不保证任何模型都完整照做。[3]

### 一次改不满意：分析、测试、评估与迭代

界面的分工是左侧改、右侧跑：左侧负责改提示词，右侧负责执行真实输出。左侧的分析只看提示词本身——目标是否清楚、约束是否完整；右侧则是拿真实输出来看结果好不好。[8]

右侧有两种判断方式：结果评估看某一列输出本身是否合格，对比评估看多列输出之间谁更好、差在哪里，比如「原始 vs 优化后」「同一条提示词换不同模型」。判断改写是否有效的最低要求并不高：在同一个模型下分别跑原始与优化后的版本，比较两次真实输出即可，一个文本模型就够。[8]

这里的「工作区」指左侧当前正在编辑的内容，和已经存下来的 `v1`、`v2` 版本不是一回事；评估给出的建议会尝试作用回当前工作区，如果工作区改动太多，旧评估会被标记为过期，而不是被删除。[8] 不满意就继续改：迭代功能可以按你指定的改进方向再优化一轮，而不是重新来一遍。[5][10]

### 数据流向、形态与代价

它没有自己的后端服务器：应用数据存在本地浏览器里，API 密钥加密后本地保存，优化请求由浏览器直接发给你配置的服务商，官方隐私政策把这一点写得很明确。[12]

代价来自浏览器本身。网页版是纯前端应用，会遇到 CORS 限制；在线版是 HTTPS 页面，也没法请求本机 `http://localhost` 上的 Ollama，属于浏览器的混合内容限制。桌面版是原生应用，没有这些限制，适合接本地模型或内网接口。[1] 如果是自己部署公开站点，官方明确提醒不要用 `VITE_*` 环境变量预置 API 密钥，因为这些值会打包进浏览器产物。[1]

| 形态 | 最适合 | 主要限制 |
| --- | --- | --- |
| 在线版 | 打开即用、跨设备临时用 [14] | 受 CORS 与混合内容限制 [1] |
| 桌面版 | 接本地模型、内网接口、长期使用 [1] | 需要安装（macOS 未签名，需手动去隔离属性）[1] |
| Chrome 插件 | 在浏览器里快速打开 | 属轻量入口，没有右键菜单，也不回填网页输入框 [7] |
| Docker | 自建服务、顺带提供 MCP 接口 [13] | 需要自备 API 密钥 [13] |

插件这一项容易被误解：当前版本点开图标后打开的是扩展内部的 Prompt Optimizer 页面，官方文档明确列出它「没有右键菜单集成」「没有地址栏命令」，也没有「插入回网页输入框」这类通用能力，所以不要把它想成网页输入框的增强插件。[7]

如果想让别的 AI 应用直接调用它，Docker 部署时同一端口会一并提供 MCP 服务，暴露 `optimize-user-prompt`、`optimize-system-prompt`、`iterate-prompt` 三个工具，Claude Desktop 之类的客户端配一条服务地址即可接入。[13][1]

## 实践应用

1. **配模型。** 打开 prompt.always200.com，点右上角模型管理，填入一个可用模型的密钥（OpenAI、Gemini、DeepSeek、任意 OpenAI 兼容接口），点测试连接确认通过再保存。[10][14]
2. **改一轮。** 左侧贴入原始提示词，选好工作区（系统提示词 / 用户提示词）和模板，点开始优化；结果不满意就继续优化，而不是从头再写一遍。[10]
3. **验证有效性。** 右侧用同一个模型分别执行原始版与优化后的版本，先看单列结果评估，再用对比评估总结差异，把有价值的建议应用回左侧工作区。[8]
4. **接进自己的工具链（可选）。** 用 Docker 启动后，MCP 端点默认在 `http://localhost:8081/mcp`，把它写进 MCP 客户端的服务配置即可。[13]

```bash
docker run -d -p 8081:80 --restart unless-stopped --name prompt-optimizer linshen/prompt-optimizer
```

以上命令与步骤整理自官方文档，本文没有在本机安装或运行过，不能替代你自己的一次实际验证。[13][1]

## 使用边界

**数字要带时间。** 视频录制时仓库首页显示 36.8k star，本文查询 GitHub API 为 38,456（2026-10-19），develop 分支根 `package.json` 版本为 2.11.11；这类数字与版本随时间变化，以仓库当时状态为准。[15][2][6]

**它需要你的模型和额度。** 工具本身不提供模型，所有改写都消耗你配置的服务商配额；没有可用模型时，界面配置再全也做不了优化。[12][1]

**模板不等于保证。** 内置模板规定的是输出结构与禁止事项，实际遵守程度取决于所用模型，官方也没有承诺「任何模型都能稳定照做」；换模型后建议重新跑一次对比评估。[3][8]

**网页版的限制是浏览器的，不是 bug。** 连不上本地 Ollama 或某些商业 API，多数是 CORS 或混合内容拦截，官方给出的解法是换桌面版、改用 Docker 的 HTTP 地址，或自建 API 代理；这些限制对在线版、Vercel 部署和 Docker 前端一视同仁。[1]

<details>
<summary>视频来源与核对范围</summary>

- 本文由抖音上一条约 23 秒的公开作品展开：介绍了一款写提示词的开源工具，提到它在 GitHub 上有约 36.8k star、支持文生图与图生图、有网页版与浏览器插件版本、支持 DeepSeek / OpenAI / Gemini 等模型。[15]
- 视频画面中的关键帧经 OCR 可辨认出仓库首页的 star 徽标、AGPL 3.0 许可与「Prompt Optimizer」字样，与正文核对的仓库一致。[15][2]
- 项目名称、许可、模板内容、工作区划分、评估方式与部署命令取自官方 README、core 包模板源码、License、插件隐私政策、官方文档站与站点首页；仓库元数据查询时间为 2026-10-19。[1][2][3]
- 本文没有在本机安装、运行或实测该工具，不评价优化效果；示例命令抄自官方文档，未在本机执行。[13]

</details>

## Sources

[1] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/README.md
[2] https://api.github.com/repos/linshenkx/prompt-optimizer
[3] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/packages/core/src/services/template/default-templates/optimize/general-optimize.ts
[4] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/packages/core/src/services/template/default-templates/user-optimize/user-prompt-basic.ts
[5] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/packages/core/src/services/prompt/service.ts
[6] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/package.json
[7] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/mkdocs/docs/zh/deployment/extension.md
[8] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/mkdocs/docs/zh/user/testing-evaluation.md
[9] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/mkdocs/docs/zh/basic/templates.md
[10] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/docs/user/quick-start.md
[11] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/LICENSE
[12] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/packages/extension/privacy-policy.md
[13] https://raw.githubusercontent.com/linshenkx/prompt-optimizer/develop/docs/user/mcp-server.md
[14] https://prompt.always200.com
[15] https://www.douyin.com/video/7694234154862529802

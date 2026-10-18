---
title: 'Archify：给 AI 编程 Agent 的可验证画图技能'
published: 2026-10-18
description: '把系统描述或代码库变成可交互、可校验的 HTML 架构图'
tags: ['AI Agent', 'Skill', '架构图', '可视化', 'Codex']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

Archify 是一个开源的画图技能（agent skill）：装进 Claude Code、Codex CLI、Cursor、OpenCode 这类编程 agent 之后，你用一句话描述一个系统，或者让它去读一个代码库，它就会在对话里产出一张可交互的架构图。[3][6] 产物是一个单独的 HTML 文件，下载下来直接用浏览器打开就能交互，看图的人不需要先安装什么。[3]

它面向的是需要把系统讲清楚的人：写设计文档、做合并前的架构评审、向同事解释一个陌生仓库的运行时结构，或者只是想把一张手绘草图变成能点开的东西。[3][8]

视频把它概括成「只干一件事：画图」，同时说这个项目在 GitHub 上已经涨到 80.5 万颗星。[1] 后一个数字需要修正：仓库页显示的是 85,083 颗星（2026-10-18 读取），量级差了十倍；仓库创建于 2026 年 4 月，MIT 许可。[1][2]

<!--more-->

## 和 Mermaid 式画图有什么不同

多数人让 AI 画流程图，走的是 Mermaid 那条路：模型输出一段声明式文本，渲染器照着画出来，好不好看、连得对不对，没人替你校验。[3] Archify 把中间层显式化——agent 先写一份带类型的 JSON 中间表示（typed JSON IR），再由随技能一起装的 Node 渲染器把它编译成自包含的 HTML/SVG。[3][4]

真正的差别在交付前的关卡。schema、布局、HTML/SVG、路径、标签与线条的避让关系都要通过，新的成品才会原子地替换掉上一次的成品；失败时给的是机器可读的修复清单——规则码、具体对象、实测证据，而不是一段堆栈让你自己猜。[3] 技能的说明写得很直接：非零退出永远不算成功。[4]

这份修复清单不是让 agent 重画整张图，而是指名道姓地改一个局部；技能给这次修正留了两轮预算，超出就停下来报告没解决的规则码。[3][4] 预览也有个保底机制：可选的桌面预览循环只监听一个 JSON 源文件，候选版本全部过关才刷新页面，保存到一半或者校验没过时，屏幕上留着的仍是上一版已验证的图。[3]

写入位置同样有约定：每个新的画图请求在 `.archify/<类型>-<名字>-<时间戳>/` 目录里放自己的候选 JSON 和 HTML，后续修复复用同一个目录，早先的版本不会被覆盖。[4]

## 能画哪几种图

稳定版 3.1.0 一共十种图，前五种是早期就有的，后五种是这次补进来的。[3][5]

| 类型 | 适合画的东西 |
| --- | --- |
| Architecture | 组件、服务、存储、网络与安全边界 |
| Workflow | CI/CD、审批关卡、runbook、工具调用 |
| Sequence | API 调用、缓存回退、鉴权、异步链路 |
| Data Flow | 数据管道、ETL、血缘、敏感数据的边界 |
| Lifecycle | 状态机、重试、等待与终态 |
| ERD | 表、字段、主外键与关系基数 |
| Class | 类、接口、哪些类型依赖或实现谁 |
| Tree | 单父级层级：仓库、模块、能力拆解 |
| Timeline | 事故复盘、发布史等带时间的事件 |
| Waterfall | 一次请求或一次 agent 运行的时间去向 |

每种类型都有自己的 schema、示例和布局规则；拿不准该用哪种时，可以先让内置的场景向导给建议——它只推荐类型和写法，不会替你出图。[4][8]

## 从一句话到一张图

安装是一条命令，本机需要 Node.js 18 或更高版本。[3][8]

```bash
npx skills add tt-a1i/archify -g
```

装完给 agent 一句具体的话，比如让它画一次 Web 请求：浏览器调用 API，API 查 Redis，缓存没命中就查 PostgreSQL 并把结果写回缓存。[3] 之后继续用自然语言微调，例如「加上认证」「高亮缓存未命中的那条路径」「换成浅色主题」，agent 改的是那份 JSON 源文件，没被点到的结构会保持稳定。[3][4]

产物打开后可以按键操作：`/` 搜索并聚焦某个节点，`R` 探查一条有向路径，`Upstream` / `Downstream` 看某个节点作者写下的上下游关系，`L` 对比两类角色，`M` 打开总览雷达，`F` 进入演示模式，`S` / `T` / `E` 依次切换视觉风格、主题和导出菜单。[3]

导出覆盖 PNG、SVG、WebM 和 1200×630 的分享卡；追过一条路径之后导出的分享卡会把整张图保留为上下文，方便贴进评审文档或聊天里。[3]

## 让它读一个真实仓库

对已有代码库，提示词要把范围写死，否则模型容易越画越密。仓库推荐的写法是：分析这个仓库，然后画一张高层运行时架构图，展示 8–12 个核心组件、一条主路径、外部依赖和信任边界，补充细节放进卡片而不是继续加连线。[3][8]

需要出处时，被证据支持的节点会标记 `SRC n`，并链到钉在某一个公开 commit 上的文件与行号；普通的图不带源码证据，这样可以避免把「看起来像」的东西当成事实。[3]

做设计或 PR 评审时还有 Architecture Delta：把改动前后两份已经校验过的快照对比，输出新增、删除、变更、移动的机器回执。它只陈述作者写下的结构变化，不推断影响面、风险或合并安全性。[3]

手动流程主要用于集成和排障，命令都在技能包内：[3][4]

```bash
node bin/archify.mjs doctor
node bin/archify.mjs guide "Show an API request with Redis cache miss" --json
node bin/archify.mjs finalize architecture candidate.json out.html --quality showcase --json
node bin/archify.mjs compare architecture base.json head.json architecture-delta.html --json
```

## 适用与限制

- **开源但只有一个仓库。** MIT 许可，官网 archify.si 提供文档、示例与安装说明；同名的第三方在线服务和付费计划由各自提供方运营，不代表项目本身。[2][3]
- **不是通用画图工具。** 自动解析 Mermaid、通用自动布局、托管分享、所见即所得编辑都在范围之外；Mermaid 只能作为拓扑输入被读懂，再由 agent 重写成 Archify 的 JSON，不做机械渲染。[3][4]
- **校验不等于好看。** 自动校验保证的是 schema、布局和交互契约，视觉质量仍需人看；时间线和水流图里的时间值若不是来自日志或追踪，会标注为示意而非实测。[5]
- **联网检查是可选的。** 更新提示只请求一份固定清单，不下载也不安装更新，也不上报版本、项目数据或提示词；可以用环境变量彻底关掉。[3]
- **Hermes 属于社区集成。** 集成说明写明这不是 Nous 官方产品、不代表 Nous 背书，只是 skill-only 集成，同样需要 Node 18+，不带遥测，也不注册原生渲染工具。[3][7]
- **本文没有实跑。** 上面的机制、命令与边界都来自仓库 README、SKILL.md、CHANGELOG 与官网原文；我没有安装或运行 Archify，也不评价它在真实项目里的成图质量。[3][4][5]

<details>
<summary>视频来源与核对范围</summary>

- 本文由公开抖音视频「你敢信！这个 80.5 万颗星的项目，它只干一件事：画图」展开，实际读取了 20.5 秒视频的整段语音，并按每秒一帧抽取 20 张画面、逐张查看其中 5 张；画面里出现了 GitHub 仓库页、能力对照表、实操终端和安装选项表，项目名与仓库地址由此确认。[1]
- 项目名、仓库地址、版本与安装方式以仓库 README、SKILL.md 和 CHANGELOG 原文为准。[3][4][5]
- 官网 archify.si 用于核对当前稳定版本号与合作平台；Star 数与许可证按 GitHub API 读取。[2][6]
- 视频画面当时的版本是 2.16.0，仓库当前稳定版是 3.1.0；视频里的星标数字与仓库实际读数不一致，本文按仓库读数。[1][2][5]
- 未验证部分：没有安装、没有运行、没有执行视频里的任何安装命令，也没有核对其提到的安装量数字。[1][3]

</details>

## Sources

[1] https://www.douyin.com/video/7694606982510136586 — 抖音视频：作品简介与宣传语
    > "你敢信！这个80.5万颗星的项目，它只干一件事：画图。 #科研 #神经网络 #绘图 #论文绘图 #ai"
[2] https://github.com/tt-a1i/archify — GitHub：tt-a1i/archify 仓库页（License / Stars）
    > ""description": "Turn any idea, plan, or codebase into a beautiful interactive diagram. An agent skill for Claude Code, Codex, and more.","
    > ""stargazers_count": 85083,
  "watchers_count": 85083,
  "language": "JavaScript","
    > ""created_at": "2026-04-15T05:27:37Z",
  "updated_at": "2026-10-18T09:32:48Z","
    > ""name": "MIT License",
    "spdx_id": "MIT","
[3] https://github.com/tt-a1i/archify/blob/main/README.md — tt-a1i/archify — README
    > "Turn anything you want to understand, plan, or share into an interactive visual."
    > "Works with Cursor, Claude Code, Codex CLI, and OpenCode."
    > "npx skills add tt-a1i/archify -g"
    > "**Typed JSON IR** — every renderer-backed mode has a schema and reproducible source."
    > "**Atomic validation before delivery** — schema, layout, HTML/SVG, route, and label-to-route clearance checks must all pass before a showcase artifact replaces the last known good output."
    > "**Failures come with a repair receipt** — `validate --json` and `deliver --json` return stable rule codes, the exact subject, measured evidence, and only supported repair controls instead of a Node stack or an unstructured retry guess."
    > "**Last-good live preview** — an optional desktop loop watches one JSON file, refreshes only after the latest candidate passes every gate, and keeps the previous verified diagram visible when a save is incomplete or invalid."
    > "**Source evidence, only when requested** — Evidence-backed Architecture nodes mark themselves `SRC n` and open Git-verified files and line ranges pinned to one public commit; ordinary artifacts stay source-free."
    > "Archify is not a general-purpose drawing editor or a Mermaid theme."
    > "Automatic Mermaid parsing, general-purpose auto-layout, hosted sharing, and WYSIWYG editing are intentionally outside the current scope."
    > "| **Hermes Agent** | Opt-in: `hermes skills install skills-sh/tt-a1i/archify/archify -y` | Community Skill-only integration; Node `>=18`; not a Nous official product. No telemetry. It is not a switcher target."
    > "Archify may GET the fixed stable manifest solely to show an optional reminder; it never downloads or installs updates."
    > "Set `ARCHIFY_UPDATE_CHECK_DISABLED=1` to disable networking and reminder-state writes."
    > "For design or PR review, Architecture Delta compares validated Before / Delta / After snapshots with a machine receipt."
    > "**Current stable version:** `v3.1.0`."
    > "The output is a self-contained HTML file."
[4] https://github.com/tt-a1i/archify/blob/main/archify/SKILL.md — archify/SKILL.md — 生成与交付契约
    > "Create an interactive HTML diagram from typed JSON."
    > "give each new diagram request its own folder `.archify/<type>-<slug>-<YYYYMMDD-HHMMSS>/` there (local time, chosen once when the request starts)"
    > "A passing receipt proves the included `validate`, `deliver`, strict `check`, and real-browser `browser-check` gates passed."
    > "A non-zero exit is never success."
    > "Read Mermaid for topology and meaning, then author fresh Archify JSON; do not mechanically render Mermaid styling."
    > "never install or update on your own initiative."
[5] https://github.com/tt-a1i/archify/blob/main/CHANGELOG.md — CHANGELOG.md — 3.1.0 发布说明
    > "## [3.1.0] — 2026-10-14"
    > "**Ten diagram types.** ERD, Class/interface, Tree, Timeline and Waterfall join Architecture, Workflow, Sequence, Dataflow and Lifecycle, with typed JSON, source evidence and standalone Viewer exports."
    > "Automatic validation does not establish perceptual quality."
    > "Waterfall durations need recorded trace evidence to be called measured; author-supplied illustrative values remain labelled."
[6] https://archify.si — Archify 官网
    > "Archify is an open-source diagram skill for coding agents."
    > "9/9 Validation checks per artifact"
    > "0 Runtime dependencies"
    > "$ npx skills add tt-a1i/archify -g"
[7] https://github.com/tt-a1i/archify/blob/main/integrations/hermes-agent/README.md — Hermes Agent 集成说明
    > "This is **not** an official Nous Research product and does not imply Nous endorsement."
    > "This is a **Skill-only** plugin. It does not register native Python render tools, telemetry, MCP servers, credentials handling, or background services. Hermes still needs **Node.js 18+**."
    > "hermes skills install skills-sh/tt-a1i/archify/archify -y"
[8] https://github.com/tt-a1i/archify/blob/main/docs/authoring-cookbook.md — Authoring Cookbook — 手动流程参考
    > "Archify is primarily an Agent-facing Skill. Normal users can ask a Skill-capable Agent to generate the diagram; they do not need to learn the schema or run `validate`, `inspect`, or `deliver` themselves."
    > "Archify requires Node.js 18 or later."
    > "Keep the first diagram to roughly 8–12 primary nodes, one main path, and only the branches that help explain the question."

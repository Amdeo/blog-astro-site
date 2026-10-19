---
title: '给 AI 补两个设计 Skill：Taste 定方向，Impeccable 挑毛病'
published: 2026-10-19
description: '两个设计 Skill 的分工：一个决定页面往哪做，一个用规则挑毛病'
tags: ['AI Agent', 'Skill', '前端设计', 'Claude Code', 'Codex']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://www.douyin.com/video/7694574622355901706'
---

用编程助手写前端，结果常常长得像同一个模板：居中大标题、紫到蓝的渐变、毛玻璃卡片、卡片里再套卡片。[4][8] 这不是模型不会写 CSS，而是需求空着的地方，它会补上训练数据里最常见的那套做法。[4][8]

这篇介绍两个把这件事拆开解决的开源 Skill：Taste 负责在动手前给出视觉方向，Impeccable 负责在写完之后按规则挑出毛病。[1] 它们不是组件库，也不互相依赖，装上之后是让你的编程助手在原有流程里多两道判断。[1][4]

<!--more-->

## 主题概览

一句话分工：Taste 回答「往哪做」，Impeccable 回答「哪里不行」。[1]

两个项目都开源。Taste 是 Leonxlnx/taste-skill，MIT 许可。[2][3] Impeccable 是 pbakaus/impeccable，作者 Paul Bakaus，Apache-2.0。[4][5] 建仓时间都不长（Taste 2026 年 2 月、Impeccable 2025 年 11 月），star 已经在几万量级——2026-10-19 查询 GitHub API 分别是 99,155 与 82,966。[3][5]

形态也不一样。Taste 主要是「一份 SKILL.md 加脚本」：把怎么找方向、用什么素材、自己怎么检查写成 agent 照做的流程。[2] Impeccable 是「一份技能 + 24 条命令 + 61 条确定性检查规则」，更接近一套设计工作台，还额外提供命令行和编辑器钩子。[4] 视频把两者概括为「一个管品位，一个管框架」，方向没错。[1]

## 核心技术

### 先看清 AI 界面的共同破绽

Anthropic 官方仓库里那份 frontend-design 技能就是为这个问题写的，它点名了几种最常见的痕迹：把标题里的某一个词单独换成斜体或另一种颜色、标签一律全大写、内容上方加装饰性小字；以及每一屏都做「淡入上滑」的入场动画、每张卡片都加悬停过渡——它直接说这类做法「读起来就是 AI 生成的」。[8]

Impeccable 的 README 给的是同一现象的另一种清单：所有项目都用 Inter、紫到蓝的渐变、卡片套卡片、彩色底上用灰字、每个标题上方一块圆角图标。[4] 它同时承认自己的起点就是 Anthropic 那份技能，只是把「模板痕迹」从提醒变成了可执行的检查。[4] 理解这条脉络之后，两个项目的分工也就清楚了：一份负责别做错，一份负责做得有意思。

### Taste：六步走完一个页面

README 说明默认技能建立在对 247 个网站的研究上，一次构建分六步：先读需求、列出只有这家客户才有的东西；由脚本从 20 个研究过的方向里发出三张牌，agent 选一张；把客户自己的素材和这个方向绑成一句话概念；用开放馆藏里的真实图片和影像把页面搭出来并署名；在真实浏览器里按三个宽度检查，不合格就直接判为 slop；最后看自己的截图，修掉最要紧的三个问题，最多三轮。[2]

代价也写清楚了：一次构建大约 30 到 45 分钟、几十万 token。[2] 老版本的技能文件顶部有三个 1 到 10 的旋钮，分别控制布局变化幅度、动效强度和视觉密度；现在的 v2 没有旋钮，方向交给发牌，边界交给检查器。[2]

### Impeccable：先记住项目，再谈设计

它的入口是一句 `/impeccable init`：在 agent 对话里把受众、目标、使用场景、约束和语气写进 PRODUCT.md，之后每条命令都读这份事实，不再靠猜；已有的视觉规范另存为 DESIGN.md。[4][6] 这一步看起来只是填文档，实际决定了后面所有判断的基准。

命令按用途分六类：Create（shape、impeccable）、Evaluate（audit、critique）、Refine（animate、bolder、colorize、delight、layout、overdrive、quieter、typeset）、Simplify（adapt、clarify、distill）、Harden（harden、onboard、optimize、polish）、System（document、extract、generate、init、live），共 24 条。[4][6] 常用的可以 pin 成独立快捷命令。

### 61 条规则：把「挑毛病」变成可重复的事

真正让检查落地的是那 61 条确定性规则：命令行和浏览器扩展都能跑，不需要 LLM，也不需要 API key。[4] 检测分两种目标：源码扫描看 UI 代码与样式，URL 扫描会打开页面，用渲染后的布局做判断；URL 扫描默认视口 1280×800，查移动端要显式换更窄的尺寸。[7] 项目里存在 DESIGN.md 时，它还会拿文档里记录的字体、颜色、圆角、字号来对照实际实现。[7]

退出码让它能进 CI：0 表示扫完没有主要问题（仍可能有 advisory），2 表示扫出主要问题，1 表示至少一个目标没能扫——多目标部分失败时按 1 处理。[7] 另外还有一套钩子：在 Claude Code、GitHub Copilot、Codex、Cursor、Grok Build 上安装时会写入各家原生的钩子清单，直接编辑 UI 文件后就把发现带回对话；Cursor 侧会在写入落地之前拦截。[4]

## 实践应用

### 装上 Taste

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

`npx skills` 是 Agent Skills 生态里的安装器，同一格式的技能包都走这条路。[9] 运行前提是 Node 22+ 和一个已安装的 Chrome、Edge 或 Chromium；技能自己什么都不装、不需要 API key，只有找图时要联网。[2] 用 Claude Code 或 Codex 的也可以走插件市场安装，命令写在 README 里。[2]

### 装上 Impeccable

```bash
npx impeccable install
```

装完在 agent 对话里跑 `/impeccable init`。[4] 安装器会列出它识别到的工具目录，其中包含 Hermes Agent：项目级安装需要先跑一次 `hermes skills trust` 才会被加载，装到全局技能目录则免这一步；Hermes 没有钩子入口，命令通过技能的 Commands 表路由。[4]

### 不用 AI 也能扫

```bash
npx impeccable detect src/
npx impeccable detect https://example.com
npx impeccable detect --json . > findings.json
npx impeccable detect --viewport 390x844 http://localhost:3000
```

人读的发现写到 stderr，JSON 走 stdout，所以要存文本输出就重定向 `2> findings.txt`。[7] 有意的例外可以登记成忽略，并且最好带上具体值，这样规则对其他字体依然生效：

```bash
npx impeccable ignores add-value overused-font Inter --reason "Brand font"
```

### 一条能跑通的组合用法

1. 让 Taste 的流程先定方向、出初稿：这一层解决的是「不像模板」。[2]
2. 装好 Impeccable 后跑一次 `npx impeccable detect src/`，看退出码和发现清单：这一层解决的是「有没有硬伤」。[7]
3. 有硬伤就用具体命令修，一次只盯一类问题，例如 `/impeccable typeset` 修字体层级、`/impeccable layout` 修间距节奏、`/impeccable harden` 补空状态与异常态。[4]
4. 上线前用 `/impeccable polish` 收尾，再扫一次确认主要问题清零；想现场比较几个变体就用 `/impeccable live` 在浏览器里挑一个。[4][6][7]

### 验收时看什么

- **扫描干净不等于好看**：干净的扫描只说明这几十条规则没发现问题，官方也强调它不能替代在真实视口里看页面。[7]
- **多看几个宽度**：Taste 的检查器按三个宽度验页面，而 detector 的 URL 扫描默认只有 1280×800，移动端要另外指定。[2][7]
- **分清检查与判断**：61 条规则是确定性的，能自动跑；critique 这类评价仍依赖模型判断，属于建议而不是结论。[4]

## 使用边界

- 本文没有在本机安装或运行这两个技能：命令、参数与退出码都来自官方 README 与文档，属于文档内容而非本站实测。[2][4][7]
- 数字有时效：视频画面里写的是 Taste 8.9 万 star、Impeccable 7 万 star，本文采用的是 2026-10-19 查询 GitHub API 的返回值。[1][3][5]
- 命令条数以官方为准：视频里说 23 条命令，README 与官方文档现在都是 24 条。[4][6]
- 图片需要署名：Taste 使用的照片来自 Wikimedia Commons、Openverse、Met 等开放馆藏，只选公有领域与 CC 许可的文件，并把署名放到页面上；能换成自己的素材最省心。[2]
- 归属要分清：Impeccable 的起点是 Anthropic 的 frontend-design 技能，但它由 Paul Bakaus 维护，不是 Anthropic 官方项目；Taste 也不是任何大厂的官方发布。[4][8]
- live 模式有边界：它只用于本地 checkout，官方明确不支持把本地助手注入生产站点，也不该为此放宽生产环境的 CSP。[4]
- 它会联网：开始新设计时 Impeccable 会向 impeccable.style 的接口请求一组视觉方向，默认还会匿名记录哪张牌被选中；`npx impeccable telemetry off` 或 `DO_NOT_TRACK=1` 可以关闭，关闭后发牌仍然工作。[4]

## Sources

[1] https://www.douyin.com/video/7694574622355901706 — 抖音公开作品《AI写前端先补两个设计Skill》（四分一只在努力，60 秒）
[2] https://github.com/Leonxlnx/taste-skill — Leonxlnx/taste-skill README（Anti-slop Agent Skills）
[3] https://api.github.com/repos/Leonxlnx/taste-skill — GitHub API：Leonxlnx/taste-skill 仓库元数据
[4] https://github.com/pbakaus/impeccable — pbakaus/impeccable README（design language for AI agents）
[5] https://api.github.com/repos/pbakaus/impeccable — GitHub API：pbakaus/impeccable 仓库元数据
[6] https://impeccable.style/docs — Impeccable 文档：命令参考与安装入口
[7] https://impeccable.style/docs/detector — Impeccable 文档：detector 扫描与退出码
[8] https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md — Anthropic skills 仓库：frontend-design SKILL.md（AI 生成界面的常见破绽与自检流程）
[9] https://raw.githubusercontent.com/vercel-labs/agent-skills/main/README.md — vercel-labs/agent-skills README（npx skills CLI 与 Agent Skills 格式）

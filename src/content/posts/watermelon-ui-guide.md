---
title: 'Watermelon UI：免费开源的 React 组件库，复制进项目就能用'
published: 2026-10-19
description: '500+ 开源 React 组件与仪表盘模板，MIT 许可，支持 shadcn 安装'
tags: ['React', 'UI 组件库', '开源项目', 'shadcn', 'MCP']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://ui.watermelon.sh'
---

Watermelon UI 是一个免费开源的 React UI 平台，官网在 ui.watermelon.sh：在网站上浏览组件和整页模板，挑中之后把源码复制进自己的项目——组件以源码形式落在你的代码库里，改样式、删逻辑都不用等第三方库发版。[1][5][6]

目录里现在有 516 个基础组件、131 个动画组件、189 个页面区块（blocks）和 12 套仪表盘模板（2026-10-19 计数），全部 MIT 许可、没有付费档；它还专门给编程助手留了入口——一个不需要密钥的 MCP 服务，Claude Code、Codex 这类 Agent 可以检索目录并直接执行安装。[2][6][7]

<!--more-->

## 主题概览

它解决的是前端开发里最重复的那类工作：把常见界面做出来。登录页、定价表、页脚、数据表格、图表仪表盘，这些几乎每个项目都要重做一遍的东西，在这里是能直接拿走的起点。[1][4]

适合正在写 SaaS 或业务平台的开发者，尤其是一个人搭界面的场景：从现成的组件和整页模板起步，比对着设计稿从空白文件开始快得多；拿它做原型也合适。[1][6]

项目由 WatermelonCorp 维护，站点和安装源分成两个公开仓库：watermelon-platform 负责浏览、预览与文档（相当于店面），watermellon-registry 存放可安装的注册表产物（相当于货架）。两边都是 MIT 许可、免费对社区开放，靠赞助维持；平台仓库建得很新，2026 年 10 月 9 日创建。[3][4][10]

## 核心技术

### 一条目录，四种用法

组件按用途分层：基础组件是功能零件，比如按钮、对话框、数据表格、日期选择器，分布在 30 个类别里；动画组件在功能之外加了 Motion 动效，卡片展开、轮播、微交互都有；blocks 是拼页面用的整块区块（hero、定价、页脚、公告栏等）；dashboards 是整套后台仪表盘模板，目前 12 套（Agndex、Astrix、Bionis、Capitalio 等）。[2][6][8]

「店面 + 货架」的分工是理解它的关键：网站负责看——每个条目页有 Preview 与 Source Code 两个标签，能直接在浏览器里读源码；注册表负责装——同一份组件既能在页面上预览，也能一条命令装进项目。[3][4]

### 安装即拷贝：shadcn 注册表怎么工作

Watermelon 把自己发布成一个 shadcn 注册表，安装走 shadcn 命令行。比如装一个卡片组件：

```bash
npx shadcn@latest add https://registry.watermelon.sh/r/card-split-accordian.json
```

命令把组件源码拷进项目的 components 目录，并顺带装好它需要的 npm 依赖；代码进项目之后就归你，这一点和「装一个 npm 包、跟着库的节奏升级」是两种模式。[5][6]

许多动画组件还带 `-base` 变体：把固定配色换成你项目的主题变量，做主题色适配时装这个版本。前提是项目已经用上 shadcn（`npx shadcn@latest init` 生成一次 components.json），并且启用 Tailwind CSS——组件样式就是 Tailwind 工具类加 CSS 变量。[5][6]

### 给 AI Agent 的入口

站点和仓库都准备了机器可读入口：hosted MCP 服务在 https://mcp.watermelon.sh/mcp，Streamable HTTP、无需 API key；站点上还有 llms.txt、openapi.json 与 sitemap，仓库里附了给各家助手用的插件描述文件。[2][3]

MCP 提供 search、get_inspiration、get_component、compose_page、list_categories 等工具，Agent 可以搜索目录、取组件源码、按页面结构做组合；接入命令很短：[2]

```bash
claude mcp add --transport http watermelon https://mcp.watermelon.sh/mcp
codex mcp add watermelon --url https://mcp.watermelon.sh/mcp
```

接好之后，预期的用法是：你描述想要的界面，助手从目录检索组件并执行安装命令。实际体验取决于所用客户端与模型。[2][5]

## 实践应用

### 把组件用起来的三步

1. 在 ui.watermelon.sh 上浏览目录（站点分 Components、Animated Components、Blocks、Dashboards 几个栏目），挑中一个条目。
2. 项目里没配过 shadcn 的话，先执行一次 `npx shadcn@latest init`。
3. 复制条目页上的安装命令执行，源码和依赖一并落进项目。[5]

### 目录里有什么

站点摘要接口给出的分布如下（2026-10-19 查询，合计 849 条）：

| 类型 | 数量 | 例子 |
| --- | --- | --- |
| 基础组件 | 516 | 按钮、对话框、数据表格、日期选择器 [6] |
| 动画组件 | 131 | 卡片展开、轮播、微交互 [2] |
| Blocks 区块 | 189 | hero、定价、页脚、公告栏 [2] |
| 仪表盘模板 | 12 | Agndex、Astrix、Bionis、Capitalio 等 [8] |
| 整站模板 | 1 | — [7] |

### 装完怎么确认

源码文件出现在项目的 components 目录、依赖安装无报错，是第一步；把组件引用到页面里跑起来，确认渲染与交互正常；如果样式没跟着主题走，换 `-base` 变体重装一次。[5]

这几步整理自官方安装文档，本文没有在本机执行过。

## 使用边界

**数量口径要带时间。** 视频录屏时首页写的是「600 多个组件、100 多个动画」，目录接口在 2026-10-19 的分项计数是 516 / 131 / 189 / 12，合计 849。两种口径的统计范围不同，本文以目录接口为准并保留查询日期。[7]

**拷贝模式有代价。** 组件源码进项目意味着维护也归你：库里的改进不会自动流进已有项目，想跟进要重新安装并对比差异。换来的是不受库版本约束的改动自由——改样式、删逻辑，都不用等上游发版。[6]

**Agent 入口是通道，不是保证。** MCP 提供的是检索与安装的工具面；能不能顺利做到「一句话换一个界面」，取决于客户端支持程度与模型表现，本文没有实测这条链路。[2][5]

**前置条件不算少。** 需要 React 项目、Tailwind CSS 和 shadcn 的 components.json（一次 init）；组件面向 React 19 与 Tailwind CSS 4 构建，安装文档给了 Next.js 与 Vite 的接入说明。[3][5][6]

<details>
<summary>视频来源与核对范围</summary>

- 本文由抖音上一条约 75 秒的公开作品展开：演示了浏览网站、翻看仪表盘模板、切换桌面与手机视口，以及复制安装命令的完整流程。[9]
- 项目名称、许可、数量、安装命令与 MCP 说明取自官方站点、llms.txt、两个仓库 README 与目录计数接口；数字查询时间为 2026-10-19。[1][2][7]
- 本文没有在本机安装或运行任何组件，不评价组件质量与渲染效果；示例命令抄自官方文档，未在本机执行。[5]
- 视频里首页横幅的「600+ 组件 / 100+ 动画」与目录接口的分项计数口径不同，正文按目录计数并标注查询时间。[7]

</details>

## Sources

[1] https://ui.watermelon.sh — Watermelon UI 官网首页（开源 React UI 平台）
[2] https://ui.watermelon.sh/llms.txt — Watermelon UI llms.txt（机器可读目录与 MCP 说明）
[3] https://github.com/WatermelonCorp/watermelon-platform — WatermelonCorp/watermelon-platform：平台仓库 README
[4] https://github.com/WatermelonCorp/watermellon-registry — WatermelonCorp/watermellon-registry：可安装注册表仓库 README
[5] https://ui.watermelon.sh/cli — Watermelon UI 安装文档：shadcn CLI
[6] https://ui.watermelon.sh/free/react-components — Free React Components：许可与数量说明
[7] https://ui.watermelon.sh/api/catalog/summary — 目录计数 API：components/blocks/dashboards 数量
[8] https://ui.watermelon.sh/dashboards — Dashboard Templates 列表页
[9] https://www.douyin.com/video/7694828934676992187 — 视频来源：抖音公开作品
[10] https://api.github.com/repos/WatermelonCorp/watermelon-platform — GitHub API：watermelon-platform 仓库元数据（2026-10-19 查询）

---
title: 'Watermelon UI：把组件源码拷进项目再用'
published: 2026-10-19
updated: 2026-10-23
description: 'MIT 许可的 React 组件与整页模板，按 shadcn 方式复制安装'
tags: ['React', 'UI 组件库', '开源项目', 'shadcn', 'MCP']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://ui.watermelon.sh'
---

[Watermelon UI](https://ui.watermelon.sh) 是一个免费开源的 React 界面库。它的用法不是 `npm install` 一个包，而是浏览目录、挑中条目、把源码拷进自己的项目——组件以源码形式落在你的代码库里，改样式、删逻辑都不用等第三方发版。

它填的是前端最重复的那块工作：登录页、定价表、页脚、数据表格、图表仪表盘，几乎每个项目都要重做一遍，在这里是能直接拿走的起点。一个人搭 SaaS 界面或做原型时最省事。

<!--more-->

站点负责浏览和预览，[组件注册表](https://github.com/WatermelonCorp/watermellon-registry)提供可安装的源码。挑组件时可以先看效果，再读源码与依赖，确认它适合当前项目，而不是看到动画好看就整套装进来。

## 目录分四层

- **基础组件**：按钮、对话框、数据表格、日期选择器这类功能零件。
- **动画组件**：在功能之外加了 Motion 动效，卡片展开、轮播、微交互都有。
- **blocks**：拼页面用的整块区块，hero、定价、页脚、公告栏。
- **dashboards**：带整体布局的后台模板，适合作为新项目的骨架。

## 安装就是拷贝

```bash
npx shadcn@latest add https://registry.watermelon.sh/r/card-split-accordian.json
```

命令把源码拷进 `components` 目录，顺带装好它需要的 npm 依赖。项目里没配过 shadcn，先跑一次 `npx shadcn@latest init` 生成 `components.json`，并且项目要启用 Tailwind——组件样式就是 Tailwind 工具类加 CSS 变量。

一个容易踩的细节：很多动画组件带 `-base` 变体，把写死的配色换成项目的主题变量。要适配主题色时装这个版本，不要装完再手动扒颜色。

URL 指向的注册表清单包含依赖和源码。安装前读它，就能知道会新增哪些文件与包；安装后检查项目差异，别把「复制源码」误当成没有维护成本。

## 代价在维护

源码进项目，维护也跟着进项目：库里的改进不会自动流进已有项目，想跟进要重新安装再对比差异。换来的是不受库版本约束的改动自由。这是 shadcn 模式的取舍，不是 Watermelon 独有的问题；选它之前先确认团队愿意承担这份维护。

## 四种条目怎么挑

挑错层级会白干活。做单个交互（日期选择、可折叠表格、带校验的表单）从基础组件起；要的是动效本身（卡片展开、滚动揭示、悬停微交互）就用动画组件，它省掉自己调 spring 参数的时间。整页的结构（hero、定价、页脚）用 blocks 拼，官方也建议这类需求优先看 blocks——它已经把间距、断点和内容密度配好了。要从零起一个后台，拿 dashboards 当起点再换数据，比从空白布局搭省事。

一个实际用法：先用后台模板定整体骨架，再用 blocks 替换或删减区块，最后用基础组件补业务表单和表格。每次只引入少量内容，检查差异并运行页面；已有业务改动时，不要直接重装覆盖。

## 给 Agent 的入口

站点也提供 MCP 地址 `https://mcp.watermelon.sh/mcp`，让支持该协议的助手搜索组件、读取源码和组合页面，而不是只看一张截图猜实现。

```bash
claude mcp add --transport http watermelon https://mcp.watermelon.sh/mcp
codex mcp add watermelon --url https://mcp.watermelon.sh/mcp
```

接入后仍要明确任务：先找符合技术栈的候选，说明会引入什么，再安装选中的组件。MCP 只是取材料的通道，不能保证助手自动处理好所有业务逻辑。

## 前置与验收

需要 React 项目、Tailwind、以及一次 init 出来的 `components.json`；组件面向 React 19 与 Tailwind CSS 4 构建，官方给了 Next.js 与 Vite 的接入说明。装完先看源码文件有没有出现在 `components` 目录、依赖有没有报错，再把组件引用到页面里跑起来看渲染与交互；样式没跟主题走，就换 `-base` 变体重装。

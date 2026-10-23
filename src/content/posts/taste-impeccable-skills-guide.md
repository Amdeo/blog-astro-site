---
title: '给 AI 补两个设计 Skill：Taste 定方向，Impeccable 挑毛病'
published: 2026-10-19
updated: 2026-10-23
description: '两个设计 Skill 的分工：一个决定页面往哪做，一个用规则挑毛病'
tags: ['AI Agent', 'Skill', '前端设计', 'Claude Code', 'Codex']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://www.douyin.com/video/7694574622355901706'
---

用编程助手写前端，结果常长得像同一个模板：居中大标题、紫到蓝的渐变、毛玻璃卡片、卡片里再套卡片。只要求「现代、好看、有设计感」，其实没有给它多少可执行的判断。

[Taste](https://github.com/Leonxlnx/taste-skill) 和 [Impeccable](https://github.com/pbakaus/impeccable) 把这件事拆成两半：一个在动手前给视觉方向，一个在写完之后按规则挑毛病。两者都是开源 Skill，互不依赖，可以把它们当作编程助手的设计指南与检查清单。

<!--more-->

它们针对的不是某种颜色或字体本身，而是不看内容就反复套用同一组选择。Impeccable 延续了 Anthropic 的 [frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) 对模板化界面的提醒，再把部分问题做成规则扫描；它由 Paul Bakaus 维护，并非 Anthropic 官方项目。

## Taste：先决定页面该长什么样

它要求先找出产品和客户独有的内容，再从不同视觉方向中选一套，把素材与方向连成一个明确概念，而不是直接开始堆组件。页面做出来后，还要在不同宽度下看真实截图，按问题继续修改。

值得借的是这个顺序：先有方向，再做页面，最后看画面。比如做一家咖啡店的网站，先决定突出手作过程、街区气质还是菜单效率，再选照片、字体和布局；不能先套一张通用 SaaS 首页，最后才换店名。

素材那条有硬要求：只选公有领域或 CC 许可的图片，并把署名放到页面上。能换成自己的素材最省心。

## Impeccable：先写事实，再谈命令

入口是 `/impeccable init`：把受众、目标、使用场景、约束、语气写进 PRODUCT.md，之后每条命令都读这份事实，不靠猜；已有的视觉规范另存 DESIGN.md。这一步看着像填文档，实际决定了后面所有判断的基准——同一句「再简洁一点」，有事实和没事实是两种结果。

常用能力可以按问题来记：审整体、修字体层级、调布局、补异常状态，最后再做统一打磨。不必先背一张命令表。

它还有不依赖模型的规则扫描：既能检查源码，也能打开页面检查实际布局；有 DESIGN.md 时，可以对照里面的颜色、字体和尺寸。手机页面要显式指定窄视口，不能只扫一遍桌面就算通过。

```bash
npx impeccable install
npx impeccable detect src/
npx impeccable detect --viewport 390x844 http://localhost:3000
```

## 合起来用

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

工具链需要相应的 Node 与浏览器环境，安装前按项目文档确认版本。技能说明、规则扫描和模型评审是不同环节，不要把「装上了」当成整套检查已经执行。

顺序上，先让 Taste 定方向出初稿；再用 detector 看有没有布局与样式硬伤。修的时候一次只盯一类：`/impeccable typeset` 修字体层级，`/impeccable layout` 修间距，`/impeccable harden` 补空状态和异常态，最后用 `/impeccable polish` 收尾。

## 三个容易忽略的边界

- 扫描干净不等于好看。规则检查与模型评价都不能替代在真实视口里看页面。
- 桌面与手机都要看。排版在宽屏成立，不代表窄屏仍有清楚的层级。
- 部分功能会联网。Impeccable 的视觉方向请求带匿名遥测，可用 `npx impeccable telemetry off` 关闭；不要把本地预览功能直接暴露到生产环境。

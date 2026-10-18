---
title: '一张照片做出 3D 网站：GPT-6 调度 Blender 与 Aholo Lux3D'
published: 2026-10-18
description: '用 AI 调度建模与网页生成，把 3D 模型做成滚动交互网站'
tags: ['AI 编程', '3D', 'Blender', 'three.js']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

把一个 3D 模型放进网页，让它随着鼠标滚动旋转、拆解、逐层展开——这类效果通常要建模师和前端配合才能做出来。现在多了一条路：只给一张主体照片和几段提示词，建模、组装、网页代码都交给 AI 调度。抖音作者黄白用这套流程做了一个能随滚动探索的应县木塔科普网站，按他的说法整个案例大约花了 30 分钟。[1]

它适合想做产品官网、科普展示或个人作品集，但不会建模、也不想从零写 WebGL 的人。前提是接受「AI 出初稿、你来挑问题」的节奏：建模方式选错时，复杂模型很难直接可用。[1]

<!--more-->

## 一条流程，四步

作者在配套文档里把整套工作流拆成四步，每步都有明确的输入与产出：上传照片和提示词（约 5 分钟）→ 生成设计稿（约 10 分钟）→ AI 建模与组装（约 10 分钟）→ 生成网站预览（约 5 分钟）。[1] 这些时长是作者自己记录的口径，不是工具方的性能承诺。

整条链路的调度者是 GPT-6 Astra 加 Codex：它理解需求、调用生图模型产出设计稿、通过 MCP 操作 Blender、调用 3D 生成插件，最后写出网页代码。[1] 选它当调度层并不意外——官方介绍里明确写到它能创建网站并跑前端 QA 检查功能是否可用，也演示过用 Blender 建模后进入 Unreal Engine 场景。[2]

## 建模为什么要分两条路

Blender 负责精确几何。模型通过 MCP 连上去之后，可以读场景、建物体、给材质、执行脚本，实际的执行者是 Blender 插件在本地开的 socket server。[7] 身份需要说清楚：这类连接通常是社区集成，不是 Blender 官方产品，插件作者自己标注为第三方，并提醒复杂操作要拆成更小的步骤。[7]

曲面和复杂结构换一条路。Aholo Lux3D 是群核科技自研的 AI 3D 基础模型，能从一张图或一段文字生成模型：先出 3D 高斯预览，再出网格预览，最后给出带几何与 PBR 材质的成品，官方给出的标准档耗时约 5 分钟。[5] 它分两个档位——Standard 质量优先，Turbo 速度优先、适合批量筛图。[5]

两条路合起来用才是重点：规则结构（方形、圆柱一类）用 Blender 精确搭建，复杂零件交给 Aholo Lux3D 生成，再让模型在 Blender 里拼装。这样得到的模型既能完整展示，也能把各个组件拆开查看。[1] 反过来，作者的经验是直接让模型通过 MCP 在 Blender 里造复杂曲面，效果往往不能直接用。[1]

在 Codex 里，Aholo Lux3D 以插件和 Skill 的形式接入。官方仓库说明这套套件可以本地安装到 Codex、WorkBuddy 等兼容宿主，一个 aholo-lux3d 入口同时支持 OpenAPI 与 MCP，除生成模型外还覆盖材质处理、重拓扑、模型关节化、角色自动绑骨和动作迁移。[6] OpenAI 的插件机制本来就是「技能 + MCP server + 可选界面」的打包方式，用来把外部工具接到 ChatGPT 和 Codex 上。[3] 出设计稿那一步调用的是图像模型，官方把它定位为高质量图像生成与编辑模型。[4]

## 模型怎么进网页

拼装好的模型导出成 glTF 或 GLB，再交给网页。glTF 是 Khronos 的 3D 场景交换格式，其中二进制版本 GLB 把 JSON、缓冲区和图片打进一个文件，省掉多次请求和 base64 编码带来的体积与解码开销。[8] three.js 的 GLTFLoader 同时支持 .gltf 和 .glb 两种形态，加载完成后模型就是场景里的一个对象。[9] 页面侧用 React 和 Vite 搭结构、three.js 做实时渲染，React Three Fiber 则是 three.js 的 React 渲染器，可以用组件的方式描述场景。[10]

视频里的成品网页固定六屏，导航常驻（首页、结构、柱网、斗拱、飞檐、守护、自由观塔），滚到「结构」时塔身会逐层展开。[1] 视差、拆解动画和章节切换，都是把滚动进度映射到相机与模型动画上的结果，具体实现以作者的配套文档为准。[1]

## 想自己走一遍

1. 在 Codex 的插件页搜索 Aholo Lux3D 安装，或者按官方仓库的说明把 aholo-lux3d 装成本地 Skill。安装本身不需要密钥，生成才要，而且国内区与国际区的密钥不通用。[6]
2. 准备一张主体照片，先用图像模型出一套六屏设计稿当视觉基准。作者的提示词固定了画布比例、色板、字体、导航与主体比例，六屏依次是首页、整体介绍、结构展示、细节展示、价值展示和收尾，并要求不编造尺寸、性能与历史数据。[1][4]
3. 按结构复杂度分配建模方式：规则结构走 Blender，复杂曲面走 Aholo Lux3D，先生成零件再拼装。[1][5]
4. 导出 GLB 交给网页，检查三件事：模型是否带材质、滚动时相机与拆解动画是否跟随、六个章节的导航高亮是否正确。[9]

几个值得提前知道的边界：

- Aholo Lux3D 会把完整计划、任务输入和结果证据提交回 Lux3D 做协同评估，而且首次使用就自动执行、不缩成摘要。[6] 介意设计素材外传的话要先想清楚。
- 本地 Blender 的 socket server 默认没有鉴权和加密，能连上端口的人就能在 Blender 里跑 Python；项目方建议只在 localhost 或可信网络使用，远程优先走 SSH 隧道。[7]
- 不是一键出片。模型能不能直接用，取决于结构复杂度和建模方式的选择；标准档单个模型约 5 分钟，批量生产要按这个节奏排时间。[1][5]

## Sources

[1] https://www.douyin.com/video/7686474500473211299 — 抖音原视频：全自动建模，GPT 6搞定 3D 网站（作者：黄白）
    > "全自动建模，GPT 6搞定 3D 网站！ 我用应县木塔做了一个能随滚动探索的 3D 科普网站，整个案例大约花了 30 分钟。把模型放进网页，实现视差滚动和结构展示。"
[2] https://openai.com/index/gpt-6-astra — GPT-6 Astra: A new generation of intelligence | OpenAI
    > "It can analyze scientific data, generate plots, create a website, and run frontend QA checks to make sure all the features on that site work."
    > "models a house in Blender and turns it into a walkable scene in Unreal Engine 5"
[3] https://developers.openai.com/plugins — Plugins | OpenAI Developers
    > "Combine skills, MCP servers, and optional interfaces to connect your tools and services to ChatGPT and Codex."
[4] https://developers.openai.com/api/docs/models/gpt-image-2 — GPT-Image-2 Model | OpenAI API
    > "GPT Image 2 is our state-of-the-art image generation model for fast, high-quality image generation and editing."
[5] https://lux3d.aholo3d.cn/lux3d/home — Aholo Lux3D 官网（群核科技 Manycore）
    > "Aholo Lux3D is an AI 3D foundation model developed in-house by Manycore."
    > "A single product suite for different production needs: Aholo Lux3D Turbo for quick previews and batch screening, and Aholo Lux3D Standard for high-quality delivery of key assets."
    > "High-quality meshes generated in 5 minutes."
    > "It converts images or text descriptions into 3D Gaussian models for quick previews, then into refined models with geometry and PBR materials for rendering, editing, and production."
[6] https://github.com/manycore-research/Aholo-Lux3D — manycore-research/Aholo-Lux3D（官方插件仓库）
    > "One common Aholo Lux3D suite for local installation in Codex, WorkBuddy, and other compatible hosts."
    > "Generate 3D assets from images or text, process existing models, and deliver verified files with an offline preview."
    > "China and international API Keys are not interchangeable. No key is required to install this Common suite"
    > "REPORT sends the complete versioned plan, task-related original inputs and attachment references, actual calls and result evidence to Lux3D for collaborative evaluation."
[7] https://github.com/ahujasid/mcp-for-blender — ahujasid/mcp-for-blender（社区 Blender MCP）
    > "Community plugin to control Blender 3D with any LLM of your choice. Not affiliated with the official Blender Foundation."
    > "This is a third-party integration and not made by Blender"
    > "Complex operations might need to be broken down into smaller steps."
    > "so anyone who can reach that port can run Python inside Blender."
[8] https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html — glTF 2.0 Specification | Khronos
    > "To avoid this file size and processing overhead, a container format, *Binary glTF* is introduced that enables a glTF asset, including JSON, buffers, and images, to be stored in a single binary blob."
[9] https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/GLTFLoader.js — three.js GLTFLoader 源码
    > "for efficient delivery and loading of 3D content. Assets may be provided either in JSON (.gltf) or binary (.glb) format."
[10] https://r3f.docs.pmnd.rs/getting-started/introduction — React Three Fiber 文档：Introduction
    > "React-three-fiber is a React renderer for three.js."

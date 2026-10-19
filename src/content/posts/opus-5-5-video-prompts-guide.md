---
title: 'Awesome Opus 5.5 Videos：爆火 AI 视频的原作与复刻并排看'
published: 2026-10-20
description: '开源 Opus 5.5 视频案例库：原作与站上复刻并排对比，提示词可复制'
tags: ['AI 视频', '提示词', 'Claude Opus 5.5', '开源项目']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://skillry.dev/ai-videos/opus-5-5'
---

刷到一条用 Claude Opus 5.5 做的动效视频，想知道它怎么开场、怎么转场、提示词长什么样 —— **Awesome Opus 5.5 Videos** 就是为这个问题做的一份公开合集：把网友用 Opus 5.5 做出来的爆火视频收在一起，每条附上作者公开的提示词，再配一个"原作 vs 站上复刻"的并排对比页面。[1][2]

它本身不生成视频，也不是可以安装的软件，而是一份 GitHub 仓库加一个可以浏览器直接看的案例库。适合要做产品介绍片、工具演示片头的创作者，也适合想研究"提示词怎么控制画面节奏"的开发与设计师。[2][4]

需要先说明一点：这里几乎所有作品都不是视频生成模型产出的，而是让 Opus 5.5 把动画写成 HTML、Canvas、SVG、Three.js 之类的代码再渲染成视频。所以你拿到的不是一段像素，而是可以改文案、改配色、改节奏的代码与提示词。[2]

<!--more-->

## 主题概览

合集有两个入口，分工清楚。GitHub 仓库 `yihui-dev/awesome-opus5-5-videos` 保存提示词文本与索引，采用 MIT 许可，2026 年 9 月 27 日创建，本次查询（2026-10-20）时 6,520 star、699 fork。[3] 配套站点 Skillry 的 Opus 5.5 视频库页负责"看"：把原视频和站方复刻并排放着播放。[2][4]

站上今天写着 418 条视频，分四类：动效宣传 229、知识讲解 68、3D 场景 56、游戏互动 65，页头标的三件事是"提示词免费复制""原视频与复刻并排对比"。[4] 仓库 README 同日的口径是 703 条提示词、其中 418 条有站上复刻，并在 README 里精选了 100 条。[2]

两处数字不一致是正常的：仓库收提示词（有的案例没有复刻也照样收），站点只展示能播出来、能对比的那部分。这类计数每天都在涨，引用时带上查询日期更稳妥。[2][4]

## 核心技术

### 视频是"写代码写出来的"

这是整个合集最值得记住的一点。README 第一句就写明：这里的每个视频，都是让 Claude Opus 5.5 把动画写成代码（HTML、Canvas、SVG、Three.js 等）做出来的，选一条、复制它的提示词，就能交给自己的 agent 试。[2]

渲染环节通常交给 HyperFrames。它是 HeyGen 开源的框架，Apache-2.0 许可，本次查询时 67,420 star，自述为"把 HTML、CSS、媒体与可寻址动画变成确定性 MP4"的工具，可以本地 CLI 用，也可以作为 AI coding agent 的 skill 使用。[7][8] 也有案例走 Remotion 路线 —— 例如本文示例的那条提示词，就明确要求"在 Remotion 里用代码写 30 秒发布片，方便我自己改和重渲染"。[6]

"确定性"是关键：画面每一帧只由时间决定，不依赖过渡动画和计时器，才能并行渲染而不闪帧。这也是为什么同一句提示词换个人执行，出片效果能大致对上。[10]

### 一条案例里能看到什么

点进任意一条案例，页面顶部是分类标签和"同时播放""查看原帖"，中间左右并排：左边"原视频 @作者"，右边"实测复刻 @skillry_dev"，两边都标着时长；再往下是"用你的 Agent 做出这类视频"和一批可安装的视频类 Skill，最下面是提示词区，带"复制提示词"按钮。[5]

一个容易忽略的细节：复刻账号是 `@skillry_dev`，也就是合集站点方，不是原作者。所以这个并排对比看的是"同一句提示词换个执行者能到什么程度"，而不是原作者的第二版。[5]

仓库那边每条案例对应一个 markdown 文件，结构固定：标题写作者，接着是站上对比链接与原帖链接，再列 Category、Remake built with（复刻用了什么技术）、Author，最后是 `## Prompt` 代码块。[6] 作者没有公开完整提示词时，文件里会直接写明，然后只放原帖正文 —— 本文示例的那条就属于这种：复刻用了 SVG · GSAP · CSS，但提示词是作者原帖里的那段话。[6]

## 实践应用

### 从站上挑一条照着做

推荐的操作顺序是这样：先在视频库页按四类浏览，挑一条和你要做的片子最接近的；进案例页先按"同时播放"看原作与复刻的差距，差得小的说明提示词够稳，换个执行者也跑得出来；然后点"复制提示词"，或者点"查看原帖"看作者自己怎么描述。[4][5]

拿到提示词之后，仓库 README 给的标准用法是三步：打开提示词文件，复制 `Prompt` 下面那一段；粘进 Opus 5.5（Claude Code、Claude 应用，或任何跑 Opus 5.5 的 agent）；让它把结果渲染成一个单文件 HTML，需要视频就录屏或走渲染器导出。[2]

### 从仓库直接取提示词

不想开浏览器时可以直接从仓库拉提示词文件。下面这条命令我在本机跑过，返回的是本文示例案例的提示词文件（节选）：

```bash
curl -s https://raw.githubusercontent.com/yihui-dev/awesome-opus5-5-videos/main/prompts/aschapmann-724497.md
```

```text
# Opus 5.5 video by @aschapmann
- **Category:** Motion graphics
- **Remake built with:** SVG · GSAP · CSS
> The author didn't publish the full prompt. Below is the text of their original post.

## Prompt
"Act as a senior motion designer and build a 30-second launch video for [product] in Remotion,
entirely in code so I can edit and re-render it: first read my landing page and codebase to pull
the real story, copy, colors, font and logo file ... then render it, check the frames yourself and
fix anything that overlaps, clips or feels rushed before showing me the result."
```

提示词里那句"先读我的落地页和代码库，把真实的故事、文案、配色、字体和 logo 文件取出来"，是这类片子比通用模板更像品牌物料的原因；结尾那句要求模型自己抽查帧、修掉重叠和拖沓，也是能直接抄进自己提示词的写法。[6]

### 写提示词时可以借用的几条经验

另一份同类整理 `joeseesun/opus-video-prompts`（本次查询 433 star）把社区经验列成了清单，几条比较实用：先交分镜或节拍表、确认后再写代码，这样后面可以只改某个镜头；像导演一样给结构，写清总时长、场景数、每场讲什么，给参考视频比堆形容词有效；列一份禁用清单（粒子爆炸、RGB 分离、镜头光晕、霓虹辉光、弹跳缓动），模板味大多来自这些；最后要求确定性渲染，每一帧只由时间决定。[10]

这些是整理者汇总的经验，不是"照做必定出好片"的保证，当成写提示词时的检查项更合适。[10]

## 使用边界

- 不是每条都有完整提示词。站点页面写着"每个都附作者使用的原始提示词"，但案例页同时会标"作者只公开了部分提示词"，仓库也说明没有公开提示词的条目只放原帖链接，所以看到"复制提示词"时先确认内容完整度。[2][4][5][6]
- 站上的"实测复刻"由合集方完成（`@skillry_dev`），不代表原作者认可或验证过这个复刻结果。[5]
- 提示词里的产品、品牌、素材都是别人的。照抄前把占位信息换成自己的，画面里出现的 logo、字体、音乐另有各自授权，不能因为提示词公开就直接商用。
- Skillry 本身是一个 Agent Skills 商店：首页写明 Pro 为 US$9.99/月，站上的 Skill 多为付费商品。Opus 5.5 视频库页面可以直接浏览、直接复制提示词，但不要把整个站点当成免费资源库。[9]
- 计数与 star 都是查询日（2026-10-20）的值，仓库和站点都在持续更新；本批其他两篇相关文章可以一起看：[GPT Image 2 提示词案例库](/posts/awesome-gpt-image-2-prompts-guide/) 讲图像侧的同类型整理，[huashu-art-motion](/posts/huashu-art-motion-guide/) 讲代码动画 Skill 本身怎么工作。
- 我没有实际跑过 Opus 5.5 生成视频，也没有安装 HyperFrames 或站上的 Skill；本文只在本地取过提示词文件，渲染链路依据的是官方仓库说明。[7][8]

## Sources

[1] https://www.douyin.com/video/7694260998802263296 — 视频来源：抖音公开作品 7694260998802263296
[2] https://raw.githubusercontent.com/yihui-dev/awesome-opus5-5-videos/main/README.md — awesome-opus5-5-videos README.md
[3] https://api.github.com/repos/yihui-dev/awesome-opus5-5-videos — GitHub API 仓库元数据
[4] https://skillry.dev/zh/ai-videos/opus-5-5 — Skillry · Opus 5.5 视频库页
[5] https://skillry.dev/zh/ai-videos/opus-5-5/aschapmann-724497 — Skillry 案例页：@aschapmann
[6] https://raw.githubusercontent.com/yihui-dev/awesome-opus5-5-videos/main/prompts/aschapmann-724497.md — prompts/aschapmann-724497.md
[7] https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md — HyperFrames README
[8] https://api.github.com/repos/heygen-com/hyperframes — HyperFrames 元数据
[9] https://skillry.dev — Skillry 首页（Agent Skills 商店）
[10] https://raw.githubusercontent.com/joeseesun/opus-video-prompts/main/README.md — opus-video-prompts README（另一份整理）

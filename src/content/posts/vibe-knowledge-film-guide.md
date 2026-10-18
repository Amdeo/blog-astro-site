---
title: 'vibe-knowledge-film：用代码逐帧画一条 Vibe 知识大赏'
published: 2026-10-18
description: '把抖音爆火的 Vibe 知识大赏做成可安装的 Agent 技能'
tags: ['AI Agent', 'Skill', 'AI 视频', 'Canvas', '开源项目']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

抖音上有一类知识短片：从头到尾没有人说话，观众读屏幕底部的一行字幕，同时看着画面把这句话演出来——高尔顿钉板里成千上万颗小球堆出同一条钟形曲线，血管里的红细胞被一串珠子顶弯成镰刀形。这类片子最近在抖音上火起来，被叫做「Vibe 知识大赏」。[5]

`vibe-knowledge-film` 是把这类片子做成可复用流程的开源 Agent 技能：把它放进编程 Agent 的技能目录，丢一个选题或一份文案进去，Agent 会按它写死的流程选画风、写字幕稿、排分镜表，最后生成一个代码工程，用代码把画面逐帧画出来渲成一条 16:9 横屏短片。[1][2] 作者的说法是「用 Canvas 和 JavaScript 把每一帧画出来，驱动浏览器一帧一帧截图，压成视频，再混上声音」。[1]

它适合已经在用 Claude Code、Codex 这类 Agent、但被动态画面卡住的人。以前做这种画面要么套模板素材，要么在剪辑软件里一帧帧摆；这个技能把画面变成代码，形状和运动都能现写。[1][5]

<!--more-->

## 它把「做一条知识短片」拆成了有验收标准的流程

先讲清楚一件事：这不是「一键出片」。SKILL.md 里写的是「第一次渲出来的画面几乎都有毛病」——这种片子是看着图改出来的，至少要改两轮才交片。[2] 它给的是流程和引擎，判断留给人。

流程本身是线性的，每一步都有过关标准，没过就停在那一步改。[2]

第一步是立题和事实表：一句话论点、3–12 个概念，每个概念写明「要观众明白什么」和「外行卡在哪」，然后在表里列出每个年份、人名、数字的出处。[2]

第二步找形象，作者说这是决定片子好坏的一步。**先找形象，再写文案**：每个概念先找到一样外行认得的东西来演它，画不出来的句子就改句子。[2] SKILL.md 拿自己的失败案例说明代价——讲蛋白质折叠那一版，全片主体只是一串星点连成的折线，字幕说「只换掉第 6 个，形状就变了」，折线就换个卷法变个颜色；颜色、字体、节奏都像参考片，可观众始终没见过蛋白质长什么样。重做以后的同一段内容是：镜头从血管里的红细胞钻进去，找到一串珠子，第 6 颗变色，拉出来细胞弯成镰刀。[2]

第三步把文案和分镜表一起写：一句字幕一行，写清画法、屏上是什么、它在干什么、屏上的小字、观众明白了什么和声音。没有分镜表就不建工程。[2]

第四步定外观，第五步才建工程，而且先做最难的那一镜。[2] 视频里演示的正是后面的节点：Agent 先交一段带「30 秒样片」标记的片段，确认了再做完整片。[5] 这一步在流程里也是硬要求——**先做 30 秒**，开头 30 秒过了三问、给用户看过，再铺全片。[2]

最后是铺全片、配声音和终检。声音分两条路：夜曲用事件音，在 `film.js` 里用 `fr.sfx(时刻, 名字)` 登记每一处变化，再合出来；寓言则由用户给一首配乐垫在下面。[2]

## 画面是代码画的，所以每帧只取决于时间

引擎的模型可以压缩成一句话：「一张 1920×1080 的 Canvas，一个 `seek(t)`」，每一帧只由时间 t 决定，没有时间线对象、没有补间库、没有跨帧状态。[3] Canvas 本来就是浏览器里用 JavaScript 画图的接口，动画、数据可视化、实时视频处理都靠它。[6]

这么设计换来三件实际好用的能力：只渲其中一段（`--clip 0 30 head`）、在任意时刻截原尺寸静帧（`--stills`）、乱序截图拼成自查用的拼图（`--sheet`、`--motion`）。[3] 代价是随机数不能用 `Math.random()`，只能用固定种子的发生器，否则同一帧两次渲染结果不一致——引擎自带 `--det` 自检，同一帧渲两次必须一样。[3]

成片管线是：浏览器逐帧截图 → ffmpeg 压成视频 → 再混上声音。渲染脚本打开的是本机 Chrome，通过 Python 的 Playwright 驱动。[1][3] 仓库标注的速度是单路每秒 3–6 帧（1080p 截 PNG），`--jobs 4` 分四段并行大致快三倍，一条 3 分钟的片子仍要十几分钟，所以顺序是先看拼图、再渲片段、最后才渲全片。[3]

## 两套外观：夜曲和寓言

外观只有两套，跟着题材走，在分镜表定完之后选。[1][2]

| 外观 | 命令参数 | 适合的题目 |
| --- | --- | --- |
| 夜曲（night） | `--world C` | 抽象概念或看不见的机制，拆成几个当场可演的小实验 |
| 寓言（flat） | `--world B` | 一个心理或行为机制，从动物、生活场景讲到「你该怎么办」 |

拿不准的时候选夜曲，作者自己的评价是寓言最费工。[2] 视频里对两套画风的介绍和仓库一致：夜曲适合讲底层、难懂的知识，寓言适合把心理、行为这类逻辑直观地演给观众看。[1][5]

## 怎么开始

先把仓库目录放进 Agent 的技能目录，文件夹名保持 `vibe-knowledge-film`；仓库说明里给的常见位置是 Claude Code 的 `~/.claude/skills/vibe-knowledge-film`。[1] 然后装依赖，本机需要有 Google Chrome 和 ffmpeg。[1]

```bash
pip install -r requirements.txt
python -m playwright install
python engine/get_fonts.py        # 字体是 SIL OFL，不在仓库里，要单独取一次
```

`requirements.txt` 里是 playwright、numpy、scipy、Pillow。[3] 字体缺了随时可以重跑 `get_fonts.py`。[2]

工程要建在你自己的项目里，不要建在技能目录里。[1] 常用命令如下，`<工程>` 都是那个工程目录。[3]

```bash
python scripts/new_film.py <工程> --world C|B   # 建 index.html + film.js 骨架
python engine/render.py <工程> --serve          # 浏览器预览 127.0.0.1:8765
python engine/render.py <工程> --sheet 16       # 全片均匀拼 16 帧，看整体
python engine/render.py <工程> --stills 5.9     # 原尺寸截帧，看细节
python engine/render.py <工程> --clip 0 30 head # 只渲 0–30 秒
python engine/render.py <工程> --jobs 4         # 全片，四段并行
python engine/audio.py <工程>                   # 合成声音，出 renders/final.mp4
```

`new_film.py` 建出来的 `film.js` 只是能跑起来的骨架，里面一行画面都没有，每一镜都要照自己的分镜表现写。[2] 按章节拆文件、字幕区的位置、辉光和推拉的坑，`references/engine.md` 里另有清单。[3]

## 边界与注意

- **文体限制。** 只做 16:9 横屏、没有旁白的片子；有人声口播的讲解片不在适用范围。[2]
- **事实要上屏带出处。** 年份、人名、数字要和事实表一致，而且成片不加水印、不加署名。[2]
- **许可要分开看。** 引擎、脚本和文档是 MIT；但 `references/` 里按参考片记下的字幕画面、以及 `examples/` 中来自他人短片的片段不在这份许可之内，只供学习对照，不授权复制、发布或当成自己的作品使用。[4]
- **接受渲染时间。** 3 分钟的片子要十几分钟，调试靠的是拼图和片段，不是反复渲全片。[3]
- 视频演示用的是 Codex，仓库说明里举的路径是 Claude Code；两者都不绑定客户端，真正需要的是能读写文件、能跑 Python 脚本的 Agent。[1][5]

本文只按仓库文档和视频画面整理，没有安装或运行这个技能，成片质量、渲染速度都按仓库自述转述；视频里展示的样片是原作者的作品，不是本文的运行结果。[1][3]

## Sources

[1] https://github.com/HeyChengC/vibe-knowledge-film — GitHub：HeyChengC/vibe-knowledge-film 仓库页（README）
    > "这个 skill 有两种模式。一个叫「夜曲」，适合讲底层、难懂的知识。另一个叫「寓言」，适合把心理、行为这类逻辑，直观地演给观众看。这两种是我拆了市面上几条爆款之后，总结出来的两种热门画风。"
    > "原理不复杂。用 Canvas 和 JavaScript 把每一帧画出来，驱动浏览器一帧一帧截图，压成视频，再混上声音。字体都是开源的。说白了，就是用代码做这样一条视频。"
    > "还需要本机已经安装的 Google Chrome 和 ffmpeg。渲染脚本打开的是本机 Chrome。"
[2] https://raw.githubusercontent.com/HeyChengC/vibe-knowledge-film/main/SKILL.md — vibe-knowledge-film/SKILL.md — 流程与验收标准
    > "5. **先做 30 秒。** 开头 30 秒过了三问、给用户看过，再铺全片。"
    > "只做 16:9 横屏。有人声口播的讲解片不用这个。"
    > "3. **句子里的动词，屏上真的做。** "砍掉一半"就盖住一半，"粘住"就真的卡上去。数是算出来的；示意的地方写明"示意"。"
[3] https://raw.githubusercontent.com/HeyChengC/vibe-knowledge-film/main/references/engine.md — vibe-knowledge-film/references/engine.md — 引擎、命令与坑
    > "一张 1920×1080 的 Canvas，一个 `seek(t)`"
    > "每一帧只由时间 t 决定**：没有时间线对象，没有补间库，没有跨帧状态。"
    > "渲染速度单路约每秒 3–6 帧（1080p，截 PNG），`--jobs 4` 大致快三倍。3 分钟的片子仍然要十几分钟"
[4] https://raw.githubusercontent.com/HeyChengC/vibe-knowledge-film/main/LICENSE — vibe-knowledge-film/LICENSE — 许可与参考片版权说明
    > "`references/analysis.md`、`references/prompts.md` 第二节、`references/visualization.md` 里按参考片记下的字幕和画面，以及 `examples/stim_B`、`examples/info_C` 的片名、字幕和画面设计，来自他人的短片，版权属于原作者。这些材料只供学习对照，不授权复制、发布或当作自己的作品使用。"
[5] https://www.douyin.com/video/7694993637419006075 — 抖音视频：公开作品文案与画面文字（来源作品）
    > "[公开作品文案] 三言在进化：Vibe知识大赏，丢个主题就能做 刷到停不下来的Vibe知识大赏，其实不用自己剪。在Codex里装上知识大赏skill，丢一个主题进去，它自己挑画风、写字幕、排镜头，先出30秒样片给你看，你点头了再做完整的#Vibe知识大赏#Codex#AI做视频#知识科普#skill
用Codex做某音爆火的Vibe知识大赏视频
第一步在Codex上装上这个skill
第二步 它会自己挑画风
一种叫夜曲 专门讲难懂的知识
30秒样片
通过"
[6] https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API — MDN Canvas API
    > "The **Canvas API** provides a means for drawing graphics via"
    > "Among other things, it can be used for animation, game graphics, data visualization, photo manipulation, and real-time video processing."

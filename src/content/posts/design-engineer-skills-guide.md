---
title: 'emilkowalski/skills：给 AI 编程助手补上设计判断的技能包'
published: 2026-10-18
description: '把设计工程经验写成 AI 能照做的规则，Apple 动效原则是最完整的一份'
tags: ['AI Agent', 'Skill', '设计工程', '前端动效', 'Codex']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

emilkowalski/skills 是一套给 AI 编程助手用的技能包：作者 Emil Kowalski 把自己判断「什么算好界面」的经验，写成一份份 `SKILL.md`，让 agent 照着执行。[2] 它面向用 Codex、Claude Code、Cursor 这类工具写前端和组件的人，解决的是「AI 做出来的界面总是差一点」这个具体问题。[2][11]

差一点通常不是能力问题，而是选择问题：入场动画用了 `ease-in`，本该是 `ease-out`；该用半透明阴影的地方，放了一个实心边框。这些错误单独看都不影响功能，叠在一起就让界面始终不到位。[2]

先把边界说清楚：这套技能不是 Apple 官方项目，而是作者把 WWDC 设计演讲里的内容整理、翻译成 Web 能直接执行的写法；这些判断来自他在 Vercel 和 Linear 的工作经验。[4][2] Apple 那部分之所以值得单独讲，是因为它是整个仓库里最完整的一份技能。[4]

<!--more-->

## 它解决什么问题

README 对原因的说明很直接：agent 挑选动画配料时手不稳，而懂行的人知道正确答案——入场动画应该是 `ease-out`，因为用户最关注的是刚开始那一下。[2] 作者的另一篇文章把思路讲得更清楚：如果你知道什么感觉是对的，就把规则描述出来交给 agent，产出就带上了你的判断。[12]

这套技能的另一个特点是会拒绝。`find-animation-opportunities` 里写着：它期望拒掉大多数候选，一份高置信的短清单比一张长愿望单更有价值。[7] 它的目标不是让界面到处都在动。

## 技能包里有什么

视频当时介绍的 6 个技能，正好构成一条从判断到落地的链路。[1] 仓库现在的 `skills/` 目录已经是 15 个技能，README 的参考清单同样列了 15 项，比视频当时多出移动端、Expo、Swift、组件库选择等方向。[2][3]

| 技能 | 负责什么 | 输出性质 |
| --- | --- | --- |
| emil-design-eng | 主体技能：要不要动、用什么曲线、多快 | 判断规则 [5] |
| apple-design | Apple 界面与流畅动效原则，翻译成 Web 写法 | 规则加代码 [4] |
| animation-vocabulary | 把「那个会弹一下的效果」换成准确术语 | 只命名，不实现 [6] |
| find-animation-opportunities | 找哪里值得加动效，并说明哪里不该加 | 只读，给方案 [7] |
| review-animations | 用固定标准审查已有动画代码 | 只读，出结论 [8] |
| improve-animations | 审计整个代码库，产出改进计划 | 只读，出计划 [9] |

其中三份的只读边界写得很硬：`find-animation-opportunities` 和 `improve-animations` 都规定绝不修改源码，只报告和建议。[7][9] `improve-animations` 还要求计划必须自包含，因为执行者可能对上下文一无所知、也没有自己的品味，所以曲线、时长、文件路径都要写进计划里。[9] 这个分工对实际使用影响不小：可以让能力强的模型做判断和写计划，再让更便宜的模型照着执行。

## apple-design：把 WWDC 的设计演讲变成可执行的写法

这是仓库里最值得细看的一份。它的知识来源是 Apple 的 WWDC 设计演讲，主要是 2018 年的 Designing Fluid Interfaces，作者把它翻译成 Web 上的做法：CSS、Pointer Events、`requestAnimationFrame`，以及 Motion / Framer Motion 这类弹簧动画库。[4]

17 个模块串起来只有一条主线：界面之所以「活」，是因为动画从当前屏幕上的值开始、继承用户手势的速度、把动量投射出去，并且随时能被抓住反向。[4] 其中最重要的一条是可中断——任何动画都要能在任意时刻被打断和改向，用户可以在元素飞行途中抓住它推回去，而不是等它播完；转场期间也不能锁住输入。[4]

弹簧参数的讲法也很实用。Apple 把物理课本里的质量、刚度、阻尼换成了两个更好理解的参数：阻尼比和响应时间。默认用 damping 1.0（临界阻尼，不过冲），只有手势本身带动量时——快速滑动、甩出去、拖动松手——才加一点回弹。[4]

动量投影用的是 Apple 的公式而不是中学物理那套：`v/1000 × d/(1−d)`，d 取 0.998 左右，用来估算松手后大概会停在哪，再吸附到离那个点最近的目标上。[4] 到了边界则用橡皮筋阻力，越拉越难拉，而不是硬停住。[4]

## emil-design-eng：一套先问再写的判断框架

如果只想先试一份技能，从主体这份开始。它在写动画代码之前，先要求按顺序回答几个问题。[5]

- 这个动画多久会被看到一次？每天 100 次以上的操作（快捷键、命令面板）不要动画。[5]
- 键盘触发的操作永远不加动画，因为它们一天要重复几百次。[5]
- UI 动画控制在 300ms 以内，并且不要对 UI 元素用 `ease-in`。[5]

它还给审查结果规定了固定的输出格式（Before / After 表格），让 agent 的结论可读、可复核。[5] 审查类技能则把标准前置：默认就是挑问题，通过是要被挣来的，不是默认结论。[8]

## 怎么装，怎么确认生效

安装是一条命令：`npx skills@latest add emilkowalski/skills`。[2]
这个 `skills` CLI 会把技能文件装进各个 agent 自己的技能目录，默认软链、加 `--copy` 则复制；Claude Code 对应 `.claude/skills/` 和 `~/.claude/skills/`。[11]
不想安装也可以只生成提示词交给 agent。[11]
排行榜和安装量由 CLI 的匿名遥测统计，官方文档说明了这一点。[10]

装完怎么确认生效：让 agent 做一件具体的事，比如审查你刚写的一段弹窗动画，看它的结论里有没有出现具体的曲线、时长和 `transform-origin` 判断——这些正是技能文件规定的输出内容。[5][8]

技能文件是写给模型看的规则，它规定「应该怎么做」，不保证模型每次都遵守；实际效果取决于 agent 是否读到、是否照做，最好先用一个小的真实改动验证一次。[5]

## 需要注意的地方

- **不是官方项目。** 苹果设计部分是对 WWDC 公开内容的整理和转译，不代表 Apple 发布或背书，也不属于 Vercel 或 Linear。[4][2]
- **版本会变。** 视频讲到的是 6 个技能的快照，仓库现在有 15 个，具体清单以仓库为准。[1][2]
- **安装量未核实。** 视频画面里的安装量数字来自第三方排行榜，其统计方式是 CLI 匿名遥测，我没有独立核实这个数字。[1][10]
- **本文没有实跑。** 文中的参数、公式和规则都来自仓库原文，我没有在自己的项目里安装或运行这套技能，因此不评价它的实际效果。[2][4][5]

<details>
<summary>视频来源与核对范围</summary>

- 本文由作者「大昀懂点技术」2026 年 10 月发布的公开视频展开，实际读取了约 110 秒视频的整段语音，并抽取画面帧查看其中的演示内容，其中 5 张逐张看过（画面列出了 17 个原则模块、另外五项技能和安装命令）。[1]
- 仓库信息、技能清单、安装命令与设计规则依据仓库 README 与各技能文件原文；许可证与 Star 数按 GitHub API 读取。[2][3]
- 视频提到的「17 个原则模块」与仓库中 apple-design 的编号模块数量一致（1 到 17）。[4]
- 未验证部分：没有安装或运行这套技能，也没有执行视频里的安装命令；技能的实际效果、安装量以及在具体项目中的表现均未验证。[1][10]

</details>

## Sources

[1] https://www.douyin.com/video/7664517369217289512 — 抖音视频：Apple 的设计品味，终于被做成 Skill 了
    > "Apple的设计品味，终于被做成Skill了 AI不是不会写界面，而是经常在细节上选错。 进入动画该用ease out，它却用了ease in。该用半透明阴影，它却放了一个实心边框。这些小问题叠在一起，界面就会始终“差一点”。 Emil Kowalski把自己在Vercel和Linear积累的设计工程经验，整理成了6个Skill。 其中最值得看的就是apple-design。#codex #skills #ai工具使用 #ai教程技巧"
[2] https://github.com/emilkowalski/skills/blob/main/README.md — emilkowalski/skills — README
    > "For designers and engineers to help them build better user interfaces."
    > "They are based on my years of experience working at companies like Vercel and Linear."
    > "npx skills@latest add emilkowalski/skills"
    > "Agents don’t have great taste"
    > "An `ease-in` easing for an enter animation when it’s supposed to be `ease-out`"
    > "This is your shortcut to great interfaces. A shortcut to stand out in a sea of slop."
    > "- **[apple-design](./skills/apple-design/SKILL.md)** — Apple’s principles for interface design and fluid motion, distilled from their WWDC design talks and translated for the web."
[3] https://github.com/emilkowalski/skills — emilkowalski/skills 仓库页（License / Stars）
    > ""description": "Skills for Designers and Engineers.""
    > ""name": "MIT License""
    > ""stargazers_count": 47151,
 "watchers_count": 47151"
    > ""created_at": "2026-03-16T13:52:31Z",
 "updated_at": "2026-10-18T07:39:12Z",
 "pushed_at": "2026-10-11T13:58:36Z""
[4] https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md — apple-design/SKILL.md
    > "How Apple builds interfaces that stop feeling like a computer and start feeling like an extension of you. This knowledge comes from Apple's WWDC design talks — chiefly *Designing Fluid Interfaces* (WWDC 2018) — distilled and translated into the web platform (CSS, Pointer Events, `requestAnimationFrame`, spring libraries like Motion/Framer Motion)."
    > "an interface feels alive when motion starts from the current on-screen value, inherits the user's velocity, projects momentum forward, and can be grabbed and reversed at any instant."
    > "Every animation must be interruptible and redirectable at any moment. A user must be able to grab a moving element mid-flight and reverse it without waiting for the animation to finish. A closing modal the user grabs again should follow the finger — not finish closing first, then reopen."
    > "Never lock out input during a transition."
    > "Apple deliberately replaced the physics triplet (mass/stiffness/damping) with two designer-friendly parameters."
    > "function project(initialVelocity /* px/s */, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);"
    > "const projectedEndpoint = currentPosition + project(releaseVelocity);"
    > "At an edge, resist progressively instead of stopping hard. A hard stop reads as "frozen"; continuous resistance reads as "responsive, but there's nothing more here."
[5] https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md — emil-design-eng/SKILL.md
    > "Never animate keyboard-initiated actions."
    > "These actions are repeated hundreds of times daily."
    > "UI animations should stay under 300ms."
    > "Never use ease-in for UI animations."
    > "Raycast has no open/close animation. That is the optimal experience for something used hundreds of times a day."
    > "Springs maintain velocity when interrupted — CSS animations and keyframes restart from zero."
[6] https://github.com/emilkowalski/skills/blob/main/skills/animation-vocabulary/SKILL.md — animation-vocabulary/SKILL.md
    > "Turn a vague description of a motion or effect into the precise term, so the user knows what to ask for."
    > "Resistance and snap-back when you drag past a boundary (the iOS overscroll feel)."
[7] https://github.com/emilkowalski/skills/blob/main/skills/find-animation-opportunities/SKILL.md — find-animation-opportunities/SKILL.md
    > "Never modify source code."
    > "At most 5–7 suggestions for a whole app, fewer for a single view."
    > "Expect to reject most candidates. A short list of high-conviction opportunities beats a long wishlist."
[8] https://github.com/emilkowalski/skills/blob/main/skills/review-animations/SKILL.md — review-animations/SKILL.md
    > "Default to flagging. Approval is earned, not assumed."
    > "Every animation must answer "why does this animate?"
[9] https://github.com/emilkowalski/skills/blob/main/skills/improve-animations/SKILL.md — improve-animations/SKILL.md
    > "Plans must be fully self-contained."
    > "The executor has zero context from this conversation and zero taste."
[10] https://skills.sh/docs — skills.sh 文档（skills CLI）
    > "Skills are reusable capabilities for AI agents. They provide procedural knowledge that helps agents accomplish specific tasks more effectively."
    > "This telemetry is completely anonymous and only tracks which skills are being installed"
[11] https://github.com/vercel-labs/skills — vercel-labs/skills — skills CLI
    > "The CLI for the open agent skills ecosystem."
    > "Generate a prompt for one skill, or start a supported coding agent interactively:"
    > "Copy files instead of symlinking to agent directories"
    > "| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |"
[12] https://emilkowal.ski/ui/agents-with-taste — Emil Kowalski：Agents with Taste
    > "coding agents don’t quite know what great feels like."
    > "If you know what great feels like, describe the rules, then give them to your agents so they can follow them."

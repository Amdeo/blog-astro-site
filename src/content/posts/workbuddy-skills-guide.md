---
title: 'WorkBuddy 的 Skill 机制：8 个常用技能各自解决什么'
published: 2026-10-18
description: 'WorkBuddy 的 Skill 是怎么被触发和安装的，8 个常用技能各解决什么问题'
tags: ['AI Agent', 'Skill', 'WorkBuddy', '效率工具']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

WorkBuddy（腾讯 WorkBuddy）是一个桌面 AI 智能体工作台：你用一句话说需求，它自己拆步骤、读写你授权的本地文件，最后交出一份可以直接验收的结果。[9][2] 它面向的不是开发者，而是每天在处理 Word、Excel、PPT 和文档的职场角色。[2]

Skill（技能）是它扩展能力的方式，也是这套工具真正的用法分水岭。一个技能本质就是个文件夹，核心是一份 `SKILL.md`：头部写「这个技能做什么、什么时候用」，正文写「按什么流程做」，需要的话再带上脚本、参考文档和模板。[5][6] 抖音上作者推荐的那 8 个技能，就是围绕「先装什么」给出的清单，作者的前提是「如果你在用 work Buddy，这 8 个 skill 都可以装一下」。[1]

这篇文章先讲清一个技能是怎么被触发、怎么装进来的，再看那 8 个技能各自解决什么问题，以及哪些地方需要自己把关。

<!--more-->

## 一个技能由什么组成

一个技能最少只要一个 `SKILL.md` 文件，其余目录都可以没有；有需要时，约定用这几个目录装东西：[5]

```text
skill-name/
├── SKILL.md      # 必需：YAML 头部 + Markdown 正文
├── scripts/      # 可选：要确定性执行的脚本（Python / Bash）
├── references/   # 可选：按需查阅的文档
└── assets/       # 可选：模板、字体、图标等输出资源
```

`SKILL.md` 的 YAML 头部只有两个必填字段：

- `name`：技能标识，最多 64 个字符，只允许小写字母、数字和连字符，且必须和技能所在目录同名。[5]
- `description`：最多 1024 个字符，要同时写清「做什么」和「什么时候用」。[5]

`description` 是整份文件里最关键的一行，因为它决定技能会不会被触发。技能采用渐进式加载：启动时只有全部技能的 `name` 和 `description` 进入上下文（约 100 tokens）；技能被激活后才加载 `SKILL.md` 正文；`scripts/`、`references/`、`assets/` 里的文件更是用到才读。[5] 换句话说，「什么时候该用它」只写在正文里等于没写——正文要等触发之后才被看到，那段信息必须在头部就给出来。[5]

## 在 WorkBuddy 里装一个技能

技能市场分上下两半：上半部分是已经装在本地、可以直接在对话里调用的技能，下半部分是推荐技能，按需一键安装。[3]

添加技能有三条路：上传本地技能包、让 WorkBuddy 按你的任务描述去「查找技能」，或者让它按描述直接「创建技能」；不需要的可以在本机卸载。[3] 自己建技能不用写代码，把「要什么能力、什么情况触发、输出成什么样」说清楚就行，执行完在技能栏的「已安装」里能看到新技能。[4] 官方给的三条建议是：第一个技能只解决一个明确问题、把触发条件写清楚、从最高频的重复动作开始沉淀。[4]

## 8 个技能分别做什么

| 技能 | 解决的问题 | 可核对来源 |
| --- | --- | --- |
| Find Skill（智能找技能） | 不知道装什么时，让它去找技能 | 视频 [1]；官方「查找技能」入口 [3] |
| 办公全家桶（Word / Excel / PPT / PDF） | 写报告文稿、搭表算数、做演示、读和转 PDF | 视频 [1]；同类实现见 [6] |
| Self Improving（自我改进） | 把纠正过的地方记下来，同类任务不再踩同一个坑 | 视频 [1]；同类实现见 [8] |
| Memory Setup（长期记忆） | 记住习惯和偏好，新会话不用从头交代 | 视频 [1] |
| Summarize（内容总结） | 长视频、长文章丢链接，直接拿核心观点 | 视频 [1] |
| Skill Creator（创建新技能） | 用大白话说需求，生成能直接用的技能 | 视频 [1]；官方元技能见 [7] |
| Humanizer（去 AI 味） | 把机器的句子调顺，写文案时省事 | 视频 [1] |
| Video Downloader（视频下载） | 平台不让下载时把视频抓下来当素材 | 视频 [1] |

其中办公那一类最值得说清楚来历：Word、Excel、PPT、PDF 这四类技能在 Anthropic 的公开技能仓库里就有对应实现（`skills/docx`、`skills/pdf`、`skills/pptx`、`skills/xlsx`），它们是 Claude 文档能力背后在跑的技能，属于 source-available，可以当作复杂技能怎么写脚本和参考文档的参考。[6]

Self Improving 的常见实现方式是：把命令失败、用户纠正、能力缺失、知识过时这些情况按类别记录到 `.learnings/` 下的 markdown 文件，反复出现的结论再提升到工作区记忆文件里（比如 `AGENTS.md`、`TOOLS.md`）；它附带的可选 hook 只负责提醒和捕获，不会强制这套流程，也不会自动复核记下的结论是否成立。[8] 也就是说，「记下来」和「下次一定照做」是两件事，指望它做长期记忆时，这一点要放在预期里。

## 需要自己把关的地方

技能是别人写的代码。能带 `scripts/` 就说明它可能真的在你机器上跑东西，安装前看一眼技能来源是必要的。[5] 官方仓库对自家技能的提醒同样适用于第三方技能：这些技能用于演示和教学，你实际拿到的行为可能和它们不同，用在关键任务前要在自己的环境里完整测过。[6]

另外两点说明：上表里除官方文档和公开仓库覆盖的部分，社区技能的来源、作者与安装量请以各自发布页为准，视频里「全网三百万安装量」这类数字没有独立核实；视频里的技能名与技能生态中的同名社区技能对应关系，也建议先在技能市场里确认作者再装。[1]

## 从零装上第一批技能

1. 先装办公类技能，然后用一个真实任务验收，比如「把这份 Excel 生成分析报告」：跑完能直接拿到成品，才算真的装上。[2][3]
2. 遇到能力缺口，用「查找技能」描述任务让 WorkBuddy 去找，找到后核对来源再安装。[3]
3. 确认生效看两处：技能栏的「已安装」里有它；新开一个对话，说出 `description` 里描述的那类需求，技能会被激活并按它的流程走。[3][5]

## 自己写一个技能

手写一个最小技能只需要建目录和写文件：

```markdown
---
name: meeting-notes
description: 把会议记录整理成结构化纪要与待办清单。当用户说「整理会议纪要」「从这段记录里提取待办」时触发。
---

## 工作流程
1. 提取会议主题、时间、参与人。
2. 按「讨论 → 决议 → 待办」三段输出，待办带上负责人与截止日期。
3. 输出为 Markdown 文件，写入用户指定目录。
```

写完后可以用 Agent Skills 规范的参考工具校验格式，`skills-ref validate ./my-skill` 会检查头部字段和目录命名是否符合规范。[5]

想认真迭代一个技能，可以装 Anthropic 官方的元技能 `skill-creator`，它把一个技能从想法到打包的循环固定下来：先想清楚这个技能要做什么、大致怎么做，写一版草稿，准备几条测试提示词跑一遍，再根据评测结果改写草稿，满意后打包成技能文件交付。[7] 这套「带评测的迭代」比反复凭感觉改 `description` 更靠谱，因为触发准确率本身就是一个可以量化的指标。[5][7]

<details>
<summary>视频来源与核对范围</summary>

- 本文由作者 Ai包子铺 2026 年 10 月 12 日发布的公开视频展开，实际读取了整段约 94 秒视频的语音，并结合关键帧读取了画面上的技能卡片文字。[1]
- 技能格式与加载机制依据 Agent Skills 规范；办公技能与 skill-creator 的循环依据 Anthropic 公开的技能仓库。[5][6][7]
- 技能市场、查找与创建方式依据 WorkBuddy 官方文档。[3][4]
- 本文没有安装或运行 WorkBuddy，也没有逐个安装视频里的社区技能，因此不评价它们的实际效果、安装量与安全结论；视频提到的安装量数字未独立核实。[1]

</details>

## Sources

[1] https://www.douyin.com/video/7695617986736458139 — 抖音视频：WorkBuddy 必装的 8 个 Skill（Ai包子铺，2026-10-12）
    > "work Buddy必装的8个Skill 如果你在用work Buddy，这8个skill都可以装一下，提高你的工作学习效率"
[2] https://www.workbuddy.ai/docs/zh/workbuddy/Quickstart — WorkBuddy 官方文档：快速开始
    > "Tencent WorkBuddy 是腾讯推出的全场景职场 AI 智能体桌面工作台。您只需用一句话描述需求，Tencent WorkBuddy 便能像同事一样自主规划和执行复杂任务，并交付可验收的结果。"
[3] https://www.workbuddy.ai/docs/zh/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market — WorkBuddy 官方文档：技能（技能市场）
    > "技能市场用于统一管理和安装 Skills，扩展 Tencent WorkBuddy 的能力范围。"
[4] https://www.workbuddy.ai/docs/zh/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Create-Skills — WorkBuddy 官方文档：实践八 创建自己的 Skills
    > "请帮我创建一个用于记录灵感的自定义 Skill。当我输入灵感、想法或待验证创意时，自动识别内容类型，整理成结构化记录，并保存到指定目录。 先定义单一能力：首个自定义 Skill 建议只解决一个明确问题。 把触发条件说清楚：例如何时触发、写入哪里、输出什么结果。 执行完成后，打开技能栏，在已安装目录下即可查看新创建的 Skill。"
[5] https://agentskills.io/specification — Agent Skills 规范
    > "Must match the parent directory name"
[6] https://github.com/anthropics/skills — anthropics/skills 仓库
    > "Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks."
    > "We have also included the document creation and editing skills that power Claude document capabilities under the hood in the skills/docx, skills/pdf, skills/pptx, and skills/xlsx subfolders."
[7] https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md — anthropics/skills：skill-creator/SKILL.md
    > "Decide what you want the skill to do and roughly how it should do it"
[8] https://clawhub.ai/pskoett/self-improving-agent — ClawHub：self-improving-agent
    > "Log learnings and errors to markdown files for continuous improvement. Agents can later process these into fixes, and important learnings get promoted to workspace memory."
[9] https://www.workbuddy.ai/docs/zh/workbuddy/Overview — WorkBuddy 官方文档：简介
    > "Tencent WorkBuddy 是腾讯推出的全场景职场 AI 智能体桌面工作台，面向各类职能角色设计。您只需用一句话描述需求，Tencent WorkBuddy 便能像同事一样自主规划和执行任务，并交付可验收的结果。"

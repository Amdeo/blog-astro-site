---
title: 'Superpowers：让 AI 编程助手按流程干活的技能库'
published: 2026-04-07
updated: 2026-10-17
description: '一套装进 AI 编程助手的流程技能库，用加一个小功能的过程认识它怎么先想清楚再动手。'
tags: ['superpowers', 'AI Agent', 'Claude Code', 'Codex', 'Cursor']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://github.com/obra/superpowers'
---

Superpowers 是一套给 AI 编程助手用的开发流程技能库。「技能」可以先理解成一份操作说明：遇到某类任务时，告诉助手先做什么、怎么做、完成后检查什么。[1]

例如，你想给待办清单应用加一个按标签筛选的功能。助手如果没问清多标签怎么组合、空标签怎么显示，就直接写代码，很容易做错方向。Superpowers 希望它先澄清需求，再安排实现和测试，而不是急着动手。[1]

它不替换模型，而是改变现有助手处理开发任务的步骤。经常用 Claude Code、Codex、Cursor 等助手完成多步骤改动，希望过程有检查点的人，更可能需要它。**装好技能不等于助手必然遵守，最终仍要看实际行为和检查结果。**

<!--more-->

## 加一个小功能，把整个流程走一遍

继续用「给待办清单加标签筛选」这个例子。下面讲的是技能文档要求的工作方式，不是本文实跑过的一次开发。

### 先说清楚要什么

`brainstorming` 是负责澄清需求和讨论方案的技能。按它的要求，助手应先确认：同时点几个标签时，是都要满足还是满足其一？没有标签的条目怎么显示？而不是立刻写代码。[5]

它一边问，一边把你的回答复述回去确认。了解得差不多后，它会判断这件事有多大：如果只是「把图标改成蓝色」这种一眼就明白的小事，直接做；如果需要反复确认的小改动，在对话里说定即可；如果是一个值得写设计文档的项目，才进入正式流程。[5]

加筛选可以作为需要确认细节的小改动来理解：助手把这些选择摆出来，等你说定。技能明确要求，在你确认完整描述之前，不应开始实现。[5]

### 设计确认后，先准备干净的工作区

功能确认后，`using-git-worktrees` 技能负责准备工作区。Git worktree 是让同一个代码仓库在另一个目录里展开一个分支的办法，便于把这次修改和原目录里的工作分开。技能还要求先跑现有测试，记录起点：原来就失败的测试，不能算成新改动造成的。[12]

### 把工作拆成能验收的小步

接着是 `writing-plans` 技能。它把「加一个筛选功能」拆成一串小任务，每个任务都细到能独立测试、能被单独拒绝或通过。[6] 计划里写清楚要改哪些文件、每个函数的名字和参数、每一步怎么验证。拆完之后还有一次自审，专门检查后面的任务用到的函数名是否和前面定义的一致。[6]

### 逐项实现，先写测试

实现阶段由 `test-driven-development` 技能约束，规则很硬：**先写会失败的测试，再写让测试通过的代码。** [7] 助手不能先写好筛选逻辑再补测试；如果它这么做了，产物要删掉重来。[7] 它也列了三类例外，遇到时会先问你：一次性的原型、自动生成的代码、配置文件。[7]

具体到筛选功能，助手会先写一个「两个标签只显示同时满足的条目」的失败测试，看着它失败，再写最少的代码让它通过。

### 收尾由你决定，不自动合并

任务都做完后，`finishing-a-development-branch` 技能要求先跑测试，再让你选择本地合并、推送并创建拉取请求（PR，用于评审和合并修改），或者保留分支。[10] 未经你的选择，不应自动完成集成。

## 换一种执行方式，成本不一样

上面「逐项实现」那一步有两种走法。

`subagent-driven-development` 为每个任务派一个全新的子代理，也就是另开一位 AI 助手负责该任务；做完后检查是否符合要求、代码质量如何，最后再审查整个分支。[9] 它增加了中间审查，代价是更多模型调用与上下文开销。

另一种是 `executing-plans`：在同一个会话里把计划一项项做完，最后只做一次整体审查。README 把它列为开销更小的选择。[1]

选哪种，看任务之间是否独立、中间审查值不值得。不能为了省调用，就跳过高风险改动需要的验证。

## 出问题时还有诊断与收尾检查

如果助手不按计划走，或技能没有按预期起作用，可以让它按 `diagnosing-superpowers` 技能检查会话记录、定位问题。[1] 这是一套供助手执行的诊断步骤，不是会在后台自动纠正所有错误的程序。

另有一条约束叫 `verification-before-completion`：在同一轮里没跑过验证命令，就不能宣称它通过。[8]

## 怎么安装，怎么确认它真的在起作用

先在 README 找自己使用的助手，再按对应章节安装。不同平台的安装和加载方式不同，不能把另一款助手里的成功接入当成当前也已生效。[1]

例如 README 给 Hermes 的命令是 `hermes plugins install obra/superpowers --enable`，并提示装完后重启已有会话。[1] 这里是文档示例，本文没有执行安装。

安装后先拿一个容易检查的小功能试。官方给的检查方法是新开会话，提出做一个待办清单的需求，观察助手是否在写代码前先使用 `brainstorming` 澄清。[2] 如果它还是直接开写，就没有达到这个预期；应查接入是否正确，而不是仅凭插件列表里有名字就算成功。

<details>
<summary>资料版本与本次核对范围</summary>

- 文档依据固定到仓库 `obra/superpowers` 的提交 `bb92a77741419a4ab5f06e711a283343f1ada0c3`，对应发布 v7.0.0（2026-10-09）。技能集与各平台适配会继续变化。
- 文中各阶段行为（任务分档、TDD 例外、两种执行方式的差异、收尾选项）引自对应技能文件与 README，不是本文实测。
- 未在任何助手中安装 Superpowers，未运行模型，也没有观察到真实的自动触发或那条验收测试。触发与工作流行为按仓库文档引用。

</details>

## Sources

[1] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/README.md — superpowers/README.md
[2] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/AGENTS.md — superpowers/AGENTS.md
[5] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/SKILL.md — superpowers/skills/brainstorming/SKILL.md
[6] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/writing-plans/SKILL.md — superpowers/skills/writing-plans/SKILL.md
[7] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/test-driven-development/SKILL.md — superpowers/skills/test-driven-development/SKILL.md
[8] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/verification-before-completion/SKILL.md — superpowers/skills/verification-before-completion/SKILL.md
[9] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md — superpowers/skills/subagent-driven-development/SKILL.md
[10] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/finishing-a-development-branch/SKILL.md — superpowers/skills/finishing-a-development-branch/SKILL.md
[12] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/using-git-worktrees/SKILL.md — superpowers/skills/using-git-worktrees/SKILL.md

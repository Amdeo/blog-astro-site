---
title: 'superpowers：给编码代理用的开发工作流技能库'
published: 2026-04-07
description: '根据 obra/superpowers 的 README 整理，重点说明它是什么、解决什么问题、用在哪些编码代理里、怎么安装，以及接上之后会如何改变日常开发流程。'
image: '/assets/desktop-banner/1.webp'
tags: ['superpowers', 'AI Agent', 'Claude Code', 'Codex', 'Cursor']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# superpowers：给编码代理用的开发工作流技能库

> superpowers 官方最值得先记住的一句话是：**Superpowers is a complete software development workflow for your coding agents**。
>
> 如果翻成以后自己查资料最有用的话，就是：**superpowers 是一套给 Claude Code、Cursor、Codex、OpenCode、Gemini CLI 这类编码代理用的开发工作流技能库。**

## 什么是 superpowers

superpowers 不是一个单独的大模型，也不是一个只提供几个 prompt 的提示词合集。

它更像是一套 **装在编码代理上的开发方法 + 技能系统**。它的核心目标不是“让 AI 更会聊天”，而是让 AI 在做软件开发时，按一套固定流程来工作，比如：

- 先把需求问清楚
- 先出设计，再做实现
- 先拆计划，再写代码
- 强调 TDD，而不是先糊代码
- 用子代理并行做任务
- 中间穿插代码审查
- 最后再决定合并、提 PR，还是丢弃分支

所以以后如果自己再回来看这篇文章，先记一句话：

**superpowers 本质上是给编码代理加一套“规范开发流程”的技能层。**

## 它到底解决什么问题

很多人现在用 Claude Code、Cursor、Codex 这类工具时，会遇到同一类问题：

### 1. AI 会直接冲进去写代码

用户刚说一个需求，AI 还没搞清楚目标、边界和验收标准，就已经开始改文件了。

superpowers 解决这个问题的方式很直接：  
**先触发 brainstorming，让代理先把需求问清楚，再整理成设计。**

### 2. AI 会写，但不一定会按工程流程写

很多编码代理会做事，但不稳定：

- 有时先写代码，后补测试
- 有时没有计划，做到哪算哪
- 有时修完一个点，顺手把别的地方也动乱了
- 有时嘴上说“好了”，其实没验证

superpowers 想解决的是：  
**把“会写代码”推进成“会按流程开发”。**

### 3. 多步骤开发时，AI 容易跑偏

一旦任务稍复杂，常见问题就出来了：

- 忘了前面定的设计
- 中途偏离目标
- 每次新任务上下文不统一
- 子任务之间没有清晰边界

superpowers 的思路是把整个过程拆成一连串技能触发点，让代理在每个阶段做固定动作，而不是全靠临场发挥。

## 它用在哪些工具里

README 里已经明确列出，它可以接在这些编码工具里：

- **Claude Code**
- **Cursor**
- **Codex**
- **OpenCode**
- **GitHub Copilot CLI**
- **Gemini CLI**

如果只从“实用价值”看，这个项目最适合放在：

- 经常让 AI 写代码的人
- 希望 AI 别直接乱改代码的人
- 想让 AI 先计划、再执行、再审查的人
- 想把开发流程标准化的人

换句话说，它不是给“偶尔问一句代码问题”的场景准备的，  
它更适合 **已经把 AI 当开发搭子甚至半自动执行器来用** 的人。

## 安装方式

superpowers 的安装方式按平台不同而不同。

### Claude 官方插件市场

如果是 Claude 官方插件市场，直接安装：

```bash
/plugin install superpowers@claude-plugins-official
```

### Claude Code（通过插件市场）

先注册 marketplace：

```bash
/plugin marketplace add obra/superpowers-marketplace
```

再安装：

```bash
/plugin install superpowers@superpowers-marketplace
```

### Cursor

在 Cursor Agent chat 里安装：

```text
/add-plugin superpowers
```

或者直接去插件市场里搜 `superpowers`。

### Codex

对 Codex，它不是一条本地安装命令，而是让 Codex 去抓安装说明：

```text
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md
```

### OpenCode

对 OpenCode 也是一样：

```text
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

### GitHub Copilot CLI

```bash
copilot plugin marketplace add obra/superpowers-marketplace
copilot plugin install superpowers@superpowers-marketplace
```

### Gemini CLI

安装：

```bash
gemini extensions install https://github.com/obra/superpowers
```

更新：

```bash
gemini extensions update superpowers
```

## 接上以后先怎么验证

官方给的验证方式很简单：

**开一个新会话，然后给代理一个本该触发某项技能的任务。**

比如可以直接说：

- `help me plan this feature`
- `let's debug this issue`

如果安装正常，代理应该会自动调用对应的 superpowers skill，而不是直接跳进去乱写代码。

所以最小验证思路就是：

1. 装上 superpowers
2. 开新会话
3. 提一个“应该先规划/先排查”的任务
4. 看代理有没有按技能流程行动

## 它的基本工作流是什么

README 里把默认工作流列得很清楚，核心顺序大概是这样：

### 1. brainstorming

在真正写代码前触发。

作用：

- 把模糊需求问清楚
- 探索不同方案
- 分块展示设计，方便人确认
- 最后沉淀成设计文档

这是整个流程里很关键的一步，因为它避免了 AI 直接误解需求后开工。

### 2. using-git-worktrees

设计确认后触发。

作用：

- 创建隔离工作区
- 新建分支
- 跑项目初始化
- 确认测试基线是干净的

这一步解决的是“别直接在主工作区乱改”。

### 3. writing-plans

有了设计后，开始拆计划。

作用：

- 把任务拆成小步骤
- 每一步写清楚文件路径
- 明确实现内容
- 给出验证步骤

它强调的是：**计划要足够具体，不能只有空泛任务名。**

### 4. subagent-driven-development / executing-plans

真正进入执行阶段。

两种思路：

- **subagent-driven-development**：每个任务交给新的子代理处理，并带两阶段审查
- **executing-plans**：按批次执行，中间保留人工检查点

如果你想让代理更自治，前者更合适。  
如果你想中途多看几眼，后者更稳。

### 5. test-driven-development

实现时触发。

这一步是 superpowers 很强调的核心之一：

- 先写失败测试
- 看它失败
- 再写最小代码
- 看测试通过
- 再重构

也就是标准的 **RED-GREEN-REFACTOR**。

README 甚至直接强调：  
如果代码不是在测试之后写出来的，就删掉重来。

### 6. requesting-code-review

任务阶段之间做代码审查。

作用：

- 对照计划检查有没有偏
- 按严重程度报告问题
- 严重问题会阻断继续推进

也就是说，它不是“写完再象征性看看”，而是把 review 也变成强制流程的一部分。

### 7. finishing-a-development-branch

任务做完后触发。

作用：

- 验证测试
- 给出后续选项：合并、提 PR、保留、丢弃
- 清理 worktree

这一步相当于开发收尾，不让代理做到最后留一地分支和临时工作区。

## 它里面具体有哪些技能

README 里的技能大致分成几类。

### 测试

- `test-driven-development`

### 调试

- `systematic-debugging`
- `verification-before-completion`

### 协作与开发流程

- `brainstorming`
- `writing-plans`
- `executing-plans`
- `dispatching-parallel-agents`
- `requesting-code-review`
- `receiving-code-review`
- `using-git-worktrees`
- `finishing-a-development-branch`
- `subagent-driven-development`

### 元技能

- `writing-skills`
- `using-superpowers`

如果只抓重点，这套技能库实际上围绕的是 4 件事：

1. 先想清楚
2. 再拆计划
3. 再按测试驱动去实现
4. 做完要审查和收尾

## 它的理念是什么

README 提到的几个关键词，基本能概括这套方法论：

- **Test-Driven Development**
- **Systematic over ad-hoc**
- **Complexity reduction**
- **Evidence over claims**

翻成更直接的话就是：

- 先测后写，不要倒过来
- 靠流程，不靠拍脑袋
- 能简单就别复杂
- 先验证，再宣布完成

这个项目的味道其实很明显：  
**它不是想让代理“更自由”，而是想让代理“更守规矩”。**

## 什么情况下值得用

superpowers 适合这些情况：

### 1. 你已经高频用编码代理

如果你每天都在用 Claude Code、Cursor、Codex 这类工具，那它有价值，因为它改的是“工作方式”。

### 2. 你希望 AI 先计划再实现

如果你最烦 AI 直接冲进去乱写，那这套流程正好对症。

### 3. 你做的是中等以上复杂度任务

任务越复杂，越需要：

- 设计
- 计划
- 审查
- 验证
- 分支隔离

这类场景下，superpowers 的收益更明显。

### 4. 你愿意接受流程约束

它的本质就是给 AI 上规矩。  
如果你认可这件事，它就好用。

## 什么情况下没必要急着上

也有一些场景，没必要一上来就装。

### 1. 你只是偶尔问几个代码问题

如果你只是把 AI 当“代码问答工具”，那它的整套工作流可能太重。

### 2. 你不想让开发流程变严格

superpowers 会明显增加“先确认、先计划、先测试”的步骤。  
如果你追求的是随手试、随手改，那可能会觉得它管太多。

### 3. 你的团队还没接受这套习惯

这套东西不是只改一个命令，而是改开发节奏。  
如果你或团队本身就不习惯：

- TDD
- 计划驱动
- 中间 code review
- 分支/工作区隔离

那它未必会马上顺手。

## 日常怎么理解它的位置

以后如果自己再遇到这个项目，可以把它放在这个位置理解：

- **不是模型**
- **不是 SDK**
- **不是单个 MCP**
- **不是普通 prompt 模板**
- **而是一套给编码代理用的开发流程增强层**

它处在“你”和“编码代理的行为方式”之间。  
你还是照样给任务，但代理会因为 superpowers 的存在，按另一套节奏来干活。

## 总结

最后收成 5 句最值得记的：

1. **superpowers 是一套给编码代理用的开发工作流技能库。**
2. **它的核心不是提升聊天能力，而是约束 AI 按设计、计划、TDD、审查、收尾流程开发。**
3. **它支持 Claude Code、Cursor、Codex、OpenCode、Copilot CLI、Gemini CLI 等平台。**
4. **它最适合已经高频用 AI 写代码，并且想让 AI 更稳、更守流程的人。**
5. **如果你只是偶尔问代码问题，或者不喜欢流程约束，那它可能会显得偏重。**

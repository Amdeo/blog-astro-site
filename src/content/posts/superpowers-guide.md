---
title: 'Superpowers 的技能为什么不触发：加载、触发与验证是三件事'
published: 2026-04-07
updated: 2026-10-17
description: '从 SessionStart 引导注入讲起，区分技能库的加载、触发与验证，说明不该走全流程的任务。'
tags: ['superpowers', 'AI Agent', 'Claude Code', 'Codex', 'Cursor']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://github.com/obra/superpowers'
---

把一个技能库装进编码代理，最常见的失望不是技能写得不好，而是它根本没被调用：文件在磁盘上、技能列表里能看到、插件也显示已启用，代理还是直接开始改代码。

Superpowers 的 README 把自己描述成一套完整的软件开发方法论，并声称技能会自动触发、你不需要做任何特别的事。[1] 要判断这句话在什么条件下成立，得把三件常被混为一谈的事拆开：**加载**（技能进了会话）、**触发**（代理真的调用了它）、**验证**（你确认它确实按技能做了）。

<!--more-->

> 本文追踪仓库当前的加载入口与工作流，并离线复现了它的引导机制。未安装插件、未运行模型，也没有观察真实的自动触发。

## 加载：引导不是可选项

插件里有一个 `hooks/session-start` 脚本，注册在 `SessionStart` 事件上，匹配 `startup|clear|compact` 三种时机。[15] 它只做一件事：读取 `skills/using-superpowers/SKILL.md` 的全文，塞进会话上下文。[3]

仓库自己的贡献者说明把这条机制的必要性讲得毫不含糊：

> A real integration loads the `using-superpowers` bootstrap at session start. The bootstrap is what causes skills to auto-trigger at the right moments. Without it, the skills are dead weight — present on disk but never invoked.[2]

译文：真正可用的集成会在会话启动时加载 `using-superpowers` 引导；引导才是技能能在恰当时机自动触发的原因，没有它，技能只是躺在磁盘上的死重，永远不会被调用。

### 离线复现：这个钩子注入了什么

不用安装插件也能看清机制。把仓库取到本地，脚本所在的 `hooks/` 与 `skills/` 本就同级，直接执行即可（以下命令已在 macOS + GNU bash 3.2.57 上实际运行）：

```bash
mkdir sp && cd sp && git init -q
git remote add origin https://github.com/obra/superpowers.git
git fetch --depth 1 origin bb92a77741419a4ab5f06e711a283343f1ada0c3
git checkout FETCH_HEAD
cd hooks && bash session-start > hook.json; echo "exit=$?"
head -c 400 hook.json
```

本次运行退出码为 0，`hook.json` 为 3547 字节。`head` 只是为了截断预览，下面这 400 字节的输出在字符串中间被切断，不是文件结尾：

```json
{
  "additionalContext": "<EXTREMELY_IMPORTANT>\nYou have superpowers.\n\n**Below is the full content of your 'superpowers:using-superpowers' skill - your introduction to using skills. For all other skills, use the 'Skill' tool:**\n\n---\nname: using-superpowers\ndescription: Use when starting any conversation - establishes how to find and use skills, requiring skill invocation before ANY response
```

也就是说，注入的不只是一句介绍，而是 `using-superpowers` 的**全文**，包括那条「只要有 1% 的可能技能适用，就必须调用它」的强制规则，以及一张把「这只是个简单问题」「技能太重了」等念头逐条驳回的对照表。[4]

### 同一个钩子，不同平台输出不同字段

脚本按环境变量判断当前代理平台，只输出该平台消费的字段。带上不同变量各跑一次，实测的顶层 JSON 键如下：

| 环境变量 | 顶层 JSON 键 |
|----------|--------------|
| 无（SDK 标准） | `additionalContext` |
| `CURSOR_PLUGIN_ROOT` | `additional_context` |
| `CLAUDE_PLUGIN_ROOT`（无 Copilot / Muse 变量） | `hookSpecificOutput` |
| `MUSE_PLUGIN_ROOT` | `hookSpecificOutput` |

这不是洁癖。脚本注释写明 Claude Code 会同时读 `additional_context` 和 `hookSpecificOutput` 且不去重，所以必须只发当前平台那一个字段。[3] 注入的**内容**相同，**送达方式**按平台定制。

## 加载成功不等于会触发

技能进了会话之后，触发是模型行为，受引导文本塑造，并不是自动保证。更麻烦的是，「装了」这件事在不同代理里的含义不同：

- **这份 Hermes 适配器**通过 `pre_llm_call` 在首轮注入引导，内容附加到第一条用户消息上。[14] 该仓库 README 把压缩后不能重新注入列为集成限制，并建议触发失效时新开会话。[1] 这是固定提交下的插件设计与项目方说明，不是对所有 Hermes 版本的生命周期接口作判断；本文也没有实测压缩后的触发行为。
- **Antigravity** 在该版本的发布说明里采用另一种接入方式：向模型展示已安装技能的描述，而非依赖会话启动钩子。项目方称在 agy 1.3.1 上做过 12 次运行验证；本文未独立复现。[13]

「已安装」并不保证引导已经加载，更不保证触发。首先要确认平台是否把引导送进了模型的合适入口。触发之后由哪条技能接管也由引导规定：遇到「Let's build X」先走 `brainstorming`，遇到「Fix this bug」先走 `systematic-debugging`，再进入领域技能。[4][11]

## 验证：怎么确认它真的在按技能工作

仓库给的验收标准很短：新开一个会话，发送 `Let's make a react todo list`，一个可用的集成会在写任何代码之前自动触发 `brainstorming`。[2] 它同时把「手工把技能文件拷进代理」「依赖用户逐会话开启技能」这类做法排除在真实集成之外。[2]

这条验收之所以有用，是因为它检验的是**触发**，而不是安装命令有没有执行成功。

另外两层验证来自技能库内部：

- `verification-before-completion` 规定：在同一轮里没跑过验证命令，就不能宣称它通过。[8]
- 会话跑歪时，`diagnosing-superpowers` 会读会话记录、按行给出证据，需要的话打出一个脱敏的复现包。[1]

## 工作流：七个阶段，成本并不一样

README 把默认流程列成七步：`brainstorming` → `using-git-worktrees` → `writing-plans` → `subagent-driven-development`（或 `executing-plans`）→ `test-driven-development` → `requesting-code-review` → `finishing-a-development-branch`。[1] 关键在这条链不是无条件全程展开的。

**brainstorming 先给工作分级。** 它把任务划成三档：清晰的小任务（直接做）、小改动（在对话里确认后走常规流程）、需要设计文档的项目。分档之后才决定是否写设计文档，硬性门槛是「在你的人类伙伴批准完整描述之前，什么都不建」。[5] 所谓所有小任务都走重流程，并不符合它的设计——第一站本身就在缩小流程。

**执行有两种路径，审查成本不同。** `subagent-driven-development` 为每个任务派一个全新子代理，并逐任务检查规格符合度与代码质量，最后再审查整分支。[9] `executing-plans` 则在当前会话执行计划，README 将它列为开销更小的选择。[1] 选择时既要看任务能否独立交付，也要看中间审查的价值；不能为了省调用而跳过高风险改动所需的验证。

**隔离工作区先检测再创建。** `using-git-worktrees` 的顺序是：先判断自己是不是已经在隔离工作区里，再用平台原生的 worktree 工具，最后才退回 `git worktree`。[12] 创建完成后要跑一遍项目测试，确认基线是干净的——基线脏会让后续每一次失败都归因不清。[12]

**TDD 有命名的例外。** `test-driven-development` 的铁律是「没有先失败的测试，就不写生产代码」，先写代码后补测试的产物要删掉重来。[7] 但它同时列出三类例外并要求先问你：一次性原型、生成代码、配置文件。[7]

**计划要能独立验收。** `writing-plans` 要求每个任务都以一个可独立测试的交付物收尾，任务边界画在「审查者可以拒绝其中一个任务、却通过相邻任务」的地方，粒度细到每一步只有一个动作、一个可检查结果。[6] 计划写完后还有一次自审，逐条查设计覆盖，以及后续任务里用到的函数名是否和前面定义的一致。[6]

**收尾是一个决策菜单，不是自动合并。** `finishing-a-development-branch` 先跑整套测试，再给出本地合并、推送并开 PR、保留分支三选一，并强调集成是人类伙伴的决定，给出菜单然后等待。[10]

## 关于安装：不要一张万能对照表

README 现在的安装小节覆盖了十几个代理（Claude Code、Antigravity、Codex、Cursor、Devin、Factory Droid、Gemini CLI、Copilot CLI、Grok、Kimi、OpenCode、Pi、Qwen、Hermes、Muse 等），每个平台命令都不同，列表还在增长。[1] 抄一张表既容易过时，也掩盖了真正重要的东西。

真正的不变量只有一条：**安装必须让该平台在会话启动（或等价时机）加载引导。** README 因此要求按平台分别安装，即使你已经在另一个代理里用了它，也要为当前这个单独安装。[1] 判断一个集成是否成立，用上面那条验收测试比对照安装表更可靠。[2]

以 Hermes 为例，README 给出的是 `hermes plugins install obra/superpowers --enable`，并提示安装后重启已有会话。[1] 但这条命令本身不证明触发成功——触发要看新会话里 `brainstorming` 是否在写代码之前出现。

## 验证范围与资料版本

- **修订日期：2026-10-17。** 保留原发布日期与路径。原稿按 README 整理了一份多平台安装命令表，并把工作流描述成对所有任务生效；本文改为追踪加载入口与各执行路径的成本差异。
- **文档依据：** 仓库 `README.md`、`AGENTS.md`、`hooks/hooks.json`、`hooks/session-start`、`skills/*/SKILL.md`、`RELEASE-NOTES.md`、`.hermes-plugin/__init__.py` 固定到提交 `bb92a77741419a4ab5f06e711a283343f1ada0c3`，对应发布 v7.0.0（2026-10-09）。[13]
- **实际执行：** 在临时目录中按最终成稿的命令复现了 `hooks/session-start`，捕获了四种平台分支的真实 JSON 输出，退出码均为 0（macOS，GNU bash 3.2.57，脚本取自上述提交）。
- **未验证：** 没有在任何代理中安装 Superpowers，没有运行模型，也没有观察到真实的自动触发或那条 `Let's make a react todo list` 验收测试。触发与工作流行为按仓库文档与技能文本引用，非本文实测。
- **版本变化提醒：** `brainstorming` 在 v7.0.0 被重写，`diagnosing-superpowers` 是较新的技能，技能集与各平台适配会继续变化。[13][1]

## Sources

[1] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/README.md
[2] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/AGENTS.md
[3] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/hooks/session-start
[4] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/using-superpowers/SKILL.md
[5] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/SKILL.md
[6] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/writing-plans/SKILL.md
[7] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/test-driven-development/SKILL.md
[8] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/verification-before-completion/SKILL.md
[9] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md
[10] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/finishing-a-development-branch/SKILL.md
[11] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/systematic-debugging/SKILL.md
[12] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/using-git-worktrees/SKILL.md
[13] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/RELEASE-NOTES.md
[14] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/.hermes-plugin/__init__.py
[15] https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/hooks/hooks.json
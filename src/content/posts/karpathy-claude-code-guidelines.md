---
title: 'Karpathy 的 LLM 编码吐槽，和一份第三方 CLAUDE.md 的边界'
published: 2026-04-27
updated: 2026-10-17
description: '区分 Karpathy 的原始观察与第三方整理的四原则，讲清生效机制、修改范围、验证与轻重取舍。'
tags: ['AI', 'Claude Code', '编程指南', 'Andrej Karpathy']
category: 'AI/编程'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://github.com/multica-ai/andrej-karpathy-skills'
---

假设任务只是改一个错别字，AI 却顺手重排缩进、删掉不相干的注释，又加了一层抽象。这里举的是范围失控的示意场景，不是某次实测。Andrej Karpathy 在 2026 年 1 月的长帖里讨论过类似的过度设计与无关修改；随后一个第三方仓库把他的观察归纳成四条原则，做成 `CLAUDE.md` 来约束编码代理。[1][2]

这两件事需要分开看：Karpathy 报告的是一组失败模式，而网上流传的四原则是别人替他归纳的检查清单。边界清楚了，才知道该把它当成可直接套用的规范，还是一份要自己裁剪的草稿。

<!--more-->

> 本文是来源与文档解读，不是使用体验或效果测评。文中未安装插件、未运行代理、未做 A/B 对比。

## Karpathy 报告了什么

帖子里的重点不是 AI 会写错语法，而是错误的层级变了：不再是语法错误，而是「一个略微粗心、着急的初级工程师会犯的概念性错误」。最常出现的一类，他用一句话概括：

> The most common category is that the models make wrong assumptions on your behalf and just run along with them without checking. They also don't manage their confusion, they don't seek clarifications, they don't surface inconsistencies, they don't present tradeoffs, they don't push back when they should, and they are still a little too sycophantic.[1]

第二类是复杂度：

> They will implement an inefficient, bloated, brittle construction over 1000 lines of code and it's up to you to be like "umm couldn't you just do this instead?"[1]

第三类最隐蔽，也和「精准修改」直接相关：

> They still sometimes change/remove comments and code they don't like or don't sufficiently understand as side effects, even if it is orthogonal to the task at hand.[1]

帖子里还有一句常被忽略、却对本文最关键的话——这些问题「尽管在 CLAUDE.md 里做了几次简单的指令尝试，依然发生」：

> All of this happens despite a few simple attempts to fix it via instructions in CLAUDE.md.[1]

也就是说，Karpathy 报告的是一次指令没能完全修好的经历，而不是一份已被证明有效的规则。

## 四原则是谁归纳的

「四原则」来自仓库 `andrej-karpathy-skills`（原地址为 `forrestchang/andrej-karpathy-skills`，现已转移并重定向到 `multica-ai/andrej-karpathy-skills`）。README 自己写明这是一个单文件 `CLAUDE.md`，是 derived from Andrej Karpathy's observations，即从 Karpathy 的观察派生。[2] Think Before Coding、Simplicity First、Surgical Changes、Goal-Driven Execution 是该仓库的整理结果；这里核对的原帖并没有把它们发布为一套四原则框架。[1][2] 不能把第三方整理直接署在 Karpathy 名下。

## 同一套原则的三种载体，触发方式不同

仓库里其实是同一份内容的三次包装：

| 载体 | 生效方式 | 作用范围 |
|------|----------|----------|
| `CLAUDE.md` | 项目根指令文件，会话启动时读取 | 常驻，所有任务 |
| `skills/karpathy-guidelines/SKILL.md` | 技能，按需加载 | 被触发时 |
| `.cursor/rules/karpathy-guidelines.mdc` | Cursor 项目规则，标记 `alwaysApply: true` | 在该项目内常驻 |

三份文本几乎逐字一致。[3][5] 差别在触发机制：常驻根指令进入会话上下文；按需技能需要先被宿主或模型选中；Cursor 规则依赖 Cursor 的规则加载——仓库写得很明确，Cursor 默认不读 `.claude-plugin/` 或 `CLAUDE.md`。[4] 所以「我装了 Claude Code 插件」并不等于 Cursor 里也生效，反之亦然。

## 四原则各自约束什么

与其背四个英文标题，不如记住它们分别管哪件事。

### 修改范围：每行改动都能追溯到请求

Surgical Changes 给出的判据是可检验的：每一行改动都应该能直接追溯到用户的请求。[3] 配套规则也很具体——不要顺手「改进」相邻的代码、注释或格式；不要重构没坏的东西；匹配现有风格，哪怕你自己会写得不一样；发现无关的死代码可以提，但不要删。唯一的例外是自己改动造成的孤儿：你的改动让某个 import 或函数变成未使用，那些由你清理。[3]

这条把「精简」从审美问题变成了范围问题。AI 生成的大 diff 里，真正危险的不是新增的那部分，而是没人要求、也没人细看的顺手改动。

### 验证：把命令式任务改写成可验证目标

Goal-Driven Execution 把「做什么」换成「怎么算做完」。仓库给的三组对照是：「加个校验」改成「为无效输入写测试，然后让它们通过」；「修个 bug」改成「写个能复现 bug 的测试，再让它通过」；「重构 X」改成「确保重构前后测试都能通过」。[3] 多步骤任务则要求先列出 `1. [步骤] → 验证: [检查]` 的骨架。[3]

它和原帖里那句被广泛引用的话，是同一件事的两种说法：

> Don't tell it what to do, give it success criteria and watch it go.[1]

强弱标准的差别直接决定循环方式：强标准（有测试、有明确输出）能让代理自己迭代；弱标准（「让它能跑」）会把问题不断弹回给你。[3]

### 轻重取舍：这不是对所有任务都上的流程

`CLAUDE.md` 的第一句就是权衡声明：这些指南偏向谨慎而非速度，对琐碎任务用判断力。[5] README 说得更直白，对错别字和显而易见的一行修复，不是每个改动都需要全套严谨流程。[2]

这条恰好是「简洁优先」的自指：如果把一个错别字修复也套上假设陈述、多种解读、测试先行、计划骨架，那本身就是过度工程。[3] 四原则要压制的是非平凡任务上的昂贵错误，不是速度；把它当成所有任务的强制流程，等于用错了工具。

Think Before Coding 则是最前面的前提：不确定就问、有歧义时列出多种解读而不是默默选一个、有更简单方案就说出来、不清楚就停下来。[3] 它负责在动手之前截断「错误假设一路狂奔」。

## 不要照抄安装命令

README 给了两种接入方式：对新项目是 `curl -o CLAUDE.md <raw URL>`，对已有项目是往 `CLAUDE.md` 里追加同一份文件。[2]

这两条都不适合直接照抄。`curl -o` 会覆盖同名文件，用在已有项目上等于用通用规则替换掉你自己的项目约定；追加则会把整套通用规则复制进你的文件，与既有项目规则并存、重叠甚至冲突。文件自己的第一句写的是按需与项目专属指令合并（merge with project-specific instructions as needed），[3] 而不是整份复制。

更稳妥的做法是把它当来源而不是成品：读这四条原则，对照你最近实际遇到的失败——是范围失控、没验证就宣布完成，还是需求没问清——只把对症的那一两条写进你自己的 `CLAUDE.md`，并保留原有项目规则。CURSOR.md 也建议把 Cursor 规则文件拷进目标项目再按需调整。[4]

## 怎么判断它是否在生效

仓库列出的生效信号是：diff 里不必要的改动更少、因过度复杂导致的重写更少、澄清问题出现在实现之前、PR 干净精简。[2] 这些是整理者给出的观察指标，仓库没有提供 A/B 或测量数据。

在自己的仓库里，可以逐行检查 diff 与需求的对应关系，并从会话记录核对必要的澄清是否发生在实现之前。问题问得多、diff 行数少，都不能单独证明效果。

例如给列表接口增加 `limit` 校验，可以先约定：缺省值不变，纯数字字符串才接受，越界和混合字符串必须被拒绝；修改范围限于参数解析及对应测试，不动路由命名、数据库层或全文件格式。审查时同时核对边界测试和修改范围。这是一个验收设计示例，不是本文已经运行的项目实验。

## 验证范围与资料版本

- **修订日期：2026-10-17。** 保留原发布日期与路径。原稿把四原则的来源直接算在 Karpathy 名下，并给出了会覆盖已有 `CLAUDE.md` 的接入命令；两处均按原始来源更正。
- **未验证：** 未安装插件、未运行任何代理、未做 A/B 对比，也未测量这套指南对 diff 范围或重写次数的影响。README 的生效信号是仓库自述，本文按声明引用。
- **文档依据：** Karpathy 原帖（2026-01-26）；仓库 `README.md`、`CLAUDE.md`、`CURSOR.md`、`skills/karpathy-guidelines/SKILL.md` 固定到提交 `2c606141936f1eeef17fa3043a72095b4765b9c2`（2026-04-20）。仓库 2026 年 1 月 27 日创建，此后内容与安装方式仍可能变化。
- **一个已知反例：** Karpathy 本人报告这些失败在他的 `CLAUDE.md` 尝试下依然存在，[1] 所以这类文件应视为降低概率的约束，而不是消除错误的保证。

## Sources

[1] https://x.com/karpathy/status/2015883857489522876
[2] https://github.com/multica-ai/andrej-karpathy-skills/blob/2c606141936f1eeef17fa3043a72095b4765b9c2/README.md
[3] https://github.com/multica-ai/andrej-karpathy-skills/blob/2c606141936f1eeef17fa3043a72095b4765b9c2/CLAUDE.md
[4] https://github.com/multica-ai/andrej-karpathy-skills/blob/2c606141936f1eeef17fa3043a72095b4765b9c2/CURSOR.md
[5] https://github.com/multica-ai/andrej-karpathy-skills/blob/2c606141936f1eeef17fa3043a72095b4765b9c2/skills/karpathy-guidelines/SKILL.md
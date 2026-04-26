---
title: 'Karpathy 风格的 Claude Code 编码指南'
published: 2026-04-27
description: '基于 Andrej Karpathy 对 LLM 编码问题的观察，整理出四原则编码指南，让 AI 助手写出更简洁、更精准的代码。'
tags: ['AI', 'Claude Code', '编程指南', 'Andrej Karpathy']
category: 'AI/编程'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Karpathy 风格的 Claude Code 编码指南

最近看到了一个很有意思的项目 [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)，作者基于 Andrej Karpathy 在 X 上的一系列观察，提炼出了一套针对 LLM 编码的改进指南。Karpathy 作为 AI 领域的大牛，他对当前 LLM 编程问题的吐槽可谓一针见血。

## Karpathy 指出的问题

Karpathy 在推文中提到，现在的 LLM 在编码时存在几个典型问题：

> "模型会替你做出错误的假设，然后沿着这些假设一路狂奔而不加验证。它们不管理自己的困惑，不寻求澄清，不暴露矛盾，不呈现权衡，不在该反对的时候反对。"

> "它们特别喜欢把代码和 API 搞复杂，堆砌抽象，不清理死代码……明明 100 行能搞定的事，非要搞成 1000 行的臃肿构造。"

> "有时候还会把不理解的代码或注释当作副作用改掉或删掉，哪怕这些改动跟当前任务完全无关。"

这些问题，相信用过各种 AI 编程工具的人都有共鸣。

## 四原则解决方案

这个项目把 Karpathy 的观察浓缩成了四个核心原则，写进一个 `CLAUDE.md` 文件里：

| 原则 | 解决的问题 |
|------|-----------|
| 编码前先思考 | 错误假设、隐藏困惑、缺失权衡 |
| 简洁优先 | 过度复杂、臃肿抽象 |
| 精准修改 | 无关改动、误触不该碰的代码 |
| 目标驱动 | 通过测试定义可验证的成功标准 |

### 1. 编码前先思考

不要假设，不要隐藏困惑，要暴露权衡。

- **明确陈述假设** — 不确定就问，别猜
- **呈现多种解读** — 有歧义时不要默默选一种
- **该反对时就反对** — 如果有更简单的方案，说出来
- **困惑时停下来** — 说出哪里不清楚，请求澄清

### 2. 简洁优先

用最少的代码解决问题。不要 speculative。

- 不要加没被要求的功能
- 不要为只用一次的代码造抽象
- 不要加没被要求的"灵活性"或"可配置性"
- 不要为不可能发生的场景写错误处理
- 如果 200 行能压缩到 50 行，重写它

检验标准：资深工程师会不会说这代码过度复杂了？如果是，简化。

### 3. 精准修改

只碰必须碰的。只清理自己制造的混乱。

编辑现有代码时：
- 不要"改进"相邻的代码、注释或格式
- 不要重构没坏的东西
- 匹配现有风格，哪怕你自己会写得不一样
- 如果发现无关的死代码，提一下 — 但别删

自己的改动制造了孤儿代码时：
- 删掉**你的改动**导致的未使用 import/变量/函数
- 不要删预先存在的死代码，除非被要求

检验标准：每一行改动都能直接追溯到用户的请求。

### 4. 目标驱动

定义成功标准。循环直到验证通过。

把命令式任务转化为可验证的目标：

| 不要说... | 转化为... |
|-----------|----------|
| "加个校验" | "为无效输入写测试，然后让它们通过" |
| "修个 bug" | "写个能复现 bug 的测试，然后让它通过" |
| "重构 X" | "确保重构前后测试都能通过" |

多步骤任务时，简要列出计划：

1. [步骤] → 验证: [检查]
2. [步骤] → 验证: [检查]
3. [步骤] → 验证: [检查]

强的成功标准让 LLM 能独立循环。弱的标准（"让它能跑"）则需要不断澄清。

## 关键洞察

Karpathy 说得很精辟：

> "LLM 特别擅长循环直到达成具体目标……别告诉它该做什么，给它成功标准，然后看它发挥。"

"目标驱动执行"这个原则就是对此的捕捉：把命令式指令转化为带验证循环的声明式目标。

## 怎么知道它在生效

这些指南生效时，你会看到：

- **diff 里不必要的改动更少** — 只有被请求的改动
- **因过度复杂导致的重写更少** — 代码第一次就简洁
- **澄清问题出现在实现前** — 而不是出错后
- **干净、精简的 PR** — 没有顺路重构或"改进"

## 使用方式

这个项目提供了几种使用方式：

**方式 A：Claude Code 插件（推荐）**

```bash
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```

**方式 B：项目级 CLAUDE.md**

新项目：
```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```

现有项目（追加）：
```bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

**Cursor 用户**：项目里还包含了 `.cursor/rules/karpathy-guidelines.mdc`，在 Cursor 中打开项目即可应用同样的规则。

## 权衡说明

这些指南偏向谨慎而非速度。对于简单任务（改个错别字、 obvious 的一行修复），自行判断 — 不是每个改动都需要全套严谨流程。

目标是减少非平凡任务上的昂贵错误，而不是拖慢简单任务。

---

这个项目让我想起了自己平时用 AI 编程时的各种糟心体验。有时候 LLM 确实像个过度热情的新手程序员，什么都想加，什么都想改，就是不想先想清楚。Karpathy 这四条原则，本质上是在给 LLM 立规矩 — 先想后做、保持简洁、精准下手、目标导向。

如果你也经常被 AI 的"过度发挥"困扰，不妨试试这套指南。

**项目地址**：[https://github.com/forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)

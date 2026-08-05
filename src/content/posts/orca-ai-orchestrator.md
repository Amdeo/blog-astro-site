---
title: 'Orca：一个让多个 AI 编程助手并行协作的开源编排器'
published: 2026-08-05
description: 'Orca 是桌面端的 AI 编排器：用 git worktree 让 Codex、Claude Code 等并行干活，还带手机端和 CLI。'
tags: ['AI编程', '开源工具', 'Agent编排']
category: 'AI/编程'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

最近看到了一个很有意思的项目——**Orca**（[github.com/stablyai/orca](https://github.com/stablyai/orca)），一个短短几个月就冲到 3.8 万 star 的开源 AI 编排器。它解决了一个很真实的痛点：当你的电脑上同时装了 Codex、Claude Code、OpenCode 好几个 AI 编程助手，怎么让它们**并行协作**而不是互相打架。

<!--more-->

## 它是什么

一句话：**Orca 是一个桌面端的 "Agent Development Environment"（ADE）**，专门用来管理"一整个舰队"的 AI agent。

传统用法是你开一个终端，跑一个 Claude Code 或 Codex，然后等它干完。Orca 的玩法是：**同一个提示词，一次性丢给五个不同的 agent**，每个 agent 在各自独立的 git worktree 里干活，最后你比较结果、挑最好的合并进来。

> The AI Orchestrator for 100x builders. Run Codex, ClaudeCode, OpenCode or Pi side-by-side — each in its own worktree, tracked in one place.

它兼容市面上几乎所有 CLI agent——Claude Code、OpenCode、Codex、Cursor、GitHub Copilot、Hermes Agent、Kimi、Qwen Code……只要能在终端里跑的，都能在 Orca 里跑。核心卖点是：**用你自己的订阅**（比如你自己的 Claude 订阅），不额外抽成。

## 核心特性

| 特性 | 干什么用 |
|------|---------|
| 并行 Worktree | 一个提示分发给 5 个 agent，各跑各的 git worktree，对比结果合并最优 |
| 移动 Companion | 手机上看 agent 进度、收完成通知、随手发 follow-up 指令 |
| 终端分屏 | Ghostty 级终端，WebGL 渲染，无限分屏，滚动历史重启不丢 |
| Design Mode | 点真实 Chromium 窗口里的 UI 元素，把 HTML/CSS/截图直接喂给 agent |
| GitHub & Linear 原生集成 | 应用内浏览 PR/issue，从任务直接开 worktree |
| SSH Worktree | 让 agent 跑在远程高性能机器上，自动重连+端口转发 |
| 标注 AI Diff | 在任意 diff 行评论，把意见发回给 agent，不离开 Orca |
| Orca CLI | `orca worktree create`、`snapshot`、`click`、`fill`，脚本化一切 |

## 怎么用

安装很简单，桌面端三平台都有：

```bash
# macOS
brew install --cask stablyai/orca/orca

# Arch Linux
yay -S stably-orca-bin
```

典型工作流：

1. 在 Orca 里打开你的项目仓库
2. 输入一个任务描述（比如"给这个 API 加限流"）
3. 选 2~3 个 agent 并行执行——比如 Claude Code 写实现、Codex 写测试、OpenCode 做代码审查
4. 每个 agent 在独立的 worktree 里干活，互不污染主分支
5. 比较各 worktree 的 diff，挑最好的合并

```bash
# 或者用 CLI 脚本化
orca worktree create "refactor auth module" --agent claude-code
orca snapshot list
```

## 为什么值得关注

**第一，它把"多 agent 协作"从概念变成了实用工具。** 之前想并行跑多个 agent，要么手动开好几个终端窗口手工切，要么写一堆脚本管理 worktree。Orca 把这些全收进一个 GUI 里，还统一跟踪进度。

**第二，git worktree 这个技术选型很聪明。** 它不是用 Docker 或虚拟机隔离，而是用 git 原生的 worktree 机制——每个 agent 有独立的文件系统和 git 分支，天然隔离，合并也方便。轻量、可靠、和你的版本控制流程无缝衔接。

**第三，它照顾了真实的"人机协作"场景。** Design Mode 让前端 agent 能直接"看到"真实渲染的 UI；Diff 标注让 review 变得像在 GitHub 上评论一样自然；移动端让你出门在外也能盯着 agent 干活。这些细节说明它不只是个玩具 demo。

## 什么时候适合用它

- **你在同时用多个 AI 编程助手**，想让它们各司其职、并行推进
- **你有需要对比多种实现方案的场景**（重构、算法选型），想让几个 agent 各给一版再挑
- **你想在手机/远程监控 agent 任务**，不想一直守在电脑前
- **你在 VPS/远程服务器上跑 agent**，需要 SSH worktree 这种远程编排能力

## 注意事项

- 它是**桌面应用**（Electron 系），首次上手需要下载客户端，不是纯 CLI 工具（虽然有 Orca CLI 可以脚本化）
- 并行跑多个 agent 意味着**多份 API 消耗**，注意你的订阅额度
- worktree 隔离的是文件系统，**不是安全沙箱**——agent 仍然有权限访问你的文件，敏感项目还是要谨慎
- 项目更新非常快（"we ship daily"），功能列表变化频繁，以 changelog 为准

## 总结

Orca 是 AI 编程工具从"单 agent 助手"走向"多 agent 编排"的一个代表性产品。它没有发明新的 agent，而是把已有的 Codex、Claude Code 们**编排**起来，让它们并行、隔离、可比较。如果你已经深度使用多个 AI 编程助手，Orca 值得一试——尤其是它的 worktree 并行模型和 Design Mode，是目前同类工具里比较少见的亮点。

**参考：**
- 仓库：<https://github.com/stablyai/orca>
- 官网：<https://onorca.dev>

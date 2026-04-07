---
title: 'RTK：给 AI 编程工具用的 CLI 代理'
published: 2026-04-07
description: '按 RTK 官方 README 重写，重点只讲三件事：它到底解决什么问题、用在哪些 AI 编程工具里、接入后先跑哪些命令。适合以后自己直接查接入方法和常用命令。'
image: '/assets/desktop-banner/1.webp'
tags: ['RTK', 'MCP', 'AI Agent', '工具链']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
permalink: /rtk/
sourceLink: https://github.com/rtk-ai/rtk
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

# RTK：给 AI 编程工具用的 CLI 代理

> RTK 官方首页最值得先记住的一句话是：**High-performance CLI proxy that reduces LLM token consumption by 60-90%**。
>
> 如果直接翻成我们自己以后查资料时最有用的话，就是：**RTK 是一个接在 Claude Code、Codex、Cursor、Gemini CLI 这类 AI 编程工具前面的 CLI 代理层，主要用来减少 token 消耗，并把常见命令调用统一收口到本地 CLI 这一层。**

## 什么是 RTK

RTK 不是一个单独的聊天产品，也不是一个只包模型 API 的 SDK。

更准确地说，它是一个 **给 AI 编程工具用的 CLI 代理层**。这些编程工具本来就会频繁调用 shell、bash、git、测试命令、容器命令、云命令。RTK 做的事情，是把这类调用先接到自己这一层，再决定怎么重写、压缩、过滤和返回结果。

所以以后自己再看这篇文章，先记住一句话就够了：

**RTK 主要不是给人直接手敲命令玩的，而是给 Claude Code、Codex、Cursor 这类编程工具接上的。**

## 它到底解决了什么问题

这个问题应该放最前面，因为它才是核心。

RTK 主要解决下面 3 类问题。

### 1. AI 编程工具太费 token

像 Claude Code、Codex、Cursor 这类工具，在真实开发里会大量调用：

- `git status`
- `git diff`
- `git log`
- `ls`
- `cat`
- `grep`
- `docker ps`
- `kubectl get`
- `gh pr list`

这些命令很多都会产生很长的输出。如果这些输出原样喂给模型，token 会烧得非常快。

RTK 解决的第一件事，就是：**尽量把本来可以在本地 CLI 层处理的内容，先在本地处理，不要一股脑全送进模型。**

### 2. 编程工具会调命令，但缺统一代理层

问题往往不在“会不会调命令”，而在：

- 调用结果怎么压缩
- 哪些命令要改写
- 哪些命令不该改写
- 配置放哪
- 出问题怎么查

RTK 就是在这些 AI 编程工具和底层 CLI 之间补了一层统一代理。

### 3. 自己以后不好查，也不好排障

如果只是偶尔做 demo，可能无所谓。

但如果以后真的长期用 Claude Code、Codex、Cursor 这些工具，那最烦的其实是：

- 接入命令忘了
- 当前支持哪些工具忘了
- 配置路径忘了
- telemetry 怎么关忘了
- 失败日志去哪看忘了

所以这篇文章也必须按“以后自己查资料直接能用”的方式写，而不是写成泛介绍。

## RTK 用在哪些编程工具里

这一节比“架构分层”重要得多，因为平时真正会查的就是这个。

根据官方 README，RTK 目前主要用于这些 **AI 编程工具**：

- Claude Code
- GitHub Copilot
- GitHub Copilot CLI
- Cursor
- Gemini CLI
- Codex
- Windsurf
- Cline / Roo Code
- OpenCode
- OpenClaw

所以以后如果脑子里只想记一件事，就记：

**RTK 是给这些编程工具接 shell / CLI 能力时用的，不是单独拿出来理解成一个通用 AI 理论项目。**

## 这些编程工具怎么接 RTK

下面只保留以后自己最可能直接查的接入命令。

### Claude Code / GitHub Copilot

```bash
rtk init -g
```

这是默认全局初始化方式。README 说明它会通过 hook 把 Bash 工具调用改写到 RTK 这一层。

### Gemini CLI

```bash
rtk init -g --gemini
```

### Codex

```bash
rtk init -g --codex
```

README 提到 Codex 接入后会涉及：

- `~/.codex/RTK.md`
- `~/.codex/AGENTS.md`

所以以后如果 Codex 接入不对，先查这两个文件。

### Cursor

```bash
rtk init -g --agent cursor
```

相关文件包括：

- `~/.cursor/hooks/rtk-rewrite.sh`
- `~/.cursor/hooks.json`

### Windsurf

```bash
rtk init --agent windsurf
```

### Cline / Roo Code

```bash
rtk init --agent cline
```

### OpenCode

```bash
rtk init -g --opencode
```

### OpenClaw

```bash
openclaw plugins install ./openclaw
```

这个很关键，因为它说明 RTK 不只是和某一个编码工具耦合，而是可以接到更广义的 Agent 系统里。

## 接上以后先跑哪些命令

如果以后真要自己用，最重要的不是长篇解释，而是“第一轮到底先敲什么”。

建议按下面顺序。

### 1. 看版本和收益

```bash
rtk --version
rtk gain
```

README 给的版本示例是 `rtk 0.28.2`。

这里 `rtk gain` 很值得记，因为它直接对应 RTK 的核心价值：**节省 token**。

### 2. 看命令和能力有没有正常挂上

```bash
rtk --help
rtk list
```

- `rtk --help`：确认命令体系是否完整
- `rtk list`：看当前有哪些能力已经可用

### 3. 跑环境诊断

```bash
rtk doctor
```

如果以后装完之后感觉“不对”，不要先猜，先跑这个。

## 日常最常用的 RTK 命令

这部分才是真正适合以后自己回来查的。

### 文件和文本处理

```bash
rtk ls .
rtk read file.rs
rtk read file.rs -l aggressive
rtk smart file.rs
rtk find "*.rs" .
rtk grep "pattern" .
rtk diff file1 file2
```

适合场景：

- 让编程工具读目录
- 让编程工具读文件
- 让编程工具做 grep / 查找 / diff

### Git / GitHub 相关

```bash
rtk git status
rtk git log -n 10
rtk git diff
rtk git add
rtk git commit -m "msg"
rtk git push
rtk git pull
```

GitHub CLI：

```bash
rtk gh pr list
rtk gh pr view 42
rtk gh issue list
rtk gh run list
```

这一组很适合以后在 Claude Code / Codex 里频繁操作代码仓库时用。

### 测试、构建、检查

```bash
rtk test cargo test
rtk err npm run build
rtk vitest run
rtk playwright test
rtk pytest
rtk cargo test
rtk cargo build
rtk cargo clippy
rtk tsc
rtk lint
rtk lint biome
rtk prettier --check .
```

这组命令说明 RTK 不只管 git，它是往完整开发流程里插的。

### 容器、云、网络类

```bash
rtk docker ps
rtk docker images
rtk docker logs <container>
rtk docker compose ps
rtk kubectl pods
rtk kubectl logs <pod>
rtk kubectl services
rtk aws sts get-caller-identity
rtk aws ec2 describe-instances
rtk aws s3 ls
rtk curl <url>
rtk wget <url>
```

如果以后要在更复杂的工程环境里用 AI 编程工具，这一组会更有价值。

## RTK 是怎么把普通命令接过去的

README 里有一个非常关键的点：**它会把普通命令改写成 `rtk ...` 形式。**

例如：

- `git status` → `rtk git status`
- `git diff` → `rtk git diff`
- `gh pr list` → `rtk gh pr list`
- `cat file` → `rtk read file`
- `grep pattern` → `rtk grep pattern`
- `ls` → `rtk ls`
- `docker ps` → `rtk docker ps`
- `kubectl logs` → `rtk kubectl logs ...`

这正是它能减少 token 的关键原因：

**不是让模型先看到一大段原始输出再总结，而是在命令入口就先做代理和重写。**

## 有一个很容易踩坑的点

README 明确提到：

> 只有 Bash 工具调用会经过 hook。
> Claude Code 内建的 Read / Grep / Glob 这类工具，并不会自动走 RTK。

这个点必须记住。

也就是说：

- **走 shell / bash / CLI 的调用**，RTK 能介入
- **走工具自身内建读取能力的调用**，RTK 不一定介入

所以如果以后在 Claude Code 里装了 RTK，却发现某些读取还是没省 token，先别怀疑 RTK 没生效，先看调用路径到底是不是 Bash。

## 配置、遥测和排障入口

这一节就是典型的“以后查资料直接用”。

### 配置文件位置

- Linux：`~/.config/rtk/config.toml`
- macOS：`~/Library/Application Support/rtk/config.toml`

tracking 数据库默认路径：

```bash
~/.local/share/rtk/history.db
```

### 关闭 telemetry

```bash
export RTK_TELEMETRY_DISABLED=1
```

或者：

```toml
[telemetry]
enabled = false
```

### tee 失败输出恢复路径

```bash
~/.local/share/rtk/tee/1707753600_cargo_test.log
```

以后遇到失败日志找不到，先看这个目录。

## 什么情况下值得上 RTK

适合：

- 已经在用 Claude Code、Codex、Cursor、Gemini CLI 这类工具
- 这些工具会频繁跑 git、测试、构建、容器、云命令
- 已经感受到 token 消耗高
- 想把命令调用统一收口到一层代理里

## 什么情况下没必要急着上

如果现在只是：

- 偶尔跑几个简单命令
- 还在轻量 demo 阶段
- 没有明显 token 成本压力
- 没有复杂命令调用链

那 RTK 暂时可能不是第一优先级。

## 总结

最后直接收成 5 条，方便以后复习：

1. **RTK 最核心的定位**：给 Claude Code、Codex、Cursor 这些 AI 编程工具用的 CLI 代理层。
2. **RTK 最核心的价值**：减少 60%–90% 的 LLM token 消耗。
3. **RTK 主要用在哪**：这些编程工具调用 shell / CLI、git、测试、容器、云命令的时候。
4. **第一次接上以后先跑**：`rtk --version`、`rtk gain`、`rtk --help`、`rtk list`、`rtk doctor`。
5. **最关键的注意点**：只有 Bash / CLI 调用会经过 RTK，内建 Read / Grep / Glob 不一定会走它。

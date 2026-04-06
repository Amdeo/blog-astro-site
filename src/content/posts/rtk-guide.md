---
title: 'RTK：给 Claude Code、Codex 这类编程工具用的 CLI 代理怎么接、怎么用'
published: 2026-04-07
description: '直接根据 rtk-ai/rtk 官方 README 重写，重点说明 RTK 到底解决什么问题、用在哪些 AI 编程工具里、怎么接入 Claude Code / Codex / Cursor / Gemini CLI，以及第一次该跑哪些命令。'
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

# RTK：给 Claude Code、Codex 这类编程工具用的 CLI 代理怎么接、怎么用

> RTK 官方给自己的定义很直接：**High-performance CLI proxy that reduces LLM token consumption by 60-90%**。如果按中文直接理解，它本质上就是一个给 AI 编程工具使用的高性能 CLI 代理层，主要作用是减少 token 消耗，并把常见命令调用收口到本地 CLI 这一层。

## 什么是 RTK

如果只看名字，RTK 很容易被误解成一个泛泛的 AI 框架。

但看完 README，更准确的理解应该是：**RTK 不是一个“让模型聊天更聪明”的项目，而是一个接在 Claude Code、Codex、Cursor、Gemini CLI 这类编程工具前面的 CLI 代理层。**

它的目标很明确：

1. **减少 LLM token 消耗**，官方给出的口径是 **60%–90%**
2. **把原本会直接喂给模型的大量命令行输出，先在本地 CLI 层处理一遍**
3. **让 AI 编程工具在调用本地工具、命令和工作流时，更可控、更统一、更容易排障**

所以它最核心的关键词不是“框架”，而是：

- CLI proxy
- token reduction
- coding tools integration
- local command rewrite

## 它到底解决了什么问题

如果是给自己以后查阅，那最该先记住的不是概念，而是问题。

RTK 主要解决下面几类问题。

### 1. AI 编程工具在命令行场景下太费 token

像 Claude Code、Codex、Cursor 这类工具，在真实工作里会频繁做这些事：

- `git status`
- `git diff`
- `git log`
- `ls`
- `cat`
- `grep`
- `docker ps`
- `kubectl get`
- `gh pr list`

这些命令很多都会产生大量输出。如果这些输出原样进模型，上下文会迅速膨胀，token 消耗也会很高。

RTK 要解决的第一件事，就是：**让这些本来可以在本地 CLI 层处理的内容，不要全部原样喂进模型。**

### 2. 编程工具会调命令，但缺一层统一代理

很多 AI 编程工具本身已经会调用 shell / bash / CLI。

问题不在于“能不能调”，而在于：

- 调用结果怎么压缩
- 哪些命令应该重写
- 哪些命令应该排除
- 配置在哪里
- 出问题怎么查

RTK 就是在这一层补了一个统一代理。

### 3. 日常工具链越来越多，缺少统一入口

实际开发里，命令来源通常很杂：

- git / gh
- npm / pnpm / cargo / pip / go
- docker / kubectl / aws
- pytest / playwright / vitest / tsc / lint

README 里可以看到，RTK 已经把这些常见命令都收进了自己的命令体系。

所以它解决的不是“有没有命令可用”，而是：**怎么把这些常见开发命令统一纳入一层适合 AI 编程工具调用的代理入口。**

## RTK 用在哪些工具里

这个问题应该直接往前放，因为它就是文章核心。

RTK 不是单独玩的，它主要就是给这些 **AI 编程工具** 用的：

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

如果以后自己要接某个工具，先从这一节查，而不是再回 README 里翻。

## 这些编程工具怎么接 RTK

下面把 README 里最关键的接入命令直接收一遍。

### Claude Code / GitHub Copilot

默认全局初始化命令：

```bash
rtk init -g
```

README 说明它会通过 hook 把 Bash 工具调用重写到 RTK 这层。

### Gemini CLI

```bash
rtk init -g --gemini
```

### Codex

```bash
rtk init -g --codex
```

README 里提到 Codex 这条链路会写入：

- `~/.codex/RTK.md`
- `~/.codex/AGENTS.md`

所以如果以后要排 Codex 接入问题，可以先看这两个文件。

### Cursor

```bash
rtk init -g --agent cursor
```

README 提到它会涉及：

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

这条很重要，因为它说明 RTK 不只是给某一个编码工具用，而是可以接进更广义的 Agent / tool 调用系统。

## 接上以后先跑哪些命令

如果以后自己要实际用，最该记的不是长篇解释，而是“接上以后第一轮跑什么命令”。

建议按这个顺序：

### 1. 看版本和收益概览

```bash
rtk --version
rtk gain
```

README 里给的版本示例是 `rtk 0.28.2`。`rtk gain` 用来直接看 token 节省效果，这个命令本身就能帮助判断 RTK 有没有真正发挥作用。

### 2. 看命令和能力是否正常挂上

```bash
rtk --help
rtk list
```

- `rtk --help`：确认主命令和子命令是否存在
- `rtk list`：看当前有哪些能力已经被识别出来

### 3. 跑诊断

```bash
rtk doctor
```

这个命令很关键。以后如果接入 Claude Code / Codex 后感觉“不对劲”，先不要猜，先跑 `rtk doctor`。

## 日常怎么用 RTK

这部分也应该明确写，不然文章看完还是不知道怎么落地。

README 里其实已经给了很多实际命令例子。

### 文件与文本类

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

- 让 AI 编程工具读目录、读文件、查文本
- 减少把整段原始内容直接塞给模型

### Git / GitHub 类

```bash
rtk git status
rtk git log -n 10
rtk git diff
rtk git add
rtk git commit -m "msg"
rtk git push
rtk git pull
```

GitHub CLI 也有：

```bash
rtk gh pr list
rtk gh pr view 42
rtk gh issue list
rtk gh run list
```

如果以后自己是在 Claude Code / Codex 里频繁做 Git 操作，这一组就是最值得先记的。

### 测试 / 构建 / 质量检查

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

这组命令说明 RTK 不是只能包 git，它对开发主链路里的测试、构建、lint 也考虑到了。

### 容器 / 云 / 数据 / 网络类

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

如果以后要把 RTK 用到更重的工程环境，这一组就很实用。

## 它是怎么把普通命令改写成 RTK 命令的

README 里有一个非常关键的信息：**它会把常见原始命令改写成 `rtk ...` 形式。**

比如：

- `git status` → `rtk git status`
- `git diff` → `rtk git diff`
- `gh pr list` → `rtk gh pr list`
- `cat file` → `rtk read file`
- `grep pattern` → `rtk grep pattern`
- `ls` → `rtk ls`
- `docker ps` → `rtk docker ps`
- `kubectl get` / `kubectl logs` → `rtk kubectl ...`

这就解释了 RTK 为什么能省 token：

**它不是等模型拿到一大段原始输出再处理，而是尽量在命令入口处就把调用改写掉。**

## 接入时有个很重要的注意点

README 里还特别提到一个容易踩坑的地方：

> 只有 Bash 工具调用会经过 hook。
> Claude Code 自带的 Read / Grep / Glob 这类内建工具，并不会自动走 RTK。

这个点非常重要。

也就是说，如果你以为“装上 RTK 以后所有读取动作都会自动省 token”，那是不对的。

更准确的理解是：

- **走 shell / bash / CLI 的调用**，RTK 能介入
- **走工具自身内建读取能力的调用**，RTK 不一定介入

所以以后在 Claude Code / Codex 里使用 RTK，要先判断自己走的是哪条调用路径。

## 配置、遥测和排障入口

这些信息以后很容易忘，所以直接记在一节里。

### 配置文件位置

README 给出的配置路径包括：

- Linux：`~/.config/rtk/config.toml`
- macOS：`~/Library/Application Support/rtk/config.toml`

默认 tracking 数据库路径：

```bash
~/.local/share/rtk/history.db
```

### 遥测关闭

```bash
export RTK_TELEMETRY_DISABLED=1
```

或者：

```toml
[telemetry]
enabled = false
```

### tee 失败输出

```bash
~/.local/share/rtk/tee/1707753600_cargo_test.log
```

如果以后碰到失败日志追不到，先看这条线。

## 什么情况下适合上 RTK

更适合下面这些情况：

- 已经在用 Claude Code、Codex、Cursor 这类 AI 编程工具
- 这些工具会频繁跑 git、测试、构建、容器、云命令
- 你已经感受到 token 消耗太快
- 你希望把命令调用整理成更统一的一层

## 什么情况下没必要急着上

如果现在只是：

- 偶尔跑几个简单命令
- 还在轻量 demo 阶段
- 没有大规模 CLI 输出
- 也没有 token 成本压力

那 RTK 可能还不是第一优先级。

## 总结

最后直接收成 5 条，方便以后复习：

1. **RTK 最核心的定位**：给 AI 编程工具使用的高性能 CLI 代理层。
2. **它最核心的价值**：减少 60%–90% 的 LLM token 消耗。
3. **它主要用在哪**：Claude Code、Codex、Cursor、Gemini CLI、Copilot、OpenClaw 这类工具接 shell / CLI 的地方。
4. **第一次接上以后先跑**：`rtk --version`、`rtk gain`、`rtk --help`、`rtk list`、`rtk doctor`。
5. **它解决的问题不是模型能力，而是 AI 编程工具调用命令时的成本、混乱和排障问题。**

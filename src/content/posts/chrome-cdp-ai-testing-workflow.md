---
title: '用 Chrome CDP 接管浏览器：AI 测试为什么要这样搭'
published: 2026-04-21
description: '从 Chrome DevTools Protocol 的基本原理出发，梳理 AI 测试里为什么要固定远程调试端口、隔离 user-data-dir、通过 MCP 连接专用 Chrome，以及一套可直接落地的本地工作流。'
tags: ['Chrome', 'CDP', 'AI 测试', '自动化']
category: '工程实践'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# 用 Chrome CDP 接管浏览器：AI 测试为什么要这样搭

最近把一套“AI 自动启动专用 Chrome，再通过 `chrome-devtools-mcp` 接管浏览器做页面调试和测试”的流程落了一遍。看起来像是多绕了一层，但真做下来会发现，这套结构其实是在解决两个现实问题：

1. 让 AI 能稳定控制浏览器，而不是赌“刚好接上一个我手动打开的窗口”。
2. 让测试环境长期可复用，又不污染我日常正在使用的 Chrome。

这篇文章就按“CDP 是什么 → AI 为什么要通过 MCP 接 → 为什么要固定端口和独立 Profile → 平时怎么用”这条线，把整套流程梳理清楚。

<!--more-->

## 先说结论：这套链路到底谁负责什么

整套链路可以先记成一句话：

```text
AI -> 启动脚本 -> 专用 Chrome <- chrome-devtools-mcp <- Codex / LLM
```

如果展开一点，就是：

```text
[你 / AI 发起测试]
          |
          v
[start-chrome-devtools]
          |
          v
[专用 Chrome]
--remote-debugging-port=9222
--user-data-dir=~/Documents/data/chrome-devtools-profile
          ^
          |
[chrome-devtools-mcp]
--browser-url=http://127.0.0.1:9222
          ^
          |
[Codex / LLM]
```

这里每一层都只干一件事：

- `start-chrome-devtools`：确保目标 Chrome 真的已经启动，并且 `9222` 端口可用。
- 专用 Chrome：承载真实页面、登录态、Cookie、扩展、缓存这些浏览器状态。
- `chrome-devtools-mcp`：把 Chrome DevTools Protocol 暴露成适合 AI 调用的工具接口。
- Codex / LLM：发出“打开页面、点按钮、看 console、查 network、截图”这些高层任务。

## Chrome CDP 的原理到底是什么

`CDP` 全称是 `Chrome DevTools Protocol`。它本质上不是“自动化框架”，而是一套 Chrome 对外开放的调试协议。

当 Chrome 以远程调试模式启动后，例如：

```bash
open -na "Google Chrome" --args \
  --remote-debugging-port=9222 \
  --user-data-dir=~/Documents/data/chrome-devtools-profile \
  --no-first-run \
  --no-default-browser-check
```

Chrome 会在本机开启一个调试入口。这个入口最直观的表现，就是下面几个 HTTP / WebSocket 地址：

```text
http://127.0.0.1:9222/json/version
http://127.0.0.1:9222/json/list
ws://127.0.0.1:9222/devtools/browser/...
ws://127.0.0.1:9222/devtools/page/...
```

它们分别承担不同职责：

- `/json/version`：告诉你当前浏览器版本，以及浏览器级别的 `webSocketDebuggerUrl`。
- `/json/list`：列出当前可调试目标，比如页面、扩展 Service Worker、空白标签页。
- `ws://.../browser/...`：浏览器级连接，可以创建标签页、管理 target。
- `ws://.../page/...`：页面级连接，可以执行 DOM、Runtime、Network、Page 等域的命令。

这就是“接管 Chrome 端口”的本质：不是魔法，也不是模拟点击系统窗口，而是通过 CDP 直连 Chrome 暴露出来的调试接口。

## 为什么 AI 测试不直接操控日常 Chrome

很多人第一反应是：既然都能接管端口，为什么不直接接我平时正在用的 Chrome？

因为这样做通常会把三件事情混在一起：

1. **测试环境和个人浏览环境混在一起**
   你的日常 Chrome 里可能有工作页面、私人账号、支付站点、临时标签页，这些都不应该暴露给自动化流程。

2. **状态不可预测**
   AI 测试要的是一个“可重复接管”的对象，而不是一个今天开了 30 个标签、明天又手动关了几个窗口的浏览器。

3. **失败难排查**
   如果 AI 连的是日常主 Profile，出问题时你很难判断是站点代码的问题，还是浏览器自身环境、扩展、历史缓存造成的干扰。

所以更稳的方案不是“接管任意 Chrome”，而是“接管一台专门给自动化准备的 Chrome”。

## 为什么要固定 `user-data-dir`

专用 Chrome 的关键不是只有端口，还包括独立的 `user-data-dir`。

例如：

```text
~/Documents/data/chrome-devtools-profile
```

这个目录的作用是把专用浏览器的全部状态都隔离出来，包括：

- Cookie
- LocalStorage / SessionStorage
- 已登录站点状态
- 已安装扩展
- 浏览器缓存
- 站点授权信息

这带来两个直接好处。

### 1. 长期复用

今天让 AI 登录一次后台，明天继续调试时，这套状态还在，不需要每次从头来一遍。

### 2. 和日常浏览彻底隔离

即便 AI 在测试过程中打开了一堆页面、改了缓存、触发了某些权限授权，也只会污染专用 Profile，不会影响平时手动使用的主浏览器。

## 为什么要固定端口，比如 `9222`

固定端口的核心价值不是“好看”，而是让整条链路可以稳定编排。

当端口固定成 `9222` 后：

- 启动脚本知道自己要检查哪个地址。
- MCP 知道自己要连接哪个浏览器。
- AI 的前置动作可以固定成一条命令。
- 排障时第一步永远是 `curl http://127.0.0.1:9222/json/version`。

如果端口每次随机，那就必须把“发现端口 -> 传递端口 -> 更新 MCP 配置 -> 再连接”这套流程再多做一遍，复杂度明显上升。

对于日常本地调试，固定 `9222` 往往是最省心的选择。

## 为什么 AI 层不直接说“启动浏览器”，而要经过 MCP

AI 能理解“打开百度”“检查 console 错误”“看看这个按钮为什么点不动”，但浏览器不理解这种自然语言。

中间必须有一层，把高层任务翻译成底层工具调用。`chrome-devtools-mcp` 承担的就是这个角色。

它做的事情可以理解为：

```text
LLM 的自然语言任务
        |
        v
MCP 工具调用
        |
        v
CDP 命令
        |
        v
Chrome 页面状态变化 / 控制台 / 网络日志 / 截图
```

也就是说：

- `CDP` 负责“浏览器能做什么”
- `MCP` 负责“AI 怎么调用这些能力”
- `LLM` 负责“决定现在要做什么”

没有 MCP，AI 只能停留在“我建议你打开 DevTools 看看”的层面；有了 MCP，它才能真的去做。

## 为什么还要单独做一个启动脚本

如果只是人手工调试，启动 Chrome 复制一次长命令也就算了。

但 AI 测试要求的是**可重复、可复用、可验证**，所以启动动作最好收敛成一个固定入口，比如：

```bash
~/bin/start-chrome-devtools
```

这个脚本的职责不是复杂逻辑，而是把前置条件统一掉：

1. 检查 `9222` 是否已经可用。
2. 如果已可用，直接复用现有专用 Chrome。
3. 如果不可用，就按固定参数拉起 Chrome。
4. 轮询 `/json/version`，确认浏览器真的能被接管。
5. 只有成功时才返回。

这样 AI 每次测试前只需要执行同一条命令，而不是自己临时拼启动参数。

## 平时测试时，这套流程怎么跑

我自己的实际工作流，通常就是下面这个顺序。

### 第一步：确保专用 Chrome 已经启动

```bash
~/bin/start-chrome-devtools
```

如果专用 Chrome 已经在跑，脚本直接复用，不重复开新实例。

### 第二步：确认端口真的可用

```bash
curl http://127.0.0.1:9222/json/version
```

看到返回里有 `webSocketDebuggerUrl`，说明这台 Chrome 已经具备可接管条件。

### 第三步：让 MCP 连接这台浏览器

例如在 `~/.codex/config.toml` 里：

```toml
[mcp_servers.chrome-devtools]
type = "stdio"
command = "npx"
args = [
  "-y",
  "chrome-devtools-mcp@latest",
  "--browser-url=http://127.0.0.1:9222",
]
```

这样 Codex 重启或重载后，`chrome-devtools-mcp` 就会明确连接这台专用 Chrome。

### 第四步：把浏览器任务交给 AI

后面的事情就回到自然语言层了，比如：

- 打开某个站点
- 登录后台
- 检查按钮点击是否生效
- 读取 console error
- 查看 network 里失败请求
- 截图当前页面

AI 不需要知道“先发哪个 CDP Method 再看哪个 Target”，它只需要通过 MCP 使用现成的浏览器工具。

## 这套方案为什么适合“调试型测试”，但不一定适合所有自动化

这套方案有一个很重要的适用前提：它更偏**调试型、交互型、状态型**测试，而不是纯 CI 回归。

更适合它的场景包括：

- 本地联调时让 AI 帮忙查页面行为
- 需要保留登录态的后台站点调试
- 需要观察真实页面状态、扩展、Cookie、缓存的场景
- 一边人工看浏览器，一边让 AI 帮忙操作和排错

不那么适合它的场景包括：

- 需要完全无状态、一次性启动销毁的 CI 用例
- 并行大量回归测试
- 强调高度隔离和固定快照的自动化流水线

换句话说，这不是在替代 Playwright / Selenium 的所有用途，而是在补上“AI 接管真实浏览器做本地调试”这一块。

## 我为什么最后会选“固定端口 + 固定 Profile + MCP”这一套

把这几个选择放在一起看，其实背后的目标非常一致：**让 AI 接管的对象稳定、可预期、可复用**。

### 固定端口

让浏览器发现、MCP 连接、故障排查都收敛到一个地址。

### 固定 Profile

让登录态、缓存和扩展长期存在，同时不污染日常主浏览器。

### 专用 Chrome 实例

让自动化对象和人工日常浏览完全分离，减少误操作风险。

### MCP 适配层

让 AI 从“只能提建议”变成“真的可以执行浏览器任务”。

### 启动脚本

让每次测试前的前置动作变成稳定、幂等、可验证的一条命令。

## 常见故障怎么判断

如果这套链路出问题，基本可以按下面顺序查：

### 1. 先看端口

```bash
curl http://127.0.0.1:9222/json/version
```

- 连不上：Chrome 根本没起来，或者没有带远程调试参数。
- 能连上：说明 Chrome 端基本没问题，继续查 MCP。

### 2. 再看目标列表

```bash
curl http://127.0.0.1:9222/json/list
```

这里能看到当前页面和扩展 target，是不是已经打开了目标页面，一眼就能确认。

### 3. 再看 MCP 配置

确认 `chrome-devtools-mcp` 连接的是不是 `http://127.0.0.1:9222`，而不是别的端口或错误实例。

### 4. 环境脏了就重置 Profile

如果 Cookie、缓存、扩展、登录态已经乱掉，最直接的方法就是：

```bash
~/bin/reset-chrome-devtools-profile
```

然后重新执行：

```bash
~/bin/start-chrome-devtools
```

这样就能重新得到一套干净环境。

## 总结

“让 AI 接管 Chrome 做测试”这件事，真正可落地的关键并不是 AI 本身，而是把浏览器这一端先整理成一个稳定对象。

所以整套方案的核心不是单独某个命令，而是这几个点同时成立：

- Chrome 通过 CDP 暴露稳定调试入口
- 专用实例和日常主浏览器隔离
- `user-data-dir` 固定，状态长期复用
- 远程调试端口固定，便于编排和排障
- `chrome-devtools-mcp` 作为 AI 和 CDP 之间的桥接层
- 启动脚本把前置动作收敛成一条幂等命令

这样搭好之后，AI 测试才不是“碰运气连浏览器”，而是真正有一条稳定、可重复的浏览器自动化链路。

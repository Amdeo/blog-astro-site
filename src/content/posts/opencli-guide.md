---
title: 'OpenCLI：把网站和本地工具变成 CLI 的工具'
published: 2026-04-07
description: '基于 jackwener/opencli 的 README 整理，重点说明它是什么、解决什么问题、能接到哪些 AI 编程工具里、怎么安装验证，以及接上后先跑什么命令。'
tags: ['OpenCLI', 'AI Agent', 'CLI', 'Browser Bridge', 'Claude Code', 'Cursor']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: https://github.com/jackwener/opencli
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

# OpenCLI：把网站和本地工具变成 CLI 的工具

一句话说，OpenCLI 是一个把**网站、Electron 应用、本地 CLI 工具**统一接进命令行的工具。它的目标不是再做一个聊天界面，而是把原本需要手动点网页、开桌面应用、切不同命令行工具的动作，收进一个可以脚本化、可复用、适合 AI 代理调用的统一入口。

## 它是什么

按照项目 README 的原始定位，OpenCLI 的核心是：

- 把任意网站变成 CLI
- 把 Electron 应用变成 CLI
- 把本地已有工具挂进统一 CLI Hub
- 让 AI 代理能直接发现、调用、编排这些能力

它不是单一网站爬虫，也不是浏览器自动化脚本集合，更不是一个只会“问答”的 AI 壳。更接近的理解是：**一个面向 AI 代理和重度终端用户的命令行适配层**。

## 它解决什么问题

很多工具其实都能做事，但入口很散：

- 一部分能力在网页里
- 一部分能力在本地命令行里
- 一部分能力在 Electron 桌面应用里
- AI 编程工具虽然会写代码，但不一定天然知道你本机有哪些可直接调用的工具

OpenCLI 要解决的，就是把这些分散入口收拢成统一命令，并且尽量保留 CLI 的几个优点：

- 输出稳定，适合管道和脚本
- 能复用浏览器登录态，不用重复折腾授权
- 能被 AI 代理发现和调用
- 能在 CI、自动化和日常命令行里复用

如果您平时已经在用 Claude Code、Cursor、终端脚本、浏览器登录态复用这套工作方式，OpenCLI 的位置就比较清楚：**它不是替代这些工具，而是把它们之间的操作入口打通。**

## 它用在哪些工具和场景里

### 1. 给 AI 编程工具接浏览器和网站能力

README 里明确强调，它可以配合 AI 代理使用，尤其是这类工具：

- Claude Code
- Cursor
- 其他能读取 skill / rules / AGENT.md 的编码代理

接法不是“把 OpenCLI 当聊天对象”，而是把它当一套可以被代理直接调用的命令系统。比如：

- 让代理列出本机可用命令：`opencli list`
- 让代理通过 `opencli-operate` skill 直接操作网页
- 让代理把某个网站逐步固化成可复用命令

### 2. 把网站变成可复用 CLI

这个方向适合：

- 热榜抓取
- 信息读取
- 站点数据提取
- 登录态网页能力复用
- 需要稳定输出 JSON / CSV 的场景

README 给出的例子包括 Bilibili、Zhihu、小红书、Twitter/X、Reddit、YouTube 等网站。

### 3. 把 Electron 应用变成 CLI

这是它比较特别的一点。项目不只盯网页，也想把 Electron 应用接进命令行。对已经形成本地工作流的人来说，这意味着某些原本只能点界面的桌面工具，可以被脚本和 AI 代理重新编排。

### 4. 把本地 CLI 接进统一入口

README 里把这部分叫 CLI Hub。它支持把本地命令注册进 OpenCLI，让 AI 代理和人都从统一入口发现并调用。

## 这些工具怎么接入 OpenCLI

如果您是按“给自己以后直接用”的标准来接，先看下面这条最短路径。

### 第一步：安装 Browser Bridge 扩展

OpenCLI 依赖一个 Browser Bridge 扩展加微型 daemon，来连接 Chrome / Chromium 的真实浏览器环境。

最短流程：

1. 打开 GitHub Releases 页面
2. 下载最新的 `opencli-extension.zip`
3. 解压后打开 `chrome://extensions`
4. 开启开发者模式
5. 选择 **Load unpacked** 加载解压目录

这一步的意义很直接：**让 OpenCLI 能接上真实浏览器和真实登录态。**

### 第二步：安装 OpenCLI

README 推荐安装方式：

```bash
npm install -g @jackwener/opencli
```

如果您还要给 Claude Code / Cursor 这类 AI 编程工具一起装配套技能，README 直接给了这条：

```bash
npx skills add jackwener/opencli
```

### 第三步：先验证，不要急着正式用

安装后先跑这两个命令：

```bash
opencli doctor
opencli daemon status
```

它们分别用来：

- 检查扩展和 daemon 是否连通
- 看 daemon 当前状态、进程、运行情况

如果这两步没过，先别继续折腾更高层命令。

## 接上以后先跑哪些命令

README 给的最小上手顺序很清楚，可以直接照着走。

### 先看有哪些命令

```bash
opencli list
```

这一步适合先建立整体感，尤其是要让 AI 代理自动发现本机可用工具时，这条命令很重要。

### 先跑一个不依赖浏览器的命令

```bash
opencli hackernews top --limit 5
```

这个更像冒烟测试：先验证 OpenCLI 自己的命令体系可用。

### 再跑一个依赖浏览器扩展的命令

```bash
opencli bilibili hot --limit 5
```

如果这一条跑通，说明浏览器连接、扩展、daemon 这一层大概率已经接好了。

## 给 AI 代理时，先接哪一层

如果目标是让 Claude Code、Cursor 这类工具真正用起来，建议按 README 的两层来理解。

### 第一层：把 OpenCLI 当命令发现入口

让代理先知道你机器上有哪些命令可用：

```bash
opencli list
```

README 还明确建议把这类信息放进：

- `AGENT.md`
- `.cursorrules`

这样代理更容易自动发现 OpenCLI 这套能力。

### 第二层：给代理接浏览器操作能力

README 提到 `skills/opencli-operate/SKILL.md`，把它定位成给 AI 代理的浏览器操作技能。

可用动作包括：

- `open`
- `state`
- `click`
- `type`
- `select`
- `keys`
- `wait`
- `get`
- `screenshot`
- `scroll`
- `back`
- `eval`
- `network`
- `init`
- `verify`
- `close`

这部分的价值在于：**不是只把网页数据读回来，而是让代理真的能操作网页。**

## 日常最常用的命令分组

### 基础检查

```bash
opencli doctor
opencli daemon status
opencli list
```

### 公共站点数据读取

```bash
opencli hackernews top --limit 5
opencli bilibili hot --limit 5
```

### 输出格式控制

README 里也给了适合脚本和后处理的格式示例：

```bash
opencli bilibili hot -f json
opencli bilibili hot -f csv
opencli bilibili hot -v
```

适合的用途分别是：

- `-f json`：接 `jq`、脚本、LLM
- `-f csv`：导表格
- `-v`：看调试步骤

### 插件管理

```bash
opencli plugin install github:user/opencli-plugin-my-tool
opencli plugin list
opencli plugin update --all
opencli plugin uninstall my-tool
```

如果您要把 OpenCLI 作为长期入口，这组命令很实用，因为它决定了这套 CLI 能不能继续长大。

### 面向 AI 代理 / 适配器开发

README 给出的核心命令有这几条：

```bash
opencli explore https://example.com --site mysite
opencli synthesize mysite
opencli generate https://example.com --goal "hot"
opencli cascade https://api.example.com/data
```

这几条分别对应：

- `explore`：发现站点 API 与能力
- `synthesize`：生成 YAML 适配器
- `generate`：一条命令完成 explore → synthesize → register
- `cascade`：自动探测认证策略

这部分说明 OpenCLI 不只是“拿现成命令来用”，还想覆盖“发现 → 生成 → 注册”的适配器生产流程。

## 配置、验证、日志、排障入口

这部分是 README 里最值得直接记住的内容之一。

### 环境要求

- Node.js >= 20

### 浏览器连接失败时先看什么

如果报：

- `Extension not connected`
- `attach failed: Cannot access a chrome-extension:// URL`

先检查：

1. Chrome / Chromium 扩展是否正确安装并启用
2. 是否有别的扩展干扰
3. 是否真的在浏览器里保留了目标站点的登录态

### 登录态失效时

如果出现空结果或者未授权，README 建议直接回到目标站点重新登录，再重试命令。

### daemon 诊断入口

README 直接给了两个地址：

```bash
curl localhost:19825/status
curl localhost:19825/logs
```

一个看状态，一个看日志。真排障时，这两个入口比空猜更有用。

## 它什么时候值得上

比较适合用 OpenCLI 的情况：

- 您已经是终端重度用户
- 您希望复用浏览器登录态，而不是反复手填 cookie
- 您要把网站能力、桌面应用能力、本地 CLI 能力收进一个统一入口
- 您想让 Claude Code、Cursor 这类 AI 编程工具直接调用这些能力
- 您在意可脚本化、可复用、可管道化输出

## 什么情况下没必要急着上

如果您只是：

- 偶尔手动打开网页看一眼
- 没有命令行工作流
- 不打算让 AI 代理直接调工具
- 也不打算维护自己的适配器或插件

那 OpenCLI 就不一定是最优先装的东西。它更适合已经进入“把能力沉淀成命令”这一步的人，而不是只想找一个更花的聊天壳。

## 总结

如果只记 5 点，可以记这几个：

1. OpenCLI 是把网站、Electron 应用、本地工具统一接进 CLI 的工具
2. 它特别适合 AI 代理和重度终端用户，不是普通聊天壳
3. 安装顺序是：扩展 → `npm install -g @jackwener/opencli` → `opencli doctor`
4. 如果要给 Claude Code、Cursor 这类工具接能力，别忘了 `npx skills add jackwener/opencli`
5. 真排障时先看 `opencli daemon status`、`curl localhost:19825/status`、`curl localhost:19825/logs`

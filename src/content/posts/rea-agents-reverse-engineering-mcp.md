---
title: 'REA：让编程助手把已发布软件拆到二进制层'
published: 2026-10-19
description: 'REA 是给编程助手用的开源 MCP：把已编译软件拆开，讲清某个功能怎么实现。'
tags: ['REA', 'MCP', '逆向工程', 'AI Agent']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://github.com/morluto/rea'
---

REA（Reverse Engineer Anything）是一个开源项目：它把自己做成一个本地 MCP 服务器，外加一套命令行工具，让 Claude Code、Codex、Cursor 这类 AI 编程助手能够去“读”已经编译好的软件——反编译二进制、顺着调用关系追代码、翻 JavaScript 与 Electron 应用，然后把某个功能到底怎么实现的讲清楚，再帮你在自己的项目里做一个版本。[1][8]

它对应的场景很具体：你看中了某个 App 里的一个功能，却拿不到源码，只能对着界面猜。装上 REA 之后，可以直接问助手“这个 App 的离线搜索是怎么做的”，助手通过 REA 在你本机分析你提供的文件，带回带出处的结论，再决定是照着复刻一版，还是只参考它的做法。[1][9]

<!--more-->

## 主题概览

REA 由 morluto 开源，MIT 许可，TypeScript 编写，同时发布在 GitHub 与 npm（包名 `rea-agents`）。[1][6][7] 它面向想理解、对照或重写已发布软件的开发者：客户端开发者照着一个功能自己做，安全研究、漏洞分析、软件兼容与旧软件维护也在它的定位范围内。[1][5]

它不是“一键还原源码”的工具。官方对自己的描述是：让助手检查目标程序、解释某个功能，并帮助你重建，结论要带着证据和已知的局限一起返回。[1] 换句话讲，它交付的是“有据可查的理解”，不是“偷到一份源码”。

## 核心技术

### MCP 负责让助手“会用工具”

REA 的主体是一个本地 MCP 服务器：助手把分析请求交给它，它调用底层工具（反汇编器、JavaScript 解析、网络抓包等）去取结果，再把伪代码、模块关系、调用引用这些带 Evidence ID 的发现交回来，助手据此追问、解释或动手写实现。[1][3] 命令行与 MCP 走的是同一套应用工作流和证据格式，因此同一段分析既能交给助手，也能自己跑。[3]

### 深挖二进制要另配反汇编器，看 JavaScript 不用

分析原生二进制（Mach-O、ELF、PE）需要本机已有 Hopper、Ghidra 或 IDA 其中之一；REA 不附带它们的许可，安装向导经你同意后可以代为安装 Hopper，Ghidra 与 IDA 则复用你已有的安装。[1][2] 如果目标只是 JavaScript 或 Electron 打包后的应用，静态分析不需要任何原生分析引擎，读文件就能还原模块、导入、源码映射与 IPC 关系。[1]

### 能分析什么，各自前提是什么

| 目标 | 能拿到什么 | 前提 |
| --- | --- | --- |
| 原生二进制 | 伪代码、汇编、字符串、符号、调用与引用 | Hopper、Ghidra 或 IDA [1] |
| JavaScript / Electron | 模块、导入、源码映射、路由、IPC、原生插件关系 | Node.js 与 npm [1] |
| .NET 程序集 | 元数据、CIL 指令、声明的原生依赖 | 无需分析引擎，纯静态 [1][3] |
| 网站 | 页面结构、脚本、网络观察、按需截图 | Chrome 系浏览器 [1] |
| Android APK | Manifest 声明、类、反编译方法与引用 | 无头 JADX 与完整 JDK [1] |
| iPhone 的 IPA | 组件清单、路径与哈希、bundle 结构与桥接假设 | 纯清单投影，不声明运行时调用 [4] |
| Go / Rust 二进制 | 编译器版本、模块与替换、依赖清单 | 内置静态检查，不用装 Go 或 Rust [1] |

此外还有 WASM 产物、EVM 字节码、SQLite 快照、固件解包、抓包文件（pcap/SAZ）与录制的逻辑信号等目标，多数需要调用方自备对应的小工具，用法写在各自的文档里。[1]

### 结论要带证据，限制也要一起返回

REA 的结果带 Evidence ID 和来源引用，官方把它当作与“让模型猜”的区别：结论要么能指到具体指令或文件，要么被明确标成未知。[1][3] 视频里演示的 `rea analyze /bin/ls` 就是这种格式——先给出 evidence_id，然后是分析对象名、SHA-256、格式 `elf`、架构 `x86_64`。[9]

## 实践应用

### 装进助手的最短路径

```bash
npx rea-agents@latest setup
```

setup 会先列出可自动配置的客户端，文档里的支持清单有 24 项，既有 Claude Code、Codex、Cursor、Gemini CLI、Windsurf、VS Code、Trae 这类常见编码助手，也有 WorkBuddy 和 Hermes。[2] 选中之后它给出改动计划，列明要写的配置路径、涉及的外部软件、网络来源与包管理命令，批准之后才动文件；写配置前会备份，装完重启助手就能用。[1][2]

先对一下 Node 版本：README 的要求是 Node.js 22.x（≥22.19）、24.x（≥24.11）或 26+，而 npm 上 6.7.0 的 `engines` 字段写的是 node ≥24.18.0 <25，两者口径并不完全一致，自己按本机版本核对更稳妥。[1][6]

### 用命令行直接看

不装全局命令也能跑，官方给 JavaScript / Electron 目录或 `.asar` 的例子是：

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

通用入口 `rea analyze PATH` 在既没给 `--provider` 也没给 `--snapshot` 时，会对目录和 `.asar` 文件自动选择这条 JavaScript 工作流。[3] 真正的应用体积不小——官方举过例子，一个 334 MB 的 Evidence 文件投影成摘要视图后只有约 10 KB，所以它建议把结果存成文件、再看摘要或某个模块。[3]

### 怎么判断这次分析可信

看三件事：结论旁有没有指向具体文件、指令或引用的证据；原生分析用的是哪个反汇编器（Hopper、Ghidra 还是 IDA）；结果里哪些部分被标成了未知或未覆盖。[1][3] 官方仓库给了几份完整案例可以对照，例如把 DX-Ball 的声音声场计算重建成 C，官方称其通过了 3,205 个原始 x86 用例、复现了全部 63 个函数字节；另外两例是 Notion 的 Electron 剪贴板桥接与一款 PC-98 游戏的子弹环计算。[1][8]

## 使用边界

**软件不上传，但结果会进模型。** 官方 FAQ 的措辞是：REA 在本地分析目标，助手会收到工具结果，而助手背后的模型提供方有自己的数据政策。[1] 所以“纯本机跑”讲的是分析动作，不等于整条链路的数据都不出本机，敏感目标要按这个前提评估。

**只做合法授权范围内的分析。** 仓库的免责声明把支持范围写成安全研究、恶意样本与事件分析、漏洞研究与协同披露、CTF 与教学、互操作性、软件保存，以及审计你拥有或获授权检查的软件；同时明确不支持绕过 DRM、授权校验、反作弊、破解收费功能、未授权绕过鉴权等用法。[5] 另外 Hopper、IDA、JEB 都是独立商业软件，需要你自己合法取得许可，REA 不提供任何许可或激活权益。[2][5]

**IPA 目前是清单级。** 对 iOS 的 IPA（以及 macOS 的 `.app`、ZIP、DMG），REA 做的是执行无关的清单投影：给出路径、内容哈希、检测到的格式、bundle 组成和基于路径的桥接假设，并声明不解析 plist/CMS 语义、不声称观察到了运行时调用。[4] 把它和“能反编译 iOS 应用”区分开更准确。

**星标数字变化极快。** 视频里说这个项目“已经涨了 1.2 万多颗星”，而本文查询当日（2026-10-19）官方仓库显示约 31.9 万星、README 也在庆祝突破 30 万。[1][7][9] 这类数字几周就变一个量级，引用时最好连查询时间一起写。

<details>
<summary>视频来源与核对范围</summary>

- 本文由作者 AI产品狙击手 发布的公开视频展开，实际读取了约 69 秒视频的完整语音，并查看了其中的终端演示与幻灯画面（`rea analyze /bin/ls` 的 Evidence 输出、能力与安装提示页）。[9]
- 项目名称、许可、安装命令与支持客户端，以官方仓库 README、安装文档与 npm 包元数据为准。[1][2][6]
- 各目标类型的能力与前提取自 README 能力表；Apple 清单投影的边界见其专门文档；合法使用范围见仓库免责声明。[1][4][5]
- CLI 行为取自 CLI 文档，星标数据取自 GitHub API 与 README 的星标记录（查询日 2026-10-19）。[1][7]
- 本文没有安装或运行 REA，也没有用 Hopper、Ghidra、IDA 实际反编译任何目标，因此不评价分析准确率、速度或复刻效果；文中案例数字来自官方仓库的展示说明。[1][8]

</details>

## Sources

[1] https://github.com/morluto/rea — REA 官方仓库（morluto/rea README）
[2] https://github.com/morluto/rea/blob/main/docs/installation.md — REA 安装与支持客户端文档
[3] https://github.com/morluto/rea/blob/main/docs/cli.md — REA CLI 与 Evidence 文档
[4] https://github.com/morluto/rea/blob/main/docs/apple-application-analysis.md — REA Apple 应用清单投影文档
[5] https://github.com/morluto/rea/blob/main/DISCLAIMER.md — REA 责任使用与合法边界声明
[6] https://www.npmjs.com/package/rea-agents — rea-agents（npm 包）
[7] https://api.github.com/repos/morluto/rea — GitHub API：morluto/rea 仓库元数据
[8] https://rea.tools — REA 官方网站
[9] https://www.douyin.com/video/7693939168761679119 — 视频来源：AI产品狙击手（抖音）

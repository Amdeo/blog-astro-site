---
title: 'REA：让编程助手说清一个功能是怎么实现的'
published: 2026-10-19
updated: 2026-10-23
description: '开源 MCP：在授权范围内分析已发布软件，给出带证据的解释。'
tags: ['REA', 'MCP', '逆向工程', 'AI Agent']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://github.com/morluto/rea'
---

**REA**（Reverse Engineer Anything）是一个本地 MCP 服务器，外加一套命令行工具。装上之后，Claude Code、Codex、Cursor 这类编程助手可以读已经编译好的软件——原生二进制、JavaScript 与 Electron 应用、.NET 程序集、APK、网站——把某个功能到底是怎么实现的讲清楚，再帮你在自己的项目里写一版。[仓库](https://github.com/morluto/rea)

<!--more-->

## 它接的是什么活

例如维护一个缺少源码的旧项目，需要确认离线搜索怎样实现，可以让助手在授权范围内分析样本，再把结论指向具体文件、指令或调用关系。目标是弄清机制与兼容要求，不是照搬别人的受保护实现。

先确认自己对样本有相应分析权限，购买软件不等于自动取得任意拆解或再利用的授权。工具不支持绕过 DRM、授权校验、反作弊、收费功能或账号鉴权；商业反汇编器的许可也需自行取得。

## 结论为什么能查

它强调用 Evidence ID 和来源引用组织分析：结论应当能指向具体指令、文件或引用，拿不准的部分标成未知，而不是用一段流畅解释把缺口盖过去。

证据来自底层工具。原生二进制交给 Hopper、Ghidra 或 IDA 反汇编，拿到伪代码、汇编、字符串、符号、调用与引用；JavaScript 和 Electron 包是静态读文件，还原模块、导入、source map、路由和 IPC 关系，不需要原生分析引擎；.NET 走元数据与 CIL，也是纯静态；APK 要无头 JADX 和 JDK；Go 和 Rust 二进制则从产物里读编译器版本与依赖清单，本机不用装 Go 或 Rust。

MCP 和命令行共用同一套工作流与证据格式，所以同一段分析既能交给助手，也能自己跑。

## 一个能记住的例子

`rea analyze` 的输出是这样的：先给 `evidence_id`，然后是分析对象名、SHA-256、格式（如 `elf`）、架构（如 `x86_64`）。有了这个 ID，后面每一句判断都能回到同一份证据上。

结果可能很大，适合先看摘要，再按模块回到详细证据。把全部分析文本一次塞进对话，既浪费上下文，也不方便定位结论究竟依赖哪里。

不装全局命令也能跑，比如分析一个 JavaScript / Electron 目录或 `.asar`：

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

想长期用就装全局：`npm install --global rea-agents`，然后 `rea --help`。

## 装进助手

```bash
npx rea-agents setup
```

setup 会列出能自动配置的客户端，选中后先给一份改动计划——要写的配置路径、涉及的外部软件、网络来源、要执行的包管理命令——批准之后才动文件，写之前备份，装完重启助手。原生分析要先配好 Hopper / Ghidra / IDA；安装向导可以经你同意代为安装 Hopper，Ghidra 和 IDA 复用你已有的。

安装前核对实际软件包的 Node 版本要求，并按分析对象准备相应工具；能启动 MCP 服务，不等于所有格式的分析依赖都已经齐全。

## 怎么判断一次分析值不值得信

看三件事：结论旁有没有指向具体文件、指令或引用的证据；原生分析用的是哪个反汇编器；哪些部分被标成了未知或未覆盖。三者缺一项，那段结论就只能当线索。

两处边界要提前知道。**IPA 目前是清单级**：对 iOS 的 IPA、macOS 的 `.app`、ZIP、DMG，REA 做的是执行无关的清单投影——路径、内容哈希、检测到的格式、bundle 组成、基于路径的桥接假设，明确不解析 plist/CMS 语义、不声称观察到运行时调用。把它理解成「能反编译 iOS 应用」会失望。

**本地分析不等于数据不出本机。** 助手会收到工具结果，背后的模型提供方有自己的数据政策。敏感项目应先确认哪些内容会进入模型上下文，再决定是否接入。

项目地址：[morluto/rea](https://github.com/morluto/rea)。

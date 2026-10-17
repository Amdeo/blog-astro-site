---
title: 'OpenCLI 的浏览器桥接：命令从哪来，权限到哪停'
published: 2026-04-07
updated: 2026-10-17
description: '拆开 OpenCLI 的命令发现与浏览器桥接，讲清零配置到哪一步为止。'
tags: ['OpenCLI', 'AI Agent', '浏览器自动化', 'CLI']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: https://github.com/jackwener/opencli
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
---


OpenCLI 的 README 把自己定位成面向 AI agent 的通用浏览器自动化 CLI，也是 agent-browser 的替代品。[1] 它的宣传语"把任意网站变成 CLI"容易被读成"装上就能零配置操作任意站点"。按当前代码追一遍会发现，这句话其实对应三条不同的边界：命令从哪来、浏览器桥接依赖什么、登录态能授权到哪。

本文固定到仓库提交 `c1052f67`（npm 包 `1.8.8`）。本机没有安装 OpenCLI，下面是文档与源码解读，不包含真实浏览器调用。

<!--more-->

## 命令从哪来：一个预编译清单

`opencli list` 能快速检索一堆站点命令，是因为它默认读的是预编译清单，而不是现场扫描目录。

构建脚本 `build-manifest.ts` 扫描 `clis/` 下的 JS CLI 定义，将命令写进 `cli-manifest.json`。[5] `discovery.ts` 再尝试清单快速路径、按需加载 JS 模块；清单不可用时退回文件系统扫描。[7]

所以"有多少命令"是可数的。固定的 `cli-manifest.json` 里当前有 1222 条命令、覆盖 170 个站点；每一条都声明了站点、名称、`access`（read/write）、是否依赖浏览器（`browser`）和认证策略（`strategy`）。[3]

发现入口就是 `opencli list`，支持关键词、`--site` 过滤和 `--limit`/`--offset` 分页；要读某个命令的参数用 `<command> --help -f json`。[1]

## 零配置指的是桥接，不是站点

README 说浏览器桥接是"一个轻量扩展加一个小 daemon"，daemon 需要时自动启动。[1] "零配置、自动启动"针对的是扩展和 daemon 这一层，不等于任意网站开箱可用。

把清单统计一下，三类命令的区别就出来了：1222 条里有 924 条声明需要浏览器，其余 298 条不需要（纯 fetch 或 SSR 解析即可）；认证策略分布是 cookie 785、public 339、ui 70、intercept 22、local 6；307 条声明为 write。[3]

桥接本身的成本写在扩展的 `manifest.json` 里：Manifest V3，权限包含 `debugger`、`tabs`、`cookies`、`activeTab`、`storage`、`downloads`、`tabGroups`，`host_permissions` 是 `<all_urls>`。[2] 桥接拿的不是"被动读页面"的权限，而是调试器级别的能力。

## 登录态授权到哪

浏览器桥接文档写得很直白：browser 命令复用 Chrome 的登录 session，跑之前你必须在 Chrome 里登录目标站点。[4]

但"有登录态"不等于"授权任意操作"，原因有三层：

- 内置站点命令是逐个适配器实现的。清单没有覆盖的站点，不能假设已有专用命令；可能需要通用浏览器操作或另写适配器。
- write 命令具备修改账号状态的能力，例如 `clis/twitter/post.js` 实现了 X 发帖流程。[10] 这不表示所有 307 条 write 命令都依赖浏览器，或都能在当前环境成功。
- `opencli browser` 提供的 `click`、`type`、`eval` 等原语本身就能在页面上执行写操作。能做什么由"登录了哪个站点"加"你给什么指令"决定，不是某个权限令牌。

`access: read|write` 是适配器声明的元数据，`list` 会把它展示出来。[8] `capabilityRouting` 中的 `shouldUseBrowserSession()` 则检查 `browser`、函数、导航和 pipeline 步骤，不检查 `access`。[9] 这两处代码没有显示按 read/write 实施的运行时门禁，但不足以证明整个仓库都没有其他检查。不能仅凭清单里写着 read 就认定已有强制安全边界；调用方仍需限制命令与审批写操作。

## 真实命令面

本次核对的命令与含义：

- `opencli doctor`：检查扩展和 daemon 的连通性。[4]
- `opencli list`：发现命令，支持 `--site` 与分页。[1]
- `opencli browser --session <name> open <url>`：页面操作原语，页面级操作要求显式 `--session`。[1][4]
- `opencli <site> <command>`：运行某个站点适配器；参数用 `--help -f json` 查。[1]

退出码沿用 `sysexits.h`，方便脚本分支：66 空结果、69 桥接不可用、75 超时、77 需要登录、78 配置错误。[6]

这些是文档与源码核对的结果。本机没有安装扩展，也没有在真实 Chrome 上调用过这些命令，所以本文不声称"运行通过"。文档参数核对和真实浏览器调用是两件事：参数对不对可以从源码确认，扩展连不连得上、登录态在不在、站点会不会改版，只能在实际环境里验证。

## 验证范围与资料版本

- 修订日期 2026-10-17，原发布日期保留。
- 文档依据固定到提交 `c1052f67c0320ac240bfb650be4933101e615eda`；npm 包 `1.8.8`，扩展 manifest `1.0.24`。站点适配器和命令列表会继续变。
- 实际执行：仅在本地读取仓库源码与清单。OpenCLI 未安装，未运行任何 `opencli` 命令，未启动扩展或 daemon，未连接真实浏览器。
- 统计数字（1222 条命令、170 站点、924/298 浏览器分布、307 write）由仓库内 `cli-manifest.json` 直接统计得出。[3]
- 未验证：浏览器桥接的实际连通性、各站点适配器在真实环境下的成功率、以及 write 命令对账号的实际影响。

## Sources

[1] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/README.md — jackwener/OpenCLI README @1.8.8
[2] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/extension/manifest.json — Browser Bridge extension manifest (MV3)
[3] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/cli-manifest.json — cli-manifest.json (command registry)
[4] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/docs/guide/browser-bridge.md — Browser Bridge setup guide
[5] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/src/build-manifest.ts — build-manifest.ts (manifest compiler)
[6] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/docs/guide/exit-codes.md — exit-codes.md
[7] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/src/discovery.ts — OpenCLI command discovery
[8] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/src/commands/list.ts — OpenCLI list command
[9] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/src/capabilityRouting.ts — OpenCLI browser-session routing
[10] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/clis/twitter/post.js — OpenCLI X post adapter

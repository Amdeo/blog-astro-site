---
title: 'OpenCLI：用命令行操作网站和应用'
published: 2026-04-07
updated: 2026-10-17
description: '讲清它是什么、AI 为什么能用命令行操作网站，再看两条使用路径。'
tags: ['OpenCLI', 'AI Agent', '浏览器自动化', 'CLI']
category: 工具
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: https://github.com/jackwener/opencli
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

OpenCLI 是一个用命令行操作网站和应用的工具。你在终端里敲一条命令，它去对应的网站上取数据或执行操作，再把结果按统一格式返回。[1]

它也能供可以运行命令的 AI 助手使用：配套技能会告诉助手怎样调用命令，部分操作还能借助你的浏览器打开页面、点击、填表或提取内容。[1] 经常要从网站取信息，或者想把重复网页操作交给脚本和助手的人，比较容易用上它。

<!--more-->

## 为什么要把网页操作变成命令

让 AI 直接看网页，它得先读页面结构或截图，判断哪个按钮在哪，再模拟点击，一页页往下走。这套流程能用，但每一步都可能被页面改版、弹窗或加载时机打乱。[1]

换成命令后，AI 可以按「要做哪件事、需要什么参数」来调用，不必每次从页面外观重新判断按钮位置。命令通常返回 JSON，也就是便于程序读取的结构化文本。[1] 但这不保证命令永远有效：网站改版、登录过期或接口变化，仍然可能让适配失效。

## 先看一条命令长什么样

举个文档里的只读示例，读取 Hacker News 的热门文章列表：[1]

```bash
opencli hackernews top --limit 5
```

这条命令请求最多 5 条记录，默认以 JSON 返回。[1] 它以取信息为目的，不是发帖或改资料，适合入门时先了解命令形式；本文没有运行这条查询。

命令按"站点 + 动作"命名，比如 `opencli bilibili hot`、`opencli twitter search`。[1]

## 怎么知道有哪些命令

不用背。`opencli list` 会列出已注册的命令，可以按站点过滤、分页翻看；想知道某条命令要什么参数，读它的帮助输出就行，加 `-f json` 会给出结构化版本。[1]

```bash
opencli list
opencli list search --site github
opencli hackernews top --help -f json
```

命令默认输出 JSON，需要给人看时，可以换成表格、CSV 等格式。[1]

## 两条不同的路径：现成适配器，还是临时开浏览器

"把任意网站变成 CLI"听起来像装上就能操作一切，实际要分两种情况。[1]

一种是**站点已经有现成适配器**。适配器可以理解成为某个网站预先写好的命令，规定了怎么取数据、需要什么登录条件、结果长什么样。哔哩哔哩、知乎、小红书、Reddit、X 等站点已有内置命令，仍要按具体命令准备所需登录和依赖。[1]

另一种是**站点还没有适配器**。这时不能用 `opencli <站点> <命令>` 直接搞定，得走通用浏览器操作：让 OpenCLI 在你真实的浏览器里打开页面，再按步骤点击、输入、抓取。[1] 也可以用配套的 skill 自己写一个新适配器，把它变成一条可复用的命令。[1]

内置命令内部还有一条分界：有些靠一次网络请求或解析页面就能取到数据，不需要开浏览器；有些必须借助浏览器，因为要用到你已经登录的状态。[3][4]

## 登录和授权到哪一步

需要浏览器的命令，靠一个"浏览器桥接"工作。它由两部分组成：一个装在 Chrome 里的扩展，和一个本地的小后台进程；后台进程在第一次用到浏览器时自动启动，不用手动配置。[4]

有一条规则最容易被忽略：**浏览器命令复用你 Chrome 里现有的登录状态。** 想操作某个需要登录的网站，你得先在 Chrome 里登录好。[4] 配套扩展具有浏览器调试和访问网站等较高权限，并不是只能被动阅读页面的插件，安装前应先判断是否信任它。[2]

那"有登录态"是不是就等于"能替你做任何事"？不是：

- 只有写了适配器的站点才有对应的专用命令。没覆盖的站点，要么用通用浏览器操作，要么自己写适配器。[1]
- 命令分读和写。读命令只取数据，写命令能改动账号状态，比如发帖、关注。内置的 X 发帖命令就是一个写适配器。[3][10] 跑之前先看清楚自己用的是哪一类。
- 通用浏览器操作本身就能在页面上点按钮、输入文字。能做什么，取决于你登录了哪个站点、以及你给了什么指令。[4]

已经登录代表它可能具备操作条件，不代表你授权了发帖、关注或修改资料。给 AI 的任务范围仍要说清楚，真正执行写操作前要核对目标和内容。

## 常用命令与排错

| 命令 | 作用 |
| --- | --- |
| `opencli list` | 查有哪些命令[1] |
| `opencli <站点> <命令>` | 跑某个站点的适配器[1] |
| `opencli browser --session <名字> open <网址>` | 通用页面操作；多步流程用同一个 session 名字串起来[1][4] |
| `opencli doctor` | 检查扩展和后台进程有没有连上[4] |

出错时，退出码能帮你判断方向：需要登录是一个码，桥接没连上又是另一个，脚本可以据此分支处理。[6]

## 怎样开始

官方给了两条安装路径：桌面用户从下载页装 OpenCLIApp（自带运行时，并托管 `opencli` 命令），或在 Node.js 20.18.1 以上用 npm 全局安装。[1]

```bash
node --version          # 需要 >= 20.18.1
npm install -g @jackwener/opencli
```

要操作浏览器，还得装上浏览器桥接扩展；装好后先跑一次 `opencli doctor`，确认扩展和后台进程连通。[4]

## 谁适合用它

如果你经常让 AI 帮忙从网站上取信息，或者想把网页操作串进脚本和自动化流程，OpenCLI 值得先挑一两个只读命令试。它把支持的网页操作整理成可重复调用的命令，不用每次都从页面第一步开始研究。[1]

如果你只是偶尔打开某个网站看一眼，或者目标站点既没有适配器、你也不想折腾浏览器桥接，它暂时帮不上太多忙。

<details>
<summary>资料版本与本次核对范围</summary>

- 仓库固定到提交 `c1052f67`（npm 包 `1.8.8`）；站点适配器和命令列表会继续变。
- 本文只读了仓库文档和源码，没有安装 OpenCLI，没有启动扩展或后台进程，也没有连接真实浏览器，因此不声称任何命令在本机跑通过。
- 供深入时参考的统计：仓库内预编译的命令清单当前有 1222 条命令、覆盖 170 个站点，其中 924 条声明需要浏览器，307 条声明为写操作。[3]
- 浏览器桥接扩展申请的是调试器级别的权限（包含 `debugger`、`cookies`、`tabs` 等，并可访问所有网址），不是"被动读页面"的权限。[2]

</details>

## Sources

[1] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/README.md — jackwener/OpenCLI README @1.8.8
[2] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/extension/manifest.json — Browser Bridge extension manifest (MV3)
[3] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/cli-manifest.json — cli-manifest.json (command registry)
[4] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/docs/guide/browser-bridge.md — Browser Bridge setup guide
[6] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/docs/guide/exit-codes.md — exit-codes.md
[10] https://github.com/jackwener/opencli/blob/c1052f67c0320ac240bfb650be4933101e615eda/clis/twitter/post.js — OpenCLI X post adapter

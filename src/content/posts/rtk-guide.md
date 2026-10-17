---
title: 'RTK 会省多少：输出压缩、调用边界与原始证据'
published: 2026-04-07
updated: 2026-10-17
description: '从本机 0.51.0 实测出发，讲清 RTK 拦什么、压什么、怎么回到原始输出。'
tags: ['RTK', 'CLI 代理', 'AI Agent', '工具链']
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


RTK 的 `--help` 第一行就是它的定位：一个把系统输出过滤、压缩后再交给 LLM 的 CLI proxy。真正需要判断的不是"它支持多少命令"（本地 `rtk --help` 列了 100 多个子命令），而是三层边界：它拦得住哪些调用、压缩后少了什么、压缩输出不够用时怎么拿回原文。

本文机制部分固定到 rtk-ai/rtk 的 v0.51.0（提交 `e001f773`）[1]；本机实测环境是 macOS 上 Homebrew 安装的 `rtk 0.51.0`。字节与行数比对在临时 Git 仓库里跑过，没有执行 `rtk init`，也没有改写任何真实项目的命令。

<!--more-->

## 先看调用有没有经过改写入口

RTK 的工作方式是拦截 shell 命令，把它们改写成 rtk 等价形式再执行，agent 拿到的是压缩后的输出。[1]

以 README 描述的 Claude Code hook 为例，它只拦 Bash 工具调用；内建的 `Read`、`Grep`、`Glob` 不经过该 hook，因此不会被这条路径自动改写。[1] 同一个读文件动作，走 shell 与走内建工具是两条路径。其他代理的接入还要看各自的改写入口，不能把 Claude Code 的 hook 范围推广到所有宿主。

## 压缩发生在哪一层，失败时怎么办

架构文档列出的设计约束包括约 5–15ms 的代理开销、退出码透传，以及过滤失败时回退原始输出。[2] 这里的开销是项目方描述，不是本文独立测得的延迟。 最后一条决定了 RTK 不是一个必然成功的转换层，它允许命令走 passthrough。

改写本身也有独立命令：`rtk rewrite` 把原始命令翻译成 rtk 等价形式，`rtk hook` 是给各家 CLI 用的 hook 处理器。

## 本机实测：压缩输出对比原始输出

下面在自建临时 Git 仓库里比较输出：合成文本、6 次提交和 4 个修改文件。HOME 与 XDG 数据目录均隔离在夹具中，表内命令不修改仓库。直接捕获完整输出字节流，保留末尾换行；行数按换行符计数。原命令与 RTK 后面的参数保持一致，另将 `rtk proxy` 的输出逐字节与原命令比较。

| 命令 | 原始 bytes / 行 | rtk bytes / 行 |
|------|-----------------|----------------|
| `git status` | 370 / 10 | 91 / 5 |
| `git diff` | 704 / 28 | 439 / 31 |
| `git log` | 965 / 35 | 354 / 6 |
| `grep -rn added src` | 136 / 4 | 136 / 4 |
| `rg added src` | 128 / 4 | 128 / 4 |

`git diff` 的字节少了，行数反而从 28 增至 31：压缩器会改变展示结构，并加入汇总信息，不能用行数直接替代输出体积。而 `grep` 和 `rg` 在这个小样本里完全没变；同一个工具并不会对所有命令、所有输出都产生相同收益。

脚本接入时还要核对所需选项、输出结构与退出码，不能只替换可执行文件名。本文只验证了表中的参数组合，没有证明所有原生选项都能无差别迁移。

## 字节不等于 token，更不等于账单

README 把两件事分开了：它衡量的"最高 90%"指的是 Bash 输出量；输出量下降不等于账单下降 90%，因为 Bash 输出只是输入 token 的一个来源，而输入 token 又只是账单的一部分。[1]

精度上还有一层：README 说明 token 数按 `bytes / 4` 估算，没有使用模型 tokenizer。[1] 这个算法里的节省比例仍然是字节比例；压缩前后的文本结构改变时，实际 token 比例未必相同。因此上表只报字节和行数，不把它们换算成模型 token 或费用。

顺带一提，README 的"验证安装"段落仍写着版本应为 `rtk 0.28.2`，而当前发布已到 0.51.0。文档里的示例数字会滞后于版本。[1]

## 压缩输出不够用时，怎么回到原始证据

三条出口，按"是否过滤"排列：

- `rtk proxy <command>`：原样执行、不做过滤，但仍记录用量。[1] 本次 `rtk proxy git status` 得到 370 字节 / 10 行，与原命令完全一致；表内另外四组也逐字节一致。
- `rtk run <cmd>`：最原始的直接执行，既不过滤也不记录。
- `rtk recall <hash>`：过滤发生截断时，完整原文会被保存，输出里给出 `rtk recall <hash>` 提示。[1]

另一个截断夹具里，`rtk grep item src/big.ts` 对 400 条匹配只显示 25 条，尾部给出 `+375 hidden: rtk recall cb7326de85f3`；本次执行 `rtk recall cb7326de85f3 --full` 后取回全部 400 行。recall 默认用 sqlite 存储，`rtk config recall` 可以切到 tee 或关闭。本例的 hash 是临时夹具生成的标识，不能在另一台机器上照抄；应使用自己那次输出里的提示。

## 验证范围与资料版本

- 修订日期 2026-10-17，原发布日期保留。
- 文档依据固定到提交 `e001f773f80b22b7dc4c7a79521b30e35aaef026`（v0.51.0）。支持的 agent 清单和子命令会继续变。
- 实际执行环境：macOS，`rtk 0.51.0`（Homebrew）。仅运行只读命令和 `recall`，未运行 `rtk init`，未改写真实项目命令，未读取本机 `rtk gain --history` 个人记录。
- 未验证：其他仓库与命令的压缩率、`rtk init` 之后的 hook 行为，以及输出体积变化折算成模型 token 与费用的比例。上表只说明这一轮临时夹具的结果。

## Sources

[1] https://github.com/rtk-ai/rtk/blob/e001f773f80b22b7dc4c7a79521b30e35aaef026/README.md — rtk-ai/rtk README @ v0.51.0
[2] https://raw.githubusercontent.com/rtk-ai/rtk/e001f773f80b22b7dc4c7a79521b30e35aaef026/docs/contributing/ARCHITECTURE.md — RTK ARCHITECTURE.md

---
title: 'Yazi 使用指南：用一次素材整理任务走通导航、选择与退出'
published: 2026-04-18
updated: 2026-10-17
description: '围绕一次素材整理任务讲清导航、选择、退出，以及 q/Q 与 shell wrapper 的差别。'
tags: ['yazi', 'terminal', 'cli', 'tools', 'file-manager']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---


场景很具体：`~/Downloads` 里攒了一批素材，截图、几份 PDF、零散文本混在一起。你要把真正有用的几张挪进项目的 `assets/` 目录，然后让终端停在目标目录，接着跑构建或 git 命令。

这件事拆开是四步：找对目录、判断哪些文件有用、把选中的搬过去、退出并让 shell 落在目标目录。最后一步是终端文件管理器最常被误解的地方，下面单独讲。

> 本文是使用指南，不是体验评测。键位以 Yazi v26.9.1 的默认 keymap 为准；`q`/`Q` 与 `--cwd-file` 的行为在本机夹具里实际执行过，预览、选择、复制粘贴等交互没有执行，两者在文末「验证范围」里分开列出。

<!--more-->

## 起手：确认版本，选对入口

本机用于核对的 Homebrew 版本如下，这里不据此断言它仍是最新版本：

```console
$ yazi --version
Yazi
    Version: 26.9.1 (Homebrew 2026-09-01)
```

版本在这里不是小事：默认键位随版本变化，所以后面所有按键都以这个版本的默认 keymap 为准。

入口就是 `yazi` 命令 [2]，可以带参数直接落在目标目录：

```bash
yazi                 # 打开当前目录
yazi ~/Downloads     # 直接落在素材所在的目录
```

`--help` 里这个参数写为 `[ENTRIES]...`，说明是「Set the current working entry」，也就是启动时选中的位置；本机验证过，传目录路径进去它就直接停在那里。同一份帮助里还有一个 `--cwd-file`，退出那一节会用到。

## 装什么：本体必需，依赖可选

只安装本体可先执行下面这条命令（文档示例，本次未执行安装）：

```bash
brew install yazi
```

官方还列出 ffmpeg、sevenzip、jq、poppler、fd、ripgrep、fzf、zoxide、resvg、ImageMagick 等扩展依赖；除 `file` 外它们是按功能选装项。[5] 不需要为了整理几张图片就一次装全，更不必在没检查冲突时强制覆盖已有命令链接。 依赖和按键的对应关系在默认 keymap 里写得很直白：`s` 是 `search --via=fd`，`S` 是 `search --via=rg`，`z` 走 fzf 插件，`Z` 走 zoxide 插件。[1] 缺 fd 的话，`s` 这类能力就没有；它的边界在依赖，不在 Yazi 本体。

本机检查（`which`）里 `file`、`fd`、`rg`、`fzf`、`zoxide`、`ffmpeg`、`7zz`、`jq`、`pdftoppm`、`resvg`、`magick` 都在。注意压缩包工具装出来的命令是 `7zz`，不是旧名字 `7z`。

## 走目录：导航

方向键和 Vim 风格两套默认都有。[2] 在这个整理任务里用得上的键位是下面这些，动作名直接来自默认 keymap [1]：

| 按键 | 默认动作 |
| --- | --- |
| `j` / `k` | `arrow next` / `arrow prev` |
| `l` / `h` | `enter` 进入目录 / `leave` 回上级 |
| `G` / `g` `g` | 到列表底部 / 顶部 |
| `H` / `L` | `back` / `forward`，在访问过的目录之间来回 |
| `f` | `filter`，按名字过滤当前列表 |
| `/` `?` `n` `N` | 查找、反向查找、跳到下一个 / 上一个匹配项 |
| `.` | 切换隐藏文件的显示 |
| `z` / `Z` | 走 fzf / zoxide 插件，直接跳到目标目录 |
| `J` / `K` | 预览区向下 / 向上滚动 5 个单位 |
| `w` | 打开任务管理器，看后台任务和失败任务 |
| `Enter` / `o` / `O` | `open` 打开选中项；`O` 是交互式打开，由你挑 opener |

到顶部不是单独的 `g`，默认是 `g` `g` 组合键；`g` `t` 是插件实现的回收站入口。[1] 这份表是按默认 keymap 核对出来的，你自己的配置会改变它。

## 预览：先判断哪些文件有用

搬运之前总得扫一眼哪个文件是对的。文本类的预览是自带的，图片、PDF、压缩包、音视频、字体这类预览依赖外部工具，官方把它们归在「可选扩展」，缺一个就少一类。[5] 本机这些依赖都在（见上一节的 `which` 结果），但各类文件实际的预览效果这次没有核对，属于文末列出的未执行项。

## 选中与批量操作：把素材搬过去

默认键位把「选」和「动」分得很清楚，这个任务里对应三步 [1]：

1. 用 `Space` 逐个标记要的文件，标记后光标自动下移；一整片连续文件用 `v` 进可视模式，`V` 从「取消选中」的方向进入；`Ctrl+a` 全选、`Ctrl+r` 反选，`Esc` 按当前状态退出可视模式、清空选择或取消搜索。
2. `y` 复制（`yank`），`x` 剪切（`yank --cut`）；切到 `assets/` 目录按 `p` 粘贴，目标已有同名文件时 `P` 覆盖粘贴。
3. 落地后再微调：`r` 重命名，`a` 新建（名字以 `/` 结尾就是建目录）。

删除有两个强度：`d` 进回收站，`D` 是永久删除。[1] 两键挨得很近，整理素材时建议只用 `d`，把 `D` 留给确认过、必须立刻消失的文件。

这套流程属于默认键位的文档核对，本文没有完整执行一遍。

## 退出、切目录与 shell wrapper

这里要分清两件不同的事：Yazi 退出，和父 shell 换目录。

默认键位里 `q` 是 `quit`，`Q` 是 `quit --no-cwd-file`，`Ctrl+c` 是 `close`：只关当前标签页，只有在它是最后一个标签页时才真正退出进程。[1][3]

把这两件事连起来的是 `--cwd-file`：启动时给它一个文件路径，退出时 Yazi 把当前目录写进去；`Q` 的作用就是退出但不写。[1][3]

但 Yazi 退出并不会改变你 shell 的当前目录。父 shell 的目录只能由父 shell 自己改，所以官方给的做法是一个 `y` 包装函数：用 `--cwd-file` 指向临时文件启动 Yazi，退出后读出里面的目录再 `cd` 过去。官方的说明是，用 `y` 启动、按 `q` 退出，就能看到 CWD 变了；不想换目录时按 `Q`。[2]

换句话说，「退出」是进程行为，「切目录」是包装函数读文件之后的副产物。不用包装函数也能拿到同样的信息，代价是得自己处理这个文件。

自定义键位可能改变这里的按键结果：把 `q` 绑到别的动作，或者装退出确认插件后，就需要重新核对。用户配置会覆盖默认值。[4] 但子进程不能直接替父 shell 更改目录这一机制不受键位影响。

## 配置边界：什么时候才需要动配置文件

官方把配置分成三个文件：`yazi.toml`（通用）、`keymap.toml`（键位）、`theme.toml`（配色）。默认值已经内置在程序里，要覆盖某一项时，才把对应的片段抄到 `~/.config/yazi/` 下。[4]

键位有个容易忽略的区别：写 `keymap = [...]` 是整体覆盖默认键位；想保留默认、只追加自己的键位，要用 `prepend_keymap` / `append_keymap`。[4] 改键位之前先确认自己在改写哪一层，否则很容易出现「明明改了却不好使」。

配置文件的位置可以整体换掉：导出 `YAZI_CONFIG_HOME` 指向另一个目录即可。[4]

下面的核对针对默认键位，不把用户配置目录是否存在当作唯一依据；`YAZI_CONFIG_HOME` 和插件也可能改变运行环境。

## 一个可复现的核对：`q` 与 `Q` 的差别

动手整理素材之前，可以拿一个临时目录先确认「退出到底改不改目录」。下面这组命令在真实终端里跑，按键步骤需要 TTY：

```bash
work="$(mktemp -d "${TMPDIR:-/tmp}"/yazi-demo.XXXXXX)/demo"
mkdir -p "$work/outer/inner" && touch "$work/outer/inner/deep.txt"

# 第一次：按 q 退出
q_out="$work/q-out"
yazi "$work/outer/inner" --cwd-file "$q_out"
printf '%s\n' "$(<"$q_out")"  # 期望：打印刚打开的 .../outer/inner 绝对路径

# 第二次：按 Q 退出
q_out2="$work/q-out2"; : > "$q_out2"
yazi "$work/outer/inner" --cwd-file "$q_out2"
[ -s "$q_out2" ] && echo "写了内容" || echo "空文件：Q 没有写入"
```

本文复现的结果：第一次退出码 0，文件里是打开目录的绝对路径；第二次退出码 0，文件保持为空。把按键换成「先进子目录（`l`）、再按 `q`」，写出的目录会跟着更新到子目录。

复现方式需要说明：本机的 agent shell 没有 TTY，直接跑 `yazi` 会报 `Inappropriate ioctl for device`，所以这组按键是在伪终端（pty）里自动发送的，夹具和输出都在临时目录里，没有碰真实文件。你在自己的终端里手按，得到的应当是同一结果。

## 验证范围与版本

- **修订日期：2026-10-17。** 原发布日期保留；删除了没有依据的热度与性能评价，以及缺少对照资料的 ranger / nnn 对比。
- **环境：** macOS 26.6.2（arm64），Yazi 26.9.1（Homebrew 2026-09-01）。
- **实际执行：** `yazi --version`；`yazi --help`（本机无 TTY，经伪终端执行）；在自建临时夹具里经伪终端发送按键，核对 `--cwd-file` 配合 `q`、`Q`、先 `l` 后 `q` 三种组合的退出码与文件内容；用 `which` 检查依赖清单。
- **未执行：** 预览效果（图片 / PDF / 压缩包 / 媒体 / 字体）、选择与复制粘贴删除等交互流程、`y` 包装函数替换父 shell 目录的端到端过程、跨平台行为、性能与资源占用。
- **文档依据：** 默认 keymap 固定到 Yazi v26.9.1 提交 `8dd895c695a5950330c2623eb43debf323b60654`；官方文档固定到 yazi-rs.github.io 仓库提交 `ac991095234dc9c604ff3a811d21b9a41470ecda`（2026-10-16）。升级版本后请重新核对键位。

## Sources

[1] https://github.com/sxyazi/yazi/blob/8dd895c695a5950330c2623eb43debf323b60654/yazi-config/preset/keymap-default.toml — Yazi default keymap @ v26.9.1
[2] https://github.com/yazi-rs/yazi-rs.github.io/blob/ac991095234dc9c604ff3a811d21b9a41470ecda/docs/quick-start.md — Yazi Quick Start (docs source)
[3] https://github.com/yazi-rs/yazi-rs.github.io/blob/ac991095234dc9c604ff3a811d21b9a41470ecda/docs/configuration/keymap.md — Yazi keymap docs
[4] https://github.com/yazi-rs/yazi-rs.github.io/blob/ac991095234dc9c604ff3a811d21b9a41470ecda/docs/configuration/overview.md — Yazi configuration overview
[5] https://github.com/yazi-rs/yazi-rs.github.io/blob/ac991095234dc9c604ff3a811d21b9a41470ecda/docs/installation.md — Yazi installation docs

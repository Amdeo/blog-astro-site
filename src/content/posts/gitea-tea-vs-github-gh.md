---
title: 'Gitea tea 使用指南：顺手对比 GitHub gh'
published: 2026-04-18
description: '整理 Gitea CLI 工具 tea 的常用用法，并和 GitHub CLI gh 做一份上手即用的对比。适合同时维护 Gitea 和 GitHub 仓库的人。'
tags: ['gitea', 'github', 'cli', 'git', 'tea', 'gh']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Gitea tea 使用指南：顺手对比 GitHub gh

如果你平时已经用惯了 GitHub CLI 的 `gh`，那碰到 Gitea 时，多半会想找一个差不多手感的命令行工具。这个工具就是 `tea`。

一句话概括：

- `gh` 是 GitHub 官方 CLI
- `tea` 是 Gitea 生态里最常用的 CLI
- 两者定位相似，但成熟度、默认体验和命令设计并不完全一样

这篇文章主要讲三件事：

1. `tea` 是什么
2. `tea` 常见命令怎么用
3. `tea` 和 `gh` 到底差在哪

## 什么是 tea

`tea` 是 Gitea 的命令行工具，用来在终端里操作：

- 登录 Gitea 实例
- 查看仓库
- 管理 issue
- 管理 pull request / merge request
- 查看 release
- 触发 actions / CI（视 Gitea 版本和配置而定）
- 做一些仓库自动化工作

如果你把 `gh` 当成 “GitHub 的终端控制台”，那 `tea` 就可以理解成 “Gitea 的终端控制台”。

## 什么时候适合用 tea

下面这些场景，`tea` 都挺顺手：

- 你的代码托管在自建 Gitea
- 你同时维护 GitHub 和 Gitea 两套仓库
- 你想在 shell 脚本里批量操作 issue / PR
- 你在服务器上处理代码，不想总开浏览器
- 你希望把 Gitea 工作流接进自动化脚本

## 安装 tea

安装方式要看你的系统和分发渠道，最稳妥的方式是看官方 release 或包管理器。

常见思路是：

```bash
# macOS（如果仓库里有公式）
brew install tea

# 或者去 Gitea / tea 的 release 页面下载二进制
```

安装完成后先确认版本：

```bash
tea --version
```

## 登录与配置

第一次使用，一般先做登录或配置实例。

不同版本的 `tea` 子命令和参数可能有细微差异，但核心思路通常是：

1. 指定 Gitea 实例地址
2. 配置访问令牌（token）
3. 给实例起一个名字，后续复用

你可以先看本地帮助：

```bash
tea help
tea login help
```

常见的使用方式通常类似下面这种思路：

```bash
tea login add
```

然后按提示填写：

- Gitea 地址，例如 `https://git.example.com`
- 用户 token
- 默认实例名

登录后可以查看当前配置：

```bash
tea login ls
```

如果你维护多个 Gitea 实例，这一步尤其有用。

## tea 的常用命令

不同版本细节会变，但下面这些方向基本都绕不开。

## 查看仓库与基本信息

先看帮助：

```bash
tea repo help
```

常见用途：

- 查看当前仓库信息
- 在远程实例中查找某个仓库
- 读取仓库元数据

如果你习惯 `gh repo view`，那这里可以把 `tea repo` 理解成对应入口。

## 管理 Pull Request / Merge Request

这是 `tea` 最常见的用途之一。

先看帮助：

```bash
tea pr help
```

常见操作一般包括：

- 列出 PR
- 查看某个 PR 详情
- 创建 PR
- 审查 / 合并 PR
- Checkout 到某个 PR

例如你通常会先这样摸命令：

```bash
tea pr list
tea pr view <编号>
tea pr checkout <编号>
```

如果版本支持创建 PR，一般会有类似：

```bash
tea pr create
```

和 `gh pr create` 类似，通常需要你提供：

- base 分支
- head 分支
- 标题
- 描述

## 管理 Issue

Issue 也是 CLI 高频场景。

```bash
tea issue help
```

常见操作：

```bash
tea issue list
tea issue view <编号>
tea issue create
```

如果你已经用惯了 `gh issue list` / `gh issue create`，这里迁移成本不算高。

## Release 操作

如果仓库有版本发布流程，可以看看：

```bash
tea releases help
```

典型用途：

- 列出 release
- 查看 release 详情
- 创建 release
- 上传构建产物

这一块的可用度比较依赖 Gitea 版本和实例配置。

## Actions / CI 相关

如果你的 Gitea 开启了 actions 或兼容工作流能力，可以查一下：

```bash
tea actions help
```

常见需求可能包括：

- 查看 workflow run
- 重新触发任务
- 查看日志

但这一块不要先入为主地按 `gh` 的体验去期待，最好先以本机 `tea help` 为准，因为不同版本差异会比较明显。

## 先用 help，再写脚本

这是我对 `tea` 最实用的建议：

> 别先背命令，先看本机 help。

因为 `tea` 的版本演进比 `gh` 更容易出现：

- 子命令命名调整
- 参数变化
- 某些功能在不同版本里支持度不一致

所以最稳的方法是：

```bash
tea help
tea <子命令> help
```

比如：

```bash
tea pr help
tea issue help
tea repo help
tea login help
```

## tea 和 gh 的核心对比

这部分直接说重点。

## 1. 官方性与生态成熟度

### gh

- GitHub 官方出品
- 文档更完整
- 功能覆盖更广
- 与 GitHub 平台特性结合更紧
- 用户量更大，社区示例更多

### tea

- 面向 Gitea 生态
- 足够实用，但整体成熟度通常不如 `gh`
- 很多体验依赖你所在的 Gitea 实例版本
- 命令功能有时更“能用”，但不一定像 `gh` 那样丝滑统一

说白了：

> `gh` 更像成熟产品，`tea` 更像实干工具。

## 2. 平台绑定程度

### gh

强绑定 GitHub。

你可以认为它不是通用 Git forge CLI，而是 GitHub 专用控制器。

### tea

强绑定 Gitea。

如果你是自建代码托管、内网协作、私有部署，`tea` 的价值会明显更大。

## 3. 命令习惯相似，但不完全一一对应

很多人会下意识把 `tea` 当成 Gitea 版 `gh`，这个方向没错，但别指望每条命令都完全平移。

比如同样是 PR 操作：

```bash
gh pr list
tea pr list
```

看起来很像，但：

- 支持的参数可能不同
- 输出字段可能不同
- 交互体验可能不同
- 某些高级功能未必对齐

也就是说：

> 思维模型可以迁移，命令细节不要硬套。

## 4. gh 的交互体验通常更统一

`gh` 在这些方面一般更强：

- 交互提示更完整
- JSON 输出支持更成熟
- 与 GitHub Actions、Codespaces、Release、Repo 设置联动更丰富
- 文档和例子更容易搜到

而 `tea` 的优势在于：

- 适配自建 Gitea
- 私有部署友好
- 轻量直接
- 对内网工作流更自然

## 5. 自动化脚本里，tea 很实用，但要更保守一点

如果你把 `tea` 放进 CI 或 shell 脚本，我建议注意三点：

### 固定版本

`tea` 的脚本兼容性最好建立在固定版本基础上，不要默认线上环境都一样。

### 先确认输出格式

如果某个命令支持 JSON 输出，优先用 JSON，不要脆弱地解析纯文本。

### 先在目标实例验证

同一个 `tea` 命令，在不同 Gitea 版本、不同插件、不同 actions 配置下，行为可能会有差异。

## 常见命令对照表

下面给一份够用的迁移对照表。注意：这是**思路对照**，不是保证 100% 参数一致的照抄表。

| 场景 | GitHub `gh` | Gitea `tea` |
| --- | --- | --- |
| 查看帮助 | `gh help` | `tea help` |
| 登录/配置 | `gh auth login` | `tea login add` |
| 查看登录状态 | `gh auth status` | `tea login ls` |
| 查看仓库帮助 | `gh repo help` | `tea repo help` |
| 列出 PR | `gh pr list` | `tea pr list` |
| 查看 PR | `gh pr view 12` | `tea pr view 12` |
| Checkout PR | `gh pr checkout 12` | `tea pr checkout 12` |
| 创建 PR | `gh pr create` | `tea pr create` |
| 列出 issue | `gh issue list` | `tea issue list` |
| 查看 issue | `gh issue view 23` | `tea issue view 23` |
| 创建 issue | `gh issue create` | `tea issue create` |
| 查看 release 帮助 | `gh release help` | `tea releases help` |
| 查看 actions 帮助 | `gh run help` / `gh workflow help` | `tea actions help` |

## 一个很实在的结论

如果你只用 GitHub，那直接用 `gh`，没什么悬念。

如果你主要在自建 Gitea 干活，那 `tea` 值得装，而且应该装。

如果你两边都用，那最舒服的方式不是“强行统一命令”，而是：

- 用 `gh` 处理 GitHub
- 用 `tea` 处理 Gitea
- 在你自己的 shell alias 或脚本层做一层轻封装

比如：

```bash
alias github='gh'
alias gitea='tea'
```

或者自己写脚本，根据远程域名判断用哪一个 CLI。

## 我的建议

如果你准备认真用 `tea`，我建议按这个顺序上手：

1. 先完成 `tea` 登录
2. 把 `tea help`、`tea pr help`、`tea issue help` 跑一遍
3. 先做查看类命令，不要一上来就写自动化脚本
4. 确认你所在 Gitea 实例版本支持哪些能力
5. 再把稳定命令抽进 shell 脚本

这样最省事，也最不容易踩坑。

## 总结

`tea` 和 `gh` 的关系，可以简单理解为：

- `gh` 更成熟、更统一、更 GitHub 原生
- `tea` 更贴近 Gitea、自建环境更友好、更偏务实

如果你已经熟悉 `gh`，学 `tea` 不会太痛苦；
但如果你指望它和 `gh` 一模一样，那大概率会有点失望。

正确姿势不是“把 `tea` 当成低配版 `gh`”，而是：

> 把 `tea` 当成 Gitea 世界里足够好用的命令行工具。

这样心态会平和很多，命令也会用得更顺。

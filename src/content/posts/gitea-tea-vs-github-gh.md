---
title: '从 gh 迁到 tea：先对齐版本、仓库和只读命令'
published: 2026-04-18
updated: 2026-10-17
description: '核对 tea 与 gh 的版本、PR 查询、分页和身份边界，避免直接替换命令名。'
tags: ['gitea', 'github', 'cli', 'git', 'tea', 'gh']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://gitea.com/gitea/tea'
---

把 `gh pr view 12` 改成 `tea pr view 12`，看起来只是替换工具名，实际却可能连命令结构都不对。平台、CLI 版本和当前仓库上下文，是迁移脚本之前要分别确认的三件事。

Tea 是 Gitea 官方 CLI。[1] 它与 GitHub CLI 都能处理仓库和 PR，但不应据此推导为共享 API、身份配置或输出结构。本文以**本机实际核对的 tea `0.16.0`、gh `2.102.0`** 为范围，先解决只读查询，不做账号配置或仓库写操作。

<!--more-->

## 先分清发布版本和 main 文档

```bash
tea --version
gh --version
tea pr --help
gh pr --help
```

以上命令本次均已执行。tea `0.16.0` 的帮助将 PR 入口列为 `pulls, pull, pr`，并明确说明：没有索引参数时列出 PR，提供索引参数时显示详情。

这意味着本版本的查询形式是 `tea pr 12`，不是把 GitHub 的 `view` 子命令直接搬过来。GitHub CLI 则明确使用 `gh pr view`，也支持不带编号时读取当前分支对应的 PR。[3]

版本限定并非一句免责话。核对时，Tea 的 main README 已经描述了 **1.0 的破坏性命令、配置和鉴权迁移**，而本机仍是 `0.16.0`。[2] main 分支的说明不能当作已安装稳定版的命令手册。反过来，tag README 中嵌入的帮助示例也可能没有跟随二进制完整更新；具体参数最终仍要与对应版本的本机帮助核对。

## 查询前，把目标写完整

Tea 会利用当前目录的 Git 仓库上下文，登录配置又可能对应多个 Gitea 实例。[1] 同一个 `owner/repo` 在不同服务器上并不是同一个仓库。

下面是按上述版本帮助核对的**远端查询示例，本次没有执行这些查询**。`owner/repo`、`work` 和编号是待替换的占位值；前提是读者已按对应版本官方说明完成登录，且账号具有目标仓库的读取权限。不要把真实 token 直接写进命令历史或提交到脚本中。

列出开放 PR：

```bash
# Gitea：work 是已配置的目标实例登录名
tea pr list --repo owner/repo --login work --state open --limit 20 --output json

# GitHub：owner/repo 指 GitHub 上的仓库
gh pr list --repo owner/repo --state open --limit 20 --json number,title,state
```

读取指定 PR：

```bash
tea pr --repo owner/repo --login work --comments=false --output json 12
gh pr view 12 --repo owner/repo --json number,title,state
```

在多实例脚本中，显式指定登录名与仓库，比依赖默认实例和执行目录更容易审计。查询成功后，还要检查结果的仓库或 URL，确认没有读到另一个同名仓库；列表为空也不能直接判为鉴权失败。

## 命令相近，不代表状态和分页语义相同

本次帮助核对暴露了几个会影响自动化的差别：

| 检查项 | tea 0.16.0 | gh 2.102.0 |
| --- | --- | --- |
| PR 详情 | `tea pr` 后接索引 | `gh pr view` 后接编号、URL 或分支 |
| PR 状态筛选 | `all / open / closed` | `open / closed / merged / all` |
| 数量选项 | `--limit` 为每页条目数，另有 `--page` | `--limit` 为此次最多获取的条目数 |
| 输出选择 | `--output json`；`--fields` 选择展示字段 | `--json` 明确列出需要的 JSON 字段 |

因此，不要把 `closed` 一律映射成“已合并”，也不要因为两边都设置 `--limit 20` 就声称已经遍历完全部记录。需要完整统计时，应先核对分页和终止条件；涉及已合并状态时，还要核对对应版本返回的合并信息，不能仅靠列表标签猜。

同样，tea 帮助里的 `index` 展示字段与 gh 的 `number` JSON 字段，不意味着两份 JSON 可以直接交给同一个解析器。第一次接入应保存目标实例的一份真实只读响应，确认字段与空结果形态，再做归一化。

## CI 能力要分成客户端和服务器两层检查

```bash
tea actions --help
tea actions runs --help
```

本机 `0.16.0` 的帮助确实列出了 `actions`，其下有 workflow runs 和 workflows 等入口；runs 帮助也列出了查询和日志命令。因此，不能笼统地把 Actions 写成“可能有，也可能没有”。

但客户端有子命令，不等于目标 Gitea 实例已经启用相应服务、支持所需 API，或当前账号拥有权限。应先确认实例版本和配置，再在明确仓库上做只读验证。不要把 GitHub 的 `gh run`、`gh workflow` 参数直接平移，也不要因一次 403 或 404 就扩大 token 权限反复尝试。

## 什么时候再把查询升级成写操作

先用一个明确仓库完成只读链路：确认主机和身份，列出记录，读取具体 PR，检查输出字段与分页。只有这些步骤稳定后，才值得把创建、评论、合并或发布纳入自动化。

写操作还需要单独的权限与确认边界。例如，能读取某个 PR 不代表可以合并它；成功修改后必须重新读取准确目标，不能只根据 CLI 的退出码宣称完成。预览参数、dry-run 或幂等键也应以具体子命令为准，而不是假设所有工具都具备。

这两种 CLI 的选择首先由代码托管平台决定。只用 GitHub 就围绕 gh 建立流程；管理 Gitea 就评估与实例版本匹配的 tea。没有必要先给它们排一个“成熟或低配”的主观座次。

## 核对范围

- 2026-10-17 修订；实际运行了版本与帮助命令，核对 tea `0.16.0` 和 gh `2.102.0` 的 PR、Issue、仓库、Release 与 Actions 入口。
- Tea 资料分别保留 `v0.16.0` tag 与 main 提交 `33bb12729e6de375813fb94fbcfbfa110d45c107`，避免混用发布版和未来版本说明。[1][2]
- 未查看或导出本机账号配置与凭据，未登录目标 Gitea，未执行正文中的仓库查询、评论、创建、合并或发布命令；查询示例仅核对了命令与参数，不代表远端端到端测试通过。

## Sources

[1] https://gitea.com/gitea/tea/raw/tag/v0.16.0/README.md — release-readme
[2] https://gitea.com/gitea/tea/raw/commit/33bb12729e6de375813fb94fbcfbfa110d45c107/README.md — main-readme
[3] https://cli.github.com/manual/gh_pr_view — GitHub CLI gh pr view manual

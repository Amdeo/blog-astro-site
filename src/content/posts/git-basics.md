---
title: 'Git 基础'
published: 2017-11-26
description: '从配置、初始化、日志查看到远程仓库管理，整理一份适合日常查阅的 Git 基础命令笔记。'
image: '/assets/desktop-banner/4.webp'
tags: ['工具']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Git 基础

这篇文章把 Git 最常用的基础能力集中整理在一起，包括配置、仓库初始化、日志查看和远程仓库管理，适合作为入门与日常速查。

## Git 配置

Git 提供了 `git config` 工具，用来配置或读取工作环境变量。

- `/etc/gitconfig`：系统中对所有用户普遍适用的配置文件。
- `~/.gitconfig`：当前用户自己的全局配置文件。

### 用户信息

```shell
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

### 文本编辑器

```shell
git config --global core.editor emacs
```

### 差异分析工具

```shell
git config --global merge.tool vimdiff
```

### 查看配置

```shell
git config --list
git config user.name
git help config
```

![image-20191220231611951](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20191220231611951.png)

## 仓库基础操作

### 初始化新仓库

```shell
git init
```

### 增加文件

```shell
git add *.c
git add README
```

### 克隆仓库

```shell
git clone url
```

### 查看提交历史

```shell
git log
git log -p -2       # 展开最近两次提交的详细内容
git log --stat      # 显示简要的增改行数统计
git log --since=2.weeks
```

| 选项            | 说明 |
| --------------- | ---- |
| `-p`            | 按补丁格式显示每次提交的差异。 |
| `--word-diff`   | 按单词级别显示差异。 |
| `--stat`        | 显示每次更新的文件修改统计信息。 |
| `--shortstat`   | 只显示最后的增删改统计。 |
| `--name-only`   | 仅显示修改过的文件名。 |
| `--name-status` | 显示新增、修改、删除状态。 |
| `--abbrev-commit` | 仅显示 SHA-1 的前几个字符。 |
| `--relative-date` | 使用相对时间显示提交时间。 |
| `--graph` | 用 ASCII 图展示分支合并历史。 |
| `--pretty` | 指定提交信息的显示格式。 |
| `--oneline` | `--pretty=oneline --abbrev-commit` 的简化写法。 |

| 选项 | 说明 |
| ---- | ---- |
| `-(n)` | 仅显示最近的 n 条提交。 |
| `--since`, `--after` | 仅显示指定时间之后的提交。 |
| `--until`, `--before` | 仅显示指定时间之前的提交。 |
| `--author` | 仅显示指定作者的提交。 |
| `--committer` | 仅显示指定提交者的提交。 |

### 修改最后一次提交

```shell
git commit --amend
```

### 查看当前仓库状态

```shell
git remote -v
git remote show origin
git branch -a
git status
git remote add origin "URL"
```

![1574781334458](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1574781334458.png)

## Git 上传大文件报错

报错信息：`RPC failed; curl 56 OpenSSL SSL_read: SSL_ERROR_SYSCALL, errno 10054`

可以在 Git Bash 中增加下面这项配置：

```shell
git config --global http.postBuffer 524288000
```

## 常用命令速查

### 新建代码库

```shell
# 在当前目录新建一个 Git 代码库
git init

# 新建一个目录，将其初始化为 Git 代码库
git init [project-name]

# 下载一个项目和它的整个代码历史
git clone [url]
```

### 配置

Git 的设置文件为 `.gitconfig`，它可以放在用户主目录下（全局配置），也可以放在项目目录下（项目配置）。

```shell
# 显示当前的 Git 配置
git config --list

# 编辑 Git 配置文件
git config -e [--global]

# 设置提交代码时的用户信息
git config [--global] user.name "[name]"
git config [--global] user.email "[email address]"
```

### 增加 / 删除文件

```shell
# 添加指定文件到暂存区
git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
git add [dir]

# 添加当前目录的所有文件到暂存区
git add .

# 添加每个变化前都会要求确认
# 对于同一个文件的多处变化，可以实现分次提交
git add -p

# 删除工作区文件，并将这次删除放入暂存区
git rm [file1] [file2] ...

# 停止追踪指定文件，但保留在工作区
git rm --cached [file]

# 改名文件，并将改名放入暂存区
git mv [file-original] [file-renamed]
```

---
title: 'Linux 使用 gstack 查看进程堆栈'
published: 2020-06-20
description: '整理 gstack 的安装与基础用法，适合在 Linux 下排查进程卡住、阻塞或现场问题时快速查阅。'
image: '/assets/desktop-banner/2.webp'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Linux 使用 gstack 查看进程堆栈

这篇文章聚焦一个非常具体但很实用的场景：在 Linux 下用 `gstack` 查看进程堆栈。

## gstack 安装

```shell
yum install gdb -y
```

## 基本使用

```shell
gstack pid
```

先获取需要查看的进程 ps -ef

```shell
gstack 29913
```

![image-20200620214020985](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200620214020985.png)

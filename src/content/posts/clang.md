---
title: 'Clang：C/C++ 编译器'
published: 2017-12-08
description: '记录在 CentOS 上安装 Clang 的最小步骤，适合搭建 C/C++ 编译环境时快速查阅。'
tags: ['工具', '操作系统']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Clang：C/C++ 编译器

Clang 是常用的 C/C++ 编译器之一，很多场景会拿它和 GCC 配合使用，或者直接用它做编译、静态检查和工具链集成。

这篇文章只保留一个最常用场景：在 CentOS 上安装 Clang。

## 安装 Clang

下面是在 CentOS 上安装 Clang 的最小步骤：

```
sudo yum install epel-release
sudo yum install clang
```

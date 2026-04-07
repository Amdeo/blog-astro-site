---
title: 'Nativefier：网页转桌面应用工具'
published: 2019-12-22
description: '记录 Nativefier 的安装方式和最常用的封装命令，适合快速把网页包装成桌面应用。'
image: '/assets/desktop-banner/4.webp'
tags: ['工具']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Nativefier：网页转桌面应用工具

Nativefier 基于 Electron，可以把网页快速封装成桌面应用。它的优点就是上手快，很多时候一条命令就能先把程序跑起来，再考虑图标、名称和其他细节。

## 安装

```shell
npm install nativefier -g
```

## 基础使用

```shell
nativefier "http://medium.com"
```

## 指定应用名称

```shell
nativefier --name "Some Awesome App" "http://medium.com"
```

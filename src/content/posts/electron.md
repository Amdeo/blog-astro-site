---
title: 'Electron'
published: 2019-12-26
description: '安装electron卡在node install.js 在网上搜索找了很多方法： 例如：修改环境变量'
image: '/assets/desktop-banner/3.webp'
tags: ['工具']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Electron

[electron 官方文档]( http://www.electronjs.org/docs )

### 安装electron卡在node install.js

在网上搜索找了很多方法：

例如：修改环境变量

```shell
#淘宝镜像
ELECTRON_MIRROR="https://cdn.npm.taobao.org/dist/electron/"
#或
#华为镜像
ELECTRON_MIRROR="https://mirrors.huaweicloud.com/electron/"

ELECTRON_CUSTOM_DIR=7.1.7  #版本目录，默认的版本目录带v7.1.7，第三方镜像都是不带v的，所以需要重新指定下
```

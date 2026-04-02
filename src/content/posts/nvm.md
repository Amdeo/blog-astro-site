---
title: 'NVM 使用笔记'
published: 2020-11-24
description: '整理 nvm 的安装、常用命令与下载加速配置，适合在多 Node 版本环境中做快速查阅。'
image: '/src/assets/blog-placeholder-3.jpg'
tags: ['操作系统', '工具']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# NVM 使用笔记

这篇文章主要整理 nvm 的安装和常用命令，适合在需要频繁切换 Node 版本时快速回查。

## 安装 NVM

```shell
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

或者：

```shell
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

## 常用命令

```shell
# 查看已安装版本
nvm list

# 安装版本
nvm install 11.13.0

# 使用指定版本
nvm use 11.13.0

# 卸载版本
nvm uninstall 11.13.0

# 显示 node 是 32 位还是 64 位
nvm arch

# 安装指定架构的 node
nvm install 11.13.0 [arch]

# 开启 / 关闭 node.js 版本管理
nvm on/off

# 设置下载代理
nvm proxy [url]
```

## 下载 Node 太慢时的处理

### macOS

```shell
NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node
```

### Windows

到 nvm 安装目录的 `settings.txt` 中添加：

```txt
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

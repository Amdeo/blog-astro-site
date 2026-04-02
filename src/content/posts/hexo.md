---
title: 'Hexo 使用笔记'
published: 2019-11-25
description: '整理 Hexo 的安装、常用命令、Next 主题宽度调整、本地搜索配置和文章插图处理方式。'
image: '/src/assets/blog-placeholder-4.jpg'
tags: ['工具', 'hexo']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Hexo 使用笔记

这篇文章把 Hexo 的安装、常用命令、Next 主题调整、本地搜索和文章插图这些高频操作集中记下来，适合搭博客或后续维护时直接翻。

## 安装

```shell
hexo init <folder>
cd <folder>
npm install
```

## 常用命令

```shell
# 初始化本地文件夹为网站根目录
hexo init [folder]

# 新建文章
hexo new [文章类型] <标题>

# 生成静态文件
hexo generate
hexo g

# 启动服务器
hexo s
hexo server

# 部署站点
hexo d
hexo deploy

# 清理缓存文件
hexo clean

# 监视文件变化
hexo w

# 新建页面
hexo new page "tags"
```

## Next 主题

### 调整 Hexo 页面宽度

打开 `/Hexo/themes/hexo-theme-next/source//css/_variables/custom.styl`，添加下面两行即可：

```stylus
$main-desktop = 1200px
$content-desktop = 900px
```

### 本地搜索功能

安装插件：

```shell
npm install hexo-generator-searchdb --save
```

修改站点配置文件 `_config.yml`：

```yaml
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```

修改主题配置文件 `_config.yml`：

```yaml
local_search:
  enable: true
```

## 文章中插入图片的方法

1. 设置站点配置 `_config.yml`：将 `post_asset_folder: false` 改成 `post_asset_folder: true`
2. 安装插件：`npm install https://github.com/CodeFalling/hexo-asset-image --save`
3. 配置 Typora：

![1574954911889](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1574954911889.png)

```text
../../source/_posts//${filename}
```

## 常见报错

### Accessing non-existent property ‘lineno’ of module exports inside circular dependency

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTAyNjM0MjM=,size_16,color_FFFFFF,t_70.png)

处理思路：换一个低版本的 Node。我这里换成 `Node 12.14.0`。

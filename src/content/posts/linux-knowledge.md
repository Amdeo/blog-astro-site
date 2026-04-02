---
title: 'Linux 知识整理'
published: 2019-12-05
description: '围绕 LAMP、LNMP 与 Nginx 常用命令，整理 Linux 环境中高频出现的一批基础知识点。'
image: '/src/assets/blog-placeholder-2.jpg'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Linux 知识整理

这篇文章更像一份 Linux 运维与环境知识的整理笔记，适合在搭环境和排查服务时快速翻看。

## LAMP 和 LNMP

- `LAMP = Linux + Apache + MySQL + PHP`
- `LNMP = Linux + Nginx + MySQL + PHP`

两者的核心差别主要在 Web 服务器：

- LAMP 使用 Apache
- LNMP 使用 Nginx

LAMP 属于更传统的一套组合方式，而 LNMP 则因为 Nginx 的高性能和轻量级特性，在很多场景下更受欢迎。

### Apache 与 Nginx 的差异

Apache 是历史非常悠久的 Web 服务器，在跨平台和稳定性方面表现很好，也长期处于广泛使用状态。

Nginx 则更强调高性能、反向代理和轻量级特性，常见于高并发场景，也常作为网关或反向代理服务器使用。

## Nginx 使用

下面这些命令是日常运维中最常用的一批：

```shell
nginx -s reopen     # 重启 Nginx
nginx -s reload     # 重新加载配置并优雅重启
nginx -s stop       # 强制停止 Nginx
nginx -s quit       # 处理完请求后再退出
nginx -t            # 检测配置文件语法
nginx -?,-h         # 查看帮助信息
nginx -v            # 查看版本
nginx -V            # 查看版本和编译参数
nginx -T            # 检测配置并转储配置内容
nginx -q            # 配置检测时屏蔽非错误信息
nginx -p prefix     # 设置前缀路径
nginx -c filename   # 指定配置文件
nginx -g directives # 传入全局指令
killall nginx       # 杀死所有 nginx 进程
```

如果只是日常维护，最常见的命令通常是：

- `nginx -t`
- `nginx -s reload`
- `nginx -v`

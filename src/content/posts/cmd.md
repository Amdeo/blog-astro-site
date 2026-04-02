---
title: 'CMD 常用命令'
published: 2017-12-05
description: '整理 Windows CMD 里最常用的系统、文件、网络和进程相关命令，适合做日常速查。'
image: '/src/assets/blog-placeholder-2.jpg'
tags: ['工具', '命令', '操作系统']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# CMD 常用命令

CMD 是 Windows 下最常用的命令行工具之一，很多系统信息查看、网络排查和文件操作都可以直接在这里完成。这篇文章按场景把常用命令集中整理一下，方便后面直接查。

## 常用系统命令

### 查看当前目录

```cmd
dir
```

### 切换目录

```cmd
cd 路径
```

返回上一级目录：

```cmd
cd ..
```

### 清屏

```cmd
cls
```

### 查看帮助

```cmd
help
```

查看某个命令的帮助：

```cmd
命令 /?
```

## 文件和目录操作

### 创建目录

```cmd
mkdir test
```

### 删除目录

```cmd
rmdir test
```

删除非空目录：

```cmd
rmdir /s /q test
```

### 创建文件

```cmd
echo hello > a.txt
```

### 删除文件

```cmd
del a.txt
```

### 复制文件

```cmd
copy a.txt d:\backup\a.txt
```

### 移动文件

```cmd
move a.txt d:\backup\
```

### 重命名文件

```cmd
ren a.txt b.txt
```

## 网络相关命令

### 查看 IP 信息

```cmd
ipconfig
```

查看更详细的网络信息：

```cmd
ipconfig /all
```

### 刷新 DNS

```cmd
ipconfig /flushdns
```

### 释放和重新获取 IP

```cmd
ipconfig /release
ipconfig /renew
```

### 测试网络连通性

```cmd
ping www.baidu.com
```

### 查看路由信息

```cmd
route print
```

### 查看网络连接

```cmd
netstat -ano
```

## 用户和系统信息

### 查看当前登录用户

```cmd
whoami
```

### 查看主机名

```cmd
hostname
```

### 查看系统信息

```cmd
systeminfo
```

### 查看任务列表

```cmd
tasklist
```

### 结束进程

```cmd
taskkill /pid 进程id /f
```

## 磁盘相关命令

### 查看磁盘

```cmd
wmic logicaldisk get caption,freespace,size
```

### 检查磁盘

```cmd
chkdsk
```

## 其他常用命令

### 查看环境变量

```cmd
set
```

查看某个环境变量：

```cmd
echo %PATH%
```

### 查看端口占用

```cmd
netstat -ano | findstr 端口号
```

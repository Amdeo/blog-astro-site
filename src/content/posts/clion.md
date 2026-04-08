---
title: 'CLion 配置与 OpenGL 环境搭建'
published: 2017-12-08
description: '记录 Windows 下配置 CLion、MinGW，以及在 CLion 中接入 OpenGL / freeglut 的基础流程。'
tags: ['工具', '操作系统']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# CLion 配置与 OpenGL 环境搭建

这篇文章主要记录 Windows 下配置 CLion 开发环境，以及在 CLion 里使用 OpenGL / freeglut 的一套基础流程，适合第一次搭 C/C++ 图形开发环境时对照着走。

## 配置 CLion 的 MinGW 环境

先下载 **MinGW**：

[MinGW](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/)

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1565015562631.png)

下载后解压：

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1565016090640.png)

然后打开 CLion 的 `Settings`：

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1565016173259.png)

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1565016235330.png)

## 在 CLion 中使用 OpenGL

### 1. 下载 freeglut

先下载 freeglut：

<https://www.transmissionzero.co.uk/software/freeglut-devel/>

选择 for MinGW 版本：

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1565016355294.png)

### 2. 拷贝文件

解压后里面有 `bin`、`include`、`lib` 三个目录。

- 将压缩包 `include/GL` 中的文件拷贝到 `mingw/include/GL`
- 64 位机器把压缩包 `lib/x64` 里的 `.a` 文件拷贝到 `mingw/lib`
- 32 位机器则拷贝压缩包 `lib` 下的两个 `.a` 文件
- 64 位机器把压缩包 `bin/x64` 里的文件拷贝到 `C:/Windows/SysWOW64`
- 32 位机器把压缩包 `bin` 下的文件拷贝到 `C:/Windows/System32`

### 3. 新建 CLion 工程并修改 CMake 文件

新建 CLion 工程后，再按项目实际情况修改 `CMakeLists.txt`，把 OpenGL / freeglut 的头文件和库路径接进去。

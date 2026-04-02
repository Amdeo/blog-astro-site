---
title: '编译器'
published: 2020-01-01
description: '编译器 传统的编译器通常分为：前端、优化器和后端。 前端：主要负责词法和语法分析，将源代码转化为抽象语法树 优化器：在前端的基础上，对中间代码进行优化，使代码更加高效 后端：将已经优化的中间代码转化为针对各自平台的机器代…'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# 编译器

传统的编译器通常分为：前端、优化器和后端。

前端：主要负责词法和语法分析，将源代码转化为抽象语法树

优化器：在前端的基础上，对中间代码进行优化，使代码更加高效

后端：将已经优化的中间代码转化为针对各自平台的机器代码

常用的两大编译器：

GCC和clang

## GCC

GCC是一套由GNU开发的编程语言编译器。GCC原名为GNU C语言编译器，因为它原本只能处理C语言，现在可以支持C++、Fortan、Pascal、Objective-C、Java以及Ada等其他语言。

许多操作系统，包括类Unix系统，如Linux及BSD家族都采用GCC作为标准编译器。

GCC支持的主要处理器架构：ARM、x86、x86-64、MIPS、PowerPC等。


## Clang

> 是一个C、C++、Objective-C和Objective-C++编程语言的编译器前端

它采用了底层虚拟机（LLVM）作为其后端。它的目标是提供一个GNU编译器套装GCC的替代品。Clang主要由C++编写。

GCC与Clang区别：

**GCC特性**：除支持C/C++/ Objective-C/Objective-C++语言外，还是支持Java/Ada/Fortran/Go等；当前的Clang的C++支持落后于GCC；支持更多平台；更流行，广泛使用，支持完备。
**Clang特性**：编译速度快；内存占用小；兼容GCC；设计清晰简单、容易理解，易于扩展增强；基于库的模块化设计，易于IDE集成；出错提示更友好。

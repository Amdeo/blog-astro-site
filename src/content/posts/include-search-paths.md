---
title: 'C和C++中include搜索路径'
published: 2020-03-29
description: '在C和C++中使用 include 来引用头文件，一般有两种方式： 使用< 使用” “ 寻找头文件的顺序 1. 编译器通过参数 I 指定头文件的搜索路径(如果有多个，可以使用多个 I ) 2. 使用 include 双引…'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C和C++中include搜索路径

在C和C++中使用`#include `来引用头文件，一般有两种方式：

使用<>

```
#include <iostream>
```

使用” “

```
#include <myheadfile.h>
```

寻找头文件的顺序

1. 编译器通过参数`-I` 指定头文件的搜索路径(如果有多个，可以使用多个`-I`)

2. 使用#include 双引号方式引用头文件，会优先在当前文件下寻找头文件

3. 通过查找gcc的环境变量 C_INCLUDE_PATH、CPLUS_INCLUDE_PATH、OBJC_INCLUDE_PATH来搜索头文件位置。

4. 通过标准系统目录搜索

   /usr/include

   /usr/local/include

   /usr/lib/gcc-lib/i386-linux/2.95.2/include   (`这个是gcc程序的库文件地址，各个用户的系统上可能不一样`)

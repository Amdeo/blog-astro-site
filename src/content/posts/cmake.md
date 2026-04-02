---
title: 'cmake'
published: 2017-12-08
description: '指定cmake的最小版本 设置项目名称 定义变量或者为变量赋值 设置编译输出 搜索cpp文件 为目标文件链接依赖的库 指定目录添加到编译器的头文件搜索路劲之下 从指定的文件加载。'
image: '/src/assets/blog-placeholder-5.jpg'
tags: ['工具', '操作系统']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# cmake

指定cmake的最小版本

```cmake
cmake_minimum_required(VERSION 3.4.1)
```

设置项目名称

```cmake
project(demo)
```

定义变量或者为变量赋值

```cmake
set(haha "xxx") # 这个是自定义变量
set(CMAKE_CXX_STANDARD 11)    # 这个为CMAKE_CXX_STANDARD赋值
```

设置编译输出

```cmake
add_executable(demo demo.cpp) # 生成可执行文件

add_library(common STATIC util.cpp) # 生成静态库

add_library(common SHARED util.cpp) # 生成动态库或共享库

add_subdirectory(<指定一个目录> <指定目录存放输出文件>)
```

搜索cpp文件

```cmake
aux_source_directory(dir VAR)
```

为目标文件链接依赖的库

```cmake
target_link_libraries(<target> <lib>)
```

指定目录添加到编译器的头文件搜索路劲之下

```cmake
include_directories(<指定目录>)
```

从指定的文件加载、运行CMake代码

```cmake
include(<file|moudle>)
```

在编译目标文件<target>时指定头文件

```cmake
target_include_directories(<target> <头文件目录>)
```

为链接器添加库的搜索路径

```cmake
link_directories(路径)
```

加载外部库到项目中

```cmake
find_package()
```


### 修饰符

PUBLIC: 修饰的库或者目标会被链接，并成为链接接口的一部分

PRIVATE: 修饰的目标或库会被链接，但不能链接接口的一部分

INTERFACE: 修饰的库会被追加到链接接口中，但不会用来链接目标文件<target>

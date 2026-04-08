---
title: 'CMake：最常用命令与 CMakeLists 基础写法'
published: 2017-12-08
description: '整理 CMake 入门阶段最常见的一批写法，包括项目声明、变量设置、可执行文件与库的生成、头文件目录、链接库、子目录拆分和 find_package 的基本用法。'
tags: ['CMake', '构建系统', 'C/C++']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# CMake：最常用命令与 CMakeLists 基础写法

这篇文章整理 CMake 入门阶段最常用的一批命令和写法，适合在写 `CMakeLists.txt` 时快速回查。

它不追求覆盖完整语法，而是优先记录平时最常见、最容易忘的几类能力：

- 指定最低 CMake 版本
- 声明项目名称
- 设置变量和编译标准
- 生成可执行文件与库
- 指定头文件目录
- 链接依赖库
- 拆分子目录
- 查找外部库

## 指定最低 CMake 版本

```cmake
cmake_minimum_required(VERSION 3.4.1)
```

这通常是 `CMakeLists.txt` 里最先出现的一句，用来声明当前项目要求的最低 CMake 版本。

## 设置项目名称

```cmake
project(demo)
```

用来声明项目名。后续生成的构建信息、变量和工程结构，通常都会围绕这个名字展开。

## 定义变量或设置 CMake 变量

```cmake
set(haha "xxx")
set(CMAKE_CXX_STANDARD 11)
```

这里有两种常见用途：

- 自定义普通变量
- 给 CMake 内置变量赋值

例如：

- `set(haha "xxx")`：定义一个自定义变量
- `set(CMAKE_CXX_STANDARD 11)`：指定 C++ 标准版本为 C++11

如果项目需要明确编译标准，这一行基本是常驻项。

## 生成可执行文件和库

### 生成可执行文件

```cmake
add_executable(demo demo.cpp)
```

表示把 `demo.cpp` 编译成一个名为 `demo` 的可执行文件。

### 生成静态库

```cmake
add_library(common STATIC util.cpp)
```

表示把 `util.cpp` 编译成静态库 `common`。

### 生成动态库

```cmake
add_library(common SHARED util.cpp)
```

表示把 `util.cpp` 编译成动态库（共享库）`common`。

## 添加子目录

```cmake
add_subdirectory(<指定一个目录> <指定目录存放输出文件>)
```

这个命令适合把较大的工程拆成多个子模块管理。

常见用途包括：

- 把公共模块拆到单独目录
- 把第三方组件拆到子目录
- 把大型工程按功能分层组织

如果项目稍微复杂一点，`add_subdirectory()` 基本都会出现。

## 搜索目录中的源文件

```cmake
aux_source_directory(dir VAR)
```

这个命令会把指定目录下的源文件收集到变量 `VAR` 中。

虽然它写起来省事，但在大项目里不一定是最推荐的方式，因为：

- 文件来源不够显式
- 后续排查构建问题时不够直观

如果只是小项目或临时练习，用它问题不大。

## 为目标链接库

```cmake
target_link_libraries(<target> <lib>)
```

用来给某个目标文件链接依赖库。

例如：

```cmake
target_link_libraries(demo pthread)
```

表示给 `demo` 链接 `pthread`。

这是 CMake 里非常核心的一条命令，几乎每个稍微正式一点的项目都会用到。

## 添加头文件搜索目录

### 全局方式

```cmake
include_directories(<指定目录>)
```

表示把某个目录加入编译器的头文件搜索路径。

这种写法简单直接，但影响范围偏全局。

### 针对目标方式

```cmake
target_include_directories(<target> <头文件目录>)
```

这是一种更细粒度的写法，表示只给指定目标添加头文件目录。

如果项目逐渐变复杂，通常更推荐用 `target_include_directories()`，因为作用范围更清晰。

## 添加库搜索路径

```cmake
link_directories(路径)
```

用来为链接器添加库文件搜索路径。

这类配置常见于：

- 第三方库不在系统默认目录
- 本地手工编译安装的库
- 某些老项目的自定义目录结构

## 加载外部库

```cmake
find_package()
```

这个命令用来查找并加载外部依赖库，是 CMake 处理第三方依赖时最常见的入口之一。

常见场景包括：

- 查找 Boost
- 查找 OpenCV
- 查找 Qt
- 查找 Threads

实际使用时一般会写成类似：

```cmake
find_package(OpenCV REQUIRED)
```

然后配合：

```cmake
target_link_libraries(demo ${OpenCV_LIBS})
```

一起使用。

## include：加载额外 CMake 文件

```cmake
include(<file|module>)
```

它的作用是从指定文件中继续加载并执行 CMake 代码。

适合用来：

- 拆分公共配置
- 引入自定义模块
- 复用一组共享构建逻辑

当 `CMakeLists.txt` 越写越长时，把公共部分拆出去会清爽很多。

## PUBLIC / PRIVATE / INTERFACE 的区别

这三个修饰符经常出现在：

- `target_link_libraries()`
- `target_include_directories()`

中，用来控制依赖是只给当前目标使用，还是也要暴露给依赖它的下游目标。

### PUBLIC

- 当前目标自己会使用
- 依赖当前目标的下游也会继承

### PRIVATE

- 只有当前目标自己使用
- 不会传递给下游目标

### INTERFACE

- 当前目标自己不使用
- 只提供给依赖它的下游目标

如果刚开始学 CMake，可以先这样记：

- **PUBLIC**：自己用，下游也用
- **PRIVATE**：只有自己用
- **INTERFACE**：自己不用，下游用

## 一个最小示例

下面是一个简单但常见的 CMakeLists 示例：

```cmake
cmake_minimum_required(VERSION 3.10)
project(demo)

set(CMAKE_CXX_STANDARD 11)

add_executable(demo main.cpp)
target_include_directories(demo PRIVATE include)
target_link_libraries(demo pthread)
```

这个例子包含了最常见的几步：

1. 指定最低版本
2. 声明项目
3. 设置 C++ 标准
4. 生成可执行文件
5. 添加头文件目录
6. 链接依赖库

## 小结

如果只是为了快速写出一个能编译的小项目，最常用的往往就是下面这些命令：

- `cmake_minimum_required()`
- `project()`
- `set()`
- `add_executable()`
- `add_library()`
- `target_link_libraries()`
- `target_include_directories()`
- `find_package()`
- `add_subdirectory()`

先把这些高频命令记住，后面再逐步补充更复杂的构建组织方式，会顺很多。
---
title: '静态库与动态库：Linux 下的生成与使用'
published: 2018-12-05
description: '整理 Linux 下静态库和动态库的概念、优缺点，以及基础创建方式，适合做 C/C++ 编译链接入门速查。'
image: '/assets/desktop-banner/1.webp'
tags: ['操作系统', 'C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# 静态库与动态库：Linux 下的生成与使用

![静态库与动态库对比示意图](/assets/post-diagrams/static-vs-dynamic-libraries.svg)

Linux 下常见的库主要分为两类：静态库和动态库。

这两个概念在 C/C++ 编译、链接和部署时经常出现。简单说：

- **静态库**：在编译阶段就被链接进目标程序
- **动态库**：在程序运行时再加载

它们各有优缺点。

### 静态库

优点：

- 部署相对简单
- 可执行文件拿过去就更容易运行

缺点：

- 生成文件体积更大
- 多个程序重复携带同一份代码，空间利用率不高

### 动态库

优点：

- 可执行文件通常更小
- 库升级时更容易替换和复用

缺点：

- 部署时要一起处理依赖库
- 程序运行时必须能找到对应的动态库文件


## 静态库


静态库在程序编译时就已经被链接到目标代码中，目标程序运行不再需要该动态库。


### 如何创建


使用ar创建静态库


```cpp
ar [option] libxxx.a xx1.o xx1.o xx2.o .....
```


| option | description                                                  |
| ------ | ------------------------------------------------------------ |
| c      | 用来创建一个库，无论库                                       |
| s      | 创建目标文件索引，这在创建较大的库时能加快时间               |
| r      | 在库中插入模块，若插入的模块名已经在库中存在，则将替换同名的模块。 |
| t      | 显示库文件中有哪些目标文件。                                 |
| tv     | 显示库文件中有哪些目标文件。显示的信息包括文件名、时间、大小 |
| s      | 显示静态库文件中的索引表                                     |

静态库的命名规则：

`lib + 库名称 + .a `

### 如何使用


```cpp
#include <stdio.h>
#include <iostream>
using namespace std;


void f(int age)
{
 cout<<"your age is "<< age << endl;
}
```


```cpp
g++ -c test.cpp

ar rcs libtest.a test.o //将目标文件创建成名叫test的静态库
```


```cpp
extern void f(int age);
#include <iostream>
using namespace std;


int main()
{
    f(66);
    cout<<"H I"<<endl;
    return 0;
}
```


```cpp
g++ -o main main.cpp -L . -ltest


-L用来告诉gcc哪里去找库文件。（.）表示当前路径
-l的作用是用来指定具体的库，其中的lib和.a不用显式写出，g++或gcc会自动去寻找libtest.a,
```


## 动态库


动态库又称为共享库，相比较静态库，动态库在编译时并没有被编译进目标代码，我们的程序执行到相关函数时才调用该函数库，所以动态函数库所产生的可执行文件比较小，由于函数库没有被整合到可执行代码中，而是程序运行时动态地申请并调用，所以程序的运行环境中必须提供相应的库。


生成so文件


### 如何创建


```cpp
g++ test.cpp -fPIC -shared -o libtest.so //生成so文件
```


test.cpp是库函数源文件


libtest.so 是动态库文件

命令规则：

`lib + 库名称 + .so`


### 如何使用


#### so文件存放指定路径


存放在指定路径中，无需请他配置，系统会默认加载以下的目录的库文件。


将库复制到/usr/lib和/lib（不包含子目录）下，这两个路径是默认搜索的地方，复制到指定目录下，在执行ldconfig。


大部分包括 Linux 在内的开源系统遵循 FHS（File Hierarchy Standard）的标准，这标准规定了系统文件如何存放，包括各个目录结构、组织和作用。


- `/lib`：存放系统最关键和最基础的共享库，如动态链接器、C 语言运行库、数学库等
- `/usr/lib`：存放非系统运行时所需要的关键性的库，主要是开发库
- `/usr/local/lib`：存放跟操作系统本身并不十分相关的库，主要是一些第三方应用程序的库


> 动态链接器会在 `/lib`、`/usr/lib` 和由 `/etc/ld.so.conf` 配置文件指定的，目录中查找共享库


#### 将文件路径设置到环境变量


告诉系统需要到环境变量中配置的路径去找动态库


- `LD_LIBRARY_PATH`：临时改变某个应用程序的共享库查找路径，而不会影响其他应用程序
- `LD_PRELOAD`：指定预先装载的一些共享库甚至是目标文件
- `LD_DEBUG`：打开动态链接器的调试功能


#### 将文件路径增加到配置文件中


修改/etc/Id.so.conf,我们将动态库文件的路径加到/etc/id.so.conf中，接着执行Idconfig。

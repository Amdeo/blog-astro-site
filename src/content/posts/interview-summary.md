---
title: '面经大汇总'
published: 2022-11-15
description: '围绕操作系统、网络编程与 C++ 高频面试题，整理一份适合复习和快速回顾的核心问答笔记。'
image: '/src/assets/blog-placeholder-5.jpg'
tags: ['C/C++', '调试']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# 面经大汇总

这篇文章把操作系统、网络编程和 C++ 面试里常见的一批问题汇总到一起，更适合拿来做复习清单，而不是从头系统学习。


## 操作系统

### 线程池优势

- 降低资源消耗。通过重复利用已创建的线程降低创建和销毁造成的消耗
- 提高响应速度。当任务到达时，任务可以不需要等到线程创建就能立即执行。
- 提高线程的可管理性。线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。

### Linux 查看进程、线程、CPU 核数

```bash
cat /proc/cpuinfo
```

### 后台如何查看 TCP 连接是否成功

```bash
netstat -an
```


## 网络编程

### epoll 有什么优势


### UDP socket 编程


## C++

### 重载和重写

重载是指函数重载

函数重载，函数名可以相同，参数的个数、类型至少一个相同，返回值不同不能仅有条件

重写是指派生类重写基类同名函数，重写的函数，只有函数类体不相同，其他必须相同。

### 全局变量什么时候初始化的

进入 main 函数之前初始化

### 全局变量可以和局部变量重名吗

可以重名。有效范围就近原则，当在局部变量作用域内，全局变量失效

### 类里面静态函数和成员函数的区别

静态函数不需要类实例化，可以直接通过类名调用，函数体内只能访问静态变量

### 迭代器：++it、it++哪个好，为什么

++it

```cpp
int& operator++(int)
{
  *this += 1;
  return *this;
}
```

it++

```cpp
int operator++(int)
{
  int temp = *this;
  ++*this;
  return temp;
}
```

### \#ifdef 和 #if

条件编译

```cpp
#ifdef 标识符
程序段1
#else
程序段2
#endif
```

```cpp
#ifdef
程序段1
#endif
```

大小端如何判断

大端存储：字数据的高字节存储在低地址中

小端存储：字数据的低字节存储在低地址中

例如：32bit的数字0x12345678

所以在Socker编程中，**往往需要将操作系统所用的小端存储的IP地址转换为大端存储，这样才能进行网络传输**，网络协议中要求使用大端来传输

方式一：使用强制类型转换

```cpp
#include <iostream>
using namespace std;
int main()
{
    int a = 0x1234;
    //由于int和char的长度不同，借助int型转换成char型，只会留下低地址的部分
    char c = (char)(a);
    if (c == 0x12)
        cout << "big endian" << endl;
    else if(c == 0x34)
        cout << "little endian" << endl;
}
```

方式二：使用union联合体

```cpp
#include <iostream>
using namespace std;
//union联合体的重叠式存储，endian联合体占用内存的空间为每个成员字节长度的最大值
union endian
{
    int a;
    char ch;
};
int main()
{
    endian value;
    value.a = 0x1234;
    //a和ch共用4字节的内存空间
    if (value.ch == 0x12)
        cout << "big endian"<<endl;
    else if (value.ch == 0x34)
        cout << "little endian"<<endl;
}
```

###

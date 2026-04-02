---
title: 'C++ primer笔记'
published: 2020-11-25
description: '1 快速入门 1.1 编写简单的C++程序 每个C++程序包含一个或者多个函数，必须有一个名为main的函数 下面是一个最简单的main函数 操作系统通过main函数的返回值来确定程序是否执行完毕。一般返回0表示程序执行…'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++ primer笔记

1 快速入门 1.1 编写简单的C++程序 每个C++程序包含一个或者多个函数，必须有一个名为main的函数 下面是一个最简单的main函数 操作系统通过main函数的返回值来确定程序是否执行完毕。一般返回0表示程序执行…


## 1 快速入门

### 1.1 编写简单的C++程序

每个C++程序包含一个或者多个函数，必须有一个名为main的函数

下面是一个最简单的main函数

```cpp
int main()
{
  return 0;
}
```

操作系统通过main函数的返回值来确定程序是否执行完毕。一般返回0表示程序执行完成。

如何获取程序的返回值

```bash
g++ prog1.cpp

./a.out

echo $? # 输出程序的返回值
```

#### 习题1.1

查看所用的编译器文档，链接它所用的文件命名规范。编译并运行本节的main程序。

略

#### 习题1.2

修改程序使其返回-1，返回值-1通常作为程序运行失败的指示器。然而，系统不同，如何(甚至是否)报告main函数运行失败也不同。重新编译并运行程序，看看你的系统如何处理main函数的运行失败指示器。

略

### 1.2 初窥输入/输出

处理输入时使用cin

处理输出时使用cout

标准错误使用cerr

产生程序执行的一般信息

#### 习题1.3

编写一个程序，在标准输出打印"Hello World"

```cpp
#include <iostream>

using namespace std;

int main()
{
    cout << "hello world" << endl;
    return 3;
}

```

#### 习题1.4

我们程序利用内置的程序加法操作符“+”来产生两个数的和。编写程序，使用乘法操作符“+”产生两个数的积。

```cpp
#include <iostream>

using namespace std;

int main()
{
    int a,b;
    cin >> a >> b;
    cout << a * b << endl;
    return 3;
}

```


#### 习题1.5

我们的程序使用了一条较长的输出语句。重写程序，使用单独的语句打印每一个操作数。

#### 习题1.6

解释下面的程序段：

```cpp
std::cout << "The sum of " << v1;
					<< " and " << v2;
					<< " is " << v1 + v2;
					<< std::endl;
```

这段代码合法吗？如果合法，为什么？如果不合法，又为什么？

想要跨行使用<< 操作符，不能用分号。

#### 习题1.7

编译有不正确嵌套注释的程序。

#### 习题1.8

指出下列输出语句哪些（如果有）是合法的

```cpp
std::cout << "/*";
std::cout << "*/";
std::cout << /* "*/" */;
```

第三行有问题，删除中间的*星号

#### 习题1.9

下列循环做什么？sum的最终值是多少？

```cpp
int sum = 0;
for (int i = -100; i <= 100; ++i)
  sum += i;
```

sum 的值0

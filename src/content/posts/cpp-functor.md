---
title: 'C++仿函数'
published: 2020-05-17
description: '介绍 C++ 仿函数的基本概念、使用方式及它和普通函数的区别。'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++仿函数
所谓的仿函数，使用过重载()运算符模拟函数行为的类型
1. 仿函数不是函数，是一个类
2. 仿函数重载()运算符，使得代码形式好像调用函数

```cpp
#include <iostream>

class myclass
{
public:
    explicit myclass(int n) : threshold(n) {}
    bool operator()(int n)
    {
        return n > threshold ? true : false;
    }

private:
    int threshold;
};

int main(int argc, char const *argv[])
{
    using namespace std;
    myclass a(10);

    cout << a(2) << endl;
    return 0;
}
```

---
title: 'C++ pair'
published: 2020-06-18
description: '介绍 C++ pair 的基本用法、常见场景与搭配 STL 的实践方式。'
image: '/src/assets/blog-placeholder-5.jpg'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++ pair

pair可以将两个数据组合成一个数据

头文件： `#include <utility>`

使用：

```cpp
#include <iostream>
#include <utility> // pair
#include <string>  // string
using namespace std;

std::pair<string, string> getpair()
{
    return make_pair("yuan", "dongbin");
}

int main()
{
    // 调用构造函数 1，也就是默认构造函数
    pair<string, double> pair1;
    // 调用第 2 种构造函数
    pair<string, string> pair2("hello", "world");
    // 调用拷贝构造函数
    pair<string, string> pair3(pair2);
    // 调用移动构造函数
    pair<string, string> pair4(make_pair("hello", "world"));
    // 调用第 5 种构造函数
    pair<string, string> pair5(string("hello"), string("world"));

    cout << "pair1: " << pair1.first << " " << pair1.second << endl;
    cout << "pair2: " << pair2.first << " " << pair2.second << endl;
    cout << "pair3: " << pair3.first << " " << pair3.second << endl;
    cout << "pair4: " << pair4.first << " " << pair4.second << endl;
    cout << "pair5: " << pair5.first << " " << pair5.second << endl;

    cout << "step::判断" << endl;

    if (pair2 == pair5)
    {
        cout << "两个pair数据相等" << endl;
    }

    cout << "step::赋值1" << endl;
    pair2.first = "你好";
    pair2.second = "世界";

    cout << "pair2: " << pair2.first << " " << pair2.second << endl;

    cout << "step::赋值2" << endl;
    pair2 = make_pair("nihao", "shijie");
    cout << "pair2: " << pair2.first << " " << pair2.second << endl;

    cout << "step::pair作为返回值" << endl;
    pair5 = getpair();
    cout << "pair5: " << pair5.first << " " << pair5.second << endl;

    return 0;
}
```

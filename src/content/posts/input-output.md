---
title: '输入输出'
published: 2020-01-01
description: 'C和C++输入输出 输入 scanf和cin 输入流无论什么情况下都会忽略tab、空格、回车等分隔符 scanf 函数在除 scanf("%c",&char) 之外的所有情况都不会把回车符作为输入字符在输入缓存中读取，但…'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# 输入输出

> C和C++输入输出

## 输入

scanf和cin

> 输入流无论什么情况下都会忽略tab、空格、回车等分隔符

`scanf`函数在除`scanf("%c",&char)`之外的所有情况都不会把回车符作为输入字符在输入缓存中读取，但`scanf("%c",&char)`也不会读取tab、空格，而是把他们作为分隔符在输入缓存中忽略。

## scanf

格式化输入

```cpp
int a,b,c;
sacnf("%d,%d,%d", &a, &b, &c); // 输入 10,14,15

scanf("%d#%d#%d", &a, &b, &c); // 输入 10#14#15

sacnf("%dx%dx%dx", &a, &b, &c) // 输入 10x14x15
```

输入数字

```cpp
#include <iostream>
#include <stdio.h>

using namespace std;

int main() {
    int a;
    scanf("%d", &a);
    cout << a << endl;
    return 0;
}
```

输入带空格的字符串

```cpp
#include <iostream>
#include <stdio.h>

using namespace std;

int main() {
    string a;
    getline(cin, a);
    cout << a << endl;
    return 0;
}

```

## cin

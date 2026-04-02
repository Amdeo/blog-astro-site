---
title: 'C陷阱'
published: 2016-03-15
description: '数组作为函数参数，不能使用sizeof获取数组个数 输出: 因为数组作为函数参数，只是将指向数组指针拷贝给函数，所以在函数中使用sizeof，只能获取指针的内存大小。'
image: '/src/assets/blog-placeholder-5.jpg'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C陷阱

数组作为函数参数，不能使用sizeof获取数组个数 输出: 因为数组作为函数参数，只是将指向数组指针拷贝给函数，所以在函数中使用sizeof，只能获取指针的内存大小。


## 数组作为函数参数，不能使用sizeof获取数组个数

```cpp
#include <iostream>
#include <stdio.h>

using namespace std;

void test (int *b)
{
    int i=0;
    printf("%d\n",sizeof(b));
}

int main(int argc, char const *argv[])
{
    /* code */
    int a[10]={2,4,6,8,10,12,14,16,18,20};
    printf("%d\n",sizeof(a));
    test(a);
    putchar('\n');
    return 0;
}
```

输出:

```
40
8
```

因为数组作为函数参数，只是将指向数组指针拷贝给函数，所以在函数中使用sizeof，只能获取指针的内存大小。

---
title: 'C++ primer'
published: 2022-07-17
description: '输入输出 通过测试发现 cin遇到空格和回车，表示一个变量赋值结束 const限定符 const 修饰普通变量，变量不能修改 const 修改对象，对象只能访问被const修饰的函数，和不能修改成员变量'
image: '/assets/desktop-banner/1.webp'
tags: ['编程语言', 'C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++ primer

输入输出 通过测试发现 cin遇到空格和回车，表示一个变量赋值结束 const限定符 const 修饰普通变量，变量不能修改 const 修改对象，对象只能访问被const修饰的函数，和不能修改成员变量


## 输入输出

```cpp
df#include <iostream>

using namespace std;

int main()
{
    int a, b;
    cin >> a >> b;

    cout << a << " " << b << endl;
    return 0;
}
```

```
输入
1
2

结果
1 2
```

```
输入
1 2

结果
1 2
```

通过测试发现
cin遇到空格和回车，表示一个变量赋值结束


## const限定符

const 修饰普通变量，变量不能修改

const 修改对象，对象只能访问被const修饰的函数，和不能修改成员变量

```cpp
#include <iostream>

using namespace std;

class Student {
public:
    int GetAge() const
    {
        return age;
    }
    const int age {10};
    int height{20};
};

int main(int argc, char **argv)
{
    const Student b;
    cout << b.GetAge() << endl;
    cout << b.height << endl;
    // b.height = 2; 不能修改成员变量
    return 0;
}
```

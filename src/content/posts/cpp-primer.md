---
title: 'C++ Primer：从输入输出到 const 的基础笔记'
published: 2022-07-17
description: '整理 C++ Primer 学习过程中的两类基础知识：cin/cout 的输入输出行为，以及 const 在普通变量、对象成员和成员函数中的常见约束。'
tags: ['C++', 'C/C++', '基础语法']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++ Primer：从输入输出到 const 的基础笔记

这篇笔记主要整理两类最基础但很容易在初学阶段混淆的内容：

- `cin` / `cout` 的基本输入输出行为
- `const` 在普通变量、对象成员和成员函数中的限制

内容不追求面面俱到，重点是把最容易踩坑的地方讲清楚，方便后续快速回看。

## 输入输出

先看一个最基础的输入输出例子：

```cpp
#include <iostream>

using namespace std;

int main()
{
    int a, b;
    cin >> a >> b;

    cout << a << " " << b << endl;
    return 0;
}
```

### 输入示例 1

```text
输入
1
2

结果
1 2
```

### 输入示例 2

```text
输入
1 2

结果
1 2
```

### 结论

通过这个例子可以看出：

- `cin` 默认会按空白符分隔输入
- 这里的空白符包括：
  - 空格
  - 回车
  - 制表符

也就是说，对下面这行代码：

```cpp
cin >> a >> b;
```

无论你是这样输入：

```text
1 2
```

还是这样输入：

```text
1
2
```

`cin` 都能正常把第一个值读给 `a`，第二个值读给 `b`。

如果只是读取普通整数、浮点数、字符串（按空白分隔），这个行为通常已经够用了。

## const 限定符

`const` 用来表示“只读”或“不可修改”的约束。

在 C++ 里，它最常见的作用包括：

- 修饰普通变量，表示值不可修改
- 修饰对象，表示对象处于只读状态
- 修饰成员函数，表示该函数不会修改对象状态

### const 修饰普通变量

最简单的情况是：

```cpp
const int x = 10;
```

这表示 `x` 初始化之后就不能再被修改。

## const 对象与 const 成员函数

看下面这个例子：

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
    int height {20};
};

int main()
{
    const Student b;
    cout << b.GetAge() << endl;
    cout << b.height << endl;
    // b.height = 2; 不能修改成员变量
    return 0;
}
```

### 这个例子里要注意三件事

#### 1. `const Student b;` 表示 `b` 是一个常量对象

也就是说，`b` 创建之后就不能被当作可修改对象来使用。

#### 2. `GetAge() const` 是 const 成员函数

```cpp
int GetAge() const
```

成员函数末尾这个 `const` 的意思是：

- 这个函数承诺不会修改对象的成员状态
- 因此它可以被 `const` 对象调用

如果 `GetAge()` 后面不加 `const`，那么：

```cpp
const Student b;
b.GetAge();
```

就会报错，因为常量对象不能调用“可能修改对象状态”的普通成员函数。

#### 3. const 对象不能修改成员变量

例如下面这句：

```cpp
// b.height = 2;
```

是不能通过编译的，因为 `b` 是常量对象。

即使 `height` 本身不是 `const`，只要对象 `b` 是 `const`，你就不能通过它去修改成员值。

## 一个更直观的理解方式

可以把它理解成下面这层关系：

- **普通对象**：可以调用普通成员函数，也可以调用 `const` 成员函数
- **const 对象**：只能调用 `const` 成员函数，不能修改成员变量

所以当你写类时，如果某个成员函数只是“读取信息”而不修改对象，最好把它声明成 `const` 成员函数。

例如：

- `GetAge() const`
- `GetName() const`
- `Size() const`
- `Empty() const`

这是一个很常见、也很重要的习惯。

## 小结

这篇笔记涉及的内容不多，但都很基础：

### 关于输入输出

- `cin` 会把空格、回车、制表符都当作分隔符
- `cin >> a >> b;` 既能处理同一行输入，也能处理多行输入

### 关于 `const`

- `const` 变量不可修改
- `const` 对象不能修改成员变量
- `const` 对象只能调用 `const` 成员函数
- 不修改对象状态的成员函数，应该尽量声明为 `const`

如果后面继续整理 C++ 基础笔记，这一篇可以当成输入输出和 const 语义的起点。
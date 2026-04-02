---
title: 'C++模板'
published: 2020-05-17
description: '总结 C++ 模板的基础语法、泛型思路以及常见使用方式。'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++模板

基本语法：
```cpp
template <typename/class T>
```

typename和class都是关键字，在这里二者可以互相没有区别

## 函数模板

实例
```cpp

template <typename T>
T add(const T lva, const T rva)
{
    T ret;
    ret = lva + rva;
    return ret;
}

```

调用

```cpp
add<int>(1,1)； //<指定类型>

add<double>(2.1,2.2);

add(1,1) //这样也是可以，编译器会自动分析参数
```

模板也有默认参数

```cpp
template <typename T1,typename T2 = int>
```

## 类模板

``` c++
template <class T>
class Myclass
{
    T a;
public:
    T add(const T lva ,const T rva);
};

template <class T>
T Myclass<T>::add(const T lva, const T rva)
{
    a = lva + rva;
    return a;
}
```
调用
```cpp
Myclass<int> A;
```

成员模板

```cpp
#include <iostream>
#include <typeinfo>
using namespace std;

//成员模板
template <typename T>
class Array
{
public:
    template <typename T1>
    void output(T thistype, T1 othertype);
};

//成员模板
template <typename T>
template <typename T1>
void Array<T>::output(T thistype, T1 othertype)
{
    cout << "thistype is " << typeid(thistype).name() << ", othertype is " << typeid(othertype).name() << endl;
}

int main(int argc, char *argv[])
{
    Array<int> arr;
    arr.output<const char *>(10, "hello world");
    arr.output<double>(20, 8.8);
    arr.output(30, false);

    return 0;
}
```

### typename特性

```cpp
class Myclass{
public:
	Myclass();
    typedef int test;  //定义类型别名
}

template <class T>
class Myclass2{
public:
    Myclass2();
    //T::test *a  // 声明一个指向T::test类型的指针。 不能这样使用
    typename T::test * a
}
```

这里typename的作用是告诉编译器T::test 是一个类型。


### 类模板全特换和偏特化

```cpp
#include <iostream>

using namespace std;

template <typename T1, typename T2>
class Test
{
public:
    Test(T1 i, T2 j) : a(i), b(j) { cout << "模板类" << endl; }

private:
    T1 a;
    T2 b;
};

template <>
class Test<int, char> //参数的个数与模板类需要一样，意味每个参数都需要指定
{
public:
    Test(int i, char j) : a(i), b(j) { cout << "全特化" << endl; }

private:
    int a;
    char b;
};

template <typename T2>
class Test<char, T2> //部分参数需要指定，其他参数可以写死
{
public:
    Test(char i, T2 j) : a(i), b(j) { cout << "偏特化" << endl; }

private:
    char a;
    T2 b;
};

int main(int argc, char const *argv[])
{
    //类实例化的时候，就指定哪个模板
    Test<double, double> t1(0.1, 0.2);

    Test<int, char> t2(1, 'A');

    Test<char, bool> t3('A', true);
    return 0;
}
```


### 函数模板全特化

> 函数模板不支持偏特化

```cpp
//模板函数
template<typename T1, typename T2>
void fun(T1 a , T2 b)
{
	cout<<"模板函数"<<endl;
}

//全特化
template<>
void fun<int ,char >(int a, char b)
{
	cout<<"全特化"<<endl;
}
```

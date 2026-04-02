---
title: 'C++关键字'
published: 2017-11-25
description: 'C++知识点 C++不常用关键字 1. asm asm(指令字符串)：允许在C++程序中嵌入汇编代码。 2. auto auto（自动，automatic）是存储类型标识符，表明变量"自动"具有本地范围，块范围的变量声明…'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++关键字

C++知识点 C++不常用关键字 1. asm asm(指令字符串)：允许在C++程序中嵌入汇编代码。 2. auto auto（自动，automatic）是存储类型标识符，表明变量"自动"具有本地范围，块范围的变量声明…


## **C++知识点**


### **C++不常用关键字**


#### **1. asm**


> asm(指令字符串)：允许在C++程序中嵌入汇编代码。


#### **2. auto**


> auto（自动，automatic）是存储类型标识符，表明变量"自动"具有本地范围，块范围的变量声明（如for循环体内的变量声明）默认为auto存储类型。


#### **3. bool**


> bool代表为布尔类型，值为true(真)或者false（假），C++中bool类型可以和int混用，0代表false，非0代表为true。bool类型常用于条件判断和函数返回值。


```cpp
#define bool int
#define false 0
#define true 1
```


#### **4. catch**


> catch 和 try 语句一起用于异常处理。


#### **5. const**


1. 修饰变量，说明该变量不能被改变。


2. 修饰指针，分为指向常量的指针和指向常量。


```cpp
   const int *a;	//指针指向的变量不能修改
   int * const a;	//指针不能修改

   ```


3. 常量引用，经常用于形参类型，避免了拷贝，有避免了函数对值的修改。


4. 修饰成员函数，说明该成员函数内不能修改成员变量。


```cpp
   // 类
   class A
   {
   private:
       const int a;                // 常对象成员，只能在初始化列表赋值

   public:
       // 构造函数
       A() { };
       A(int x) : a(x) { };        // 初始化列表

       // const可用于对重载函数的区分
       int getValue();             // 普通成员函数
       int getValue() const;       // 常成员函数，不得修改类中的任何数据成员的值
   };

   void function()
   {
       // 对象
       A b;                        // 普通对象，可以调用全部成员函数
       const A a;                  // 常对象，只能调用常成员函数、更新常成员变量
       const A *p = &a;            // 常指针
       const A &q = a;             // 常引用

       // 指针
       char greeting[] = "Hello";
       char* p1 = greeting;                // 指针变量，指向字符数组变量
       const char* p2 = greeting;          // 指针变量，指向字符数组常量
       char* const p3 = greeting;          // 常指针，指向字符数组变量
       const char* const p4 = greeting;    // 常指针，指向字符数组常量
   }

   // 函数
   void function1(const int Var);           // 传递过来的参数在函数内不可变
   void function2(const char* Var);         // 参数指针所指内容为常量
   void function3(char* const Var);         // 参数指针为常指针
   void function4(const int& Var);          // 引用参数在函数内为常量

   // 函数返回值
   const int function5();      // 返回一个常数
   const int* function6();     // 返回一个指向常量的指针变量，使用：const int *p = function6();
   int* const function7();     // 返回一个指向变量的常指针，使用：int* const p = function7();
   ```


#### **6. static**


1. 修饰普通变量，修改变量的存储区域和生命周期，使变量存储在静态区，在 main 函数运行前就分配了空间，如果有初始值就用初始值初始化它，如果没有初始值系统用默认值初始化它。
2. 修饰普通函数，表明函数的作用范围，仅在定义该函数的文件内才能使用。在多人开发项目时，为了防止与他人命令函数重名，可以将函数定位为 static。
3. 修饰成员变量，修饰成员变量使所有的对象只保存一个该变量，而且不需要生成对象就可以访问该成员。
4. 修饰成员函数，修饰成员函数使得不需要生成对象就可以访问该函数，但是在 static 函数内不能访问非静态成员。


#### **7. extern "C"**


> - 被 extern 限定的函数或变量是 extern 类型的
> - 被 `extern "C"` 修饰的变量和函数是按照 C 语言方式编译和连接的
>
> `extern "C"` 的作用是让 C++ 编译器将 `extern "C"` 声明的代码当作 C 语言代码处理，可以避免 C++ 因符号修饰导致代码不能和C语言库中的符号进行链接的问题。


```cpp
#ifdef __cplusplus //如果采用C++，如下代码使用C编译器
extern "C" {
#endif


void *memset(void *, int, size_t);


#ifdef __cplusplus
}
#endif
```


#### **8. explicit**


> explicit（显式的）的作用是"禁止单参数构造函数"被用于自动型别转换，其中比较典型的例子就是容器类型。在这种类型的构造函数中你可以将初始长度作为参数传递给构造函数。

C++编译器默认有隐式类型转换，使用explicit可以禁止构造函数

```cpp
#include <iostream>

using namespace std;

class A
{
public:
    A()  {}
    A(int a) {}
    A(char a,int b = 1) {}
    A(int a, char b) {}
    A(int a, int b, int c = 2) {}
    ~A() {}
};

int main()
{
    A a;   //无参构造函数
    A b(1); //调用A(int a) {}
    A c = 1; //调用A(int a) {},C++编译器针对只有一个参数的构造函数，会隐式类型转换,通过右值类型直接调用参数类型相同（排除默认参数的构造函数也是符合的）的构造函数
    A d(1, 2); //A(int a, int b, int c = 2) {}
    A e = 'A'; // A(char a,int b = 1) {} 这里也是隐式类型转化
    return 0;

}
```

针对隐式类型转化，我们可以通过关键字explicit修饰构造函数，这样定义类变量时，只能显示的调用构造函数才能定义变量，*例如*：explicit A(char a,int b = 1)；

#### **9. register**


> register关键字请求编译器让变量直接放在寄存器里面，速度快

---
title: 'C/C++问题收集'
published: 2019-11-25
description: '类class和结构体struct区别 class和struct唯一的不同就是，class默认的访问方式是private，struct默认访问方式为public 指针作为形式参数，什么时候用一级指针？ 什么时候用二级指针?…'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C/C++问题收集

类class和结构体struct区别 class和struct唯一的不同就是，class默认的访问方式是private，struct默认访问方式为public 指针作为形式参数，什么时候用一级指针？ 什么时候用二级指针?…


## 类class和结构体struct区别
> class和struct唯一的不同就是，class默认的访问方式是private，struct默认访问方式为public



## 指针作为形式参数，什么时候用一级指针？ 什么时候用二级指针?
形参是实参的拷贝，所以在函数中修改不会修改实参的值，但是通过指针修改指针指向的内存是可以的。

```cpp

#include <iostream>
#include <stdio.h>

using namespace std;

//传入一级指针 修改指针指向的值
void func(int *p)
{
    *p = 2;

}

//传入一级指针 修改指针的值

void func1(int *p)
{
    //在函数中p是一个局部变量，修改的局部变量p，对原来的那个p没有影响
    cout<<"尝试修改p的值"<<endl;
    p = (int *)0x123345566;
}

//传入二级指针，就可以修改一级指针了
void func2(int **p)
{
    cout<<"" <<endl;
    *p = (int *)0x111313131;
}

int main()
{
    int a = 1;
    int *p = &a;
    func(p);
    func1(p);
    func2(&p);
    return 0;
}
```



## 数组的地址

**一维数组**：

```cpp
int a[] = {1,2,3,4,5};//一维数组
```

> 我经常对数组地址和元素地址混淆，虽然 a = &a 在值上是一样的，它们在层级上是不同的，&a就是整个数组的地址，a就是数组首元素的地址，a+1就是第二给元素的地址，第三、第四元素，依次加1。

- a就是a[0]的地址，a+1就是a[1]的地址
- &a是整个a[]的首地址，

一维数组元素的值和地址转换：

```cpp
a[0] == *(a+0) == *a
a[1] == *(a+1)
```

**二维数组**

```cpp
int a[][3]={1,2,3,4,5,6,7,8,9};
```

&a是整个二维数组的地址

a就是数组首元素的地址，a+1就是第二给元素的地址，第三、第四元素，依次加1。

与一维数组比较，可以将二维数组看作3个一维数组,

```cpp
a1[] = {1,2,3};
a2[] = {4,5,6};
a3[] = {7,8,9}

int a[][3] = {&a1,&a2,&a3}  //这里放的是整个数组的地址
------------
a = &a1
a + 1 = &a2
a + 2 = &a3
a[0] = a1 //首元素的地址
a[1] = a2
a[2] = a3
和一维数组一样，a是首元素的地址，移动指针可以指向后面元素
-----------
a[0][0] = *(*(a + 0) + 0)
```

二维数组元素的值和地址转换：

```cpp
#include <iostream>
#include <pthread.h>
#include <unistd.h>

using namespace std;

template <class T>
void print_point(T *p)
{
    cout<< static_cast<void *>(p) <<endl;
}


int main() {
    int a[] = {1,2,3,4,5};
    print_point(a);
    print_point(a+1);
    print_point(&a);
    print_point(&a+1);
    return 0;
}

/*
结果：
0x7fffffb6bdf0
0x7fffffb6bdf4
0x7fffffb6bdf0
0x7fffffb6be04
*/
```



```cpp
#include <iostream>
#include <pthread.h>
#include <unistd.h>
#include "common.h"

using namespace std;

template <class T>
void print_point(T *p)
{
    cout<< static_cast<void *>(p) <<endl;
}

template <class T>
void print_value(T value)
{
    cout<< value <<endl;
}

int main() {
//    int a[] = {1,2,3,4,5};
//    print_point(a);
//    print_point(a+1);
//    print_point(&a);
//    print_point(&a+1);

    int a[][3]={1,2,3,4,5,6,7,8,9};
    print_point(a);
    print_point(a[0]);

    print_point(a+1);
    print_point(*(a+1));
    print_point(a[1]);
    print_point(a[1]+1);
    print_value(*(a[1]+1));
    print_value(*(*(a+1)+1));

    print_point(a+2);
    print_point(a[2]);

    print_point(&a);
    print_point(&a+1);



    print_value(*(a[0]));
    print_value(*(a[1]));
    return 0;
}

/*
结果：
0x7fffcb97faf0
0x7fffcb97faf0
0x7fffcb97fafc
0x7fffcb97fafc
0x7fffcb97fafc
0x7fffcb97fb00
5
5
0x7fffcb97fb08
0x7fffcb97fb08
0x7fffcb97faf0
0x7fffcb97fb14
1
4
*/
```



## typename 和 class

`typename`和`class`是模板中经常使用的两个关键词 ，在模板定义的时候没有什么区别。以前用的是 class，后来 c++ 委员会加入了 typename。因为历史原因，两个是可以通用的。对有些程序员来说，在定义类模板的时候，常常使用 class 作为关键字，增加代码可读性。其它则用 typename，上面的代码大都遵循这样的标准，但是并无强制规定。但是如果二者没有差别，为什么还要加入typename呢？**c++标准委员会不会增加无用的特性**，让我们来看一个例子：

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
        T::test *a  // 声明一个指向T::test类型的指针。
        //   typename T::test * a
}
```

以上的代码没有全部写完，大家觉得编译器能够过吗？答案是不能,因为在 c++ 中，允许我们在类中定义一个类型别名，且使用的时候和类名访问类成员的方法一样。这样编译器在编译的时候就会产生二义性，它根本不知道这是一个类型还是别名，所以我们加上 typename 显式说明出来。当然如果这里没有二义性，比如`Myclass ::test * a` ,加上 typename 是会报错的。此外，在 class 的 STL 底层还有一个特性，用于保留模板参数，但是在 c++17 中已经舍弃，所以我们没有讲。

## 如何判断大小端（字节序）



| 内存地址 | 0x4000 8000（低地址） | 0x4000 8001 | 0x4000 8002 | 0x4000 8003（高地址） |
| -------- | --------------------- | ----------- | ----------- | --------------------- |
| 大端模式 | `0x12（高字节）`      | `0x34`      | `0x56`      | `0x78（低字节）`      |
| 小端模式 | `0x78（低字节）`      | `0x56`      | `0x34`      | `0x12（高字节）`      |



```cpp
#include <iostream>
#include <stdio.h>
using namespace std;

int main()
{
    int a = 0x12345678;
    char *p = (char *)&a;    //int强制类型转换为char，从低地址开始截取

    printf("0x%x\n", *p);
    if (*p == 0x12)
    {
        cout<<"This is a big endian" <<endl;
    }
    else
    {
        cout << "This ia a small endian" << endl;
    }
    return 0;
}

```

C语言中关于float、double、long double精度及数值范围
---

float double取值范围如下：

对于单精度浮点数（float）来说，有一位符号位，指数位共8位，尾数共23位。指数能够表示的指数范围为-128~127。尾数为23位。当尾数全1时再加上小数点前面的1，指数取到最大正数127（8位，正数最大127，负数最小-128）,浮点数取得正数的最大值。

+1.111111111111111111111\*2^127（1.后面23个1，由于尾数的范围1～2，其最高位总为1，故只需存取小数部分，所以小数为是23位1），约等于2\*2^127=3.4\*10^38。为3.4*10^38负数亦然。

Double的计算与此类似，double的符号位为63位，指数为62～52位，共11位。表示的范围为-1024～1023。尾数为51～0。表示的范围为+1.111111111111111111111 * 2^1023（1.后面52个1）为1.7*10^308。负数亦然。



## 如何在namespace中写代码

func.h

```cpp
//
// Created by amdeo on 2019-07-02.
//

#ifndef LINUX_C_FUNC_H
#define LINUX_C_FUNC_H

//声明一个命名空间
namespace ydb
{
    void process_test();
}


#endif //LINUX_C_FUNC_H

```

func.cpp

```cpp

//
// Created by amdeo on 2019-07-02.
//
#include "func.h"
#include <iostream>
#include <unistd.h>
#include "common.h"
#include<unistd.h>
#include<sys/types.h>

//在cpp文件中 直接使用 (::)实现函数
void ydb::process_test()
{
    pid_t pid;
    int i = 0;
    cout<<"before fork\n";
    pid = fork();
    cout<<"after fork\n";
    if (pid < 0)
    {
        cout<< "fork failed" <<endl;
    }
    else if(pid == 0)   //子进程
    {
        while (i<10) {
            cout << "I am child,i = " << i << endl;
            i += 1;
        }
        cout << "child process is " << getpid() << endl;
    }
    else{
        //父进程
        //sleep(10);
        while (i<10){
            cout<<"I am parent,i = "<<i<<endl;
            i += 2;
        }

        cout<< "parent process is " <<getpid()<<endl;
    }
    cout<<"exit process\n";
}
```

main.cpp

```cpp
#include "common.h"
#include "func.h"

int main() {
      //在main函数中直接使用（ydb::）调用
    ydb::process_test();
    return 0;
}
```

## extern和头文件

**我们引用外部的定义的变量或者函数可以使用头文件，为什么还需要extern呢？**

最先开始的C语言没有头文件，使用外部变量或者函数都是用先extern声明外部的变量和函数，之后在源文件中就可以在使用声明的变量和函数。

后来为了方便阅读和其他原因，增加头文件用来专门写声明。

如果想要引用其他源文件的全局变量或者函数。

a.c

```cpp
int a = 1;    //全局变量
void func()    //全局函数
{

}
```

b.c

```cpp
extern int a;//声明下a
extern void func();
int main()
{
    cout<< a <<endl;
    func();
    return 0;
}
```

##  获取变量的类型

 头文件： `include <typeinfo> `

```cpp
#include <typeinfo>
#include <stdio.h>
using namespace std;
int main()
{
    float i = 100;
    printf("%s\n", typeid(i).name());
    //输出结果为float
    return 0;
}
 ```

## C语言中scanf

> 从键盘获取用户的输入

如何使用scanf获取键盘输入？

```cpp
#include <stdio.h>

int main()
{
    int a;
    printf("请输入一个数字：");
    scanf("%d", &a);
    printf("输入的数字为结果：%d\n", a);
    char b[10];
    printf("请输入一个字符串：");
    scanf("%s", &b);
    printf("输入的字符串为: %s\n", b);
    return 0;
}
```

通过测试发现scanf，输入字符串时，遇到**空格**，就认为字符串输入结束。

查了资料发现：

① 遇空格、“回车”、“跳格”键。

② 遇宽度结束。
③ 遇非法输入。

怎么解决输入空字符

```cpp
void scanfV2()
{
    char str[80];
    scanf("%[^\n]",str); //读到'\n'结束读取
    printf("%s",str);
}
```

## C语言中计算代码执行时间

```cpp
#include <iostream>
#include <time.h>

using namespace std;

int main(int argc, char const *argv[])
{
    clock_t start, end;
    start = clock();
    //test
    for (size_t i = 0; i < 1000000000; i++)
    {
        i++;
    }

    end = clock();
    double finish = (double)(end - start) / CLOCKS_PER_SEC;
    cout << finish << endl;

    return 0;
}
```

如果代码执行的时间太小，例如输出的结果为0，此时可以对测试的代码做循环n，最后使用总时间/n，求平均值也行。

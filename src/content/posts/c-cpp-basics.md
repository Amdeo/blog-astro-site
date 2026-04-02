---
title: 'C++ 基础入门'
published: 2019-11-25
description: '从编译、预处理、条件编译和基础语法出发，梳理 C++ 入门阶段最常见也最容易混淆的核心知识。'
image: '/src/assets/blog-placeholder-5.jpg'
tags: ['C/C++', '编程语言']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++ 基础入门

这篇文章从语言翻译、编译流程、预处理和宏等基础概念出发，梳理 C++ 入门阶段最先遇到的一批核心知识，适合用来快速建立整体认知。


## 语言翻译

计算器可以识别**机器语言**，人往往使用编程语言来编程，这就涉及到编程语言源代码到机器语言的转化，通常，翻译器分为两类：解释器和编译器。

### 解释器

解释器将源代码转化成机器语言并立即执行，它一般是边转化边执行，遇到之前重复的内容还需要重新翻译和执行，可想而知这个效率上并不好，例如python解释器，将源代码转化为一种中间语言，然后由执行速度更快的解释器来执行。

### 编译器

编译器直接将源代码转化成汇编语言或机器指令。编译器生成的程序往往只需要较少的运行空间，并且执行速度更快。更重要的是例如C语言可以分别编译各段程序，最后使用连接器将各段程序连接成一个完成可执行程序，这个成为`分段编译`。

### C语言编译

gcc的编译流程分为四个步骤：

- 预处理
- 编译
- 汇编
- 连接

#### 预处理

>  预处理程序是一个简单的程序，它用程序员定义好的代码替代需要预处理的代码，预处理可以节省输入，增加代码的可读性。
>
>  也可以这么理解，预处理基本上针对“#“ 修饰的代码进行处理。

```shell
gcc –E hello.c –o hello.i
```

选项`-o`是指目标文件，`.i`文件为已经预处理后的C原始代码。

`#`的使用


| 含义     | 描述                                         |
| -------- | -------------------------------------------- |
| #define  | 定义一个预处理宏 或者定义一个常量            |
| #undef   | 取消宏的定义                                 |
| #if      | 预处理中的条件命令，相当于C中的if语句        |
| #ifdef   | 判断一个宏是否被定义，若定义，执行后面的语句 |
| #ifndef  | 判断一个宏如果没有被定义                     |
| #elif    | 相当于C中eles-if                             |
| #else    | 相当于C中的else                              |
| #endif   | 与\#if, #ifdef, #ifndef配套使用              |
| #include | 引用头文件                                   |

##### 条件编译

> 有条件的去编译，经典应用，头文件、跨平台编译

1

```cpp
#if defined(或者ifdef)
//代码
#endif
```

2

```cpp
#if !defined(或者ifndef)
//代码
#endif
```

3

```cpp
#if ()
//代码段
#elif ()
//代码段
#else
//代码段
#endif
```

**应用**一：防止头文件重复引用

假如有一个头文件 hello.h（宏我们一般大写）

```cpp
#ifndef __HELLO_H__ //(或者写成 #if !define __HELLO_H__) 如果这个宏没有定义,往下执行，如果宏已经被定义了，下面内容不会被引用
#define __HELLO_H__ //定义这个宏，只有第一次引用头文件会执行到这里
//声明、定义语句

#endif
```

**应用二**：使用DEBUG进行调试

```cpp
#include <iostream>
#include <stdio.h>
using namespace std;
//#define DEBUG 如果想要编译预定义宏DEBUG内的代码，需要取消注释。 或者使用#undef取消宏定义也是一样的

int main()
{
	int a = 1;
#ifdef DEBUG
	printf("a = %d\n", a);
#endif // DEBUG

	printf("hello world\n");
	return 0;
}
```

##### 宏函数

带参数的宏。利用宏可以提高代码的运行效率，子程序的调用需要压栈出栈，这一过程会过于频繁会消耗大量的cpu运算资源。

**建议**：一些代码量小但运行频繁的代码可以采用带参数宏来实现会提高代码的运行效率，例如：参数校验、获取长度等等经常需要用到的。C++中也可以inline（内联函数），它们的效率是一样的。

**缺点**：

1. 宏不像函数，不会检查入参和返回值，相对不安全

2. 不容易调试
3. 大量的引用宏会使代码膨胀

**宏的特殊符号**

> #和##是两个特殊符号

1. #表示将一个宏参数变成一个字符串
2. ##表示把两个字符串粘在一起

应用场景：（使用一个宏创建一个一种速记方式打印变量字符串化的表达式）

```cpp
#include <stdio.h>
#include <iostream>
using namespace std;

#ifdef DEBUG

#define P(A) cout << #A <<": " << A << endl;

#else

#define P(A)

#endif // 这里可以通过是否存在宏定义DEBUG，使得P(A) 表达式是否起作用

int main()
{
	int a = 1;
	P(a);
	return 0;
}
```

##### 预定义宏

例举我们常用的几个：

- `__LINE__`
- `__FILE__`
- `__DATE__`
- `__TIME__`
-  `__STDC__`

```cpp
#include <stdio.h>
int main()
{
	printf("该输出行在源程序中的位置：%d\n", __LINE__);
	printf("该程序的文件名为：%s\n", __FILE__);
	printf("当前日期为：%s\n", __DATE__);
	printf("当前时间为：%s\n", __TIME__);
	return 0;
}
```

assert宏

头文件：assert.h

```cpp
assert(布尔值)
```

```cpp
#include <iostream>
#include <assert.h>

int main()
{
    assert(1 == 2);
    return 0;
}
```

#### 编译

```shell
gcc -S hello.i -o hello.s
# -S选项进行编译而不进行汇编
```

先检查语法处理，在检查无误之后，将代码转化为汇编语言。

#### 汇编

```shell
gcc -c hello.s -o hello.o
# -c选项将.s文件转化为二进制文件
```

汇编阶段将`.s` 文件转化为`.o`文件（又称为目标文件）的二进制文件。

#### 连接

```shell
gcc hello.o -o hello
```

> 编译是针对一个源文件的，有多少个源文件就需要编译多少次，就会生成多少个目标文件。

链接阶段就是代码连接库文件。

库文件一般分为静态库和动态库，静态库是指将编译连接时，把库文件的代码全部加入到可执行文件中，因此生成的文件比较大，但在运行时就不需要库文件了，后缀一般为`.a`，动态库是在程序执行过程中链接加载库。这样可以节省系统的开销。动态库一般的后缀名为`.so`。

#### 连接器如何查找库

当C要对函数和变量进行外部引用时，根据引用情况，如果为遇到过这个函数或者变量的定义，连接器会将它的标识符加到`未解析第引用`列表中。如果连接器遇到过函数或者变量定义，就标记已解决第引用，最后总的统计下有未解析的引用，就说明函数或者变量没有定义。

#### 包含头文件的方式

```cpp
#include <stdio.h>
```

用尖括号来指定文件时，预处理器是去特定的路径去找头文件，这个路径一般是环境中或编译器中指定的某个路径（不同场景下的路径肯定有所不同）。

```cpp
#include "stdio.h"
```

预处理器先从当前的目录去寻找头文件，如果没有找到就是用尖括号同样的方式去寻找。

## 变量

C/C++语言是强类型语言，变量需要先定义再使用，下面是C语言的一些数据类型。

数据类型


基本数据类型：int、float 、double、char


构造数据类型：struct、union、enum


| 数据类型       | 字节 | 取值范围                                     |
| -------------- | ---- | -------------------------------------------- |
| unsigned char  | 1    | 0 ~ 2^8 - 1                                  |
| char           | 1    | - 2^7 ~ 2^7 -1                               |
| unsigned short | 2    | 0 ~ 2^16 -1                                  |
| short          | 2    | -2^15 ~ 2^15 -1                              |
| unsigned int   | 4    | 0 ~ 2^32 - 1                                 |
| int            | 4    | - 2^31 ~ 2^31 -1                             |
| unsigned long  | 8    | 0 ~ 2^64 - 1                                 |
| long           | 8    | - 2^63 ~ 2^63 - 1                            |
| float          | 4    | -3.4 *10^38～+3.4 *10^38 (有效数字 6 -7)     |
| double         | 8    | -1.7 *10^-308~1.7 *10^308(有效数字 15 -16)   |
| long double    | 12   | -1.2 *10^-4932~1.2 *10^4932(有效数字 18 -19) |

| 说  明   | 字符型 | 短整型 | 整型 | 长整型 | 单精度浮点型 | 双精度浮点型 |
| -------- | ------ | ------ | ---- | ------ | ------------ | ------------ |
| 数据类型 | char   | short  | int  | long   | float        | double       |
| 长  度   | 1      | 2      | 4    | 4      | 4            | 8            |


#### 小数在内存中怎么存储的

小数是用float、double类型的存放小数的。

定点数

假设我们用4个字节（32位）来存储无符号的定点数，并且约定，前16位表示整数部分，后16位表示小数部分

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1134205554-0.png)

整数部分始终占用16位（不足16位前置补0），小数部分也始终占用16位（不足16位后置补0）。例如，在内存中存储了 10101111  00110001  01011100  11000011，那么对应的小数就是 10101111 00110001 **.** 01011100 11000011，非常直观。


### 定义

数据类型 + 变量名 = 定义变量

```c
int a;
char b;
float c;
```

### 声明和定义的区别？

在学习C语言时，经常会被提及变量声明和定义的区别。

定义包含变量的声明，在编译原理上来说，声明是仅仅告诉编译器，有个变量在别的地方会被定义，但是这个编译器不会给它分配任何内存，定义就是分配内存。

> 声明可以有多个，定义只能有一个。

在我们C语言编程中，定义变量就不必说，声明变量往往不知道在哪使用。

a.h

```c
int a = 1;  //定义一个变量
```

a.c

```c
#include <stdio.h>
#include "a.h"
extern int a; //告诉编译器a是定义在其他文件中的，在这里进行声明而已

int main()
{
     printf("a = %d",a)；
}
```

### 使用typedef为变量定义别名

> typedef表示“类型定义”，但使用别名来描述可能更精确

作用：

1. 对于复杂的类型，我们可以使用typedef来少敲几个键
2. 有些类型名在不同平台上可能不同，可以使用typedef将需要使用类型名定义别名。

```cpp
typedef 原类型名 别名
```

```cpp
#include <iostream>
#include <typeinfo>
typedef int Int4

using namespace std;

int main()
{
	Int4 a = 1;
	cout<< typeid(a).name()  <<endl;
	return 0;
}
/*
output: int
*/
```

函数指针类型

```cpp
typedef void (*callback)(int x);
```

### 赋值

变量定义，不赋值

```c
int a; //定义一个整型变量，不赋值
int a,b; //定义两个整型变量，不赋值
a = 1; //给变量赋值
b = 3;
```

变量定义，并且赋值

```cpp
int a = 1;
int a = 3;b = 4; //同时定义两个int变量
```

### 转义字符

转义字符以`\`或者`\x`开头，以`\`开头表示后跟**八进制**形式的编码值，以`\x`开头表示后跟**十六进制**形式的编码值。对于转义字符来说，只能使用八进制或者十六进制。

```cpp
#include <stdio.h>

int main()
{

    char a = 65;
    printf("%c\n",a); //十进制
    puts("\101"); //八进制
    puts("\x41"); //十六进制
    puts("\x68\164\164\x70://c.biancheng.\x6e\145\x74");
    return 0;
}
```

output

```cpp
A
A
A
http://c.biancheng.net
```


### 字符串

##### 输出字符串的拼接

如果两个加引号第字符数组邻接，并且他们之间没有标点，编译器会将两个字符串，合并成一个字符串。

```cpp
int main()
{
	cout << "111"
		"222"
		"333" << endl;
	return 0;
}
```

### 自定义数据类型

#### struct

将一些其他数据类型组合成新的数据类型,称为结构体。

结构体使用

**方式一**：先创建一个结构体，在定义变量。

```cpp
//创建一个结构体，
struct student{
	char name[10];	//姓名
	int age;	//年龄
	int height;	//身高
};

//定义结构体变量，student就是标识符
person stu1; //现在大多数编译器支持这种方式进行定义变量
struct person stu2;
//上面这两种方式一样的
```

**方式二**：创建结构体的同时定义变量。

```cpp
//创建一个结构体
struct student{
	char name[10];	//姓名
	int age;	//年龄
	int height;	//身高
} stu1,stu2;
```

**方式三**：创建结构体的同时定义变量，但是忽略标识符。

由于结构体没有标识符，说明这个结构体`只能`在创建结构体同时创建变量。

```cpp
struct {
	char name[10];	//姓名
	int age;	//年龄
	int height;	//身高
} stu1,stu2;
```

**方式四**：使用typedef将结构体取别名。

```cpp
typedef struct student{
	char name[10];	//姓名
	int age;	//年龄
	int height;	//身高
}STUDENGT;

STUDENGT stu1;
```

#### union

在结构体中，不同的成员在结构体中都具有单独的内存位置，共用体成员则共有一个内存位置，也就是说，所有成员都是从相同的内存地址开始，同一个时刻只能有一个成员允许含有一个值，称为共用体或者联合体。

```cpp
union Data
{
	int i;
	double x;
	char str[16];
}
//从结构上来看，共用体和结构体是一样的
/*
这个类型可以存储一个整数、一个浮点数、字符串。
*/
union Data var,myData[100]; //定义一个共用体变量和变量数组。

var.i = 10;
var.x = 1.1;

strcpy(var.str,"yuandongbin")
```

#### enum

枚举

```cpp
#include <iostream>
#include <stdio.h>

using namespace std;

int main()
{
	enum week { Sun, Mon, Tue, Wed, Thu, Fri, Sat };

	cout << Sun << endl; //0
	cout << Mon << endl; //1
	cout << Tue << endl; //100
	cout << Wed << endl; //101
	cout << Thu << endl; //102
	cout << Fri << endl; //103
	cout << Sat << endl; //104

    //在编译器中，默认会将第一个枚举量赋值0，下一给位1，依次往下加1
    //每个枚举值的枚举量不能重复定义
    //不定义变量直接使用枚举值
	return 0;
}
```

```cpp
#include <iostream>
#include <stdio.h>

using namespace std;

int main()
{
	enum week { Sun, Mon, Tue = 100, Wed, Thu, Fri, Sat };

	cout << Sun << endl; //0
	cout << Mon << endl; //1
	cout << Tue << endl; //2
	cout << Wed << endl; //3
	cout << Thu << endl; //4
	cout << Fri << endl; //5
	cout << Sat << endl; //6

    //在编译器中，默认会将第一个枚举量赋值0，下一给位1，依次往下加1,如果为其中一枚举量赋值，之后的枚举量的在赋值的枚举量上依次加1。
    //不定义变量直接使用枚举值
	return 0;
}
```

#### struct、union 、enum的大小

```cpp

设置字节对齐
#pragma pack(4)  //设置4字节对齐 等价于#pragma pack(push,2)

#pragma pack()   //取消自定义字节对齐方式  等价于#pragma pack(pop)
```


```cpp
//4字节对齐
struct Mystruct
{
    char a       //1 + 3 不够4字节，补齐到4字节
    int b;       //4
    long c;      //4
    int d[10];    //40
}e;
/*
-------
sizeof(e)输出:52
-------
*/
```


```cpp
union
{
    int a;       //4
    long b;      //4
    int c[10];    //40
}e;
/*
-------
sizeof(e)输出:40
-------
*/
```


```cpp
enum
{
    a = 1;
    b;
    c;
}d;
/*
-------
sizeof(d)输出:4
-------
*/
```

### 变量的存储

- 存储中的每个字节拥有唯一的内存

- 字节是最小第可寻址内存单元

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1129246-20190901103222306-961055256-1581940910717.png)

 栈区（stack）： 由编译器自动分配释放 ，存放函数的参数值，局部变量的值等。

 堆区（heap） ： 一般由程序员分配释放， 若程序员不释放，在程序结束时，操作系统回收。

 BSS段（Block Started by Symbol）：.bss段被用来存放那些没有初始化或者初始化为0的全局变量。bss段只占运行时的内存空间而不占文件空间。在程序运行的整个周期内，.bss段的数据一直存在 。

 全局区（静态区）：全局变量和静态变量的存储是放在一块的， 未初始化的全局变量和未初始化的静态变量在相邻的另一块区域。 在程序序结束后由系统释放。

 DATA区（初始化的数据段）：为数据分配空间，数据保存在目标文件中

 文字（只读）常量区 ：常量字符串就是放在这里的。 程序结束后由系统释放

 代码段（TXT）：存放函数体的二进制代码


### 变量生命周期

#### 全局变量

在所有函数体之外定义的变量，与程序的生命周期一样。

#### 局部变量

函数体内定义的变量，离开函数体之外就无效。

#### 作用域

每个大括号就是一个作用域，在大括号内定义的变量，只能在括号内使用，离开大括号就是失效了，多层括号嵌套时，作用域时自上到下作用的，上层定义变量下层的作用域内都可以使用，反正不行，多层括号包含内层。


在if和for的代码块中定义的变量，变量的生命周期只有在if和for的范围中。


```cpp
//if的生命周期
#include <iostream>
using  namespace std;
int main()
{
   if(1)
   {
       int a = 1;
       cout<< a <<endl;
   }
   cout<< a <<endl; //编译报错，变量未定义
   return 0;
}
```

### 变量的修饰

#### static

有时候我们想要局部变量的生命周期和整个程序一样，可以使用static进行修饰。

从这个解释来看不是和全局变量一样了吗，那我们为什么不用全局变量？

1\. static修饰局部变量的生命周期虽然变长了，但是作用域还是没有变，不能在作用域之外使用。

```cpp
#include <iostream>

using namespace std;

void func(int x) {
    int total = 0;
    total = total + x;
    cout << "func::total= " << total << endl;
}

void func1(int x) {
    static int total = 0;
    total = total + x;
    cout << "func1::total= " << total << endl;
}

int main() {
    func(1);
    func(1);
    func1(1);
    func1(1);

    return 0;
}
/*
func::total= 1
func::total= 1  局部变量在离开作用域就自动释放了,每次调用函数时变量定义---变量释放
func1::total= 1
func1::total= 2	被static修饰的局部变量生命周期和程序一样，第一次调用函数时定义变量后，再调用函数时不会重新定义变量了，因为之前定义的变量没有被释放，但是只能在定义的作用域中使用。
*/
```

2\. static如果修饰全局变量，那这个全局变量的作用域是整个文件，离开文件不能被外部的文件进行调用。

```cpp
//common.h
#include <iostream>

#ifndef TEST_COMMON_H
#define TEST_COMMON_H

void func();

#endif //TEST_COMMON_H
```

```cpp
//common.cpp
static int a = 1;

void func()
{
    std::cout <<"全局变量a = "  << a << std::endl;
}
```

```cpp
#include <iostream>
#include "common.h"
extern int a;
int main() {
    //std::cout <<"全局变量a = "  << a << std::endl;
    func();
    return 0;
}
```

直接在main函数中调用在common中static修饰的全局变量会`编译失败`，但是在变量定义所在的文件中是可以使用的。

3\. static修饰类成员变量，由于成员变量的生命周期和整个程序一样，多个实例共用一个成员变量。

```cpp
#include <iostream>
#include "common.h"

class myclass
{
public:
    myclass(int a)
    {
        this->a = a;
    }
    int a;
    static int b;
};
int myclass::b = 1;

int main() {
    myclass x(1);
    myclass y(2);
    std::cout << "x.b = " << x.b << " 地址为：" << (long)(&(x.b)) << std::endl;
    std::cout <<"y.b = " << y.b << " 地址为：" << (long)(&(y.b)) <<std::endl;
    return 0;
}
/*
x.b = 1 地址为：4450234600
y.b = 1 地址为：4450234600
*/
```

4\. static修饰成员函数，只能操作static修饰静态成员变量，其他的成员变量不能操作。

```cpp
class myclass
{
public:
    myclass(int a)
    {
        this->a = a;
    }
    static void func()
    {
        std::cout << a << std::endl; //编译失败
        std::cout << b << std::endl;
    }
    int a;
    static int b;
};
```

#### const

被const修饰的变量不能被修改。

(1) 定义const变量

> 定义时必须初始化

```cpp
const int a=100;
const char* b = "xxx";
```

(2) const常量和#define宏定义常量的区别

const常量具有类型，编译器可以进行安全检查，#define只是简单的字符串的替换，不能进行安全检查

```cpp
const int a = 10;

#define a 10
```

(3) const修饰函数入参

```cpp
void fun(const int a);  //函数参数不会被修改
```

(4) const修饰的全局变量

> 非const修饰的变量默认为extern，要使const变量能够在其他文件中访问，必须在文件中显示地指定它为extern

a.h

```cpp
extern int a = 100;
```

main.cpp

```cpp
cout << a << endl;
```

(5) const 修饰指针

```cpp
const int * p; // const修饰*p，即修饰p指向的内存不能修改
int * const p; // const修饰p，即修饰的指针变量p不能修改
```

(6) const 修改类成员变量

被const修饰的变量只能，定义时初始化，const修饰的成员变量，也是同样的不能通过构造函数赋值，只能通过`列表初始化`

```cpp
#include <iostream>

using namespace std;

class demo
{
public:
    demo(int a,int b): b(b) //成员变量b只能这样赋值
    {
        this->a = a;
	}

    int a;
    const int b;
};
int main()
{
    demo A(1,2);
    cout << A.a << endl;
    cout << A.b << endl;
    return 0;
}
```


const修饰类

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


#### volatile

> 告诉编译器不知道在何时会改变，请编译器不需要因为优化而省略，且要求每次直接读取。

 精确地说就是，编译器在用到这个变量时必须每次都小心地重新读取这个变量的值，而不是使用保存在[寄存器](https://baike.baidu.com/item/寄存器)里的备份。


### 运算符和数据转换

#### 数学运算符

包括：加（+）、减（-）、乘（*）、除（/）和取模（%）

#### 关系运算符

包括：小于（<）、小于等于（<=）、大于（>）、大于等于（>=）、等于（==）、不等于（!=）

#### 逻辑运算符

包括：与（&&）、或（||）和非（!）

#### 移位位运算符

对位进行操作，位左移(<<)和右移(>>)

#### 一元运算符

++、--、&、*、-> 这些对一个变量进行操作的

#### 三元运算符

```cpp
a > b ? a:b
```

一个if-else的简写，可以看做一个语法糖。

#### sizeof

sizeof单独作为一个运算符，它给我们提供有关数据项目所分配的内存大小。


数据多输入和输出


- 用putchar函数输出一个字符
- 用getchar函数输入一个字符


![wm](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/wm.jpeg)


数据位数越长，优先级越高，因为位数长可以表示位数小，反之需要丢失精度。

## 常量

C语言中使用**#define**定义

```c
#define pi 3.14
```

C++中使用const进行定义常量

```cpp
const int a = 1
```


## 判断

### if

条件控制

```cpp
if (condition)
{
    //do something
}
```

- condition为布尔值，为真才可以执行do something

```cpp
if (condition)
{
	//do something1
}
else
{
	//do something2
}
```

- condition为真，执行do something1,否则执行do something2

```cpp
if (condition)
{
    //do something1
}
else if (condition)
{
    //do something2
}
else
{
    //do something3
}
```

- 哪个condition为真，就执行哪个大括号代码，else内容是兜底。

### switch

```cpp
switch(a) ｛
	case b : to do; break;
	case c : to do; break;
	case d : to do; break;
	case e : to do; break;
	default: do something
｝
```

传入a匹配上`b` `c` `d` `e`其中一个，就执行后面代码，再执行break，之后的代码不会执行了。

如果没有break，匹配上那个case之后所有代码都会被执行。

```cpp
int main()
{
	int a = 1;

	switch (a)
	{
	case 0:
		cout<< "case 0" <<endl;
	case 1:
		cout << "case 1" << endl;
	case 2:
		cout << "case 2" << endl;
	case 3:
		cout << "case 3" << endl;
	default:
		break;
	}
	return 0;
}

/*
case 1
case 2
case 3
*/
```

下面这种场景a = 0或者1，都输出"case 1"

```cpp
int main()
{
	int a = 1;

	switch (a)
	{
	case 0:
	case 1:
		cout << "case 1" << endl;
        break;
	case 2:
		cout << "case 2" << endl;
        break;
	case 3:
		cout << "case 3" << endl;
        break;
	default:
		break;
	}
	return 0;
}
```


## 循环

### for循环

```cpp
for(init; condition; increment)
{
    //do something
}
```

- init，循环之前的操作
- condition，条件表达式
- increment，每次循环之后执行

#### for的无限循环

```cpp
for(;;)
{
	//do something
}
```

### while循环

```cpp
while(condition)
{
	//do something
}
```

while的无限循环

```cpp
while(true)
{
	//do something
}
```

### do while循环

```cpp
do
{
	//do something
}
while(condition)
```

### 嵌套循环

for、while、do...while之间可以相互嵌套。

### 循环控制

#### continue

终止本次循环，continue之后的内容不会执行,继续执行下次循环。

```cpp
#include <stdio.h>
int main()
{
	int a[5] = {0,1,2,3,4};
    for(int i;i< 5;i++)
    {
        if(a[i] == 1)
        {
            continue;
        }
        printf("%d ",a[0]);
    }
	return 0;
}
/*
output:
0 2 3 4
*/
```

#### break

终止这层循环，之后循环不会执行。

```cpp
#include <stdio.h>
int main()
{
    int a[5] = {0,1,2,3,4};

    for(int i;i< 5;i++)
    {
        if(a[i] == 1)
        {
            break;
        }
        printf("%d ",a[0]);
    }
	return 0;
}
/*
output:
0
*/
```

#### goto

```cpp
goto label;
..
..
label: statement;
```

代码执行到goto，会自动跳转到label继续执行。

```cpp
#include <stdio.h>
int main()
{
    int a[5] = {0,1,2,3,4};

    for(int i;i< 5;i++)
    {
       if(a[i] == 1)
       {
           goto A;
       }
       printf("%d ",a[0]);
    }
    A：
    return 0;
}
```

## 函数

>  函数就是一段可以重复使用的代码

**函数定义**

```cpp
int func(int a,int b)
返回值 函数名(函数参数)
```

### 静态函数

函数被static修饰，只能在当前源文件中使用。

### 可变的参数列表

使用可变参数作为列表，需要提供函数**参数个数**

使用步骤：

- va_list vaList;    定义指向参数指针
- va_start(vaList,**函数第一个参数**);   初始化指针，使指针指向第一个可变参数的地址
- va_arg(vaList,**可变参数类型**)    返回可变参数的值，使指针指向下个可变参参数
- va_end(vaList);  清空va_list可变参数列表

可变参数函数要获取可变参数，必须通过一个va_list类型(有被称为`参数指针`)。

```cpp
#include <iostream>
#include <stdarg.h>

using namespace std;

void func(int num,...)
{
    va_list vaList;	//定义一个参数指针

    va_start(vaList,num);    //获取第一个参数，第一个参数的值，确定后面参数的个数
    for (int i = 0; i < num; ++i) {
        cout << va_arg(vaList,int) << endl; //这里把vaList往后跳过4个字节（sizeof(int)大小）指向下一个参数，返回的是当前参数（而非下
一个参数）
    }

    va_end(vaList); //当不再需要使用参数指针时，必须调用宏 va_end。如果想使用宏 va_start 或者宏 va_copy 来重新初始化一个之前用过的参数指针，也必须先调用宏 va_end。
}

int main() {
    func(3,3,4,5);
    return 0;
}
/*
3
4
5
*/
```

### 应用：printf函数实现

例如，printf就是明显地可变的参数函数，我们下面实现下printf函数的功能。

```cpp
#include <iostream>
#include <string.h>
#include <vector>

using namespace std;

void printf_y(const char *s,...)
{
    va_list vaList;

    va_start(vaList,s);    //获取第一个参数
    vector<char> vect_type;
    //获取字符串可变参数的类型
    for (int i = 0; i < strlen(s) - 1; ++i) {
        if(s[i] == '%')
        {
            vect_type.push_back(s[++i]);
        }
    }

    for (int l = 0; l < vect_type.size(); ++l) {
        switch (vect_type[l]){
            case 'd':
                cout << va_arg(vaList, int) << endl;
                break;
            case 's':
                cout << va_arg(vaList, char *) << endl;
                break;
        }
    }
    va_end(vaList);
}

int main() {
    printf_y("%d %s",1,"yuandongbin");
    return 0;
}
```

### 函数指针

```cpp
#include <iostream>
using namespace std;
int (*pFun)(int); //定义一个函数指针

int glFun(int a) { return a; }

void main()
{
    pFun = glFun; //想要给函数指针赋值，需要函数原型和函数指针原型一直（函数参数和返回值）
    int i = (*pFun)(2);
    cout << i << endl;
}
```

定义函数指针类型

```cpp
#include <iostream>
using namespace std;
typedef void (*callback)(int x);            // 定义一个函数指针类型
void myFunc1(int x)                         // myFunc1 的声明要与callback一样
{
    cout << "This is myFunc1 " << x << endl;
}
void myFunc2(int x)
{
    cout << "This is myFunc2 " << x << endl;
}
void callMyFunc(callback cb, int x)　　　　　 // 把函数指针类型当做调用函数参数类型
{
    cb(x);
}
int main()
{
    callMyFunc(myFunc1, 1);
    callMyFunc(myFunc2, 2);
    return 0;
}
```

### 函数重载

C++允许在同一范围内声明几个功能类似的同名函数，但这些函数的形式参数（参数个数、类型和顺序）必须不同。


## 指针

(1) 定义指针

```cpp
int * p;
```

(2) 使用指针

```cpp
*p = 10;
```


## 引用

> 可以看作一个被const修饰的指针，只能修改变量的指针，是一个语法糖。


## 转换运算符

用于明确的定义的变换，例如：把int提升到long或float不会有问题，因为后者总是能容纳一个int所包含的值。

如果将long或float转换成int，这里可能会丢失数据，因为一个int和long或float不是一样的“宽”的，它不能容纳同样大小的数字。

### static_cast

> 相当于同族之间的转换

```cpp
#include <iostream>
#include <typeinfo>
#include <stdio.h>

using namespace std;

int main() {
    int i = 100;
    cout << typeid(i).name() <<endl;
    float f;
    long l;
    f = static_cast<float>(i);
    l = static_cast<float>(i);
    cout << typeid(l).name() <<endl;
    cout << typeid(f).name() <<endl;

    return 0;
}
```

使用static_cast获取变量的地址

```cpp
#include <iostream>
#include <typeinfo>
#include <stdio.h>

using namespace std;

int main() {
    int i = 100;
    cout << static_cast<void *>(&i) <<endl;
    return 0;
}
// output: 0x7fffc33a7748
```


### const_cast

> 解开权限

如果从const转换为非const或volatile转换为非volatile，可以使用const_cast。

```cpp
#include <iostream>
#include <stdio.h>
#include <typeinfo>

using namespace std;

int main()
{
	const int i = 0;

	int* j = (int*)&i;
	j = const_cast<int*>(&i);
	*j = 1; //通过指针可以修改内容
	cout << *j << endl;
	cout << typeid(j).name() << endl;
}
```


### reinterpret_cast

> 无视种族隔离，使不同种族的转换，随意在不同类型之间使用，会导致程序的破坏。

```cpp
#include <iostream>
using namespace std;
class A
{
public:
    int i;
    int j;
    A(int n):i(n),j(n) { }
};
int main()
{
    A a(100);
    int &r = reinterpret_cast<int&>(a); //强行让 r 引用 a
    r = 200;  //把 a.i 变成了 200
    cout << a.i << "," << a.j << endl;  // 输出 200,100
    int n = 300;
    A *pa = reinterpret_cast<A*> ( & n); //强行让 pa 指向 n
    pa->i = 400;  // n 变成 400
    pa->j = 500;  //此条语句不安全，很可能导致程序崩溃
    cout << n << endl;  // 输出 400
    long long la = 0x12345678abcdLL;
    pa = reinterpret_cast<A*>(la); //la太长，只取低32位0x5678abcd拷贝给pa
    unsigned int u = reinterpret_cast<unsigned int>(pa);//pa逐个比特拷贝到u
    cout << hex << u << endl;  //输出 5678abcd
    typedef void (* PF1) (int);
    typedef int (* PF2) (int,char *);
    PF1 pf1;  PF2 pf2;
    pf2 = reinterpret_cast<PF2>(pf1); //两个不同类型的函数指针之间可以互相转换
}
```

### dynamic_cast

> 父类指针或者引用向派生类的指针或引用转换，而且能够检查转换的安全性。

```cpp
#include <iostream>
#include <string>
using namespace std;
class Base
{  //有虚函数，因此是多态基类
public:
    virtual ~Base() {}
};

class Derived : public Base { };
int main()
{
    Base b;
    Derived d;
    Derived* pd;
    pd = reinterpret_cast <Derived*> (&b);
    if (pd == NULL)
        //此处pd不会为 NULL。reinterpret_cast不检查安全性，总是进行转换
        cout << "unsafe reinterpret_cast" << endl; //不会执行
    pd = dynamic_cast <Derived*> (&b);
    if (pd == NULL)  //结果会是NULL，因为 &b 不指向派生类对象，此转换不安全
        cout << "unsafe dynamic_cast1" << endl;  //会执行
    pd = dynamic_cast <Derived*> (&d);  //安全的转换
    if (pd == NULL)  //此处 pd 不会为 NULL
        cout << "unsafe dynamic_cast2" << endl;  //不会执行
    return 0;
}
```

## 类型转换

### atoi

将字符串转换为int

```cpp
#include <stdio.h>
#include <stdlib.h>

int main()
{
	int i;
	char szInput[256];
	printf("Enter a number: ");
	fgets(szInput, 256, stdin);
	i = atoi(szInput);
	printf("The value entered is %d. The double is %d.\n", i, i * 2);
	return 0;
}
```

### atol

将字符串转换为long

### atof

将字符串转换为float

### itoa

将int转换为字符串

### ftoa

将float转换为字符串

## 面向对象

**什么是对象？**

在C中，struct是数据的凝聚，它将数据捆绑在一起，使得各种数据成为一个整体，它的存在可以使得编程更加方便，没有其他作用，我们可以其他地方编写函数进行操作这些结构，然而将函数放进struct中，结构就变成新的概念（就是class），它既能描述属性，又能描述行为，这就形成了对象的概念，**可以把数据比作肉体，函数就是灵魂。**

如何建立对象

- 类的名字：名字需要体现类行为的本质
- 类的职责：这个类应该做什么
- 类的协同：它和其他类如何交互

注意：class的成员默认为private，struct默认为public，其他方面都是一样的。

#### 封装

> 将数据连同函数捆绑在一起的能力可以用于创建新的数据类型，常常又被称为封装。

```cpp
class human
{
    void run();
    void dance();
private:
    int age;
    int height;
    int weight;
}
```

#### 隐藏实现

public: 所有的人都可以访问

protect: 类的创建者和类的内部成员、派生类可以访问

private: 类的创建者和类的内部成员

#### 友元

> 友元打破类的权限设定。

 类的友元函数是定义在类外部，但有权访问类的所有私有（private）成员和保护（protected）成员。

```cpp
class Box
{
   double width;
public:
   double length;
   friend void printWidth( Box box );
   void setWidth( double wid );
};
```

使用要点

-  要访问非static成员时，需要对象做参数；
-  要访问static成员或全局变量时，则不需要对象做参数；
-  如果做参数的对象是全局对象，则不需要对象做参数， 可以直接调用友元函数，不需要通过对象或指针 。

#### 初始化与清除

##### 构造函数

> 类的初始化是通过一个和类同名的函数完成的

当一个对被创建时，首先是先执行构造函数。

##### 析构函数

当这个对象被释放会先执行析构函数


```cpp
#include <stdio.h>
#include <iostream>

using namespace std;
class myclass
{
public:
	myclass()
	{
		cout << "构造函数" <<endl;
	}
	~myclass()
	{
		cout << "析构函数" << endl;
	}
};

int main()
{
	myclass();
	return 0;
}
```

初始化列表

```cpp
#include <iostream>
using namespace std;

class MyClass
{
public:
	MyClass(int a1,int b1,int c1):c(c1)  //这里使用列表初始化和构造函数体内初始化
	{
		this->a = a;
		this->b = b;
	}
	~MyClass() {}

private:
	int a;
	int b;
	int c;
};

int main()
{
	MyClass A(1, 2,3);
	return 0;
}
```

经过调试发现，在调用构造函数时，会优先使用列表初始化，之后才会走进函数体内执行。

初始化列表速度上比赋值要快。


空类：

```cpp
class myclass
{

};

int main()

{
	myclass();
	return 0;
}
```

空类的大小有**1个字节**，是用来表示这是一个对象

**非空类**

```cpp
class myclass
{
public:
		int a;
};

int main()

{
	myclass();
	return 0;
}
```

类的大小计算方式和struct一样，除了有虚函数时，需要多一个指针的大小。

#### this指针

this作用域是在类内部，当在类的非静态成员函数中访问类的非静态成员的时候，编译器会自动将对象本身的地址作为一个隐含参数传递给函数。也就是说，即使你没有写上this指针，编译器在编译的时候也是加上this的，它作为非静态成员函数的隐含形参，对各成员的访问均通过this进行。

(1) this指针的使用

- return *this,当成员函数需要返回类对象本身时。
- 当参数与成员函数变量名相同时，使用this->a = a

(2) this指针被编译器解析成A * const this,即这个指针不能修改指针变量。


##### 虚表指针

 https://blog.csdn.net/li1914309758/article/details/79916414


#### 对象继承和组合

##### 继承

当创建一个类时，你不需要重新编写新的数据成员和成员函数，可以通过继承一个已有的类的成员，我们成被继承的类为基类，新建的类称为派生类。

- **公有继承（public）：**当一个类派生自**公有**基类时，基类的**公有**成员也是派生类的**公有**成员，基类的**保护**成员也是派生类的**保护**成员，基类的**私有**成员不能直接被派生类访问，但是可以通过调用基类的**公有**和**保护**成员来访问。
- **保护继承（protected）：** 当一个类派生自**保护**基类时，基类的**公有**和**保护**成员将成为派生类的**保护**成员。
- **私有继承（private）：**当一个类派生自**私有**基类时，基类的**公有**和**保护**成员将成为派生类的**私有**成员。


```cpp
#include <iostream>

using namespace std;

// 基类
class Shape
{
   public:
      void setWidth(int w)
      {
         width = w;
      }
      void setHeight(int h)
      {
         height = h;
      }
   protected:
      int width;
      int height;
};

// 派生类
class Rectangle: public Shape
{
   public:
      int getArea()
      {
         return (width * height);
      }
};
```


##### 组合

类中成员是另一个类的对象

可以在已有抽象的基础上实现更复杂的抽象


```cpp
#include <iostream>
#include <cstdlib>
#include <cmath>
#include <stdio.h>

using namespace std;
//Point
class Point
{
private:
	double x,y;
public:
	Point(double x,double y):x(x),y(y)
	{
	}
	Point(const Point &p)//Copy constructor
	{
		x=p.x;
		y=p.y;
	}
	double getX()
	{
		return x;
	}
	double getY()
	{
		return y;
	}
};
//Line
class Line
{
private:
	double length;
	Point a,b;
public:
	Line(Point a,Point b):a(a),b(b)
	{
		double x=a.getX()-b.getX();
		double y=a.getY()-b.getY();
		length=sqrt(x*x+y*y);
	}
	double getLength()//get the length of line
	{
		return length;
	}
	Point getA()//get a point
	{
		return a;
	}
	Point getB()//get b point
	{
		return b;
	}
}
```

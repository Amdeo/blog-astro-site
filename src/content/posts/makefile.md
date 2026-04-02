---
title: 'makefile'
published: 2019-11-25
description: 'makefile make命令执行时，需要一个Makefile文件，make命令需要怎么样的去编译和链接程序 Makefile的规则 单文件编译 使用命令行进行编译 使用makef…'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# makefile


make命令执行时，需要一个Makefile文件，make命令需要怎么样的去编译和链接程序


## Makefile的规则


```cpp
target ... : prerequisites...
command
```


## 单文件编译


```cpp
//test.cpp
#include <stdio.h>
int main()
{
	std::cout<< "hello world" <<std::endl;
  return 0;
}
```


使用命令行进行编译


```cpp
g++ test.cpp -o test
```


使用makefile编译


1.创建一个makefile文件（`注: 没有扩展名`）


```makefile
test: test.cpp
g++ test.cpp -o test
```


`test `：最终生成的目标文件


`test.cpp`：依赖文件


`g++ test.cpp -o test`： 编译命令


## 多文件编译


```cpp
//fun1.cpp

//查找最大值
int func1(int *a,int n)
{
    int max = a[0];
    for (int i = 1;i < n;i++)
    {
        if(max < a[i])
        {
            max = a[i]
        }
    }
    return max;
}
```


```cpp
//fun1.h
extern func1(int *a,int n);
```


```cpp
//main.cpp
#include <iostream>
#include "fun1.h"

int main()
{
    int a[5] = {33,11,2,5,66};
    std::cout<< func1(a,5) <<std::endl;
    return 0;
}
```


```makefile
test: test.cpp fun1.o #目标文件：依赖文件
g++ test.cpp fun1.o -o test	#编译命令

fun1.o: fun1.cpp	#[.o]文件：生成[.o]的依赖文件
g++ -c fun1.cpp

#清理操作
clean:
rm *.o test	#删除所有[.o]文件
```


执行操作


```shell
make #执行编译

make clean #执行清理操作
```


## 清零目标文件的规则


```makefile
clean:
rm *.o test

.PHONY : clean
clean:
-rm *.o test

#.PHONY 意思表示clean是一个伪目标， 在rm命令前面加一个“-”(减号)的意思，某些文件出现问题，不需要管，继续后面的事。clean的规则不要放在文件的开头，不然就是变成make的默认目标，clean从来就是放在最后。
```


## 引用其他的Makefile


```makefile
include <filename>  #可以包含路径和通配符

#例如
#include foo.make *.mk
```


## 变量


系统默认自动化变量


```cpp
$^: 代表所有的依赖文件
$@: 代表目标
$<: 代表第一个依赖文件
```


```makefile
#定义变量
objects = main.o a.o b.o c.o

#使用变量
$(objects)
```


使用“ :=  ”操作符进行变量赋值


这种方法，前面的变量不能使用后面的变量，只能使用前面已经定义好的变量


例子：


```makefile
objects = foo.o bar.o	#变量

all: $(objects)		    #目标文件:依赖

$(objects): %.o: %.c	#[.o]文件为目标文件
$(CC) -c $(CFLAGS) $< -o $@
```


```makefile
objects = foo.o bar.o	#变量

$(objects): %.o: %.c
### ######等价于########
foo.o : foo.c
$(CC) -c $(CFLAGS) foo.c -o foo.o

bar.o : nar.c
$(CC) -c $(CFLAGS) bar.c -o bar.o
```

上面的例子中，指明了我们的目标从\$object 中获取，

“%.o”表明要所有以“.o”结 尾的目标，也就是“foo.o bar.o”，也就是变量\$object 集合的模式，

而依赖模式“%.c”，则取模式“%.o”的“%”，也就是“foo bar”，并为其加下“.c”的后缀，

于是，我们的 依赖目标就是“foo.c bar.c”。而命令中的“$<”和“$@”则是自动化变量，

“​\$<”表示 **所有的依赖目标集**（也就是“foo.c bar.c”），

“$@”**表示目标集** （也就是“foo.o bar.o”）。 于是，上面的规则展开后等价于下面的规则：


```makefile
files = foo.elc bar.o lose.o

$(filter %.o,$(files)): %.o: %.c	#这里filter函数作用，只要变量中 [.o]的内容
$(CC) -c $(CFLAGS) $< -o $@
$(filter %.elc,$(files)): %.elc: %.el	#这里filter函数作用，只要变量中 [.elc]的内容
emacs -f batch-byte-compile $<
```

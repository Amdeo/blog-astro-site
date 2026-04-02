---
title: 'Python 基础知识'
published: 2019-12-05
description: '从编码、对象模型、变量赋值到常见语法细节，系统梳理 Python 入门阶段最常用的一批基础知识。'
image: '/src/assets/blog-placeholder-1.jpg'
tags: ['python', '编程语言']
category: 'python'
draft: false
pinned: true
comment: true
lang: 'zh-CN'
---

# Python 基础知识

这篇文章整理 Python 入门阶段最常见的基础概念，包括源码编码、对象模型、变量赋值、`range`、`enumerate` 等内容，适合作为快速复习用的基础笔记。

[Python 官方文档](https://docs.python.org/zh-cn/3/)

## 源文件的编码

> Python默认源码文件的UTF-8

使用其他的文件编码

```
# -*- coding: cp1252 -*-
```


## 一切皆为对象

每一个数值、字符串、数据结构、函数、类、模块以及所有存在于Python解释器中的事务。

## 变量赋值

在Python中，对一个变量赋值，你就是创建一个指向等号右边对象第引用。

```python
a = b = c = 1 #多个变量赋相同的值
a, b, c = 1, 2, 3 #多个变量分别赋值
```

### 查看Python的关键字

```python
import keyword
print(keyword.kwlist)
```

python单行注释以开头的，多行注释以三个单引号或者三个双引号

python是使用缩进来表示代码块，缩进的空格是可变的，但是同一个代码块的语句必须包含相同的缩进空格数

### 变量赋值
在Python中，对一个变量赋值，你就是创建一个指向等号右边对象第引用。

举个例子

```python
a = [1,2,3]
b = a
print(a,b) #输出：[1, 2, 3] [1, 2, 3]

a.append(4)

print(a,b) #输出：[1, 2, 3, 4] [1, 2, 3, 4]
```

增量赋值：

`x += 1` <====>   `x = x + 1`


多重赋值：


`x = y = z = 1`


多元赋值：

`x, y, z = 1, 2, 'a string'`


### range
```python
for item in range(1, 4):
    print(item)

结果：
1
2
3

下面我们打印下这个函数
print(range(3))

结果：
range(0, 3)
```




- 一个参数，range(n),即从0~n-1


- 两个参数，range(n,m), 即遍历的范围从n~m-1

 循环之

### enumerate

通过enumerate循环可以，可以获取遍历的index

```python
list = [1,1,2,3,4,5]
for index,value in enumerate(list):
	print(index,value)

"""
0 1
1 1
2 2
3 3
4 4
5 5
"""
```


### 对象身份比较符
`a is b`


判断a 和 b是否是一个对象

`a is not b`

判断a 和 b不是一个对象

**应用场景**：

判断变量是否是None，最好使用is

```python
if a is None:

if a is not None:
```


### type()和isinstance()
type 获取变量的类型
```python
a = 1
print(type(a))
```

isinstance **判断一个对象是某种类型**

```python
a = 1
print(isinstance(a,int)) #返回bool类型值
```


### 多元赋值

```python
x,y,z = 1,2,'string'
```

### print输出

> print(...)
>
> print(value, ..., sep=' ', end='\n', file=sys.stdout, flush=False)
>
> Prints the values to a stream, or to sys.stdout by default.
>
> Optional keyword arguments:
>
> file:  a file-like object (stream); defaults to the current sys.stdout.
>
> sep:   string inserted between values, default a space.
>
> end:   string appended after the last value, default a newline.
>
> flush: whether to forcibly flush the stream.

```python
# 将内容输出到file
with open('text.txt',w) as f
print('hello world',file = f)

# 输出两个变量之间的间隔符，默认是空格，当然也可以指定
print(1,2,sep=':')	# output: 1:2

# 控制字符串的结尾字符，默认是换行符'\n'
print('my name is ',end='yuandongbin') # output: my name is yuandongbin

# flush 是否实时刷新流
# 一般print输出到屏幕之前，先将数据输出到内存，内存的内容不会实时刷新到屏幕上，将flush置为True，就会实时刷新显示到屏幕上。
print('实时刷新流'，flush=True)
```

#### 格式化输出

```python
print("the length of (%s) is %d" %('amdeo',len('amdeo')))
```

| 符  号 | 描述                                 |
| :----- | :----------------------------------- |
| %c     | 格式化字符及其ASCII码                |
| %s     | 格式化字符串                         |
| %d     | 格式化整数                           |
| %u     | 格式化无符号整型                     |
| %o     | 格式化无符号八进制数                 |
| %x     | 格式化无符号十六进制数               |
| %X     | 格式化无符号十六进制数（大写）       |
| %f     | 格式化浮点数字，可指定小数点后的精度 |
| %e     | 用科学计数法格式化浮点数             |
| %E     | 作用同%e，用科学计数法格式化浮点数   |
| %g     | %f和%e的简写                         |
| %G     | %f 和 %E 的简写                      |
| %p     | 用十六进制数格式化变量的地址         |

格式化操作符辅助指令:

| 符号   | 功能                                                         |
| :----- | :----------------------------------------------------------- |
| *      | 定义宽度或者小数点精度                                       |
| -      | 用做左对齐                                                   |
| +      | 在正数前面显示加号( + )                                      |
| \<sp\> | 在正数前面显示空格                                           |
| #      | 在八进制数前面显示零('0')，在十六进制前面显示'0x'或者'0X'(取决于用的是'x'还是'X') |
| 0      | 显示的数字前面填充'0'而不是默认的空格                        |
| %      | '%%'输出一个单一的'%'                                        |
| (var)  | 映射变量(字典参数)                                           |
| m.n.   | m 是显示的最小总宽度,n 是小数点后的位数(如果可用的话)        |

####  自动换行

在 Python 中 print 默认是换行的:

如果不想写成自动换行的 **print(i, end = '' )**


列表解析

```python
[a+'-'+b for a in "ABC" for b in "DEF"]
```

元祖解析

```python
(a+'-'+b for a in "ABC" for b in "DEF")
```

字典解析

```python
dt = {'A':1,'B':2}
{value:key for key,value in dt.items()}
```

集合解析

```python
s = set([1,2,4])
{i**i for i in s}
```

## 函数

```
def fun():
	// to do
```

默认值

```
def fun(a,b,c=1,d=4):
	// to do
```

特殊参数

![image-20210315214416491](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20210315214416491.png)

**/**作为参数，后面只能使用位置参数

*****作为参数，后面只能使用关键字参数

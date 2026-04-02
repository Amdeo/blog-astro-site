---
title: 'Python 迭代器、生成器与装饰器'
published: 2019-12-05
description: '围绕迭代器、生成器和装饰器三个高频概念，整理 Python 进阶阶段最常见的理解方式与示例。'
image: '/src/assets/blog-placeholder-1.jpg'
tags: ['python', '编程语言']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Python 迭代器、生成器与装饰器

这篇文章把 Python 里经常一起出现的三个概念放在一处整理：迭代器、生成器和装饰器。适合在学完基础语法后继续往前走时复习。

迭代器是访问集合元素的一种方法。

```python
list = [1,2,3,4]
it = iter(list)	# 创建迭代器对象
print(next(it)) # next函数读取迭代器下一个元素
print(next(it))
print(next(it))
print(next(it))
print(next(it)) # 抛出StopIteration异常
```

**为类创建迭代器**

需要在类中实现两种方法\_\_iter\_\_() 与\_\_next\_\_()。

```python
class MyNumbers:
  def __iter__(self):
    self.a = 1
    return self

  def __next__(self):
    x = self.a
    if x < 10:
    	self.a += 1
    	return x
    else:
        raise StopIteration

myclass = MyNumbers()
myiter = iter(myclass)

print(next(myiter))
print(next(myiter))
print(next(myiter))
print(next(myiter))
print(next(myiter))

for i in myclass:
    print(i)
```

## 生成器

在python中，一边循环一边计算的机制，称为生成器：generator

**为什么要有生成器？**

 列表所有数据都在内存中，如果有海量数据的话将会非常耗内存。

如：仅仅需要访问前面几个元素，那后面绝大多数元素占用的空间都白白浪费了。

如果列表元素按照某种算法推算出来，那我们就可以在循环的过程中不断推算出后续的元素，这样就不必创建完整的list，从而节省大量的空间。

简单一句话：我又想要得到庞大的数据，又想让它占用空间少，那就用生成器！

**如何创建生成器？**

```python
L = [x * x for x in range(10)] # 这是一个列表
print(L)

g = (x * x for x in range(10)) # 这是一个生成器
print(g)
```

如果一个函数中包含yield关键字，那么这个函数就不再是一个普通函数，而是一个generator。调用函数就是创建了一个生成器（generator）对象。

1\.  生成器(generator)能够迭代的关键是它有一个next()方法，工作原理就是**通过重复调用next()方法，直到捕获一个异常**

2\. 带有yield的函数不是一个普通的函数，而是一个生成器generator。可用next()调用生成器对象来取值。next 两种方式 t.__next__() | next(t)。可用for 循环获取返回值（每执行一次，取生成器里面一个值）,基本上不会用next()来获取下一个返回值，而是直接使用for循环来迭代。

3\. yield相当于return返回一个值，并且记住这个返回的位置，下次迭代时，代码从yield的下一条语句开始执行。

**普通的斐波那契数列**

```python
def fib():
    current = 0
    a, b = 0, 1
    while current < 5:
        print(b)
        a,b = b,a+b
        current = current + 1

fib()
```


**使用yield的斐波那契数列**

```python
def fib():
    a, b = 0, 1
    for i in range(5):
        yield b
        a, b = b, a + b

# fib()
s = fib()
print(type(s))
print(next(s))
print(next(s))
print(next(s))
print(next(s))
print(next(s))
# print(next(s))

# 可以遍历
L = [i for i in fib()]
print(L)
```

## send() 使用

```python
def gen():
    i = 0
    while i < 5:
        temp = yield i
        print(temp)
        i += 1

f = gen()
print(next(f))
print(next(f))
print(next(f))
print(next(f))
```

output:

```python
0
None
1
None
2
None
3
```

因为next(f)每次执行到yield就会暂停，返回yield修饰的值，再次调用next(f) 循环继续执行，由于之前执行到yield就结束了，继续执行会从下一行执行，temp就没有赋值，所有打印中就有很多None。

```python
def gen():
    i = 0
    while i < 5:
        temp = yield i
        print(temp)
        i += 1


f = gen()
print(next(f))
print(f.send('haha'))
print(f.send('haha'))
print(f.send('haha'))
```

由于迭代器第二次执行时，tmep是没有赋值，send("haha")的作用使用"haha"替代**yield i**

## 应用：使用生成器退出两层循环

使用标识位来退出两层循环

```python
l: list = [1,2,3,4,5,6,7]
l2: list = [6,7,8,9,10]

flag = False # 定义一个标识为 用来退出第二层循环
for i in l:
    for j in l2:
        if i + j == 15:
            print(i)
            flag = True
            break
    if flag:
        break
```

使用生成器来推出两层循环

```python
l: list = [1,2,3,4,5,6,7]
l2: list = [6,7,8,9,10]

# 定义一个生成器
def generator_func(l,l2):
    for i in l:
        for j in l2:
            yield i,j


for x,y in generator_func(l,l2):
    if x + y == 15:
        print(x,y)
        break
```

# 装饰器

```python
import time
def func():
    print("Enter func")
    time.sleep(3)
    print("exit func")

func()
```

我们想要打印这个函数的执行时间

方法一：

```python
import time
def func():
    start = time.time()
    print("Enter func")
    time.sleep(3)
    print("exit func")
    print(time.time() - start)

func()
```

在函数的开始和结尾加上时间戳（time.time()）

**缺点**：这方法需要修改**函数定义**

方法二:

```python
import time
def timer(func):
	start = time.time()
	func()
	print(time.time() - start)


def func():
    print("Enter func")
    time.sleep(3)
    print("exit func")

timer(func)
```

**缺点**：这个方法需要修改函数的**调用方式**

方法三：

```python
import time
def timer(func):
    def node():
        start = time.time()
        func()
        print(time.time() - start)
    return node

def func():
    print("Enter func")
    time.sleep(3)
    print("exit func")

func = timer(func)
func()
```

使用@timer 语法糖

```python
import time
def timer(func):
    def node():
        start = time.time()
        func()
        print(time.time() - start)
    return node

@timer # -->语法糖 相当于 func = timer(func)
def func():
    print("Enter func")
    time.sleep(3)
    print("exit func")

func()
```

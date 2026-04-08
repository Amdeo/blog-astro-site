---
title: 'Python 面向对象基础'
published: 2019-12-05
description: '从类、构造函数、类方法和继承出发，整理 Python 面向对象编程里最核心的一批基础概念。'
tags: ['python', '编程语言']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Python 面向对象基础

这篇文章主要整理 Python 面向对象编程里最常见的基础点，包括类的创建、构造函数、类方法和继承等内容。

- 普通方法：对象访问
-  私有方法：两个下划线开头，只能在类内部访问
-  静态方法：类和对象访问，不能和其他方法重名，不然会相互覆盖，后面定义的会覆盖前面的
-  类方法：类和对象访问，不能和其他方法重名，不然会相互覆盖，后面定义的会覆盖前面的
-  多继承情况下：从左到右查找方法，找到为止，不然就抛出异常


## 类的创建

```python
class people:
    name="Tom"  # 公有的类属性 相当与C++中的static修饰的变量（静态成员变量）
    __age=18    # 私有的类属性



# python之面向对象
p = people()
print(p.name) # 实例化对象属性
# print(p.__age) # 不能访问私有属性

print(people.name)  # 类对象可以直接调用，不需要实例化对象就可以使用
# print(people.__age) # 类对象也不能访问私有属性

# 增加实例化属性
p.height = 187

# 修改实例化属性
p.name = "jack"

print(p.height)
print(p.name)

# 增加类对象属性
people.height = 191

# 修改类对象属性
people.name = "looper"

print(people.height)
print(people.name)

# 这里我们给类对象增加一个属性，那我们在通过类对象创建实例，实例对象会有这个属性吗？
a = people()
print(a.height) #通过测试发现真的会改变
```

## 构造函数

> 构造函数在类实例化后自动调用\_\_init\_\_()

```python
class people:
    def __init__(self,age):
        self.age = age

p = people(18)
```

上面的*self*表示实例化对象，

**构造函数**的实质，就是通过类对象创建实例化对象后，实例对象添加实例属性。

## 类方法

 在类的内部，使用 **def** 关键字来定义一个方法，与一般函数定义不同，类方法必须包含参数 self, 且为第一个参数，self 代表的是类的实例。

```python
#类定义
class people:
    #定义基本属性
    name = ''
    age = 0
    #定义私有属性,私有属性在类外部无法直接进行访问
    __weight = 0
    #定义构造方法
    def __init__(self,n,a,w):
        self.name = n
        self.age = a
        self.__weight = w
    def speak(self):
        print("%s 说: 我 %d 岁。" %(self.name,self.age))
    def __some(self):
        print("私有方法")	# 私有方法以__ 开头


# 实例化类
p = people('runoob',10,30)
p.speak()
```

## 类继承

```python
#类定义
class people:
    #定义基本属性
    name = ''
    age = 0
    #定义私有属性,私有属性在类外部无法直接进行访问
    __weight = 0
    #定义构造方法
    def __init__(self,n,a,w):
        self.name = n
        self.age = a
        self.__weight = w
    def speak(self):
        print("%s 说: 我 %d 岁。" %(self.name,self.age))

#单继承示例
class student(people):
    grade = ''
    def __init__(self,n,a,w,g):
        #调用父类的构函
        people.__init__(self,n,a,w)
        self.grade = g
    #覆写父类的方法
    def speak(self):
        print("%s 说: 我 %d 岁了，我在读 %d 年级"%(self.name,self.age,self.grade))



s = student('ken',10,60,3)
s.speak()
```


## 多继承

```python
#类定义
class people:
    #定义基本属性
    name = ''
    age = 0
    #定义私有属性,私有属性在类外部无法直接进行访问
    __weight = 0
    #定义构造方法
    def __init__(self,n,a,w):
        self.name = n
        self.age = a
        self.__weight = w
    def speak(self):
        print("%s 说: 我 %d 岁。" %(self.name,self.age))

#单继承示例
class student(people):
    grade = ''
    def __init__(self,n,a,w,g):
        #调用父类的构函
        people.__init__(self,n,a,w)
        self.grade = g
    #覆写父类的方法
    def speak(self):
        print("%s 说: 我 %d 岁了，我在读 %d 年级"%(self.name,self.age,self.grade))

#另一个类，多重继承之前的准备
class speaker():
    topic = ''
    name = ''
    def __init__(self,n,t):
        self.name = n
        self.topic = t
    def speak(self):
        print("我叫 %s，我是一个演说家，我演讲的主题是 %s"%(self.name,self.topic))

#多重继承
class sample(speaker,student):
    a =''
    def __init__(self,n,a,w,g,t):
        student.__init__(self,n,a,w,g)
        speaker.__init__(self,n,t)

test = sample("Tim",25,80,4,"Python")
test.speak()   #方法名同，默认调用的是在括号中排前地父类的方法
```

## 方法重写

```python
class Parent:        # 定义父类
   def myMethod(self):
      print ('调用父类方法')

class Child(Parent): # 定义子类
   def myMethod(self):
      print ('调用子类方法')

c = Child()          # 子类实例
c.myMethod()         # 子类调用重写方法
super(Child,c).myMethod() #用子类对象调用父类已被覆盖的方法
```


## super使用

```python
# 示意super函数间接调用父类中被覆盖的方法

class A:
    def work(self):
        print('A.work被调用')

class B(A):
    '''B类继承A类'''
    def work(self):
        print('B.work被调用')

    def super_work(self):
        '''调用B类自己的work方法'''
        self.work()  # B.work被调用，调用自身类的方法，和调用属性一样
        super(B, self).work()  # A.work被调用， 借助super调用父类被覆盖的方法
        super().work()  # A.work被调用  这种必须在方法内使用 ，可以省略（自身类）参数

b = B()
# b.work()  # B.work被调用，调自身的类
# super(B, b).work()  # A.work被调用(使用super是调用B的父类)
# super().work()  # RuntimeError: super(): no arguments   不知道调用谁，所以此种省略参数的只能在内部使用
b.super_work()  # 以上懂了，这回也就懂了
```

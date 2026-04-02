---
title: 'C++面试宝典'
published: 2020-11-25
description: '深入人心的面试宝典 C++ 内存分布 主要关注： 全局区 （包含全局变量和静态变量），静态变量可以看做有作用域的全局变量 bss：存放为未初始化的全局变量和静态变量(包含值为0的)，这是全零的一段空间。 data：存放已…'
image: '/src/assets/blog-placeholder-5.jpg'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++面试宝典

深入人心的面试宝典 C++ 内存分布 主要关注： 全局区 （包含全局变量和静态变量），静态变量可以看做有作用域的全局变量 bss：存放为未初始化的全局变量和静态变量(包含值为0的)，这是全零的一段空间。 data：存放已…


## C++ 内存分布

![](https://raw.githubusercontent.com/Amdeo/blogImg/main/img/20221010152234.png)

主要关注：

- **全局区** （包含全局变量和静态变量），静态变量可以看做有作用域的全局变量
  - bss：存放为未初始化的全局变量和静态变量(包含值为0的)，这是全零的一段空间。
  - data：存放已经初始化的全局变量和静态变量
- **代码段**：这个区域的内容无法修改，只读，存放程序执行代码和存放只读的字符串常量。
- **栈区**：存放局部变量、函数参数、返回值等
- **堆区**：由程序员手动申请的内存区域


## 宏

### #和##的用法

#### #字符串化操作符

作用：将宏定义中的传入参数名转换成用一对双引号括起来参数名字符串。其只能用于传入参数的宏定义中，且必须置于宏定义体中的参数名前。

#### \#\# 符号连接操作符

作用：将宏定义参数和其他标识进行拼接，生成新的标识。

## ++a和a++有什么区别？两者是如何实现的？

a++

```cpp
int temp = a;
a=a+1;
return temp;
```

++a

```cpp
a=a+1;
return a;
```

## C语⾔函数参数压栈顺序是怎样的？

从右往左

为什么呢？

```cpp
int printf(const char *format,...);
```

从printf函数看的出来，只有从右往左压栈，format才会在最上面，通过format可以知道有几个参数，不然就会反过来设计了如`int printf(...,const char *format);`

## C++强制类型转换

- const_cast：去除变量的const属性。
  -
  -
- static_cast：静态类型转换，一般用于基本类型间的转换，
  - 用于非多态类型的转换
  - 通常用于转换数值数据类型
  - 可以在整个类层次结构中移动指针，子类转化为父类安全(向上转换)，父类转化为子类不安全(因为子类可能有不在父类的字段或方法)
- dynamic_cast：动态转换，同于多态之间的类型转换
  - 用于多态类型的转换
  - 执行运行时类型检查
  - 只适用于指针或者引用
  - 对于不明确的指针的转换将失败(返回nullptr)，但不引发异常
  - 可以在整个类层次结构中移动指针，包括向上转换、向下转换

- reinterpret_cast：用于不同类型的指针类型的转换。
  - 用于位的简单重新解释
  - 允许将任何指针转换为任何其他指针类型(有可能不安全)
  - 也允许将任何整数类型转换为任何指针类型以及反向转换
  - reinterpret_cast运算符不能丢掉const、volatile或__unaligned特性
  - reinterpret_cast的一个实际用途是在哈希函数中，即，通过让两个不同的值不以相同的索引结尾的方式将值映射到索引。


## 关键字

### volatile

有什么作用？

因为很多时候编译器会优化变量的读取和存储，程序运行的时候，操作系统会将变量的值从内存读取到寄存器，如果这个变量经常使用，这个值修改和存储一直放在寄存器中，只有在寄存器不够用了，会将这些已经不常用的变量，写入到内存中，当在内存中的变量经常会有其程序修改它，此时的寄存器中存放的变量的值就是不对的。

> 举个例子：我们会将经常要看的书，从书架上拿下来，就会一直放在桌子上，桌子上经常会堆放一堆书，以便于可以随时查看，当我们桌子上放不下新增的书的时候，我会检查下桌子上哪些已经不是经常看的，就会放回到书架上。

volatile会告诉编译器，它修饰的变量随时都有可能改变。它要求编译器每次读写这个变量的时候，都需要从内存中读取变量数据。

总结：为了保证准确性，不要怕麻烦，每次用这个变量从内存中获取。

### static

> static修饰的变量，就是静态变量

静态变量可以看做有作用域的全局变量，生命周期和全局变量是一样的，

只要是static修饰的变量，统一都存放在全局静态区。

static几种使用场景：

- 函数体内，静态局部变量，只能在函数体用
- 类静态成员变量，只能通过类来操作这个变量
- 函数体外，静态全局变量，只能在当前cpp中使用

### const

- 修饰的内容不能修改
- 修饰的变量必须初始化
- 修饰的成员函数，可以看做this指针被加const修改，所有说所有的成员变量都不能修改
- const修改的变量存放的哪个内存区内，不需要关心const

### inline内联函数

- 相当于把内联函数里面的内容写在调用内联函数处
- 相当于宏，却比宏多了类型检查，真正具有函数特性
- 编译器一般不内联包含循环、递归、switch等复杂操作的内联函数；
- 在类声明中定义的函数，除了虚函数的其他函数都会自动隐式地当成内联函数。

缺点：

1. 代码膨胀。内联是以代码膨胀（复制）为代价，消除函数调用带来的开销。如果执行函数体内代码的时间，相比于函数代用的开销较大，那么效率的收获会很少。另一方面，每一处内联函数的调用都要复制代码，将使程序的总代码两增加，消耗更多的内存空间。
2. inline函数无法随着函数库升级而升级。
3. 是否内联，程序员不可控。内联函数知识对编译器的建议，是否对函数内联，决定权在于编译器

### new/delete与malloc/free的区别是什么？

new、delete是C++中的操作符，⽽malloc和free是标准库函数。

new会调用构造函数，malloc只是申请内存

delete会调用析构函数，free只是释放变量的内存。


## 构造函数

### 构造函数为什么不能声明为虚函数

我们要知道虚函数原理，虚函数是存放在虚函数表中，是通过一个虚表指针vptr指向它的，如果构造函数是虚函数的话，就需要使用虚表指针来调用它，，但是此时对象还没有构建，虚表指针也没有。

## 析构函数

### 有什么用？

在对象生命周期结束时，系统会自动执行析构函数，完成一些类对象的资源的清理。

- 栈对象，在生命周期结束时，会自动调用析构函数
- 堆对象，在使用delete ptr时，才会调用析构函数

### 析构函数什么情况定义为virtual

当类作为基类被继承时，就应该将析构函数定义为virtual。

使用基类指针指向子类对象时，如果想要通过基类指针释放子类对象时(如 delete ptr)，只有基类的析构函数为虚函数时，才会调用子类的析构函数。

## 如果不想类被实例化，有什么办法？

- 类里面声明一个纯虚函数
- 将构造和析构函数使用private修饰


## 多态

多态，通俗点来讲就是多种状态，具体点就是去完成某个行为，当不同的对象去完成时会产生不同的状态。

C++ 多态就是指多种形态，C++的多态分为静态多态和动态多态。

### 静态多态

> 静态多态往往通过函数重载和模板(泛型编程)来实现的

对于相关的对象类型，直接实现他们各自的定义，不需要共有基类，甚至没有任何关系。只需要各个具体类的实现中要求相同的接口声明，这里的接口称之为隐式接口，客服端将把操作这些对象的函数定位模板，当需要操作什么类型的对象时，直接对模板指定该类型实参即可。

```cpp
#include <iostream>

using namespace std;

class A {
public:
    void print() const
    {
        cout << "A::print()" << endl;
    }
};

class B {
public:
    void print() const
    {
        cout << "B::print()" << endl;
    }
};

template <typename T>
void entry(const T& obj)
{
    obj.print();
}

int main()
{
    A a;
    B b;
    entry<A>(a);
    entry<B>(b);
    return 0;
}
```

模板是编译期就生成对应的代码，编译期就绑定了函数地址

函数重载也算静态多态

### 动态多态

#### 原理

当一个类中声明了虚函数，编译器会自动给这个类添加一个成员（虚表指针），虚表指针指向一个存放虚函数指针的一个数组。

- 虚函数表是一个存储类成员函数指针的数据结构，是由编译期自动生成和维护的。当存在虚函数时，每个对象中都有一个指向虚函数的指针vptr, vptr 一般作为类对象的第一个成员。

- 一个有虚函数的类拥有一个虚表，所有这个类的实例使用这一个虚表
- 虚表结尾一定是nullptr

#### 单继承

当继承一个基类（拥有虚函数），也会继承它的虚表，但是派生类中是一个新的虚表，派生类如果重写虚函数，就会覆盖虚表中的虚函数地址，派生类中新的虚函数也会追加到虚表中。

#### 多继承

多继承是，继承几个基类就会有几个虚表指针

- 如果多个基类拥有相同的虚函数，派生类重写了这个函数，会将这几个基类的虚表中虚函数都覆盖
- 派生类新增的虚函数，会添加到第一个继承的基类虚表中

多态时，父类指针指向子类对象，就会调用哪个子类的虚函数，因为可以在虚表中查找对应的虚函数。

## C++ 锁

> 顾名思义：锁的目的就是为保护，这里的锁就是保护资源，只有开了锁，其他人才能使用。

### 互斥锁

互斥锁，顾名思义：一旦一个线程lock，其他线程想要获得锁，只能等之前获得锁的线程unlock，其他线程才能获得锁。

### 递归锁

一般的互斥量对于同一个线程只能同时加锁一次，如果同时加锁两次就会出现死锁。

使用场景：一个函数内加锁，还没有解锁，调用了另外一个函数，被调用的函数里面也加了锁，这个时候就出现死锁。

为了解决这个问题，引入的递归锁，同一线程中多次加锁，实现原理就是，只有第一次才真正的加锁，但是会记录加锁计数，解锁也需要相同次数，才可以解锁。

### 自旋锁(spin lock)

互斥锁，如果不能获取加锁，将自己阻塞起来，就会进入睡眠

自旋锁，如果不能获取加锁，就会循环判断，一直循环到可以获取到锁，自旋锁。

从这两个概念一看，自旋锁效率会高。

**解决什么问题?**

因为互斥锁获取不了锁，进入让线程进入阻塞状态，要知道切换这个状态需要线程在内核态和用户态进行切换，这个阶段很浪费时间。

自旋锁，一直在用户态，不涉及线程切换，不断循环判断锁是否已经可以获取了，当然也带了一个问题，自旋锁长时间占用CPU，对性能是一种损耗。

使用场景：就是等待的锁的时间短，减少长时间占用CPU，又能很快加锁，大大的提升效率。

### 读写锁

顾名思义：有读锁和写锁

它解决了一个什么问题呢

当一个共享变量，读多写少的场景下，我们就可以使用读写锁。

- 读锁在已经已锁定场景下，其他线程也可以对读锁上锁，当读锁上锁场景下，写锁不能上锁
- 写锁上锁后，所有的上锁操作都会阻塞。

### 死锁

死锁有很多场景

场景1：一个线程上了锁，发生异常退出，没有释放锁，其他线程只能一直等待锁释放，此时就是发生死锁。

场景2：线程A先获取锁1，线程B获取锁2，此时线程A需要再获取锁2才能执行，而线程B也需要获取锁1才能继续执行，两个线程都在等在对方释放锁。

怎么解决死锁？

- 如果使用过多的锁，那就是程序设计上出现了问题，能少用锁就少用锁。


## C++智能指针

> 用来专门管理指针的一个类

解决什么问题?

- 用来内存泄露
- 就是会产生引用非法内存的指针


### unique_ptr

它的名字叫独占式指针

unique_ptr对象管理的指针，独占所指向内存的所有权。

简单的说它不允许其他智能指针共享其管理的对象

因为这个类不能通过赋值将一个unique_ptr赋值给另一个unique_ptr。

它可以通过move将所有权转移给另一个unique_ptr，一直保持只有一个智能指针管理那个对象。

当unique_ptr离开作用域，它管理的对象也将被删除，如果想要手动删除unique_ptr智能指针管理的对象，

```cpp
ptr = nullptr;
ptr.reset();
```

### shared_ptr

> 共享式智能指针

可以多个shared_ptr管理同一个对象

shared_ptr内部有个int指针保存当前有多少个shared_ptr智能指针管理同一个对象。

当shared_ptr 内部引用计数器为0的时候，才会释放对象。

共享式智能指针会引入什么问题呢？

循环引用，就是两个对象互相持有对方共享指针，双方都等在对方先释放，共享指针才能释放，最终导致两个对象无法释放。


### weak_ptr

这个智能指针是为shared_ptr大辅助用的，它指向一个shared_ptr管理的对象，但是weak_ptr不会增加shared_ptr的引用计数。

它解决什么问题?

解决了shared_ptr的循环引用的问题

weak_ptr不能直接操作资源，需要先lock获取shared_ptr实例才能访问资源

```cpp

template<class T>
void shared_ptr_valid(shared_ptr<T> &sp)
{
	weak_ptr<T> wp = sp;
	shared_ptr<T> spCheck = wp.lock();
	if(spCheck == nullptr)
	{
		cout<<"shared_ptr is invalid"<<endl;
	}
	else
	{
		cout<<"shared_ptr is valid"<<endl;
	}
}
```

lock方法会检查shared_ptr管理的对象有没有释放了，没有释放的话，创建新的shared_ptr 引用计数也会+1，通过shared_ptr来操作资源。


## 网络编程

### OSI七层模型是什么？

> 数据传输过程

![一文看懂网络七层协议/OSI七层模型](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/v2-1dd6e1ed2f348db47ce0cde38d545ae9_720w.jpg)


![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1944797-20200416183944397-1909517477.gif)

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/v2-1578921092d775e024345fa8a531a85e_1440w.png)

分层分的是什么？

其实就是每层对数据做了什么处理


应用程序产生数据，数据会经过下面几个流程进行加工

应用层：

- 常用的协议：HTTP、TELNET、FTP、NFS、SMTP，各个应用程序就是使用这些协议进行开发的
- 将想要发送的数据，按照相应的协议格式填入

表示层：

- 将应用处理的消息转换为适合网络传输的格式，或者将网络传输过来的数据转化为应用可以处理的消息。
- 主要功能就是定义数据格式以及加密
- 常用格式：ASCII、MPEG、JPEG

会话层：

- 会话，向表示层或会话层提供会话服务。
- 本质是一种同步机制
- 负责应用程序之间建立、维持和中断会话
- 差错恢复也是这层处理，断网续传就是基于这个

传输层：

- 数据单位：段

- 协议：TCP、UDP、TLS
- 主要是将从下层接受的数据进行分段和传输，到达目的地址后在进行重组
- 监控数据传输服务的质量，保证报文的正确传输。
- 传输层还要处理端到端的差错控制和流量控制问题。

网络层：

- 数据单位：数据包

- 协议：IP
- 通过路由选择算法，为报文(该层的数据单位，由上一层数据打包而来)通过通信子网选择最适当的路径。这一层定义的IP地址，通过IP地址寻址，所以产生了ip协议
- 分组和打包
- 实现了拥塞控制、网际互连等功能。

数据链路层：

- 数据单位：帧
- 在不可靠的物理介质上提供可靠的传输。
- 该层的作用包括：物理地址寻址、数据的成帧、流量控制、数据的检错、重发等。

物理层：

- 数据单位：位

- 将数据转换为比特，用来传输


总结：

应用层：将数据按照协议进行封装

表示层：翻译一下

会话层：检查数据是否发全

传输层：把包发给下层

网络层：报文--整合成包，看看送对了吗

数据链路层：整理成桢，看看数据全不全

物理层：

应用层：通过应用进程之间的交互来往成特定的网络应用。
表示层：解决通信双方交换信息的表示问题。
会话层：解决进程间会话问题。
运输层：解决进程之间基于网络通信的问题。
网络层：分组在多个网络上传输的问题。
数据链路层：分组在一段链路上的传输问题。
物理层：使用何种信号进行传输的问题。

### TCP和UDP的区别？

两个协议都是运输层协议

TCP:

- 面向连接的
- 可靠传输，使用流量控制和拥塞控制
- 只能是一对一通信
- 面向字节流
- 首部最小20字节，最大60字节，首部开销大
- 适用于要求可靠的传输的应用，文件传输

UDP：

- 无连接

- 不可靠传输，不适用流量控制和拥塞控制
- 支持一对一、一对多、多对多和多对多通信
- 面向报文
- 首部开销小，仅仅使用8字节
- 适用于实时应用，直播

### 三次握手和四次挥手

#### 三次握手

> 为什么要有握手，就是为了检查客户端和服务端接收是否正常

第一次握手：

- 客户端发送SYN，seq=x

第二次握手：

- 服务端接收客户端数据后，返回SYN，ack=x+1，seq=y
- 客户端知道自己发送正常和服务端收发正常
- 服务端知道客户端发正常和自己收正常

第三次握手：

- 客户端接收到服务端的返回数据，发送ACK, seq=x+1,ack=y+1
- 客户端知道自己和服务端收发都没问题
- 服务端知道自己和客户端收发都没问题


#### 四次挥手

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,image_d2F0ZXIvYmFpa2UxNTA=,g_7,xp_5,yp_5.png)

第一次挥手：

- client想要关闭连接，发送FIN，seq=u，client进入FIN-WAIT1状态

第二次挥手：

- server收到FIN后，发送回复消息ACK=1，seq=v，ack=u+1给client
- 因为server还有数据要发，先回复一个消息给client，告诉clent我收到消息了，等我事情处理完了
- server进入CLOSE_WAIT
- client收到消息后，进入FIN_WAIT_2状态

第三次挥手：

- FIN=1，ACK=1，seq=w，ack=u+1

- 等待server处理完数据后，向client发送FIN报文
- server进入LAST_ACK
- client进入TIME_WAIT

第四次挥手：

- ACK=1，seq=u+1，ack=w+1
- client等待2MSL后，自己关闭连接，server会在第三次挥手后，等待client的消息，超时就会重新发送个FIN
- server端接收到client消息后，server进行关闭连接

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/v2-d80eca1373a96f0f27df2400413f0902_1440w-20221016223111209.webp)

**第1次挥手**

由客户端向服务端发起，服务端收到信息后就能确定客户端已经停止发送数据。

**第2次挥手**

由服务端向客户端发起，客户端收到消息后就能确定服务端已经知道客户端不会再发送数据。

**第3次握手**

由服务端向客户端发起，客户端收到消息后就能确定服务端已经停止发送数据。

**第4次挥手**

由客户端向服务端发起，服务端收到信息后就能确定客户端已经知道服务端不会再发送数据。

### 什么是IO多路复用

IO是指同步IO，多路是指网络连接，复用是指在同一个进程/线程

一个进程/线程可以监视多个文件句柄，一旦某个文件句柄就绪，就能够通知应用程序进行相应的读写操作。

如何使用?

通过select、poll、epoll来实现

### epool中et和lt的区别与实现原理

LT：水平触发，文件描述符有数据时，只读了一部分数据，每次epoll_wait都会返回它的事件，让应用程序去读取数据。（没把数据读完，会一直提醒用户读读取数据）

ET：边缘触发，只提醒一次，不读取完，下次不会提醒了，一直有新的数据过来，才会提醒，此时之前的数据会被覆盖，导致数据丢失

- ET带来一个好处，就是系统调用会变少，效率会有提升。

### connect方法会阻塞，请问有什么方法可以避免其长时间阻塞？

使用非阻塞connect，调用后直接返回，如果处于正在简历阶段，继续使用select或者poll等函数继续处理

### 网络中，如果客户端突然掉线或者重启，服务器端怎么样才能立刻知道？

若客户端掉线或者重新启动，服务器端会收到复位信号，每一种tcp/ip得实现不一样，控制机制也不一样。

如果客户端 crash 或重新启动，其操作系统层会向客户端建立的所有 TCP 连接发 RST

## 操作系统

### 进程和线程的区别？

进程是资源分配的基本单位

线程是CPU调度的最小单位


进程有自己独立的地址空间

线程共享进程的资源


进程之间相互独立，一个进程的崩溃，不会应该其他进程

在同一个进程中线程，一个线程的崩溃，会导致整个进程的崩溃

### 线程池优势


### Linux 查看进程、线程、 CPU 核数命令


### 后台怎么查看 TCP 连接是否成功


## 数据结构

### 数组Array

数组是一种线性结构，在内存中占据一块连续空间

- 访问快
- 插入慢
- 删除慢
- 无顺序

使用场景：频繁查询，对存储空间要求不大，很少增加和删除的情况

### 链表

链表是一个非连续、非顺序的存储结构

- 访问慢
- 插入快
- 删除快

使用场景：经常删除和添加数据，少查询

### 栈

栈是一种线性结构

- 先进后出
- 后进先出

入栈叫做push，出栈叫做pop

我们经常玩的游戏：`汉诺塔`，就像栈结构，将栈里面的数据排序

### 队列

队列可以在一端添加元素，在另一端取出元素，先进先出

- 和日常生活中排队差不多

### 哈希表

哈希表又叫做 散列表，是根据码和值直接进行访问的数据结构，通过key和value来映射到集合中的一个位置，这样就可以很快找到集合中的对应元素

- 准备一个数组(比如长度为5)
- 创建一个哈希函数，计算出一个数值
- 将计算得出的数值除以5进行mod运算，将对应的结果存放对应index数组中
- 查找时候，也是使用上面的方法，找到index，直接获取到数据
- 有时候数组不够大，对应index的元素被其他数据占用了，此时发生了`冲突`，我们这样在当前数组index中添加一个链表来存储数据

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/20210205145536171.png)

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/20210205145902679.png)

### 堆

堆实际上是一个数组，在物理结构上是连续存储的，但是逻辑上数据与数据之间的关系是一个二叉树。

- 堆中某个节点的值总是不大于或不小于其父节点的值
- 堆总是一颗完全二叉树

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5q2j5LmJ55qE5LyZ5Ly05ZWK,size_20,color_FFFFFF,t_70,g_se,x_16.png)

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1FMZWVscQ==,size_16,color_FFFFFF,t_70.png)

### 树

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/ac8cf4b16d344452a26e5f72f573de8c.png)

- 根结点是唯一的，不可能存在多个根结点，数据结构中的树只能有一个根结点
- 子树的个数没有限制

#### 度数

结点拥有的子树数目称为结点的度。

#### 结点关系

- 孩子关系
- 双亲关系
- 兄弟关系

#### 结点层次

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/759b41bd13acdf33d9d3993128b086c3.png)

#### 二叉树

是n（n>=0）个结点的有限集合，改集合或者为空集(成为空二叉树)，或者由一个根结点和两棵互不相关的、分别称为根结点的左子树和右子树组成

##### 斜树

所有的结点都只有左子树的二叉树叫左斜树。所有结点都是只有右子树的二叉树叫右斜树

左斜树

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/464bf03f78fe202c34c88c55c33df0e2.png)

右斜树

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/24452364fab45a683158e9ee4e0e08c0.png)

##### 满二叉树

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/f775270b87feac4d2ea4f40536023410.png)

- 叶子只能出现在最下一层

- 非叶子结点的度一定是2
- 在同样深度的二叉树中，满二叉树的结点个数最多，叶子树最多

##### 完全二叉树

- 所有叶子结点都出现在k或者k-1层，而且从1到k-1层必须达到最大节点数。
- 第k层可以不是满的，但是第k层的所有结点必须集中在最左边
- 叶子结点出现最后一层或者倒数第二层

使用场景：

由于叶子结点的位置比较规律，因此在对数据进行排序或者查找时可以用到它，比如堆排序

##### 二叉查找树

- 若其左子树非空，则左子树上所有节点的值都小于根节点的值
- 若其右子树非空，则右子树上所有节点的值都大于根节点的值
- 其左右子树都是一棵二叉查找树

![image-20210827132158313](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/f69da6c98aace9cb39cae3391bed46e3.png)

##### 二叉树的遍历

- 先序遍历（先根，再左，右）

  ![在这里图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3h4eHh4eHh4MDA3NzIyOTk=,size_16,color_FFFFFF,t_70.png)

- 中序遍历（左，根，右）

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3h4eHh4eHh4MDA3NzIyOTk=,size_16,color_FFFFFF,t_70-20221025222627296.png)

- 后序遍历（左，右，根）

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3h4eHh4eHh4MDA3NzIyOTk=,size_16,color_FFFFFF,t_70-20221025222639310.png)

- 层次遍历

## 红黑树

平衡二叉查找树，节点被分为红色和黑色

-  根结点是黑色 叶节点是不存储数据的黑色空节点
- 任何相邻的两个节点不能同时为红色
- 任意节点到

### 图

图是一种非线性的数据结构，表示多对多的关系


应用：

- 地图导航路径计算


### STL

| 容器               | 底层数据结构      | 时间复杂度                                           | 有无序 | 可不可重复 | 其他                                                         |
| ------------------ | ----------------- | ---------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------ |
| array              | 数组              | 随机读改O(1)                                         | 无序   | 可重复     | 支持随机访问                                                 |
| vector             | 数组              | 随机读改、尾部插入、尾部删除、头部插入、头部删除O(1) | 无序   | 可重复     | 支持随机访问                                                 |
| deque              | 双端队列          | 头尾插入、头尾删除O(1)                               | 无序   | 可重复     | 一个中央控制器+多个缓存区，支持收尾快速增删，支持随机访问    |
| Forward_list       | 单向链表          | 插入、删除O(1)                                       | 无序   | 可重复     | 不支持随机访问                                               |
| list               | 双向链表          | 插入、删除O(1)                                       | 无序   | 可重复     | 不支持随机访问                                               |
| stack              | deque/list        | 顶部插入、顶部删除O(1)                               | 无序   | 可重复     | deque或list封闭头端开口，不用vector的原因应该是容量大小有限制，扩容耗时 |
| queue              | deque/list        | 尾部插入、头部删除O(1)                               | 无序   | 可重复     | deque 或 list 封闭头端开口，不用 vector 的原因应该是容量大小有限制，扩容耗时 |
| priority_queue     | vector + max-heap | 插入、删除O(log2n)                                   | 有序   | 可重复     | vector容器+heap处理规则                                      |
| set                | 红黑树            | 插入、删除、查找O(log2n)                             | 有序   | 不可重复   |                                                              |
| multiset           | 红黑树            | 插入、删除、查找O(log2n)                             | 有序   | 不可重复   |                                                              |
| map                | 红黑树            | 插入、删除、查找O(log2n)                             | 有序   | 不可重复   |                                                              |
| multimap           | 红黑树            | 插入、删除、查找O(log2n)                             | 有序   | 可重复     |                                                              |
| unordered_set      | 哈希表            | 插入、删除、查找O(1) 最差 O(n)                       | 无序   | 可重复     |                                                              |
| unordered_multiset | 哈希表            | 插入、删除、查找 O(1) 最差 O(n)                      | 无序   | 可重复     |                                                              |
| unordered_map      | 哈希表            | 插入、删除、查找 O(1) 最差 O(n)                      | 无序   | 可重复     |                                                              |
| unordered_multimap | 哈希表            | 插入、删除、查找O(1) 最差 O(n)                       | 无序   | 可重复     |                                                              |

#### array


## 算法


## 设计模式

### 组件协作

> 现代软件专业分工之后的第一个结果是"框架与应用划分"、"组件协作"模式通过晚期绑定来实现框架与应用程序之间的耦合，是而知之间协作时常用的模式

#### Template(模板模式)

> 定义一个操作中的算法的骨架(稳定)，而将一些步骤延迟(变化)到子类的中
>
> 模板方法使子类可以不改变一个算法的结构即可以重新定义该算法的某些特定步骤

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/f3d5509868594352947e18f0beaa5910.png)

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class DrinkTemplate{
public:
	//煮水
	virtual void BoildWator() = 0;
	//冲泡
	virtual void Brew() = 0;
	//倒入杯中
	virtual void PourInCup() = 0;
	//加辅助料
	virtual void AddSomeThing() = 0;

	//模板方法
	void Make()
	{
		BoildWator();
		Brew();
		PourInCup();
		AddSomeThing();
	}
};

//冲泡咖啡
class Coffee:public DrinkTemplate
{
public:
	virtual void BoildWator()
	{
		cout<<"煮山泉水"<<endl;
	}
	virtual void Brew()
	{
		cout<<"冲泡咖啡"<<endl;

	}
	virtual void PourInCup()
	{
		cout<<"咖啡倒入杯中"<<endl;
	}
	virtual void AddSomeThing()
	{
		cout<<"加糖,加奶..."<<endl;
	}

};

//煮茶
class Tea:public DrinkTemplate
{
public:
	virtual void BoildWator()
	{
		cout<<"煮山泉水"<<endl;
	}
	virtual void Brew()
	{
		cout<<"冲泡茶叶"<<endl;

	}
	virtual void PourInCup()
	{
		cout<<"茶水倒入杯中"<<endl;
	}
	virtual void AddSomeThing()
	{
		cout<<"加柠檬..."<<endl;
	}

};

int main()
{
	{
	Tea* t_Tea = new Tea;
	t_Tea->Make();
	delete t_Tea;
	t_Tea = nullptr;
	cout<<"-----------------"<<endl;
	Coffee* t_Coffee = new Coffee;
	t_Coffee->Make();
	delete t_Coffee;
	t_Coffee = nullptr;
	}
	system("pause");
	return 0;
}
```

#### Strategy(策略模式)

> 定义了算法家族，分别封装起来，让他们之间可以相互替换，此模式让算法的变化，不会影响到使用算法的用户

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNDIyMDk4,size_16,color_FFFFFF,t_70.jpeg)

```cpp
class Strategy {
public:
    virtual ~Strategy() {};
    virtual void AlgorithmInterface() = 0;
};

class ConcreteStrategyA : public Strategy{
    void AlgorithmInterface() {
        cout << "算法A实现" << endl;
    }
};

class ConcreteStrategyB : public Strategy {
    void AlgorithmInterface() {
        cout << "算法B实现" << endl;
    }
};

class ConcreteStrategyC : public Strategy {
    void AlgorithmInterface() {
        cout << "算法C实现" << endl;
    }
};

class Context {
public:
    Context(Strategy* strategy) : m_strategy(strategy) {};
    ~Context() { free_ptr(m_strategy); }
  	void SetStrategy(Strategy* strategy) {
      m_strategy = strategy;
    }
    void AlgorithmInterface() {
        m_strategy->AlgorithmInterface();
    };
private:
    Strategy* m_strategy;
};

int main() {
    Strategy* concreteStrategyA = new ConcreteStrategyA();
    Strategy* concreteStrategyB = new ConcreteStrategyB();
    Strategy* concreteStrategyC = new ConcreteStrategyC();

   	Context* context = new Context(concreteStrategyA);
  	context->AlgorithmInterface();

    context->SetStrategy(concreteStrategyB);
    context->AlgorithmInterface();

    context->SetStrategy(concreteStrategyC);
    context->AlgorithmInterface();

    free_ptr(concreteStrategyA);
    free_ptr(concreteStrategyB);
    free_ptr(concreteStrategyC);
    free_ptr(context);
    return 0;
}
```


#### Observer(观察者模式)

> 定义对象间的一种一对多的依赖关系，以便当一个对象(Subject)的状态发生改变时，所有依赖于它的对象都得道通知并自动更新。

当一个对象发生了改变，关注它的对象就会得到通知；这种交互也称为发布-订阅

观察者模式又叫发布-订阅模式、模式-视图模式

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2tlbmppYW5xaTE2NDc=,size_16,color_FFFFFF,t_70.png)

```cpp
#include <iostream>
#include <list>
using namespace std;

/*抽象观察者*/
class Observer
{
public:
    virtual void Update(int) = 0;
};

/*具体观察者*/
class ConcreteObserver : public Observer
{
public:
    ConcreteObserver(Subject *pSubject) : m_pSubject(pSubject){}

    void Update(int value)
    {
        cout << "ConcreteObserver get the update. New State:" << value << endl;
    }

private:
    Subject *m_pSubject;
};
 /*具体观察者2*/
class ConcreteObserver2 : public Observer
{
public:
    ConcreteObserver2(Subject *pSubject) : m_pSubject(pSubject){}

    void Update(int value)
    {
        cout << "ConcreteObserver2 get the update. New State:" << value << endl;
    }

private:
    Subject *m_pSubject;
};

/*具体目标*/
class ConcreteSubject : public Subject
{
public:
    void Attach(Observer *pObserver);
    void Detach(Observer *pObserver);
    void Notify();

    void SetState(int state)
    {
        m_iState = state;
    }

private:
    std::list<Observer *> m_ObserverList;//观察者列表
    int m_iState;
};

//附加观察者
void ConcreteSubject::Attach(Observer *pObserver)
{
    m_ObserverList.push_back(pObserver);
}

//移除观察者
void ConcreteSubject::Detach(Observer *pObserver)
{
    m_ObserverList.remove(pObserver);
}

//通知观察者
void ConcreteSubject::Notify()
{
    std::list<Observer *>::iterator it = m_ObserverList.begin();
    while (it != m_ObserverList.end())
    {
        (*it)->Update(m_iState);
        ++it;
    }
}

int main()
{
    // Create Subject  目标实例化
    ConcreteSubject *pSubject = new ConcreteSubject();

    // Create Observer  创建观察者
    Observer *pObserver = new ConcreteObserver(pSubject);
    Observer *pObserver2 = new ConcreteObserver2(pSubject);

    // Change the state
    pSubject->SetState(2);

    // Register the observer
    pSubject->Attach(pObserver);
    pSubject->Attach(pObserver2);

    pSubject->Notify();

    // Unregister the observer
    pSubject->Detach(pObserver);

    pSubject->SetState(3);
    pSubject->Notify();

    delete pObserver;
    delete pObserver2;
    delete pSubject;
}
```

### 单一职责

> 在软件组件的设计中，如果责任划分的不清晰，使用继承得到的结果往往是随着需求的变化，子类急剧膨胀，同时充斥着重复代码，这时候的关键是划清责任。这里并不是说其他模式无职责，只不过下面着两个模式的职责问题比较突出。

#### Decorator模式(装饰模式)

> 是在不改变原来类文件和使用继承的情况下，动态地扩展一个对象的功能。它是通过创建一个包装对象，也就是装饰来包裹真实的对象。

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/3e77e08adad83e7168733f4307dfcdd2.png)

```cpp
//饮料类
class Drinks
{
  public:
       virtual int Price() = 0;//饮料的价格
};


//奶茶类
class MilkyTea : public Drinks
{
  public:
       int Price(){
       return 10; //单独的奶茶卖10块钱一杯
       }
};

//果汁类
class FruitJuice: public Drinks
{
  public:
       int Price(){
       return 8; //单独的果汁卖8块钱一杯
       }
};

//奶茶类和果汁类都继承自饮料类--这里就是装饰器模式中所说的“原来类文件和使用继承的情况”。
//我们需要的是“动态地扩展一个对象的功能”，这里就是扩展奶茶类和果汁类的功能

//辅料类，就是装饰类Decorator，这里我们理解添加的辅料就是这些饮料的装饰
//这个装饰类是整个装饰器模式的精华，既有继承也有组合
class Decorator: public Drinks//既有继承
{
protected:
      Drinks *m_pDrinks;//也有组合

public:
      Decorator(Drinks *pDrinks) : m_pDrinks(pDrinks) {}

       virtual int Price(){
       //这里就可以加一些我们自己的操作了
       return pDrinks->Price();
       }

};

//具体的辅料（装饰）
//椰果
class Coconut : public Decorator
{
public:
     Coconut(Drinks *pDrinks) : Decorator(pDrinks) {}

     int Price(){
     return m_pDrinks->Price() + 2;//加椰果的饮料就要在原来的基础上加2块钱
     }
}

//珍珠
class Pearl: public Decorator
{
public:
     Pearl(Drinks *pDrinks) : Decorator(pDrinks) {}

     int Price(){
     return m_pDrinks->Price() + 3;//加珍珠的饮料就要在原来的基础上加3块钱
     }
}

//应用
int main()
{
   //来一杯奶茶
   Drinks *pDrinks = new MilkyTea();
   std::cout<<"Price ="<<pDrinks->Price()<<std::endl;

   //来一杯奶茶+椰果
   Decorator *pDecoratorCoconut = new Coconut(pDrinks);
   std::cout<<"Price ="<<pDecoratorCoconut->Price()<<std::endl;

   //来一杯奶茶+珍珠
   Decorator *pDecoratorPearl = new Pearl(pDrinks);
   std::cout<<"Price ="<<pDecoratorPearl->Price()<<std::endl;

   //果汁同理这里就不写了
}
```


#### Bridge模式(桥接模式)

> 将抽象部分与它的实现部分分离，使得他们都可以独立的变化

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1162428-20220221204312553-2068643313.png)

```cpp
#include <iostream>

using namespace std;

#define DELETE(pointer) delete pointer; pointer=nullptr

class Abstraction // 抽象接口
{
public:
    virtual ~Abstraction(){}
    virtual void operation() = 0;

protected:
    Abstraction() {}
};

class Implement // 实现抽象接口
{
public:
    virtual ~Implement() {}
    virtual void operation() = 0;

protected:
    Implement() {}
};

class ConcreteImplementA : public Implement // 具体实现细节类A
{
public:
    virtual void operation() override
    {
        cout << "run function ConcreteImplementA::operation()!" << endl;
    }
};

class ConcreteImplementB : public Implement // 具体实现细节类B
{
public:
    virtual void operation() override
    {
        cout << "run function ConcreteImplementB::operation()!" << endl;
    }
};

class RefinedAbstraction : public Abstraction // 具体抽象细节类
{
public:
    RefinedAbstraction(Implement* implement)
    {
        this->implement = implement;
    }
    virtual void operation() override
    {
        cout << "enter function RefinedAbstraction::operation()!" << endl;
        implement->operation();
    }

private:
    Implement* implement;
};

void doBridgeParttern()
{
    //抽象实例调用实现A
    Implement *implement = new ConcreteImplementA();
    Abstraction *abstraction = new RefinedAbstraction(implement);
    abstraction->operation();
    DELETE(implement);
    DELETE(abstraction);

    //抽象实例调用实现B
    implement = new ConcreteImplementB();
    abstraction = new RefinedAbstraction(implement);
    abstraction->operation();
    DELETE(implement);
    DELETE(abstraction);
}
```

### 对象创建

> 通过"对象创建"模式绕开new，来避免对象创建(new)过程中锁导致的紧耦合(依赖具体类)，从而支持对象创建的稳定。它是接口抽象之后的第一步工作。

#### Factory模式(工厂模式)

> 定义一个用于创建对象的接口，让子类决定实例化哪一个类。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASGVybWl0X1JhYmJpdA==,size_20,color_FFFFFF,t_70,g_se,x_16.png)

```cpp
// 鞋子抽象类
class Shoes
{
public:
    virtual ~Shoes() {}
    virtual void Show() = 0;
};

// 耐克鞋子
class NiKeShoes : public Shoes
{
public:
    void Show()
    {
        std::cout << "我是耐克球鞋，我的广告语：Just do it" << std::endl;
    }
};

// 阿迪达斯鞋子
class AdidasShoes : public Shoes
{
public:
    void Show()
    {
        std::cout << "我是阿迪达斯球鞋，我的广告语:Impossible is nothing" << std::endl;
    }
};

enum SHOES_TYPE
{
    NIKE,
    ADIDAS
};

// 总鞋厂
class ShoesFactory
{
public:
    // 根据鞋子类型创建对应的鞋子对象
    Shoes *CreateShoes(SHOES_TYPE type)
    {
        switch (type)
        {
        case NIKE:
            return new NiKeShoes();
            break;
        case ADIDAS:
            return new AdidasShoes();
            break;
        default:
            return NULL;
            break;
        }
    }
};
```


#### Abstract Factory模式(抽象工厂)

> 提供一个接口，让该接口负责创建一系列"相关或者相互依赖的对象"，无需指定它们具体的类。

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1162428-20220223152738122-2109363082.png)

```cpp
#include <iostream>

using namespace std;

//抽象工厂模式

enum CarType {
    BENZ,
    BMW
};

//车类
class Car
{
public:
    virtual void createdCar(void) = 0;
    virtual ~Car(){};
};

//高配版车类
class HighCar
{
public:
    virtual void createdCar(void) = 0;
    virtual ~HighCar(){};
};

//奔驰车
class BenzCar : public Car
{
public:
    BenzCar()
    {
        cout << "BenzCar::BenzCar()" << endl;
    }

    virtual void createdCar(void)
    {
        cout << "BenzCar::createdCar()" << endl;
    }

    ~BenzCar()
    {
        cout << "BenzCar::~BenzCar()" << endl;
    }
};

//宝马车
class BmwCar : public Car
{
public:
    BmwCar()
    {
        cout << "BmwCar::BmwCar()" << endl;
    }

    virtual void createdCar(void)
    {
        cout << "BmwCar::createdCar()" << endl;
    }

    ~BmwCar()
    {
        cout << "BmwCar::~BmwCar()" << endl;
    }
};

//奔驰高配车
class HighBenzCar : public HighCar
{
public:
    HighBenzCar()
    {
        cout << "HighBenzCar::HighBenzCar()" << endl;
    }

    virtual void createdCar(void)
    {
        cout << "HighBenzCar::createdCar()" << endl;
    }

    ~HighBenzCar()
    {
        cout << "HighBenzCar::~HighBenzCar()" << endl;
    }
};

//宝马高配车
class HighBmwCar : public HighCar
{
public:
    HighBmwCar()
    {
        cout << "HighBmwCar::HighBmwCar()" << endl;
    }

    virtual void createdCar(void)
    {
        cout << "HighBmwCar::createdCar()" << endl;
    }

    ~HighBmwCar()
    {
        cout << "HighBmwCar::~HighBmwCar()" << endl;
    }
};

//车工厂
class CarFactory
{
public:
    virtual Car *createSpecificCar(void) = 0;
    virtual HighCar *createSpecificHighCar(void) = 0;
    virtual ~CarFactory(){};
};

//奔驰车工厂
class BenzFactory : public CarFactory
{
public:
    BenzFactory(){}

    virtual Car *createSpecificCar(void)
    {
        return (new BenzCar());
    }

    virtual HighCar *createSpecificHighCar(void)
    {
        return (new HighBenzCar());
    }

    ~BenzFactory()
    {
        cout << "BenzFactory::~BenzFactory()" << endl;
    }
};

//宝马车工厂
class BmwFactory : public CarFactory
{
public:
    BmwFactory() {}

    virtual Car *createSpecificCar(void)
    {
        return (new BmwCar());
    }

    virtual HighCar *createSpecificHighCar(void)
    {
        return (new HighBmwCar());
    }

    ~BmwFactory()
    {
        cout << "BmwFactory::~BmwFactory()" << endl;
    }
};

int main()
{
    CarFactory *benzfac = new BenzFactory();
    CarFactory *bmwfac = new BmwFactory();

    Car *CardA = benzfac->createSpecificCar();
    Car *CardB = bmwfac->createSpecificCar();
    HighCar *CardC = benzfac->createSpecificHighCar();
    HighCar *CardD = bmwfac->createSpecificHighCar();

    delete CardA;
    delete CardB;
    delete CardC;
    delete CardD;

    delete benzfac;
    delete bmwfac;

    return 0;
}
```

#### Prototype模式(原型模式)

> 是一种创建型设计模式，允许一个对象再创建另外一个可定制的对象，而无需知道任何创建的细节，就是调用对象的拷贝构造函数来创建一个新的对象


![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3pvdXlhbmc4NTQ1NzAxMw==,size_16,color_FFFFFF,t_70.png)

```cpp
class Brand
{
public:
     Brand() {}
     virtual ~Brand() {}
     virtual Brand *Clone()=0;//创建对应品牌的产品
     virtual void name()=0;//返回品牌的名字
};

//那么具体的品牌类该怎么写了？
class Midea : public Brand
{
public:
     Midea() {}//构造函数
     ~Midea() {}//析构函数

     //拷贝构造函数（一定要写！！！）
     Midea(const Midea &other)
     {
        //....
     }

     //克隆，其实调用拷贝构造函数
     virtual Brand* Clone()
     {
        return new Midea(*this);
     }
};

//应用
int main()
{
   Brand *pB = new Midea();

   Brand *pClone1 = pB->Clone();//克隆了一个美的
   Brand *pClone2 = pB->Clone();//又克隆了一个
   return 0;
}
```


#### Builder模式(建造者模式)

> 将一个复杂对象的构建与其表示相分离，使得同样构建过程(稳定)可以创建不同的表示

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/8cd791ad34df4387b06a149f810016f6.png)

```cpp
class House{
public:
	//...
	virtual ~House(){}
};
class HouseBuilder{
public:
	House* GetResult(){
		return pHouse;
	}
protected:
	House* pHouse;
	virtual void BuildPart1() = 0;
	virtual void BuildPart2() = 0;
	virtual void BuildPart3() = 0;
	virtual void BuildPart4() = 0;
	virtual void BuildPart5() = 0;
};
class HouseDirector{
public:
	HouseBuilder* pHouseBuilder;
	HouseDirector(HouseBuilder* pHouseBuilder){
		this->pHouseBuilder = pHouseBuilder;
	}
	void Construct(){
		pHouseBuilder->BuildPart1();		//静态绑定，不能放在构造函数里
		for (int i = 0; i < 4; i++){
			pHouseBuilder->BuildPart2();
		}
		bool flag = pHouseBuilder->BuildPart3();
		if (flag) {
			pHouseBuilder->BuildPart4();
		}
		pHouseBuilder->BuildPart5();
	}
};
class StoneHouse : public House{
protected:
	virtual void BuildPart1(){
		//pHouse->Part1 = ...
	}
	virtual void BuildPart2(){}
	virtual void BuildPart3(){}
	virtual void BuildPart4(){}
	virtual void BuildPart5(){}
};
class StoneHouseBuilder : public HouseBuilder{
protected:
	virtual void BuildPart1(){}
	virtual void BuildPart2(){}
	virtual void BuildPart3(){}
	virtual void BuildPart4(){}
	virtual void BuildPart5(){}
};
```


### 对象性能

> 面向对象很好地解决了"抽象"的问题，但是必不可免地要付出一定的代价。对于通常情况来讲，面向对象的成本大都可以忽略不计。但是某些情况，面向对象所带来的成本必须谨慎处理。

#### Singleton模式(单例模式)

> 只有一个全局访问点，类只有一个实例对象

```cpp
#include <iostream>

class Singleton {
public:
  static Singleton& GetInstance() {
    static Singleton intance;
    return intance;
  }

  ~Singleton() = default;

private:
  Singleton() = default;
  Singleton(const Singleton&) = delete;
  Singleton& operator=(const Singleton&) = delete;
};
```

#### FlyWeight模式(享元模式)

> 主要用于共享通用对象，减少内存的使用，提升系统的访问效率。而这一部分共享对象通常比较耗费内存或者需要查询大量接口或者使用数据库资源，因此统一抽离作为共享对象使用。

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGlhb2JlaWJlaTI=,size_15,color_FFFFFF,t_70,g_se,x_16.png)

```cpp

#include <iostream>
#include <map>

using namespace std;

//侠客类
class KnightErrant
{
public:
	KnightErrant(string n) :m_name("")
	{
		m_name = n;
	}
	string getName()
	{
		return m_name;
	}
private:
	string m_name;	//侠客的名字
};

//抽象门派
class Sects{
public:
	virtual void JoinSects(KnightErrant ke) = 0;
};

//具体门派
class ConcreteSects:public Sects
{
public:
	ConcreteSects(string n) :m_name("")
	{
		m_name = n;
	}
	void JoinSects(KnightErrant ke)
	{
		cout <<"大侠："<< ke.getName().c_str()
			<< " 加入" << m_name.c_str()<< endl;
	}

private:
	string m_name;
};

//享元工厂类
class SectsFactory
{
public:
	~SectsFactory()
	{
		auto it = m_sectsMap.begin();
		for (; it != m_sectsMap.end(); it++)
		{
			if (it->second)
			{
				delete it->second;
				it->second = nullptr;
			}
		}
	}
	Sects* getSects(string name)
	{
		if (m_sectsMap.find(name) == m_sectsMap.end())
		{
			m_sectsMap[name] = new ConcreteSects(name);
		}
		return m_sectsMap[name];
	}
	int getSectsCount()
	{
		int cnt = 0;
		auto it = m_sectsMap.begin();
		for (; it != m_sectsMap.end(); it++)
		{
			cnt++;
		}
		return cnt;
	}
private:
	map<string, Sects*> m_sectsMap;
};

//客户端
int main()
{
	SectsFactory *sectsFac = new SectsFactory;
	Sects *sects = sectsFac->getSects("华山派");
	sects->JoinSects(KnightErrant("令狐冲"));
	sects->JoinSects(KnightErrant("任你行"));

	sects = sectsFac->getSects("嵩山派");
	sects->JoinSects(KnightErrant("鸠摩智"));

	sects = sectsFac->getSects("峨眉派");
	sects->JoinSects(KnightErrant("宋青书"));

	cout << "当前武林门派的个数：" << sectsFac->getSectsCount() << endl;

	if (sectsFac)
	{
		delete sectsFac;
		sectsFac = nullptr;
	}

	return 0;
}
```


### 接口隔离

> 在组件构建过程中，某些接口之间直接的依赖常常会带来很多问题，甚至根本无法实现。采用添加一层间接(稳定)接口，来隔离本来互相紧密关联的接口是一种常见的解决方案。

#### Facade模式(外观模式/门面模式)

> 是一种通过多个复杂的子系统提供一个一致的接口，而使4这些子系统更加容易被访问的模式。该模式对外有一个统一接口，外部应用程序不用憨内部子系统的具体的细节，这样会大大降低应用程序的复杂度，提高了程序的可维护性。

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/webp)

```cpp
#include <iostream>
using namespace std;

class SubSystemOne {
public:
    void MethodOne() { cout << "SubSystemOne" << endl; }
};

class SubSystemTwo {
public:
    void MethodTwo() { cout << "SubSystemTwo" << endl; }
};

class SubSystemThree {
public:
    void MethodThree() { cout << "SubSystemThree" << endl; }
};

class SubSystemFour {
public:
    void MethodFour() { cout << "SubSystemFour" << endl; }
};

class Facade {
private:
    SubSystemOne s1;
    SubSystemTwo s2;
    SubSystemThree s3;
    SubSystemFour s4;
public:
    void MethodA() { // 方法组合
        s1.MethodOne();
        s3.MethodThree();
    }
    void MethodB() { // 方法组合
        s2.MethodTwo();
        s3.MethodThree();
        s4.MethodFour();
    }
};

int main() {
    Facade f;
    f.MethodA(); // SubSystemOne
                 // SubSystemThree
    cout << endl;
    f.MethodB(); // SubSystemTwo
                 // SubSystemThree
                 // SubSystemFour
    return 0;
}
```


#### Proxy模式(代理模式)

> 是为某个对象提供一个代理对象，并且由代理对象控制对原对象访问。代理模式通俗来讲就是我们生活中常见的中介。

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1358881-20200325144924334-2060784063.png)

```cpp
#include <iostream>
using namespace std;

class Subject   // Subject类定义了RealSubject和Proxy的公用接口，这样就在任何使用RealSubject的地方都可以用Proxy
{
public:
    virtual void Request() = 0;
    virtual ~Subject() {}
};

class RealSubject : public Subject   // RealSubject类，定义了Proxy所代表的真实实体
{
public:
    void Request()
    {
        cout << "RealSubject" << endl;
    }
};

class Proxy : public Subject   // Proxy类，保存一个引用使得代理可以访问实体，并提供一个与Subject的接口相同的接口，这样代理就可以用来代替实体
{
private:
    RealSubject* realSubject;
public:
    void Request()
    {
        if (realSubject == NULL)
            realSubject = new RealSubject();
        realSubject->Request();
    }
};

int main()
{
    Proxy* p = new Proxy();
    p->Request(); // RealSubject
    delete p;
    return 0;
}

```


#### Mediator模式(中介者模式)

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/v2-c11faacdce8ef43387ae827b63389e55_1440w.webp)

```cpp

#include <string>
#include <iostream>

class Mediator;

/**
* @brief 简单概述
* @brief 对象基类
*/
class Object
{
public:
	virtual void SetMediator(Mediator*) = 0;
	virtual void SendMsg(char*) = 0;
	virtual void ReceiveMsg(char*) = 0;

protected:
	Mediator*	m_pMediator;
};

/**
* @brief 简单概述
* @brief 中介者类
*/
class Mediator
{
public:
	Mediator() {}
	void SetOBJ(Object* obj) { m_Object = obj; }
	void SendMsg(char* c)
	{
		m_Object->ReceiveMsg(c);
	}

private:
	Object* m_Object;
};


/**
* @brief 简单概述
* @brief 经理类
*/
class Manager : public Object
{
public:
	void SetMediator(Mediator* m)
	{
		m_pMediator = m;
	}
	void SendMsg(char* c)
	{
		std::cout << "Send message=>>Manager" << std::endl;
		m_pMediator->SendMsg(c);
	}
	void ReceiveMsg(char* c)
	{
		std::cout << "Receive message->Manager." << std::endl;
	}
};

/**
* @brief 简单概述
* @brief 员工类
*/
class  Staff : public Object
{
public:
	void SetMediator(Mediator* m)
	{
		m_pMediator = m;
	}
	void SendMsg(char* c)
	{
		std::cout << "Send message=>>Staff" << std::endl;
		m_pMediator->SendMsg(c);
	}
	void ReceiveMsg(char* c)
	{
		std::cout << "Receive message->Staff." << std::endl;
	}
};

/**
* @brief 简单概述
* @brief 老板类
*/
class  Boss : public Object
{
public:
	void SetMediator(Mediator* m)
	{
		m_pMediator = m;
	}
	void SendMsg(char* c)
	{
		std::cout << "Send message=>>Boss" << std::endl;
		m_pMediator->SendMsg(c);
	}
	void ReceiveMsg(char* c)
	{
		std::cout << "Receive message->Boss." << std::endl;
	}
};

int main(int argc, char* argv[])
{
	Mediator mMed;

	Manager mMgr;
	Staff	mTff;
	Boss	mBss;

	mMgr.SetMediator(&mMed);
	mTff.SetMediator(&mMed);
	mBss.SetMediator(&mMed);

	mMed.SetOBJ(&mTff);
	mMgr.SendMsg("You must finish this work today!");

	mMed.SetOBJ(&mBss);
	mMgr.SendMsg("Hi Boss,This work will be finish today!");

	mMed.SetOBJ(&mMgr);
	mBss.SendMsg("You are fired");

	mMed.SetOBJ(&mTff);
	mBss.SendMsg("You are fired");

	std::cout << "<<<<<<<<== Hello! You are a good man! ==>>>>>>>" << std::endl;
	getchar();
	return 0;
}
```


#### Adapter模式(适配器)


![结构型模式----适配器模式（C++）_类图](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/resize,m_fixed,w_1184)

```cpp
#include <iostream>
using namespace std;

//插口类，客户希望的接口
class jackSocket {
public:
    virtual void work() = 0;
};

//手机类，需要适配的类
class iPhone
{
public:
    //充电方法
    void charge()
    {
        cout << "我需要充电！！！" << endl;
    }
};

//充电器类，适配器类
class charger : public jackSocket
{

public:
    charger()
    {
        iphoneX = new iPhone;
    }

    void work()
    {
        iphoneX->charge();
    }
private:
    iPhone* iphoneX;
};

int main()
{
    jackSocket* jack = new charger;
    jack->work();

    system("pause");
    return 0;
}
```


### 状态变化

> 在组件构建过程中，某些对象的状态经常面临变化，如何对这些变化进行有效的管理？同时又维持高层模块的稳定？"状态变化"模式为这一问题提供了一种解决方案

#### Memento模式(备忘录模式)

> 在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样以后就可将该对象恢复到原先保存的状态。

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/webp-20221105182750706)

```cpp
#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Memento
{
public:
    int m_score;                 //分数
    int m_grade;             //等级
    string m_equipment ; //装备
public:
    Memento(int score,int grade,string equipment):m_score(score),m_grade(grade),m_equipment(equipment)
    {

    }
    Memento& operator=(const Memento &memento)
    {
        m_score = memento.m_score;
        m_grade = memento.m_grade;
        m_equipment = memento.m_equipment;
        return *this;
    }
};

class GamePlayer
{
public:
    GamePlayer():m_score(0),m_grade(0),m_equipment("无装备")
    {

    }
    void load(Memento memento)
    {
        m_score = memento.m_score;
        m_grade = memento.m_grade;
        m_equipment = memento.m_equipment;
    }
    Memento  save()
    {
        Memento memento(m_score,m_grade,m_equipment);
        return memento;
    }
    void show()
    {
        cout << "score: " <<m_score <<endl;
        cout << "grade: " <<m_grade <<endl;
        cout << "equipment :" <<m_equipment <<endl;
     }
private:
    int m_score;                 //分数
    int m_grade;                 //等级
    string m_equipment ; //装备

};

class Archive
{
public:
    Archive()
    {

    }
    void addItem(Memento memento)
    {
        m_mementArray.push_back(memento);
    }
    Memento Load(int state)
    {
        return m_mementArray[state];
    }
private:
    std::vector<Memento> m_mementArray;
};

int main()
{
    Archive archive;
    GamePlayer player;
    player.show();            //玩家初始化装备

    Memento memento(100,45,"青龙偃月刀");  //玩家装备记录
    player.load(memento);
    player.show();
    archive.addItem(memento);   //存档游戏
    system("pause");
    return 0;
}
```

#### State模式(状态模式)

> 当一个对象的内在状态改变时允许改变其行为，这个对象看起来像是改变了其类

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/181542449019542.png)

```cpp
#include <iostream>
using namespace std;

#define SAFE_DELETE(p) if (p) { delete p; p = NULL; }

/*声明Context类*/
class Context;

/*抽象状态类:定义一个接口以封装与Context的一个特定状态相关的行为*/
class State
{
public:
     virtual void Handle(Context *pContext) = 0;
};

/*Context类，维护一个ConcreteState子类的实例，这个实例定义当前的状态*/
class Context
{
public:
     Context(State *pState) : m_pState(pState){}

     void Request()
     {
          if (m_pState)
          {
               m_pState->Handle(this);
          }
     }

     void ChangeState(State *pState)
     {
          m_pState = pState;
     }

private:
     State *m_pState; //这里的State指针是实现特定状态相关的关键
};

class ConcreteStateA : public State
{
public:
     virtual void Handle(Context *pContext)
     {
          cout<<"I am concretestateA."<<endl;
     }
};

class ConcreteStateB : public State
{
public:
     virtual void Handle(Context *pContext)
     {
          cout<<"I am concretestateB."<<endl;
     }
};


int main()
{
     State *pStateA = new ConcreteStateA();//初始化两个具体状态类对象
     State *pStateB = new ConcreteStateB();
     Context *pContext = new Context(pStateA); //将具体状态类对象交由Context类管理

     pContext->Request();//Context类根据对象状态，调用该对象的特定函数Request
     pContext->ChangeState(pStateB); //改变对象状态
     pContext->Request();

     SAFE_DELETE(pContext);
     SAFE_DELETE(pStateB);
     SAFE_DELETE(pStateA);

     return 0;
}
```

### 数据结构

> 常常有一些组件在内部具有特定的数据结构，如果让客户程序依赖这些特定的数据结构，将极大地破坏组件的复用。这时候，将这些特定数据结构封装在内部，在外部提供统一的接口，来实现与特定数据结构无关的访问，是一种行之有效的解决方案。

#### Comosite模式(组合模式)

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/03095325-6d4e14fb112a4ef69c9352a8097a9e9f.png)

```cpp
class Company
{
public:
    Company(string name) { m_name = name; }
    virtual ~Company(){}
    virtual void Add(Company *pCom){}
    virtual void Show(int depth) {}
protected:
    string m_name;
};
//具体公司
class ConcreteCompany : public Company
{
public:
    ConcreteCompany(string name): Company(name) {}
    virtual ~ConcreteCompany() {}
    void Add(Company *pCom) { m_listCompany.push_back(pCom); } //位于树的中间，可以增加子树
    void Show(int depth)
    {
        for(int i = 0;i < depth; i++)
            cout<<"-";
        cout<<m_name<<endl;
        list<Company *>::iterator iter=m_listCompany.begin();
        for(; iter != m_listCompany.end(); iter++) //显示下层结点
            (*iter)->Show(depth + 2);
    }
private:
    list<Company *> m_listCompany;
};
//具体的部门，财务部
class FinanceDepartment : public Company
{
public:
    FinanceDepartment(string name):Company(name){}
    virtual ~FinanceDepartment() {}
    virtual void Show(int depth) //只需显示，无限添加函数，因为已是叶结点
    {
        for(int i = 0; i < depth; i++)
            cout<<"-";
        cout<<m_name<<endl;
    }
};
//具体的部门，人力资源部
class HRDepartment :public Company
{
public:
    HRDepartment(string name):Company(name){}
    virtual ~HRDepartment() {}
    virtual void Show(int depth) //只需显示，无限添加函数，因为已是叶结点
    {
        for(int i = 0; i < depth; i++)
            cout<<"-";
        cout<<m_name<<endl;
    }
};

int main()
{
    Company *root = new ConcreteCompany("总公司");
    Company *leaf1=new FinanceDepartment("财务部");
    Company *leaf2=new HRDepartment("人力资源部");
    root->Add(leaf1);
    root->Add(leaf2);

    //分公司A
    Company *mid1 = new ConcreteCompany("分公司A");
    Company *leaf3=new FinanceDepartment("财务部");
    Company *leaf4=new HRDepartment("人力资源部");
    mid1->Add(leaf3);
    mid1->Add(leaf4);
    root->Add(mid1);
    //分公司B
    Company *mid2=new ConcreteCompany("分公司B");
    FinanceDepartment *leaf5=new FinanceDepartment("财务部");
    HRDepartment *leaf6=new HRDepartment("人力资源部");
    mid2->Add(leaf5);
    mid2->Add(leaf6);
    root->Add(mid2);
    root->Show(0);

    delete leaf1; delete leaf2;
    delete leaf3; delete leaf4;
    delete leaf5; delete leaf6;
    delete mid1; delete mid2;
    delete root;
    return 0;
}
```


#### Literator(迭代器)


![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/25151517-40ba360f256240e28c14ce989ee996d5.jpg)


```cpp
#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Iterator
{
public:
    Iterator(){};
    virtual ~Iterator(){};
    virtual string First() = 0;
    virtual string Next() = 0;
    virtual string GetCur() = 0;
    virtual bool IsEnd() = 0;
};

class Aggregate
{
public:
    virtual int Count() = 0;
    virtual void Push(const string& strValue)=0;
    virtual string Pop(const int nIndex)=0;
    virtual Iterator* CreateIterator() = 0;
};

class ConcreteIterator : public Iterator
{
public:
    ConcreteIterator(Aggregate* pAggregate):m_nCurrent(0),Iterator()
    {
        m_Aggregate = pAggregate;
    }
    string First()
    {
        return m_Aggregate->Pop(0);
    }
    string Next()
    {
        string strRet;
        m_nCurrent++;
        if(m_nCurrent < m_Aggregate->Count())
        {
            strRet = m_Aggregate->Pop(m_nCurrent);
        }
        return strRet;
    }
    string GetCur()
    {
        return m_Aggregate->Pop(m_nCurrent);
    }
    bool IsEnd()
    {
        return ((m_nCurrent >= m_Aggregate->Count()) ? true: false);
    }
private:
    Aggregate* m_Aggregate;
    int m_nCurrent;
};

class ConcreteAggregate : public Aggregate
{
public:
    ConcreteAggregate():m_pIterator(NULL)
    {
        m_vecItems.clear();
    }
    ~ConcreteAggregate()
    {
        if(NULL != m_pIterator)
        {
            delete m_pIterator;
            m_pIterator = NULL;
        }
    }
    Iterator* CreateIterator()
    {
        if(NULL == m_pIterator)
        {
            m_pIterator = new ConcreteIterator(this);
        }
        return m_pIterator;
    }
    int Count()
    {
        return m_vecItems.size();
    }
    void Push(const string& strValue)
    {
        m_vecItems.push_back(strValue);
    }
    string Pop(const int nIndex)
    {
        string strRet;
        if(nIndex < Count())
        {
            strRet = m_vecItems[nIndex];
        }
        return strRet;
    }
private:
    vector<string> m_vecItems;
    Iterator* m_pIterator;
};

int main()
{
    ConcreteAggregate* pName = NULL;
    pName = new ConcreteAggregate();
    if(NULL != pName)
    {
        pName->Push("hello");
        pName->Push("word");
        pName->Push("cxue");
    }
    Iterator* iter = NULL;
    iter = pName->CreateIterator();
    if(NULL != iter)
    {
        string strItem = iter->First();
        while(!iter->IsEnd())
        {
            cout << iter->GetCur() << " is ok" << endl;
            iter->Next();
        }
    }
    system("pause");

    return 0;
}
```


#### Chain of Resposibility(职责链)


![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/03143025-4a32cc9eeb204bfd8a06f4c2f95252ae.jpg)

```cpp
#include <iostream>
#include <string>

using namespace std;

class Manager
{
protected:
    Manager *m_manager;
    string m_name;
public:
    Manager(Manager* manager,string name):m_manager(manager),m_name(name){}
    virtual void DealWithRequest(string name, int num) {}
};

//经理
class CommonManager : public Manager
{
public:
    CommonManager(Manager* manager,string name):Manager(manager,name){}
    void DealWithRequest(string name,int num)
    {
        if(num < 500)
        {
            cout << "经理" <<m_name << "批准" << name << "加薪" << num << "元" <<endl;
        }
        else
        {
            cout << "经理" << m_name << "无法处理,交由总监处理" <<endl;
            m_manager->DealWithRequest(name,num);
        }
    }
};

class Majordomo:public Manager
{
public:
    Majordomo(Manager *manager,string name):Manager(manager,name){}
    virtual void DealWithRequest(string name,int num)
    {
        if(num < 1000)
        {
            cout << "总监" <<m_name << "批准" << name << "加薪" << num << "元" <<endl;
        }
        else
        {
            cout << "总监" << m_name << "无法处理,交由总经理处理" <<endl;
            m_manager->DealWithRequest(name,num);
        }
    }
};

class GeneralManager : public Manager
{
public:
    GeneralManager(Manager *manager,string name):Manager(manager,name){}
    void DealWithRequest(string name,int num)
    {
        cout << "总经理" <<m_name << "批准" << name << "加薪" << num << "元" <<endl;
    }
};

int main()
{
    Manager *general = new GeneralManager(NULL,"a");
    Manager *majordomo = new Majordomo(general,"b");
    Manager *common = new CommonManager(majordomo,"c");
    common->DealWithRequest("d",400);
    common->DealWithRequest("d",700);
    common->DealWithRequest("d",1200);
    system("pause");
    return 0;
}
```


### 行为变化

> 在组件的构建过程中，组件行为的变化经常导致组件本身剧烈的变化。"行为变化"模式将组件的行为和组件本身进行解耦，从而支持组件行为的变化，实现两者之间的松耦合。

#### Command(命令模式)


![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1358881-20200428234049021-422378119.png)


```cpp
#include <iostream>
#include <list>
using namespace std;

// Receiver类，知道如何实施与执行一个与请求相关的操作：
class Receiver {
public:
    void Action() {
        cout << "Receiver" << endl;
    }
};

// Command类，用来声明执行操作的接口
class Command {
public:
    virtual void Excute() = 0;
    virtual void setReceiver(Receiver* r) = 0;
    virtual ~Command(){};
};

// ConcreteCommand类，绑定一个Receiver，调用其相应操作以实现Excute：
class ConcreteCommand : public Command {
private:
    Receiver* receiver;
public:
    void setReceiver(Receiver* r) {
        receiver = r;
    }
    void Excute() {
        //cout << "ConcreteCommand" << endl;
        receiver->Action();
    }
};

// 要求该命令执行这个请求：
class Invoker {
private:
    list<Command* > commands;
public:
    void setCommand(Command* c) {
        commands.push_back(c);
    }
    void Notify() {
        for (auto c = commands.begin(); c != commands.end(); c++) {
            (*c)->Excute();
        }
    }
};

// 客户端实现代码：
int main() {
    Command* c = new ConcreteCommand();
    Receiver* r = new Receiver();
    c->setReceiver(r);

    Invoker I;
    i.setCommand(c);
    i.Notify();   // Receiver

    delete r;
    delete c;

    return 0;
}
```

#### Visitor(访问器)


![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/v2-a4dbb21f208aa18b795a8fdf0583a536_1440w.webp)


```cpp
#include <string>
#include <iostream>
#include <vector>

/**
* @brief 简单概述
* @brief 访问者
*/
class Visitor
{
public:
	Visitor(std::string s) { m_sName = s; }
	std::string GetName() { return m_sName; }

private:
	std::string m_sName;
};

/**
* @brief 简单概述
* @brief 接收者基类
*/
class Receiver
{
public:
	Receiver() {}
	virtual bool Accept(Visitor*) = 0;
	std::string GetName() { return name; }

protected:
	bool m_bFree;
	std::string name;
};

/**
* @brief 简单概述
* @brief 男性接收者
*/
class ReceiverMan :public Receiver
{
public:
	ReceiverMan(std::string s)
	{
		m_bFree = false;
		name = s;
	}
	bool Accept(Visitor* v)
	{
		if (!m_bFree)
		{
			std::cout << "ReceiverMan, Visitor name:" << v->GetName() << std::endl;
			m_bFree = true;
			return true;
		}
		return false;
	}
};

/**
* @brief 简单概述
* @brief 女性接收者
*/
class ReceiverWoman :public Receiver
{
public:
	ReceiverWoman(std::string s)
	{
		m_bFree = false;
		name = s;
	}
	bool Accept(Visitor* v)
	{
		if (!m_bFree)
		{
			std::cout << "ReceiverWoman, Visitor name:" << v->GetName() << std::endl;
			m_bFree = true;
			return true;
		}
		return false;
	}
};

/**
* @brief 简单概述
* @brief 接收者管理类
*/
class ReceiverMgr
{
public:
	ReceiverMgr() {}
	bool Accept(Visitor* v)
	{
		for each (const auto& var in vec_recv)
		{
			if (var->Accept(v))
			{
				return true;
			}
		}
		std::cout << "Visit fail! visitor name:" << v->GetName() << std::endl;
		return false;
	}
	void AddReceiver(Receiver* rv)
	{
		vec_recv.push_back(rv);
	}

private:
	std::vector<Receiver*> vec_recv;
};

int main(int argc, char* argv[])
{
	Visitor vr_Lee("Lee");
	Visitor vr_John("John");
	Visitor vr_Tom("Tom");

	ReceiverMan		rv_man("man");
	ReceiverWoman	rv_woman("woman");
	ReceiverMgr		rv_mgr;
	rv_mgr.AddReceiver(&rv_man);
	rv_mgr.AddReceiver(&rv_woman);

	rv_mgr.Accept(&vr_Lee);
	rv_mgr.Accept(&vr_John);
	rv_mgr.Accept(&vr_Tom);

	getchar();
	return 0;
}
```

### 领域问题

> 在特定领域中，某些变化虽然频繁，但可以抽象为某种规则。这时候，结合特定领域，将问题抽象为语法规则，从而给出在领域下的一般性解决方案

#### Interpreter(解释器)

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/20130706193801671.gif)

```cpp
#include <iostream>
#include <map>
#include <string>

using namespace std;

class Context
{
private:
    map<string, int> valueMap;

public:
    void addValue(string key,int value)
    {
        valueMap.insert(std::pair<string,int>(key,value));
    }

    int getValue(string key)
    {
        return valueMap[key];
    }
};

class AbstractExpression
{
public :
     virtual int interpreter(Context context) = 0;
};

class AddNonterminalExpression : public AbstractExpression
{
private :
    AbstractExpression *left;
    AbstractExpression *right;

public:
    AddNonterminalExpression(AbstractExpression *left, AbstractExpression *right)
    {
        this->left = left;
        this->right = right;
    }

    int interpreter(Context context)
    {
        return this->left->interpreter(context) + this->right->interpreter(context);
    }

};

class SubtractNonterminalExpression : public AbstractExpression
{
private :
    AbstractExpression *left;
    AbstractExpression *right;

public:
    SubtractNonterminalExpression(AbstractExpression *left, AbstractExpression *right)
    {
        this->left = left;
        this->right = right;
    }

    int interpreter(Context context)
    {
        return this->left->interpreter(context) - this->right->interpreter(context);
    }

};

class TerminalExpression : public AbstractExpression
{
private :
    int i;

public :
    TerminalExpression(int i)
    {
        this->i = i;
    }

    int interpreter(Context context)
    {
        return this->i;
    }
};

int main(){
    //a-b+c
    Context context;
    context.addValue("a", 7);
    context.addValue("b", 8);
    context.addValue("c", 2);

    SubtractNonterminalExpression *subtractValue = new SubtractNonterminalExpression(new TerminalExpression(
        context.getValue("a")), new TerminalExpression(context.getValue("b")));

    AddNonterminalExpression *addValue = new AddNonterminalExpression(subtractValue, new TerminalExpression(
        context.getValue("c")));

    cout<< addValue->interpreter(context);

    return 0;
}
```

Effective C++

1. 视 C++ 为一个语言联邦（C、Object-Oriented C++、Template C++、STL）
2. 宁可以编译器替换预处理器（尽量以 `const`、`enum`、`inline` 替换 `#define`）
3. 尽可能使用const
4. 确定对象被使用前已先被初始化（构造时赋值（copy 构造函数）比 default 构造后赋值（copy assignment）效率高）
5. 了解 C++ 默默编写并调用哪些函数（编译器暗自为 class 创建 default 构造函数、copy 构造函数、copy assignment 操作符、析构函数）
6. 若不想使用编译器自动生成的函数，就应该明确拒绝（将不想使用的成员函数声明为 private，并且不予实现）
7. 为多态基类声明 virtual 析构函数（如果 class 带有任何 virtual 函数，它就应该拥有一个 virtual 析构函数）
8. 别让异常逃离析构函数（析构函数应该吞下不传播异常，或者结束程序，而不是吐出异常；如果要处理异常应该在非析构的普通函数处理）
9. 绝不在构造和析构过程中调用 virtual 函数（因为这类调用从不下降至 derived class）
10. 令 `operator=` 返回一个 `reference to *this` （用于连锁赋值）
11. 在 `operator=` 中处理 “自我赋值”
12. 赋值对象时应确保复制 “对象内的所有成员变量” 及 “所有 base class 成分”（调用基类复制构造函数）
13. 以对象管理资源（资源在构造函数获得，在析构函数释放，建议使用智能指针，资源取得时机便是初始化时机（Resource Acquisition Is Initialization，RAII））
14. 在资源管理类中小心 copying 行为（普遍的 RAII class copying 行为是：抑制 copying、引用计数、深度拷贝、转移底部资源拥有权（类似 auto_ptr））
15. 在资源管理类中提供对原始资源（raw resources）的访问（对原始资源的访问可能经过显式转换或隐式转换，一般而言显示转换比较安全，隐式转换对客户比较方便）
16. 成对使用 new 和 delete 时要采取相同形式（`new` 中使用 `[]` 则 `delete []`，`new` 中不使用 `[]` 则 `delete`）
17. 以独立语句将 newed 对象存储于（置入）智能指针（如果不这样做，可能会因为编译器优化，导致难以察觉的资源泄漏）
18. 让接口容易被正确使用，不易被误用（促进正常使用的办法：接口的一致性、内置类型的行为兼容；阻止误用的办法：建立新类型，限制类型上的操作，约束对象值、消除客户的资源管理责任）
19. 设计 class 犹如设计 type，需要考虑对象创建、销毁、初始化、赋值、值传递、合法值、继承关系、转换、一般化等等。
20. 宁以 pass-by-reference-to-const 替换 pass-by-value （前者通常更高效、避免切割问题（slicing problem），但不适用于内置类型、STL迭代器、函数对象）
21. 必须返回对象时，别妄想返回其 reference（绝不返回 pointer 或 reference 指向一个 local stack 对象，或返回 reference 指向一个 heap-allocated 对象，或返回 pointer 或 reference 指向一个 local static 对象而有可能同时需要多个这样的对象。）
22. 将成员变量声明为 private（为了封装、一致性、对其读写精确控制等）
23. 宁以 non-member、non-friend 替换 member 函数（可增加封装性、包裹弹性（packaging flexibility）、机能扩充性）
24. 若所有参数（包括被this指针所指的那个隐喻参数）皆须要类型转换，请为此采用 non-member 函数
25. 考虑写一个不抛异常的 swap 函数
26. 尽可能延后变量定义式的出现时间（可增加程序清晰度并改善程序效率）
27. 尽量少做转型动作（旧式：`(T)expression`、`T(expression)`；新式：`const_cast<T>(expression)`、`dynamic_cast<T>(expression)`、`reinterpret_cast<T>(expression)`、`static_cast<T>(expression)`、；尽量避免转型、注重效率避免 dynamic_casts、尽量设计成无需转型、可把转型封装成函数、宁可用新式转型）
28. 避免使用 handles（包括 引用、指针、迭代器）指向对象内部（以增加封装性、使 const 成员函数的行为更像 const、降低 “虚吊号码牌”（dangling handles，如悬空指针等）的可能性）
29. 为 “异常安全” 而努力是值得的（异常安全函数（Exception-safe functions）即使发生异常也不会泄露资源或允许任何数据结构败坏，分为三种可能的保证：基本型、强列型、不抛异常型）
30. 透彻了解 inlining 的里里外外（inlining 在大多数 C++ 程序中是编译期的行为；inline 函数是否真正 inline，取决于编译器；大部分编译器拒绝太过复杂（如带有循环或递归）的函数 inlining，而所有对 virtual 函数的调用（除非是最平淡无奇的）也都会使 inlining 落空；inline 造成的代码膨胀可能带来效率损失；inline 函数无法随着程序库的升级而升级）
31. 将文件间的编译依存关系降至最低（如果使用 object references 或 object pointers 可以完成任务，就不要使用 objects；如果能够，尽量以 class 声明式替换 class 定义式；为声明式和定义式提供不同的头文件）
32. 确定你的 public 继承塑模出 is-a（是一种）关系（适用于 base classes 身上的每一件事情一定适用于 derived classes 身上，因为每一个 derived class 对象也都是一个 base class 对象）
33. 避免遮掩继承而来的名字（可使用 using 声明式或转交函数（forwarding functions）来让被遮掩的名字再见天日）
34. 区分接口继承和实现继承（在 public 继承之下，derived classes 总是继承 base class 的接口；pure virtual 函数只具体指定接口继承；非纯 impure virtual 函数具体指定接口继承及缺省实现继承；non-virtual 函数具体指定接口继承以及强制性实现继承）
35. 考虑 virtual 函数以外的其他选择（如 Template Method 设计模式的 non-virtual interface（NVI）手法，将 virtual 函数替换为 “函数指针成员变量”，以 `tr1::function` 成员变量替换 virtual 函数，将继承体系内的 virtual 函数替换为另一个继承体系内的 virtual 函数）
36. 绝不重新定义继承而来的 non-virtual 函数
37. 绝不重新定义继承而来的缺省参数值，因为缺省参数值是静态绑定（statically bound），而 virtual 函数却是动态绑定（dynamically bound）
38.

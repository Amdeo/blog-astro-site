---
title: 'socket网络编程'
published: 2019-12-05
description: 'linux 网络编程 协议 什么是协议 协议就是一种规则，就是这传输的双方按照规定进行传输数据和返回数据。 典型协议 传输层，常见协议有TCP/UDP协议 应用层，常见的协议有HTTP协议，FTP协议 网络层，常见协议有…'
image: '/assets/desktop-banner/1.webp'
tags: ['网络']
category: '网络'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# socket网络编程

linux 网络编程 协议 什么是协议 协议就是一种规则，就是这传输的双方按照规定进行传输数据和返回数据。 典型协议 传输层，常见协议有TCP/UDP协议 应用层，常见的协议有HTTP协议，FTP协议 网络层，常见协议有…


## 协议

### 什么是协议

协议就是一种规则，就是这传输的双方按照规定进行传输数据和返回数据。

### 典型协议

传输层，常见协议有TCP/UDP协议

应用层，常见的协议有HTTP协议，FTP协议

网络层，常见协议有IP协议、ICMP协议、IGMP协议

网络接口层 协议有ARP协议、RARP协议

**TCP**传输控制协议是一种面向连接的、可靠的、基于字节流的传输层通信协议

**UDP**用户数据报协议是OSI参考模型中一种无连接的传输层协议，提供面向事务的简单不可靠信息传送服务。

**HTTP**超文本传输协议是互联网上应用最为广泛的一种网络协议。

**FTP**是文件传输协议

**IP**协议是因特网互联协议

**ICMP**协议是internet控制报文协议，它是TCP/IP协议族的一个子协议，用于在IP主机、路由器之间传递控制消息

**IGMP**协议是internet组管理协议是因特网协议家族中一个组播协议。该协议运行在主机和组播路由器之间。

**ARP**协议是正向地址解析协议通过已知的IP，寻找对应主机的MAC主机

**RARP**是反向地址转换协议，通过MAC地址确定IP地址


## 分层模型

### OSI七层协议

 ![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/78310a55b319ebc4e6e4dff08d26cffc1e17163e.png)

**物理层**：主要定义物理设备标准，如网线的接口类型、光纤的接口类型、各种传输介质的传输速率等。它的主要作用是传输`比特流`（就是1、0转化为电流强弱来进行传输，到达目的地后转化为1、0，也就是我i们常说的数模转换与模数转换）。

**数据链路层**：定义了如何让格式化数据以`帧`为单位进行传输，以及如何让控制对物理介质的访问。这一层通常还提供错误检测和矫正，以确保数据的可靠传输。如：串口通信中使用到的115200、8、N、1。

**网络层**：在位于不同物理位置的网络中两个主机系统之间提供连接和路径选择。internet的发展使得从世界各站点访问信息的用户数大大增加，而网络层正是这种连接的层。

**传输层**：定义了一些传输数据的协议和端口号(www端口80等)，如：TCP（传输控制协议，传输效率低，可靠性强，用于传输可靠性要求高，数据量大的数据），UDP（用户数据报协议，与TCP特性恰恰相反，用于传输可靠性要求不高，数据量小的数据，如QQ聊天数据就是通过这种方式传输的）。主要是将从下层接收的数据进行分段和传输，到达目的地址后在进行重组。

**会话层**：通过传输层（端口号：传输端口与接口端口）建立数据传输的通路。主要在你的系统之间发起会话或者接受会话请求（设备之间需要互相认识可以是IP也可以是MAC或者是主机名）。

**表示层**：可确保一个系统的应用层所发送的信息可以被另一个系统的应用层读取。例如，PC程序与另一台计算机进行通信，其中一台计算机使用扩展二一十进制交换码，而另一台则使用美国信息交换标准码（ASCII）来表示相同的字符。如有必要，表示层会通过使用一种通格式来实现多种数据格式之间的转换。

**应用层**：是靠近用户的OSI层。这一层为用户的应用程序（例如电子邮件、文件传输和终端仿真）提供网路服务。

### TCP/IP

`TCP/IP`是Transmission Control Protocol/Internet Protocol的简写，传输控制协议/因特网互联协议，又名网络通信协议，是Internet基本协议。

`TCP/IP`协议是为了解决不同系统的计算机之间的传输通信而提出的一个标准，不同系统的计算机采用同一种协议后，就能互相通信，从而建立网络连接，实现资源共享和网络通信。

`TCP/IP`协议簇按照层次由上而下可以分成4层：

![image-20200608201136398](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200608201136398.png)

**应用层**：包含所以高层协议，比如虚拟终端协议、文件传输协议、电子邮件传输协议、域名服务、超文本传送协议等等，这些就是对应用户常用的应用软件。

**传输层**：这层就是TCP协议和UDP协议这层，TCP是面向连接的协议，它提供可靠的报文传输和对上层应用的连接服务，UDP协议是面向无连接的不可靠传输的协议，主要用于不需要TCP的排序和流量控制等功能的应用程序。

**网络层**： 网络层实现数据包的选路和转发，通常使用众多分级的路由器来连接分散的主机或LAN， 该层是整个TCP/IP体系结构的关键部分，其功能是使主机把分组发往任何网络，并使分组独立地传向目标，这些分组可能经不同的网络，到达的顺序和发送的顺序也可能不同，协议包括IP协议、ICMP协议，IP协议。IP协议根据数据包的目的地址来决定如何投递它。ICMP协议（因特网控制报文协议），主要用于检测网络连接。

**网络接口层** : 或称数据链路层，该层是整个体系结构的基础部分，负责接收IP和IP数据包，通过网络向外发送，或接收处理从网络上传的物理帧，抽出IP数据包，向IP层发送。该层是主机与网络的实际连接层。数据链路层两个常用的协议是`ARP协议（地址解析协议）和RARP协议（逆地址解析协议）`，**它实现了IP地址和实际物理地址的之间的相互转换。**

**封装**


上层协议是如何使用下层协议提供的服务的呢？其实这是通过封装实现的，应用程序数据在发送到物理网络之前，需要经过传输层 ---> 网络层  ----> 链路层，每一层的协议都将在上层数据的基础上加上自己的头部信息，以实现改层的功能，这个过程就叫封装


|            |            |        |             |              |
| ---------- | ---------- | ------ | ----------- | ------------ |
| 应用层     |            |        |             | 应用程序数据 |
| 传输层     |            |        | TCP/UDP头部 | 应用程序数据 |
| 网络层     |            | IP头部 | TCP/UDP头部 | 应用程序数据 |
| 网络接口层 | 以太网头部 | IP头部 | TCP/UDP头部 | 应用程序数据 |


#### ARP协议工作原理


ARP协议能实现任意网络层地址到任意物理地址的转换，其工作原理是：主机向自己的网络广播一个ARP请求，该请求包含目标机器的网络地址，此网络上的其他机器都将收到这个请求，但只有被请求的目标机器会回应一个ARP应答，其中包含自己的物理地址。


#### DNS工作原理


我们通常使用机器的域名来访问这台机器，而不直接使用其IP地址，比如访问网站，那么如何将机器的域名转换成IP地址，这就需要使用域名查询服务，就是使用DNS协议向DNS服务器查询目标主机的IP地址。


需要访问DNS服务器，就需要知道DNS服务器的IP地址。我们需要配置DNS服务器的IP地址，常用有114.114.114.114 或者 8.8.8.8 。linux机器可以在/etc/resolv.conf文件中增加IP地址，可以配置两条IP地址（首选DNS服务器地址和备选DNS服务器地址）。


### TCP协议详解


TCP传输是可靠的，首先，TCP协议采用发送应答机制，即发送端发送的每个TCP报文段搜必须得到接收方的应答，才认为这个TCP报文段传输成功，其次，TCP协议采用超时重传机制，发送端在发送一个TCP报文之后启动定时器，如果在定时时间内未收到应答，它将重发该报文段，最后，因为TCP报文段最终是以IP数据报发送的，而IP数据报到达接收端可能乱序、重复，所有TCP协议还会对接收到的TCP报文段重排、整理，再交付给应用层。


Linux网络编程是通过socket（套接字）接口实现，socket是一种文件描述符，socket起源于UNIX，在Unix一切皆文件哲学思想下，socket是以一种“打开----读/写----关闭”模式的实现，服务器和客服端各自维护一个文件，在建立连接后，可以向自己文件写入内容供对方读取或者读取对方内容，通讯结束时关闭文件。


## socket编程

### 套接字

Socket，英文含义是“插座”，在linux环境下，用于表示进程间网络通信的特殊文件类型。本质为内核借助缓冲区形成的伪文件。

我们可以将socket看作为一个文件，可以通过文件描述符进行操作。

![image-20200627182817665](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200627182817665.png)


### 网络字节序

内存中的多字节数据相对于内存地址有大端和小端之分，磁盘文件中的多字节数据相对于文件中的偏移地址也有大端和小端之分，网络数据流同样有大端和小端之分，那么如何定义网络数据流的地址呢？发送主机通常将发送缓冲区中的数据按内存地址从低到高的顺序发出，接收主机把网络上接到的字节一次保存在接收缓冲区中，也是按内存地址从低到高的顺序保存，因此，网络数据流的地址应该这样规定：先发的数据是低地址，后发出的数据是高地址。

TCP/IP协议规定，**网络数据流应采用大端字节序**。

#### 字节序转换函数

```cpp
#include <arpa/inet.h>
```

**htonl**

```
uint32_t htonl(uint32_t hostint32);
```

功能：将32位主机字节序数据转换为网络字节序数据

参数：需要转换的43位主机字节序数据，无符号整型

返回值：若成功，返回网络字节序的值

**htons**

```
int16_t htons(uint16_t hostint16);
```

功能：将16位主机字节序数据转换成网络字节序数据

参数：hostint16，需要转换的16位主机字节序数据，uint16_t为16为无符号短整型

返回值：若成功，返回网络字节序的值

**ntohl**

```
uint32_t ntohl(uint32_t netint32);
```

功能：将32位网络字节序数据转换为主机字节序数据

参数：需要转换的32位网络字节序数据，uint32_t为32位无符号整型

返回值：若成功，返回主机字节序的值

**ntohs**

```
uint16_t ntohs(uint16_t netint16);
```

功能：将16位网络字节序数据转换成主机字节序数据

参数：需要转换的16位网络字节序数据，uint16_t为16位无符号短整型

返回值，若成功，返回主机字节序的值

> h表示host，n表示network，l表示32位长整数，s表示16位短整数

如果主机是小端字节序，这些函数将参数做相应的大小端转换然后返回，如果主机是大端字节序，这些函数不做转换，将参数原封不动地返回。

### IP地址转换

```cpp
#include <arpa/inet.h>

int inet_aton(const char *cp, struct in_addr *inp);
//转换网络主机地址cp为二进制数值，并存储在struct in_addr结构中，即第二个参数*inp
//返回值非0表示cp主机地址有效，返回0表示主机地址无效。

in_addr_t inet_addr(const char *cp);

//转换网络主机地址为网络字节序二进制值，如果参数cp无效，函数返回-1（INADDR_NONE），这个函数处理地址为255.255.255.255时，也是返回-1，这个地址是有效的，只是这个函数无法处理。

char *inet_ntoa(struct in_addr in);
//转换网络字节序排序的地址为标准的ASCII以点分开的地址，该函数返回指向点分开的字符串地址的指针，该字符串的空间为静态分配的，

```

**通用socket地址**


```cpp
#include <bits/socket.h>
struct sockaddr
{
    sa_family_t sa_family;
    char sa_data[14];
}
```


**sa_family** 成员是地址族类型（sa_family_t）的变量。地址族类型通常与协议族类型对应。


|  协议族  |  地址族  |       描述       |
| :------: | :------: | :--------------: |
| PE_UNIX  | AF_UNIX  | UNIX本地域协议族 |
| PE_INET  | AF_INET  |  TCP/IPv4协议族  |
| PF_INET6 | AF_INET6 |  TCP/IPv6协议族  |


宏PE_ * 和 AF_ *  都定义在bits/socket.h 头文件中，两者的值一样的，所以二者通常混用


**sa_data** 成员用于存放socket地址值


| 协议族   | 地址值含义和长度                                             |
| -------- | ------------------------------------------------------------ |
| PF_UNIX  | 文件的路径名，长度可达到108字节                              |
| PF_INET  | 16bit端口号和32bit IPv4地址，共6字节                         |
| PE_INET6 | 16bit端口号，32bit流标识，128bit IPv6地址，32bit 范围ID，共26字节。 |


由于原来的结构体中 sa_data根本**无法完全容纳多数协议族的地址值**。


**新的通用socket地址结构体：**


```cpp
#include <bits/socket.h>
struct sockaddr_storage
{
    sa_family_t sa_family;
    unsigned long int __ss_align;
    char __ss_padding[128-sizeof(__ss_ailgn)];
}
```


**专用socket地址**


由于之前两个socket地址结构体，操作起来很麻烦，所以linux为各个协议族提供了专门的socket地址结构体。


```cpp
#include <sys/un.h>
struct sockaddr_un
{
    sa_family_t sin_family;		/*地址族：AF_UNIX*/
    char sun_path[108];			/*文件路径名*/
}

struct sockaddr_in
{
    sa_family_t sin_family;		/*地址族：AF_INET*/
    u_int16_t sin_port;			/*端口号，要用网络字节序表示*/
    struct in_addr sin_addr;	/*IPv4 地址结构体*/
}；

struct in_addr
{
    u_int32_t s_addr;			/*IPv4 地址，要用网络字节序表示*/
}；

struct sockaddr_in6
{
    sa_family_t sin6_family;	/*地址族：AF_INET6*/
    u_int16_t sin6_port;	    /*端口号，要用网络字节序表示*/
    u_int32_t sin6_flowinfo;	/*流信息，应设置为0*/
    struct in6_addr sin6_addr;	/*IPv6 地址结构体*/
    u_int32_t sin6_scope_id;	/*scope ID，尚处于实验阶段*/
}

struct in6_addr
{
    unsigned char sa_addr[16];	/*IPv6 地址，要用网络字节序表示*/
}
```


**socket类型**


常见的socket分为3种：


1. 流式sokcet（**SOCK_STREAM**）


   流式套接字提供可靠的，面向连接的通信流；它使用TCP协议，从而保证了数据传输的正确性，和顺序性。


2. 数据报socket（**SOCK_DGRAM**）


   数据报套接字定义了一种无连接的，数据通过相互独立报文进行传输，是无序的，并且不保证是可靠、无差错的，它使用数据报协议UDP。


3. 原始socket（**SOCK_RAW**）

   原始套接字允许对底层协议如“IP”或“ICMP”进行直接访问，功能强大但使用较为不便，主要用于一些协议的开发。

**相关API**


```cpp
int socket(int domain,int type,int protocol);


int bind(int sockfd,struct sockaddr * my_addr.int addrlen);


int listen(int sockfd,int backlog);


int accept(int sockfd,struct sockaddr *addr,int *addrlen);


int connect(int sockfd,struct sockaddr* serv_addr,int addrlen);


size_t write(int fd,const void *buf,size_t nbytes)


size_t read(int fd,void *buf,size_t nbyte);


int send(int sockfd,const void *msg,int len,int flags)


int recv(int sockfd,void * buf,int len,unsigned int flags);


int sendto(int sockfd,const void *msg,int len,unsigned int flags,struct sockaddr *to,int tolen)


int recvfrom(int sockfd,void *buf,int len,unsigned int flags,struct sockaddr * from,int *fromlen)


int fcntl(int fd, int cmd, long arg)
```

### API参数取值介绍

#### socket

- *domain*

| 名称              | 含义                     |
| ----------------- | ------------------------ |
| AF_UNIX, AF_LOCAL | 本地通信                 |
| AF_INET           | IPv4 Internet协议        |
| AF_INET6          | IPv6 Internet协议        |
| AF_IPX            | IPX-Novell协议           |
| AF_NETLINK        | 内核用户界面设备         |
| AF_X25            | ITU-T X25 / ISO-8208协议 |
| AF_AX25           | Amateur radio AX.25      |
| AF_ATMPVC         | 原始ATM PVC访问          |
| AF_APPLETALK      | Appletalk                |
| AF_PACKET         | 底层包访问               |
| AF_ALG            | 内核加密API              |

- *type*

| 名称           | 含义                                                         |
| -------------- | ------------------------------------------------------------ |
| SOCK_STREAM    | TCP连接（提供序列化的、可靠的、双向连接的字节流，支持带外数据传输） |
| SOCK_DGRAM     | UDP连接（无连接状态、不可靠的报文）                          |
| SOCK_SEQPACKET | 序列化包，提供一个序列化的、可靠的、双向的基本连接的数据传输通道，数据长度定常。每次调用读系统调用时数据需要将全部数据读出 |
| SOCK_RAW       | RAW类型，提供原始网络协议访问                                |
| SOCK_RDM       | 提供可靠的数据报文，不过可能数据会有乱序                     |

- *protocol*

常取值0


#### listen

- *backlog*

  用来描述sockfd的等待连接队列能够达到的最大值。


#### send/recv/sendto/recvfrom

> sendto 和 recvfrom 中flag取值一样

- *flags*

| flags         | 说明                                                         | recv | send |
| ------------- | ------------------------------------------------------------ | ---- | ---- |
| MSG_CONFIRM   | 指示数据链路层协议持续监听对方的回应，知道得到答复，它仅用于SOCK_DGRAM和 SOCK_RAW类型的socket | N    | Y    |
| MSG_DONTROUTE | 绕过路由表查找                                               | N    | Y    |
| MSG_DONTWAIT  | 仅本操作非阻塞                                               | Y    | Y    |
| MSG_MORE      | 告诉内核应用程序还有更多数据要发送，内核将超时等待新数据写入TCP发送缓冲区后一并发送，这样可防止TCP发送过多小的报文段，从而提高传输效率 | N    | Y    |
| MSG_WAITALL   | 等待所有消息                                                 | Y    | N    |
| MSG_PEEK      | 窥看外消息                                                   | Y    | N    |
| MSG_OOB       | 发送或接收带外数据                                           | Y    | Y    |
| MSG_NOSIGNAL  | 往读端关闭的管道或者socket连接中写数据时不引发SIGPIPE信号    | N    | Y    |

**服务器端编程：**


（1）创建服务端套接字（使用socket）


（2）绑定套接字到一个IP地址和一个端口上（使用bind）


（3）将套接字设置为监听模式等待连接请求（使用listen），这个套接字就是监听套接字。


（4）请求到来后，接受连接请求，返回一个新的对应此次连接的套接字（accept）。


（5）用返回的新的套接字和客户端进行通信，即发送或接受数据（使用函数send或recv），通信结束就关闭这个套接字（使用closesocket）


（6）监听套接字继续处于监听状态，等待其他客户端的连接请求。

（7）如果要退出服务器程序，则先关闭监听套接字

```cpp
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>
int main()
{
    //创建套接字
    int serv_sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    //将套接字和IP、端口绑定
    struct sockaddr_in serv_addr;
    memset(&serv_addr, 0, sizeof(serv_addr));           //每个字节都用0填充
    serv_addr.sin_family = AF_INET;                     //使用IPv4地址
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1"); //具体的IP地址
    serv_addr.sin_port = htons(1234);                   //端口
    bind(serv_sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr));
    //进入监听状态，等待用户发起请求
    listen(serv_sock, 20);
    //接收客户端请求
    struct sockaddr_in clnt_addr;
    socklen_t clnt_addr_size = sizeof(clnt_addr);
    int clnt_sock = accept(serv_sock, (struct sockaddr *)&clnt_addr, &clnt_addr_size);

    //向客户端发送数据
    char str[] = "hello world";
    write(clnt_sock, str, sizeof(str));

    //关闭套接字
    close(clnt_sock);
    close(serv_sock);
    return 0;
}
```


### **客户端编程**


（1）创建客户端套接字（使用函数socket）


（2）向服务器发出连接请求（使用函数connect）


（3）和服务器进行通信，即发送或接收数据（使用函数send或recv）


（4）如果要关闭客户端程序，则先关闭套接字（使用函数closesocket）

```cpp
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
int main(){
    //创建套接字
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    //向服务器（特定的IP和端口）发起请求
    struct sockaddr_in serv_addr;
    memset(&serv_addr, 0, sizeof(serv_addr));  //每个字节都用0填充
    serv_addr.sin_family = AF_INET;  //使用IPv4地址
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");  //具体的IP地址
    serv_addr.sin_port = htons(1234);  //端口
    connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr));

    //读取服务器传回的数据
    char buffer[40];
    read(sock, buffer, sizeof(buffer)-1);

    printf("Message form server: %s\n", buffer);

    //关闭套接字
    close(sock);
    return 0;
}
```

### 错误处理

我们可以将使用的函数进行封装下

```cpp
#ifndef _MY_SOCKET_
#define _MY_SOCKET_

#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <stdlib.h>
#include <errno.h>
#include <unistd.h>

void perr_exit(const char *s)
{
    perror(s);
    exit(-1);
}

int Socket(int domain, int type)
{
    int sockfd;
    if ((sockfd = socket(domain, type, 0)) < 0)
    {
        perr_exit("socket Error");
    }
    return sockfd;
}

int Bind(int sockfd, const struct sockaddr *net_addr, socklen_t addrlen)
{
    if (bind(sockfd, net_addr, addrlen) < 0)
    {
        perr_exit("bind Error");
    }
    return 0;
}

int Listen(int sockfd, int backlog)
{
    int n;
    if ((n = listen(sockfd, backlog)) < 0)
    {
        perr_exit("listen Error");
    }
    return n;
}

int Accept(int sockfd, struct sockaddr *sa, socklen_t *addrlen)
{
    int clnt_sock;
again:
    if ((clnt_sock = accept(sockfd, sa, addrlen)) < 0)
    {
        if ((errno == ECONNABORTED) || (errno == EINTR))
        {
            goto again;
        }
        else
        {
            perr_exit("accept Error");
        }
    }
    return clnt_sock;
}

int Connect(int sockfd, const struct sockaddr *sa, socklen_t len)
{
    int ret;
    if ((ret = connect(sockfd, sa, len)) < 0)
    {
        perr_exit("connect Error");
    }
    return ret;
}

ssize_t Read(int sockfd, void *ptr, size_t nbytes)
{
    ssize_t n;
again:
    if ((n = read(sockfd, ptr, nbytes)) == -1)
    {
        if (errno == EINTR)
        {
            goto again;
        }
        else
        {
            return -1;
        }
    }
    return n;
}

ssize_t Write(int sockfd, const void *ptr, size_t nbytes)
{
    ssize_t n;
again:
    if ((n = write(sockfd, ptr, nbytes)) == -1)
    {
        if (errno == EINTR)
        {
            goto again;
        }
        else
        {
            return -1;
        }
    }
    return n;
}

//按照字节读取
ssize_t Readn(int sockfd, void *vptr, size_t n)
{
    size_t nleft;  //剩余未读取的字节数
    ssize_t nread; //实际读取到的字节数
    char *ptr;

    ptr = (char *)vptr;
    nleft = n;

    while (nleft > 0)
    {
        if ((nread = read(sockfd, ptr, nleft)) < 0)
        {
            if (errno == EINTR) //被中断，一个都没有读
            {
                nread = 0;
            }
            else
            {
                return -1;
            }
        }
        else if (nread == 0) //读0个字节 读取完毕
        {
            break;
        }

        nleft -= nread;
        ptr += nread;
    }
    return n - nleft;
}

ssize_t Writen(int sockfd, const void *vptr, size_t n)
{
    size_t nleft;
    ssize_t nwritten;
    const char *ptr;

    ptr = (char *)vptr;
    nleft = n;
    while (nleft > 0)
    {
        if ((nwritten = write(sockfd, ptr, nleft)) < 0)
        {
            if (nwritten < 0 && errno == EINTR)
            {
                nwritten = 0;
            }
            else
            {
                return -1;
            }
            nleft -= nwritten;
            ptr += nwritten;
        }
    }
    return n;
}
#endif
```

**字符大写转换**

**服务端**

```cpp
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <ctype.h>
#include "mysocket.h"
int main()
{
    //创建套接字
    int serv_sock = Socket(AF_INET, SOCK_STREAM);

    //将套接字和IP、端口绑定
    struct sockaddr_in serv_addr;
    memset(&serv_addr, 0, sizeof(serv_addr));           //每个字节都用0填充
    serv_addr.sin_family = AF_INET;                     //使用IPv4地址
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1"); //具体的IP地址
    serv_addr.sin_port = htons(1234);                   //端口

    Bind(serv_sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr));

    //进入监听状态，等待用户发起请求
    Listen(serv_sock, 20);

    //接收客户端请求
    struct sockaddr_in clnt_addr;
    socklen_t clnt_addr_size = sizeof(clnt_addr);

    char buffer[100] = {0};

    while (1)
    {
        int clnt_sock = Accept(serv_sock, (struct sockaddr *)&clnt_addr, &clnt_addr_size);

        int len = read(clnt_sock, buffer, 100);

        for (int i = 0; i < len; ++i)
        {
            buffer[i] = toupper(buffer[i]);
        }

        write(clnt_sock, buffer, len);

        close(clnt_sock);
    }

    //关闭套接字

    close(serv_sock);
    return 0;
}
```

客户端

```cpp
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <iostream>
#include "mysocket.h"
int main()
{
    //向服务器（特定的IP和端口）发起请求
    struct sockaddr_in serv_addr;
    memset(&serv_addr, 0, sizeof(serv_addr));           //每个字节都用0填充
    serv_addr.sin_family = AF_INET;                     //使用IPv4地址
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1"); //具体的IP地址
    serv_addr.sin_port = htons(1234);                   //端口

    //读取服务器传回的数据
    char read_buffer[100];

    char write_buffer[100];

    while (1)
    {
        //创建套接字
        int sock = socket(AF_INET, SOCK_STREAM, 0);

        Connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr));

        std::cin >> write_buffer;

        write(sock, write_buffer, strlen(write_buffer));

        read(sock, read_buffer, 100);

        printf("Message form server: %s\n", read_buffer);

        memset(read_buffer, 0, 100);
        memset(write_buffer, 0, 100);

        //关闭套接字
        close(sock);
    }

    return 0;
}
```

### 循环服务器

#### TCP

server.cpp

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "mysocket.h"
#include <string.h>
#include <iostream>

#define IP "127.0.0.1"
#define PORT 8888
#define BUFFLEN 1024

using namespace std;

int getsockfd()
{
    int sockfd = Socket(AF_INET, SOCK_STREAM);

    struct sockaddr_in server;
    memset(&server, 0, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr(IP);
    server.sin_port = htons(PORT);

    Bind(sockfd, (struct sockaddr *)&server, sizeof(server));

    Listen(sockfd, 10);

    return sockfd;
}

void handle_connect(int sockfd)
{
    struct sockaddr_in client;
    socklen_t len = sizeof(client);

    char read_buffer[BUFFLEN];
    char write_buffer[BUFFLEN];
    size_t size = 0;
    while (true)
    {
        int connfd = Accept(sockfd, (struct sockaddr *)&client, &len);

        cout << "ip: " << inet_ntoa(client.sin_addr) << " port: " << ntohs(client.sin_port) << endl;

        while (true)
        {
            size = read(connfd, read_buffer, BUFFLEN);

            if (size > 0)
            {
                cout << "接收：" << read_buffer << endl;
                strcpy(write_buffer, read_buffer);
                write(connfd, write_buffer, strlen(write_buffer) + 1);
            }
            memset(read_buffer, 0, sizeof(read_buffer));
            memset(write_buffer, 0, sizeof(write_buffer));
        }
    }
}

int main()
{
    int sockfd = getsockfd();
    handle_connect(sockfd);
    return 0;
}
```

client.cpp

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "mysocket.h"
#include <string.h>
#include <iostream>

#define IP "127.0.0.1"
#define PORT 8888
#define BUFFLEN 1024

using namespace std;

int getsockfd()
{
    int sockfd = Socket(AF_INET, SOCK_STREAM);

    struct sockaddr_in server;

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr(IP);
    server.sin_port = htons(PORT);

    Connect(sockfd, (const struct sockaddr *)&server, sizeof(server));

    return sockfd;
}

void handle_request(int sockfd)
{
    char read_buffer[BUFFLEN];
    char write_buffer[BUFFLEN];
    while (true)
    {
        cin >> write_buffer;
        write(sockfd, write_buffer, strlen(write_buffer) + 1);

        read(sockfd, read_buffer, BUFFLEN);
        cout << "接收: " << read_buffer << endl;

        memset(read_buffer,0,sizeof(read_buffer));
        memset(write_buffer,0,sizeof(write_buffer));
    }

    close(sockfd);
}

int main()
{
    int sockfd = getsockfd();
    handle_request(sockfd);
    return 0;
}
```

#### UDP

server.cpp

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "mysocket.h"
#include <string.h>
#include <iostream>

#define IP "127.0.0.1"
#define PORT 8888
#define BUFFLEN 1024

using namespace std;

int main()
{
    int sockfd = Socket(AF_INET, SOCK_DGRAM);

    struct sockaddr_in server;
    memset(&server, 0, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr(IP);
    server.sin_port = htons(PORT);

    Bind(sockfd, (struct sockaddr *)&server, sizeof(server));

    struct sockaddr_in client;
    socklen_t len = sizeof(client);

    char read_buffer[BUFFLEN];
    char write_buffer[BUFFLEN];
    size_t size = 0;

    while (true)
    {
        size = recvfrom(sockfd, read_buffer, BUFFLEN, 0, (struct sockaddr *)&client, &len);
        cout << size << endl;
        cout << "ip: " << inet_ntoa(client.sin_addr) << " port:" << ntohs(client.sin_port) << " data:" << read_buffer << endl;

        if (size > 0)
        {
            strcpy(write_buffer, read_buffer);
            sendto(sockfd, write_buffer, strlen(write_buffer) + 1, 0, (struct sockaddr *)&client, sizeof(client));
        }
        memset(read_buffer, 0, sizeof(read_buffer));
        memset(write_buffer, 0, sizeof(write_buffer));
    }
    close(sockfd);
    return 0;
}
```

client.cpp

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "mysocket.h"
#include <string.h>
#include <iostream>

#define IP "127.0.0.1"
#define PORT 8888
#define BUFFLEN 1024

using namespace std;

int main()
{
    //创建UDP套接字
    int sockfd = Socket(AF_INET, SOCK_DGRAM);

    struct sockaddr_in server;

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr(IP);
    server.sin_port = htons(PORT);

    char read_buffer[BUFFLEN];
    char write_buffer[BUFFLEN];

    struct sockaddr_in to;
    socklen_t len = sizeof(to);
    while (true)
    {
        cin >> write_buffer;

        sendto(sockfd, write_buffer, strlen(write_buffer) + 1, 0, (struct sockaddr *)&server, sizeof(server));

        recvfrom(sockfd, read_buffer, BUFFLEN, 0, (struct sockaddr *)&to, &len);

        cout << "接收: " << read_buffer << endl;

        memset(write_buffer, 0, sizeof(write_buffer));
        memset(read_buffer, 0, sizeof(read_buffer));
    }

    close(sockfd);

    return 0;
}
```

### 并发服务器

#### TCP

server.cpp

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "mysocket.h"
#include <string.h>
#include <iostream>

#define IP "127.0.0.1"
#define PORT 8888
#define BUFFLEN 1024

using namespace std;

int getsockfd()
{
    int sockfd = Socket(AF_INET, SOCK_STREAM);

    // 端口复用
    int opt = 1;
    setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, (const void *)&opt, sizeof(opt));

    struct sockaddr_in server;
    memset(&server, 0, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr(IP);
    server.sin_port = htons(PORT);

    Bind(sockfd, (struct sockaddr *)&server, sizeof(server));

    Listen(sockfd, 10);

    return sockfd;
}

void handle_connect(int sockfd)
{
    struct sockaddr_in client;
    socklen_t len = sizeof(client);

    char read_buffer[BUFFLEN];
    char write_buffer[BUFFLEN];
    size_t size = 0;
    while (true)
    {
        int connfd = Accept(sockfd, (struct sockaddr *)&client, &len);

        cout << "ip: " << inet_ntoa(client.sin_addr) << " port: " << ntohs(client.sin_port) << endl;

        while (true)
        {
            size = read(connfd, read_buffer, BUFFLEN);

            if (size > 0)
            {
                cout << "接收：" << read_buffer << endl;
                strcpy(write_buffer, read_buffer);
                write(connfd, write_buffer, strlen(write_buffer) + 1);
            }
            memset(read_buffer, 0, sizeof(read_buffer));
            memset(write_buffer, 0, sizeof(write_buffer));
        }
        close(connfd);
    }
    close(sockfd);
}

int main()
{
    int sockfd = getsockfd();

    pid_t pid[3];

    for (int i = 0; i < 3; ++i)
    {
        pid[i] = fork();

        if (pid[i] == 0)
        {
            handle_connect(sockfd);
        }
    }

    close(sockfd);
    return 0;
}
```

client.cpp

> 客户端的代码不需要重复写，使用之前循环服务器的就可以了


#### UDP

server.cpp

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "mysocket.h"
#include <string.h>
#include <iostream>

#define IP "127.0.0.1"
#define PORT 8888
#define BUFFLEN 1024

using namespace std;

void handle(int sockfd)
{

    char read_buffer[BUFFLEN];
    char write_buffer[BUFFLEN];
    size_t size = 0;
    struct sockaddr_in client;
    socklen_t len = sizeof(client);
    while (true)
    {
        size = recvfrom(sockfd, read_buffer, BUFFLEN, 0, (struct sockaddr *)&client, &len);
        cout << size << endl;
        cout << " ip: " << inet_ntoa(client.sin_addr) << " port:" << ntohs(client.sin_port) << " data:" << read_buffer << endl;

        if (size > 0)
        {
            sprintf(write_buffer, "服务端的处理进程: %d 数据: %s", getpid(), read_buffer);
            sendto(sockfd, write_buffer, strlen(write_buffer) + 1, 0, (struct sockaddr *)&client, sizeof(client));
        }
        memset(read_buffer, 0, sizeof(read_buffer));
        memset(write_buffer, 0, sizeof(write_buffer));
    }
}

int main()
{
    int sockfd = Socket(AF_INET, SOCK_DGRAM);

    struct sockaddr_in server;
    memset(&server, 0, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr(IP);
    server.sin_port = htons(PORT);

    Bind(sockfd, (struct sockaddr *)&server, sizeof(server));
    pid_t pid[3];
    for (int i = 0; i < 3; i++)
    {
        pid[i] = fork();
        if (pid[i] == 0)
        {
            handle(sockfd);
        }
    }
    close(sockfd);
    return 0;
}
```

### IO复用

linux系统在处理io操作时，一般先等数据传到 kernel  space，然后在从kernel space拷贝到用户空间（ 进程或者线程的缓冲区 ）。

下面介绍的select多路复用的机制。

#### select

- 每次调用select，需要把fd集合从用户态拷贝到内核态，内核中轮询查找所有fd，找打那个准备好的，select函数就会返回。

```cpp
#include <sys/select.h>

int select(int nfds, fd_set *readfds, fd_set *writefds,fd_set *exceptfds, struct timeval *timeout);
```

参数：

*nfds* ：被监听的文件描述符的总数，它比所有文件描述符集合中的文件描述符的最大值大1，因为文件描述符是从0开始计数的。

*readfds*： 可读 描述符集合

*writefds*： 可写 描述符集合

*exceptfds*： 异常等事件对应的描述符集合

*timeout*： 用于设置select函数的超时时间，即告诉内核select等待多长时间之后就放弃等待。timeout == NULL 表示等待无限长的时间

返回值：超时返回0，失败返回-1，成功返回大于0的整数，这个整数表示就绪描述符的数目。

```cpp
struct timeval
{
    long tv_sec;   /*秒 */
    long tv_usec;  /*微秒 */
};
```

相关的宏

```cpp
void FD_CLR(int fd, fd_set *set);	//将fd从set清除出去
int  FD_ISSET(int fd, fd_set *set); //判断fd是否在集合中
void FD_SET(int fd, fd_set *set);	 //将fd设置到set集合中去
void FD_ZERO(fd_set *set);			//将set清空
```

使用步骤：

```
fd_set readfds;

FD_ZERO(&readfds);
FD_SET(fd1,&readfds);
FD_SET(fd2,&readfds);
FD_SET(fd3,&readfds);

select ---> 返回一个准备就绪的fd总数
```

1. select 能监听的文件描述符个数受限于FD_SIZE的大小，一般为1024，单纯改变进程打开的文件描述符个数不能改变select监听文件个数
2. 解决1024以下客户端时使用select是很适合的，但如果连接客户过多，select采用的是轮询模型，会大大降低服务器响应效率，不应该在select上研究过多。

缺点：

- 将监视fd是否就绪这工作放到内核态中完成，效率会更高
- 可以监控的文件描述符最大数量为1024，就代表最大只能支持1024
- 用户进程每次讲文件描述符结合从用户态拷贝到内核态，有一定性能开销
- select函数返回后，我们只知道有文件描述符满足要求了，但不知道是哪个，所以需要遍历集合

server.cpp

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "mysocket.h"
#include <string.h>
#include <sys/select.h>
#include <iostream>
#include <ctype.h>

#define FD_SETSIZE 1024
#define BUFSIZ 1024
#define IP "127.0.0.1"
#define PORT 8888

using namespace std;

int main()
{

    int listenfd = Socket(AF_INET, SOCK_STREAM);

    struct sockaddr_in client_addr, server_addr;
    socklen_t len = sizeof(client_addr);
    bzero(&server_addr, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = inet_addr(IP);
    server_addr.sin_addr.s_addr = htons(PORT);

    Bind(listenfd, (struct sockaddr *)&server_addr, sizeof(server_addr));

    Listen(listenfd, 20);

    int nready, client[FD_SETSIZE];

    fd_set rset, allset;

    for (int i = 0; i < FD_SETSIZE; ++i)
    {
        //初始化数组
        client[i] = -1;
    }

    FD_ZERO(&allset);          //清空集合
    FD_SET(listenfd, &allset); //将监听套接字放入集合中

    int maxfd = listenfd;
    int maxi = -1;

    while (true)
    {
        rset = allset;
        nready = select(maxfd + 1, &rset, NULL, NULL, NULL);

        if (nready < 0)
        {
            perror("select Error");
            exit(-1);
        }

        //判断监听套接字是否在集合中
        if (FD_ISSET(listenfd, &rset))
        {
            int connfd = Accept(listenfd, (struct sockaddr *)&client_addr, &len);
            cout << "ip: " << inet_ntoa(client_addr.sin_addr) << " port: " << ntohs(client_addr.sin_port) << endl;

            int i;

            for (i = 0; i < FD_SETSIZE; ++i)
            {
                if (client[i] < 0)
                {
                    client[i] = connfd;
                    break;
                }

                if (i == FD_SETSIZE)
                {
                    cout << "too many clients" << endl;
                    exit(-1);
                }
            }

            if (i > maxi)
            {
                maxi = i;
            }

            if (--nready == 0)
            {
                continue;
            }
        }
        int sockfd;

        char buf[BUFSIZ];
        size_t size;

        for (int i = 0; i <= maxi; ++i)
        {
            //遍历已经登记的fd，哪个是待读取的文件描述符
            if ((sockfd = client[i]) < 0)
            {
                continue;
            }

            if (FD_ISSET(sockfd, &rset))
            {
                if ((size = read(sockfd, buf, sizeof(buf))) == 0)
                {
                    close(sockfd);
                    FD_CLR(sockfd, &allset);
                    client[i] = -1;
                }
                else if (size > 0)
                {
                    for (int j = 0; j < size; j++)
                    {
                        buf[j] = toupper(buf[j]);
                    }
                    sleep(10);
                    write(sockfd, buf, size);
                }
                if (--nready == 0)
                {
                    break;
                }
            }
        }
    }
    close(listenfd);

    return 0;
}
```


#### poll

和select原理差不多，只是解决了select只能对1024文件描述符监控的问题，poll支持的文件描述符没有数量限制，因为他们使用链表存储的，还是需要轮询和用户态和内核态的拷贝

server.cpp

```

```


#### epoll

server.cpp

```

```


 ![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/v2-14e0536d872474b0851b62572b732e39_1440w.jpg)

# select、poll、epoll之间的区别

## select

它仅仅知道了，有I/O事件发生了，却并不知道是哪那几个流（可能有一个，多个，甚至全部），我们只能无差别轮询所有流，找出能读出数据，或者写入数据的流，对他们进行操作。所以**select具有O(n)的无差别轮询复杂度**，同时处理的流越多，无差别轮询时间就越长。

## poll

poll本质上和select没有区别，它将用户传入的数组拷贝到内核空间，然后查询每个fd对应的设备状态， **但是它没有最大连接数的限制**，原因是它是基于链表来存储的.

## epoll

**epoll可以理解为event poll**，不同于忙轮询和无差别轮询，epoll会把哪个流发生了怎样的I/O事件通知我们。所以我们说epoll实际上是**事件驱动（每个事件关联上fd）**的，此时我们对这些流的操作都是有意义的。**（复杂度降低到了O(1)）**

![image-20221023221731558](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20221023221731558.png)

![image-20200731210247804](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200731210247804.png)

### epoll的两种触发模式

epoll有EPOLLLT和EPOLLET两种触发模式，LT是默认的模式，ET是“高速”模式。

LT（水平触发）模式下，只要这个文件描述符还有数据可读，每次 epoll_wait都会返回它的事件，提醒用户程序去操作；

ET（边缘触发）模式下，在它检测到有 I/O 事件时，通过 epoll_wait 调用会得到有事件通知的文件描述符，对于每一个被通知的文件描述符，如可读，则必须将该文件描述符一直读到空，让 errno 返回 EAGAIN 为止，否则下次的 epoll_wait 不会返回余下的数据，会丢掉事件。如果ET模式不是非阻塞的，那这个一直读或一直写势必会在最后一次阻塞。

![image-20200731210300948](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200731210300948.png)

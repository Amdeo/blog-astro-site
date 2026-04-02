---
title: 'Linux 定时器'
published: 2019-12-05
description: '围绕 signal、alarm、setitimer 等接口，整理 Linux 下实现定时与信号控制时最常见的基础知识。'
image: '/assets/desktop-banner/1.webp'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Linux 定时器

这篇文章整理 Linux 下和定时器相关的一批基础接口，适合在学习信号机制或写系统层程序时做速查。

## signal

```
sighandler_t signal(int signum, sighandler_t handler);
```

参数一：是一个信号。 除了SIGKILL和SIGSTOP外的任何一种信号

参数二：

1.  无返回值的函数地址
2.  SIG_IGN：忽略参数signum所指的信号
3.  SIG_DFL：恢复系统对信号的默认处理

注：当一个信号的信号处理函数执行时，如果进程又接收到了该信号，该信号会自动被储存而不会中断信号处理函数的执行，直到信号处理函数执行完毕再重新调用相应的处理函数。但是如果在信号处理函数执行时进程收到了其它类型的信号，该函数的执行就会被中断

## kill

```
int kill(pid_t pid, int sig);
```

1. 如果参数pid是正数，那么该调用将信号sig发送到进程号为pid的进程
2. 如果pid等于0，那么信号sig将发送给当前进程所属进程组里的所有进程
3. 如果参数pid等于-1，信号sig将发送给除了进程1和自身以外的所有进程
4. 如果参数pid小于-1，信号sig将发送给属于进程组-pid的所有进程
5. 如果参数sig为0，将不发送信号

## pause

```
int pause(void);
```

当前的进程暂停（进入睡眠状态），直到被信号(signal)所中断

## alarm

```
unsigned int alarm(unsigned int seconds);
```

说明：后一次设定将取消前一次的设定
注：一个进程只能有一个闹钟时间，如果在调用alarm之前已设置过闹钟时间，则任何以前的闹钟时间都被新值所代替
返回值：返回上一个闹钟时间的剩余时间，否则返回0
信号：SIGALRM

## setitimer

要求不太精确的话，使用alarm()和signal()就行了，但是如果想要实现精度较高的定时功能的话，就要使用setitimer函数

```cpp
int getitimer(int which, struct itimerval *curr_value);
int setitimer(int which, const struct itimerval *new_value, struct itimerval *old_value);
struct itimerval
{
    struct timeval it_interval; //下一次的取值
    struct timeval it_value;    //本次的设定值
};

struct timeval
{
    long tv_sec;    //秒
    long tv_usec;   //微秒，1秒 = 1000000 微秒
};
```

参数一：

1. ITIMER_REAL: 以系统真实的时间来计算，它送出SIGALRM信号
2. ITIMER_VIRTUAL: -以该进程在用户态下花费的时间来计算，它送出SIGVTALRM信号
3. ITIMER_PROF: 以该进程在用户态下和内核态下所费的时间来计算，它送出SIGPROF信号

it_interval：指定间隔时间
it_value：指定初始定时时间

1. 如果只指定it_value，就是实现一次定时
2. 如果同时指定 it_interval，则超时后，系统会重新初始化it_value为it_interval，实现重复定时
3. 两者都清零，则会清除定时器

tv_sec：提供秒级精度
tv_usec：提供微秒级精度，以值大的为先
old_value：用来保存先前的值，常设为NULL



例子：

```c
#include <stdio.h>
#include <signal.h>
#include <sys/time.h>

void print(int sig)
{
    printf("s\n");
}

int main()
{
    signal(SIGALRM,print);

    struct itimerval t;

    t.it_value.tv_sec = 1;
    t.it_value.tv_usec = 0;
    t.it_interval.tv_sec = 1;
    t.it_interval.tv_usec = 0;
    setitimer(ITIMER_REAL,&t,NULL);

    for(;;);

    return 0;
}
```

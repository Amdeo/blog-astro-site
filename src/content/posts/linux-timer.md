---
title: 'Linux 定时器'
published: 2019-12-05
description: '围绕 signal、kill、pause、alarm 和 setitimer，整理 Linux 下实现定时控制时最常见的系统接口。'
image: '/assets/desktop-banner/2.webp'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Linux 定时器

这篇文章从几个最基础的信号与定时接口出发，梳理 Linux 下实现定时功能时经常会遇到的知识点。

## signal

```cpp
sighandler_t signal(int signum, sighandler_t handler);
```

参数一是一个信号，除了 `SIGKILL` 和 `SIGSTOP` 之外，其他信号都可以处理。

参数二常见有三种写法：

1. 自定义信号处理函数地址
2. `SIG_IGN`：忽略该信号
3. `SIG_DFL`：恢复默认处理方式

需要注意的是：

- 同一种信号在处理函数执行期间再次到来，通常会先被挂起，等当前处理结束后再处理
- 如果处理函数执行期间来了其他类型的信号，则当前执行流程可能被中断

## kill

```cpp
int kill(pid_t pid, int sig);
```

- `pid > 0`：把信号发给指定进程
- `pid == 0`：把信号发给当前进程组中的所有进程
- `pid == -1`：把信号发给除进程 1 和自身外的所有进程
- `pid < -1`：把信号发给进程组 `-pid` 中的所有进程
- `sig == 0`：不发送信号，常用于探测进程是否存在

## pause

```cpp
int pause(void);
```

当前进程会进入睡眠状态，直到被某个信号中断。

## alarm

```cpp
unsigned int alarm(unsigned int seconds);
```

`alarm()` 用来设置一个秒级定时器。

- 后一次设置会覆盖前一次设置
- 一个进程同一时刻只能有一个 `alarm`
- 返回值是上一次闹钟剩余的秒数，没有则返回 `0`
- 超时后触发 `SIGALRM`

## setitimer

如果对精度要求更高，仅使用 `alarm()` 往往不够，这时可以使用 `setitimer()`。

```cpp
int getitimer(int which, struct itimerval *curr_value);
int setitimer(int which, const struct itimerval *new_value, struct itimerval *old_value);
struct itimerval
{
    struct timeval it_interval; // 下一次的取值
    struct timeval it_value;    // 本次的设定值
};

struct timeval
{
    long tv_sec;    // 秒
    long tv_usec;   // 微秒，1 秒 = 1000000 微秒
};
```

参数 `which` 常见有三种：

1. `ITIMER_REAL`：按真实时间计时，发送 `SIGALRM`
2. `ITIMER_VIRTUAL`：按用户态执行时间计时，发送 `SIGVTALRM`
3. `ITIMER_PROF`：按用户态和内核态总耗时计时，发送 `SIGPROF`

其中：

- `it_interval`：指定重复定时的时间间隔
- `it_value`：指定第一次触发前的初始时间
- `old_value`：用来保存旧的定时器值，通常可设为 `NULL`

补充说明：

1. 如果只设置 `it_value`，表示一次性定时
2. 如果同时设置 `it_interval`，超时后系统会把 `it_value` 重置为 `it_interval`，形成周期定时
3. 如果两者都清零，则表示取消当前定时器

### 示例

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
    signal(SIGALRM, print);

    struct itimerval t;

    t.it_value.tv_sec = 1;
    t.it_value.tv_usec = 0;
    t.it_interval.tv_sec = 1;
    t.it_interval.tv_usec = 0;
    setitimer(ITIMER_REAL, &t, NULL);

    for (;;);

    return 0;
}
```

---
title: 'Linux 常用 API'
published: 2020-05-23
description: '以 fork 等接口为切入点，整理 Linux 系统编程里最常用的一批 API 与基础概念。'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Linux 常用 API

这篇文章聚焦 Linux 系统编程里最常见的一批 API，适合在写进程相关程序时快速回忆接口含义和行为。

## fork

头文件：`unistd.h`

```cpp
pid_t fork(void);
```

`fork()` 调用成功后会返回两个值：

- 子进程中返回 `0`
- 父进程中返回子进程 ID
- 失败时返回 `-1`

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/20160909221749058.jpg)

从进程模型上看，子进程会继承父进程的大部分上下文信息，包括文件描述符、环境变量等。

### 父子进程共享文件描述符

如果一个进程在打开文件后再创建子进程，那么子进程会继承父进程中已经打开的文件描述符。此时父子进程共享同一份文件偏移量，因此谁先读、谁后读，结果可能不同。

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <pthread.h>
#include <assert.h>
#include <iostream>

using namespace std;

int main()
{
    cout << "程序开始运行" << endl;

    pid_t pid = fork();
    cout << "after fork()" << endl;
    if (pid == 0)
    {
        cout << "子进程创建" << endl;
    }
    else if (pid > 0)
    {
        cout << "父进程创建" << endl;
        sleep(2);
    }
    else
    {
        cout << "进程创建失败" << endl;
    }

    cout << "程序运行结束" << endl;
    return 0;
}
```

输出：

```text
程序开始运行
after fork()
父进程创建
after fork()
子进程创建
程序运行结束
程序运行结束
```

相关函数：

```cpp
getpid()   // 获取进程 id
getppid()  // 获取父进程 id
```

## vfork

头文件：`unistd.h`

```cpp
pid_t vfork(void);
```

`vfork()` 也用于创建进程，但它创建出来的子进程会先与父进程共享地址空间。

- 子进程优先运行
- 通常等子进程执行 `exec` 或 `exit` 后，父进程才继续运行

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <pthread.h>
#include <assert.h>
#include <iostream>

using namespace std;
int main()
{
    int num = 1;
    int pid = vfork();
    if (pid == 0)
    {
        num = 2;
        cout << "创建子进程" << endl;
        exit(1);
    }
    else if (pid > 0)
    {
        cout << "创建父进程" << endl;
        cout << "num:" << num << endl;
    }
    else
    {
        cout << "进程创建失败" << endl;
    }
    return 0;
}
```

### 为什么会有 vfork

因为早期 `fork` 在创建子进程时，会复制父进程的地址空间；但很多子进程马上就会执行 `exec`，前面的复制开销就显得浪费。于是 `vfork` 提供了一种更轻量的方式：让子进程先借用父进程地址空间运行，直到它执行 `exec` 或 `exit` 为止。

## clone

Linux 上创建线程通常使用 `pthread` 库，但底层也提供了 `clone` 这个系统调用。

`clone` 可以有选择地继承父进程资源：

- 可以像 `vfork` 一样共享虚拟内存
- 也可以选择不共享
- 甚至可以让新创建的执行单元与父进程不再保持传统父子关系

头文件：`sched.h`

```cpp
int clone(int (*fn)(void *), void *child_stack, int flags, void *arg);
```

常见 `flags` 示例：

| Namespace 分类 | 系统调用参数 | 含义                       |
| -------------- | ------------ | -------------------------- |
| UTS            | CLONE_NEWUTS | 提供主机名相关隔离         |
| Mount          | CLONE_NEWNS  | 提供文件系统挂载隔离       |
| PID            | CLONE_NEWPID | 提供独立的进程空间支持     |
| Network        | CLONE_NEWNET | 提供网络相关隔离           |

一个进程通常可以粗略理解为由四部分组成：

1. 需要执行的代码段
2. 自己的堆栈空间
3. 进程控制块（PCB）
4. 进程专有的 Namespace

```cpp
#include <stdio.h>
#include <malloc.h>
#include <stdlib.h>
#include <sched.h>
#include <signal.h>
#include <sys/types.h>
#include <unistd.h>

#define FIBER_STACK 8192
int a;
void *stack;

int do_something(void *)
{
    printf("This is son, the pid is:%d, the a is: %d\n", getpid(), ++a);
    free(stack);
    exit(1);
}

int main()
{
    void *stack;
    a = 1;
    stack = malloc(FIBER_STACK);

    if (!stack)
    {
        printf("The stack failed\n");
        exit(0);
    }
    printf("creating son thread!!!\n");

    clone(&do_something, (char *)stack + FIBER_STACK, CLONE_VM | CLONE_VFORK, 0);

    printf("This is father, my pid is: %d, the a is: %d\n", getpid(), a);
    exit(1);
}
```

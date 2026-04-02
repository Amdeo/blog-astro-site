---
title: 'linux多进程'
published: 2019-12-05
description: '总结 Linux 环境下 C++ 多进程开发的常见模型、通信方式与注意事项。'
image: '/src/assets/blog-placeholder-5.jpg'
tags: ['C/C++', '编程语言', '进程']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# linux多进程

**什么是进程？**

进程是一个程序的运行时，是对正在运行的程序一种抽象。

我们都知道整个计算机的核心是CPU，计算机运行实质就是通过CPU不断执行程序指令的过程，进程可以看作CPU执行程序指令的一个过程。

`由于CPU实在是太快了，那多个任务是怎么执行的呢？`

CPU其实轮流执行所有任务，具体先执行哪个后执行哪个，是有操作系统控制的（它有一个调度算法），为什么让所有程序在用户感知中是同时运行的，CPU具体执行程序的过程是这样的： 先加载进程a的上下文，然后开始执行a，保存进程a的上下文，再加载进程b的上下文，然后开始执行b，保存进程b的上下文.......就这样不停在所有程序中切换执行。

**那线程是怎么回事？**

一个程序不可能只有一条逻辑，必定会有多个分支和多个程序段，例如：当进程IO阻塞中，我们想进程在等待过程中去执行程序其他部分。那就有线程的概念，它的执行过程：程序a得到CPU，加载程序上下文，开始执行程序a的1部分，然后执行程序a的2部分。。。。

最后进程调度，CPU资源让出，保存程序a的上下文。

**进程有三种状态**

1、就绪状态

进程已获得除处理器外的所需资源，等待分配处理器资源；只要分配了处理器进程就可执行。就绪进程可以按多个优先级来划分队列。例如，当一个进程由于时间片用完而进入就绪状态时，排入低优先级队列；当进程由I/O操作完成而进入就绪状态时，排入高优先级队列。

2、运行状态

进程占用处理器资源；处于此状态的进程的数目小于等于处理器的数目。在没有其他进程可以 执行时(如所有进程都在阻塞状态)，通常会自动执行系统的空闲进程。

3、阻塞状态

由于进程等待某种条件（如I/O操作或进程同步），在条件满足之前无法继续执行。该事件发生前即使把处理机分配给该进程，也无法运行。

举个例子，你去办理业务，你需要准备好所有的材料，然后去排对，这里的过程相当于**就绪状态**，当轮到你办理业务时，就是**运行状态**，如果办理业务过程中你有什么材料不足，你需要等待其他人给你送材料，这个时候办理人员让你先去等待，他继续为其他人办理业务。这个的过程你可以看作**阻塞状态**，等待别人给你送材料就是等待满足某个事件。

> 状态转换

①就绪→执行：调度

②执行→等待：等待某个事件发生而睡眠

③等待→就绪：因等待的事件发生而唤醒

④执行→就绪：时间片用完或出现高优先

**虚拟内存**

我们知道操作系统为每一个程序分配4G的内存（有的系统可能是8G），这里的4G内存不是真正拥有4G的RAM，而是4G的虚拟内存。

内核会为每个进程维护一张页表，通过页表将虚拟地址和物理内存RAM进行映射。

![image-20200731201857653](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200731201857653.png)

每当一个页块被用完，就在RAM中申请一块新的页块，并在页表中进行映射，相反当一个页块用完被释放，对应的RAM内存也会被回收，以供其他进程使用。

**使用虚拟内存有什么好处？**

多个进程之间不会越界访问其他进程的内存，使每个进程的内存空间是隔离的。

**一个程序包含什么？**

- **二进制格式标识**：每个程序文件都包含用于描述可执行文件格式的元信息（metainformation）。

- **机器语言指令**：对程序算法进行编码。

- **程序入口地址**：标识程序开始执行时的起始指令位置。

- **数据**：程序文件包含的变量初始值和程序使用的字面常量值（比如字符串）。

- **符号表及重定位表**：描述程序中函数和变量的位置及名称。这些表格有多种用途，其中包含调试和运行时的符号解析（动态链接）。

- **共享库和动态链接信息**：程序文件所包含的一些字段，列出了程序运行时需要使用的共享库，以及加载共享库的动态链接器的路径名。

- **其它信息**：程序文件还包含许多其它信息，用以描述如何创建进程。



**进程PCB是什么？**

为了描述控制进程的运行，系统中存放进程的管理和控制信息的数据结构称为[进程控制块](https://baike.baidu.com/item/进程控制块/7205297)（PCB Process Control Block），它是进程实体的一部分，是操作系统中最重要的记录性数据结构。  它是进程管理和控制的最重要的数据结构，每一个进程均有一个PCB，在创建进程时，建立PCB，伴随进程运行的全过程，直到进程撤消而撤消。


# 进程基础

## 进程的创建

### fork

C++的fork函数用来“复制”一份主程序，即创建主进程的子进程。调用fork的同时，我的理解是，已经在内存中创建了“副本”进程，同时返回pid，所以在返回值之前，已经是主进程和子进程同时在运行了（如果fork成功的话），这样，在程序的运行过程中，一次fork返回了两次值，在父进程中，fork返回新创建子进程的进程ID，在子进程中，fork返回0，这时候就能够同时跑两个进程了。

![1560693482182-1560859901624](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1560693482182-1560859901624.png)

![1560693577868-1560859910463](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1560693577868-1560859910463.png)

![1560693782516-1560859923758](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1560693782516-1560859923758.png)

```cpp
//创建进程
pid_t fork (void)；

//获取进程ID
pid_t getpid();

//判断进程是否运行
if(0 == kill(pid,0));

//阻塞函数

```

```cpp
#include <iostream>
#include <unistd.h>
#include "common.h"
#include<unistd.h>
#include<sys/types.h>

using namespace std;

int main() {
    pid_t pid;
    int i = 0;
    cout<<"before fork\n";
    pid = fork();
    cout<<"after fork\n";
    if (pid < 0)
    {
        cout<< "fork failed" <<endl;
    }
    else if(pid == 0)   //子进程
    {
        while (i<10) {
            cout << "I am child,i = " << i << endl;
            i += 1;
        }
        cout << "child process is " << getpid() << endl;
    }
    else{
        //父进程
        //sleep(10);
        while (i<10){
            cout<<"I am parent,i = "<<i<<endl;
            i += 2;
        }

        cout<< "parent process is " <<getpid()<<endl;
    }
    cout<<"exit process\n";
    return 0;
}

/*
before fork
after fork
after fork
I am parent,i = 0
I am parent,i = 2
I am parent,i = 4
I am parent,i = 6
I am parent,i = 8
parent process is 2066
exit process
I am child,i = 0
I am child,i = 1
I am child,i = 2
I am child,i = 3
I am child,i = 4
I am child,i = 5
I am child,i = 6
I am child,i = 7
I am child,i = 8
I am child,i = 9
child process is 2067
exit process
*/
```

我们从上面的结果中看出，fork之后的代码执行了两次，子进程是从fork之后执行的，但是变量i在fork之前就定义了，在父子进程中互不影响，说明子进程复制资源和代码，并且资源是独立的。


### exec (进程替换)

### system

> system() 函数调用shell的外部命令在当前进程中开始另一个进程。

```cpp
#include <stdlib.h>
int system(const char* command);
```

参数：command,例如ls -al

返回值:

	- 失败，返回-1，当sh不能执行时，返回127
	- 成功，返回进程状态值。

```cpp
#include <stdlib.h>
#include <iostream>

using namespace std;

int main()
{
    const char *command = "ls -al";
    int ret = system(command);
    cout << "返回值：" << ret << endl;
    return 0;
}
```

![image-20200701223153044](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200701223153044.png)


### 父子进程关系

**孤儿进程**

父进程先于子进程终止

父进程退出，而它子进程还在运行，这时子进程将会成为孤儿进程。

孤儿进程将会被init进程所收养，并由init进程对它们完成状态收集。

**僵尸进程**

子进程先于父进程终止

一个子进程其父进程没有调用wait或waitpid的情况下退出，这个子进程就是僵尸进程

> 僵尸进程将会导致资源浪费，而孤儿则不会

### wait()

```cpp
#include <sys/types.h>
#include <sys/wait.h>
pid_t wait(int *status);
```

进程一旦调用wait，就会立刻阻塞自己，由wait分析是否有当前进程的某子进程已经退出，如果让它找到一个已经变成僵尸进程的子进程，wait收集这个子进程的信息，并把它彻底销毁返回，如果没有这样的进程，wait就会一直阻塞在这里，直到有一个为止。

参数status用来保存被收集进程退出时的一些状态，它是一个指向int类型的指针。但如果我们对这个子进程是如何死掉的毫不在意，只想把这个僵尸进程消灭掉，（事实上绝大多数情况下，我们都会这样想），我们就可以设定这个参数为NULL，就象下面这样：

**参数**：

| value  |                   description                    |
| :----: | :----------------------------------------------: |
| 非NULL | 则终止进程的终止状态就存放在status所指向的单元。 |
|  NULL  |        则表示父进程不关心子进程的终止状态        |

**返回值**：

|     value      | description |
| :------------: | :---------: |
| 子进程的进程号 |    成功     |
|     返回-1     |    失败     |


例子：

```cpp
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdlib.h>
#include <iostream>
using namespace std;
int main()
{
        pid_t pid;
        pid = fork();
        if(pid < 0)
        {
                cout<<"fork failed"<<endl;
        }
        else if(pid == 0)
        {
                cout<<"执行子进程"<<endl;
                sleep(10);
        }
        else
        {
                wait(NULL);
                cout<<"等待子进程结束"<<endl;
                cout<<"执行父进程"<<endl;
        }
        cout<<"进程"<<getpid()<<"执行结束"<<endl;
        return 0;
}
```

### waitpid()

```cpp
pid_t waitpid(pid_t pid, int *status, int options);
```

参数一：需要等待的进程ID

| value  |                         description                          |
| :----: | :----------------------------------------------------------: |
| pid>0  | 只等待进程ID等于pid的子进程，不管其它已经有多少子进程运行结束退出了，只要指定的子进程还没有结束，waitpid就会一直等下去。 |
| pid=-1 | 等待任何一个子进程退出，没有任何限制，此时waitpid和wait的作用一模一样。 |
| pid=0  | 等待同一个进程组中的任何子进程，如果子进程已经加入了别的进程组，waitpid不会对它做任 |
| pid<-1 | 等待一个指定进程组中的任何子进程，这个进程组的ID等于pid的绝对值。 |


参数二：

| value  |                   description                    |
| :----: | :----------------------------------------------: |
| 非NULL | 则终止进程的终止状态就存放在status所指向的单元。 |
|  NULL  |        则表示父进程不关心子进程的终止状态        |


参数三：

|   value    |                         description                          |
| :--------: | :----------------------------------------------------------: |
|  WNOHANG   | 若由pid指定的子进程未发生状态改变(没有结束)，则waitpid()不阻塞，立即返回0 |
| WUNTRACED  |          返回终止子进程信息和因信号停止的子进程信息          |
| WCONTINUED |     返回收到SIGCONT信号而恢复执行的已停止子进程状态信息      |


返回值：

|        value        | description |
| :-----------------: | :---------: |
| 返回子进程的进程号  |    成功     |
|       返回-1        |    失败     |
| 没有子进程退出返回0 |   WNOHANG   |


## linux进程间通信

实现进程间通信方式有5种：

- 管道
- 信号
- 消息队列
- 信号量
- 套接字

### 管道

管道是Linux 中进程间通信的一种方式，它把一个程序的输出直接连接到另一个程序的输入，Linux 的管道主要包括两种：无名管道和有名管道。

#### 无名管道

`使用限制`：

- 半双工的通信，数据只能单向流动
- 只能在亲缘关系的进程间使用

##### 创建与关闭

无名管道是基于文件描述符的通信方式。当一个管道创建时，它会创建两个文件描述符：fd[0] 、fd[1] 。其中 **fd[0]** 固定用于`读管道`，而 **fd[1]** 固定用于`写管道`。

> **无名管道只能用于父子进程之间的通信**

 ![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/2-1Q1021A24L06.gif)

管道关闭时只需要用 **close()** 函数将这两个文件描述符关闭即可。

```cpp
#include <unistd.h>
int pipe(int fd[2])
```

参数

| value | discription |
| ----- | ----------- |
| fd    | 文件描述符  |

返回值

| value | description |
| ----- | ----------- |
| -1    | 失败        |
| 非-1  | 成功        |

```cpp
//无名管道
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main(int arg, char * args[])
{
    //定义文件描述符数组
    int fdarr[2] = { 0 };
    int no = 0;
    int status;
    //create the conduit  创建一个管道 并且打开两个文件描述符
    //管道中，第一个文件描述符只读,第二个文件描述符只写
    no = pipe(fdarr);
    if (no == -1)
    {
        printf("pipe() is failed ! message :%s\n", strerror(errno));
        return -1;
    }
    //创建父子进程
    pid_t child = fork();
    if (child == -1)
    {
        printf("system is game over !\n");
        return -1;
    }
    //定义缓存字符串数组
    char buf[100] = { 0 };
    if (child == 0)
    {
        /*
         管道和文件一样，文件read函数以O_RDONLY方式打开也会阻塞，但是文件数据在本地，读取非常快，感觉不到阻塞，但是管道以O_RDONLY方式打开，会阻塞进程,read()函数会等待管道另一端写入数据，直到另一端关闭文件描述符
        */
        //关闭子进程中的写文件描述符--对于父子进程共享文件描述符，只在单个进程中关闭，只能将文件描述符引用减一，
        //因为父子进程中，文件描述符被引用了两次，所以需要在父子进程中分别关闭，才能使文件描述符引用次数减一
        close(fdarr[1]);
        while (read(fdarr[0], buf, sizeof(buf)) > 0)
        {
            printf("%s", buf);
            //清空缓存区
            memset(buf, 0, sizeof(buf));
        }
        //关闭子进程中读文件描述符
        close(fdarr[0]);
    }
    else
    {
        //关闭父进程中的读描述符
        close(fdarr[0]);
        //将键盘输入数据写入到管道中
        strcpy(buf,"fly on air!\n");
        write(fdarr[1], buf, strlen(buf));
        //关闭管道写文件描述符
        close(fdarr[1]);
        //等待子进程结束
        wait(&status);
        printf("child process is close ! message :%d\n", WEXITSTATUS(status));
    }
    return 10;
}
```

#### 有名管道（命令管道）

> **用于运行于同一系统中的任意两个进程间的通信**。

创建FIFO

```cpp
#include <sys/types.h>
#include <sys/stat.h>
int mkfifo(const char * pathname, mode_tmode)
```

或者可以使用shell创建命令管道

```
mkfifo /ipc/namefifo
```

参数一

| value  | description    |
| ------ | -------------- |
| 字符串 | 有名管道文件名 |

参数二: 与打开普通文件open()函数中的mode参数相同

返回值：

| value | description       |
| ----- | ----------------- |
| 0     | 成功              |
| -1    | 失败，errno被设置 |

打开FIFO文件通常有四种方式

```cpp
open(const char *path, O_RDONLY);//1
open(const char *path, O_RDONLY | O_NONBLOCK);//2
open(const char *path, O_WRONLY);//3
open(const char *path, O_WRONLY | O_NONBLOCK);//4
```

例：

```cpp
#include <iostream>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <string.h>
#include <sys/wait.h>

using namespace std;

int main()
{
    const char *fifo_path = "./test_fifo";
    int fd;
    char buf[2014];
    char str[] = "hello world";
    if (mkfifo(fifo_path, 0666) < 0 && errno != EEXIST)
    {
        perror("error");
        exit(1);
    }
    pid_t pid;
    if ((pid = fork()) == 0)
    {
        fd = open(fifo_path, O_RDONLY);
        read(fd, buf, 1024);
        cout << "the buf is " << buf << endl;
        close(fd);
        exit(1);
    }
    sleep(2);
    fd = open(fifo_path, O_WRONLY);
    write(fd, str, strlen(str) + 1);
    close(fd);

    waitpid(pid, NULL, 0);
    exit(0);
    return 0;
}
```

### 信号

信号是在软件层次上对中断机制的一种模拟，在原理上，一个进程收到一个信号与处理器收到一个中断请求可以说是一样的，信号是异步的，一个进程不必通过任何操作来等待信号的到达，进程也不知道信号到底什么时候到达。

信号是进程间通信机制中唯一的异步通信机制，信号机制进过POSIX实时扩展后，功能更加强大，除了基本通知功能外，还可以传递附加信息。

信号的分类：

（1）硬件异常产生的信号

（2）软件条件出发的信号

（3）用户按某些终端键时产生的信号，比如用户按CTRL+C键将会产生SIGINT信号

（4）用户使用kill命令将信号发送给进程。kill命令的语法是这样的。

（5）进程使用系统调用函数kill将信号发送一个进车或一组进程。

Linux使用信号主要有两个目的：一是让进程意识到发生一个特定的事件，二是迫使进程执行包含在其自身代码中的信号处理信号。

（1）忽略信号，进程将忽略这个信号的出现，但有两个信号不能被忽略：SIGKILL和SIGSTOP

（2）执行与这个信号相关的默认操作

（3）调用相应的信号处理函数来捕获信号，进程可以事先登记特殊的信号处理函数，当进程收到信号，信号处理函数被调用，当从信号处理函数返回后，被中断的进程将从其断点处重新开始执行。

**使用kill发送信号**

```cpp
#include <sys/types.h>
#include <signal.h>
int kill(pid_t pid,int sig);
```

参数：

- pid：进程号
- sig：信号编号

**在进程中自举一个信号**

```cpp
#include <sys/types.h>
#include <signal.h>
int raise(int sig);
```

参数:

- sig：信号编号



查看linux系统中定义了的信号`kill -l`

![image-20200701234639927](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200701234639927.png)


```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <signal.h>
#include <iostream>

using namespace std;

int main(void)
{
        //创建进程
        pid_t pid = fork();
        int status;
        int retval;
        if(pid < 0)
        {
                return -1;
        }
        else if(pid == 0)
        {
                //子进程
                cout<<"In child process"<<endl;
                sleep(100);
                exit(EXIT_SUCCESS);
        }
        else if(pid > 0)
        {
                //父进程
                if(0 == (waitpid(pid,&status,WNOHANG))) //判断子进程是否已经退出
                {
                        retval = kill(pid,SIGKILL); //向pid进程发送信号

                        if(retval)
                        {
                                cout<<"kill failed.\n";
                                perror("kill");
                                waitpid(pid,&status,0);
                        }
                        else
                        {
                                cout<<pid<<" killed\n";
                        }

                }
        }
        exit(EXIT_SUCCESS);
}

/*
结果：
120199 killed
*/
```

**使用sigaction查询或设置信号处理方式**

```cpp
#include <signal.h>
int sigaction(int signum, const struct sigaction *act,struct sigaction *oldact);

struct sigaction
{
    void (* sa_handler)(int);	//信号处理函数
    void (* sa_sigaction)(int ,siginfo_t *,void *); //另一个信号处理函数
    sigset_t sa_mask; //用来指定在信号处理函数执行期间需要被屏蔽的信号
    int sa_flags;
    void (* sa_restorer)(void); //已经废弃的数据域，不要使用
}
```

sa_flags

| value        | ddescription                                                 |
| ------------ | ------------------------------------------------------------ |
| SA_RESTART   | 使被信号打断的系统调用自动重新发起                           |
| SA_NOCLDSTOP | 使父进程在它的子进程暂停或继续运行时不会收到SIGCHLD信号      |
| SA_NOCLDWAIT | 使父进程在它的子进程退出时不会收到SIGCHLD信号，这是子进程如果退出，也不会成为僵尸进程。 |
| SA_NODEFER   | 使对信号的屏蔽无效，即在信号处理函数执行期间，仍能发出这个信号。 |
| SA_RESETHAND | 信号处理之后重新设置为默认的处理方式。                       |
| SA_SIGINFO   | 使用sa_sigaction成员而不是sa_handler作为信号处理函数         |


```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <signal.h>
#include <iostream>

using namespace std;
//信号处理函数
static void sig_usr(int signum)
{
	if(signum == SIGUSR1)
    {
        cout<<"SIGUSR1 received\n";
    }
    else if(signum == SIGUSR2)
    {
        cout<<"SIGUSR2 received\n";
    }
    else
    {
		cout<<"signal "<<signum<<" received\n";
    }
}

int main()
{
    char buf[512];
    int n;
    struct sigaction sa_usr;
    sa_usr.sa_flags = 0;
    sa_usr.sa_handler = sig_usr; //信号处理函数

    sigaction(SIGUSR1,&sa_usr,NULL);
    sigaction(SIGUSR2,&sa_usr,NULL);
    cout<<"My PID is "<<getpid()<<"\n";
    while(1)
    {
        if((n = read(STDIN_FILENO,buf,511) == -1))
        {
            if(errno == EINTR)
            {
                cout<<"read is interrupted by signal\n";
            }
        }
        else
        {
            buf[n] = '\0';
            cout<<n<<"bytes read: "<<buf<<"\n";
        }

    }
    return 0;
}
```

```cpp
结果：
My PID is xxxxx

kill -USR1 xxxxx

SIGUSR1 received
read is interrupted by signal
```

**系统调用sigprocmask的使用**

。。。。。。。。。。。。。。。。。

**使用sigpending检查是否挂起的信号**

。。。。。。。。。。。。。。。。。

**使用signal设置信号处理程序**

```cpp
#include <signal.h>
typedef void(* sighandler_t)(int);
sighandler_t signal(int signum,sighandler_t handler);
```

参数signum

| value   | description                        |
| ------- | ---------------------------------- |
| SIG_ING | 忽略信号                           |
| SIG_DFL | 表示恢复对信号的系统默认处理方式。 |

参数handler表示自定义的信号处理函数

忽略SIGINT信号

```cpp
#include <stdio.h>
#include <signal.h>

int main()
{
    signal(SIGINT,SIG_IGN);	//忽略SIGINT信号
    while(1);
    return 0;
}

/*
多次按下ctrl + C键，并没有使得程序退出。
*/
```


自定义信号SIGINT的处理

```cpp
#include <stdio.h>
#include <signal.h>

typedef void (*signal_handler)(int);
void signal_hander_fun(int signum)
{
    printf("catch signal %d\n",signum); //在键盘按CTRL+C键，就会打印这个。
}

int main()
{
    signal(SIGINT,signal_hander_fun);
    while(1);
    return 0;
}
```

### 消息队列

消息队列类似有名管道，但是没有与打开和关闭管道的复杂关联。然而，使用消息队列并没有解决有名管道所遇到的问题，例如管道的阻塞。

消息队列提供了一种在两个不相关的进程之间传递数据的而简单高效的方法，与有名管道比较起来，消息队列的优点在独立于发送与接收进程，这减少了打开与关闭有名管道之间同步的困难。

消息队列提供一种由一个进程向另一个进程发送块数据的方式。另外，每一个数据块被看作有一个类型，而接收进程可以独立接收具有不同类型的数据块。消息队列的好处在于我们几乎可以完全避免同步问题，并且可以通过发送消息屏蔽有名管道的问题。更好的是，我们可以使用某些紧急方式发送消息。坏处在于，与管道类似，在每一个数据块上有一个最大尺寸限制，同时在系统中所有消息队列的块尺寸上也有一个最大尺寸限制。

```cpp
#include <sys/msg.h>

//生成一个键值
key_t ftok(char * fname,int id);

//创建和打开消息队列
int msgget(key_t key,int msgflg);

//获取和设置消息队列的属性
int msgctl(int msqid,int cmd,struct msqid_ds *buf);

//将消息送入消息队列的函数
int msgsnd(int msqid,const void *msgp,size_t msgsz,int msgflg);

//从消息队列中读取一条新消息的函数
int msgrcv(int msqid,void *msg_ptr,size_t msg_sz,long int msgtype,int msgflg);

```

server.cpp

```cpp
#include <iostream>
#include <stdlib.h>
#include <sys/msg.h>
#include <sys/ipc.h>
#include <string.h>
#include <stdio.h>

using namespace std;

//主要用于两个不相关的进程

typedef struct
{
    long type;
    char str[100];
} msg;

int main()
{
    int id;
    if ((id = msgget(key_t(1234), IPC_CREAT | 0666)) < 0)
    {
        perror("msgget");
        return 0;
    }

    char buffer[100];
    msg msgdata;
    while (1)
    {
        cout << "input data:" << endl;
        fgets(buffer, 100, stdin);
        msgdata.type = 1;
        strcpy(msgdata.str, buffer);
        if (msgsnd(id, (void *)&msgdata, 512, 0) < 0)
        {
            perror("msgsnd");
            return 0;
        }

        if (strcmp(msgdata.str, "QUIT") == 0)
        {
            break;
        }
    }

    return 0;
}
```

client.cpp

```cpp
#include <iostream>
#include <stdlib.h>
#include <sys/msg.h>
#include <sys/ipc.h>
#include <string.h>
#include <stdio.h>

using namespace std;

//主要用于两个不相关的进程
typedef struct
{
    long type;
    char str[100];
} msg;

int main()
{
    int id;
    if ((id = msgget(key_t(1234), IPC_CREAT | 0666)) < 0)
    {
        perror("msgget");
        return 0;
    }

    msg msgdata;
    while (1)
    {

        if (msgrcv(id, (void *)&msgdata, 512, 1, 0) < 0)
        {
            perror("msgrcv");
            return 0;
        }
        cout << "type: " << msgdata.type << endl;
        cout << "msg: " << msgdata.str << endl;

        if (strcmp(msgdata.str, "QUIT") == 0)
        {
            break;
        }
    }

    if (msgctl(id, IPC_RMID, NULL) < 0)
    {
        cout << "del msg error" << endl;
        return 0;
    }
    return 0;
}
```

### 共享内存

> 共享内存实际就是两个进程的页表指向同一块物理内存，使得多个进程可以使用同一块内存区域。

 共享内存就是允许两个或多个进程共享一定的存储区。就如同 malloc() 函数向不同进程返回了指向同一个物理内存区域的指针。当一个进程改变了这块地址中的内容的时候，其它进程都会察觉到这个更改。因为数据不需要在客户机和服务器端之间复制，数据直接写到内存，不用若干次数据拷贝，所以这是最快的一种IPC。

 ![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1169746-20181006220403794-1279738779.png)

```cpp
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>

//创建共享内存
int shmget(key_t key, size_t size, int shmflg);

//操作共享内存
int shmctl(int shm_id, int cmd, struct shmid_ds *buf);

//将共享内存连接到当前进程的地址空间
void *shmat(int shm_id, const void *shm_addr, int shmflg);

//把共享内存从当前进程中分离
int shmdt(const void *shmaddr);
```

shmdata.h

```cpp
#ifndef _SHMDATA_H_HEADER
#define _SHMDATA_H_HEADER
#define TEXT_SZ 2048
struct shared_use_st
{
    int written;//作为一个标志，非0：表示可读，0表示可写
    char text[TEXT_SZ];//记录写入和读取的文本
};
#endif
```

 shmread.c

```cpp
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <sys/shm.h>
#include "shmdata.h"
int main()
{
    int running = 1;//程序是否继续运行的标志
    void *shm = NULL;//分配的共享内存的原始首地址
    struct shared_use_st *shared;//指向shm
    int shmid;
    //共享内存标识符 //创建共享内存
    shmid = shmget((key_t)1234, sizeof(struct shared_use_st), 0666|IPC_CREAT);
    if(shmid == -1)
    {
        fprintf(stderr, "shmget failed\n");
        exit(EXIT_FAILURE);
    }
    //将共享内存连接到当前进程的地址空间
    shm = shmat(shmid, 0, 0);
    if(shm == (void*)-1)
    {
        fprintf(stderr, "shmat failed\n");
        exit(EXIT_FAILURE);
    }
    printf("\nMemory attached at %X\n", (int)shm);  //设置共享内存
    shared = (struct shared_use_st*)shm;
    shared->written = 0;
    while(running)//读取共享内存中的数据
    {
        //没有进程向共享内存定数据有数据可读取
        if(shared->written != 0)
        {
            printf("You wrote: %s", shared->text);
            sleep(rand() % 3);          //读取完数据，设置written使共享内存段可写
            shared->written = 0;         //输入了end，退出循环（程序）
            if(strncmp(shared->text, "end", 3) == 0)
                running = 0;
        }
        else//有其他进程在写数据，不能读取数据
            sleep(1);
    }   //把共享内存从当前进程中分离
    if(shmdt(shm) == -1)
    {
        fprintf(stderr, "shmdt failed\n");
        exit(EXIT_FAILURE);
    }   //删除共享内存
    if(shmctl(shmid, IPC_RMID, 0) == -1)
    {
        fprintf(stderr, "shmctl(IPC_RMID) failed\n");
        exit(EXIT_FAILURE);
    }
    exit(EXIT_SUCCESS);
}
```

 shmwrite.c

```cpp
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <sys/shm.h>
#include "shmdata.h"
int main()
{
    int running = 1;
    void *shm = NULL;
    struct shared_use_st *shared = NULL;
    char buffer[BUFSIZ + 1];//用于保存输入的文本
    int shmid;
    //创建共享内存
    shmid = shmget((key_t)1234, sizeof(struct shared_use_st), 0666|IPC_CREAT);
    if(shmid == -1)
    {
        fprintf(stderr, "shmget failed\n");
        exit(EXIT_FAILURE);
    }
    //将共享内存连接到当前进程的地址空间
    shm = shmat(shmid, (void*)0, 0);
    if(shm == (void*)-1)
    {
        fprintf(stderr, "shmat failed\n");
        exit(EXIT_FAILURE);
    }
    printf("Memory attached at %X\n", (int)shm);    //设置共享内存
    shared = (struct shared_use_st*)shm;
    while(running)//向共享内存中写数据
    {   //数据还没有被读取，则等待数据被读取,不能向共享内存中写入文本
        while(shared->written == 1)
        {
            sleep(1);
            printf("Waiting...\n");
        }       //向共享内存中写入数据
        printf("Enter some text: ");
        fgets(buffer, BUFSIZ, stdin);
        strncpy(shared->text, buffer, TEXT_SZ);      //写完数据，设置written使共享内存段可读
        shared->written = 1;     //输入了end，退出循环（程序）
        if(strncmp(buffer, "end", 3) == 0)
            running = 0;
    }
    //把共享内存从当前进程中分离
    if(shmdt(shm) == -1)
    {
        fprintf(stderr, "shmdt failed\n");
        exit(EXIT_FAILURE);
    }
    sleep(2);
    exit(EXIT_SUCCESS);
}
```

### 信号量

信号量本质上是一个计数器（不设置全局变量是因为进程间是相互独立的，而这不一定能看到，看到也不能保证++引用计数为原子操作）,用于多进程对共享数据对象的读取，它和管道有所不同，==它不以传送数据为主要目的==，==它主要是用来保护共享资源（信号量也属于临界资源）==，使得资源在一个时刻只有一个进程独享。

工作原理：

由于信号量只能进行两种操作==等待和发送信号==，即P(sv)和V(sv),他们的行为是这样的：

（1）P(sv)：如果sv的值大于零，就给它减1；如果它的值为零，就挂起该进程的执行

（2）V(sv)：如果有其他进程因等待sv而被挂起，就让它恢复运行，如果没有进程因等待sv而挂起，就给它加1.

在信号量进行PV操作时都为原子操作（因为它需要保护临界资源）

注：原子操作：单指令的操作称为原子的，单条指令的执行是不会被打断的

```cpp
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>

//创建信号量
int semget(key_t key,int nsems,int flags);

//修改信号量
int semctl(int semid, int semnum, int cmd, ...);

//用于信号量的初始化和删除
int semop(int semid, struct sembuf *sops, size_t nops);
```

例：

```cpp
#include<stdio.h>
#include<stdlib.h>
#include<sys/sem.h>
union semun
{
    int val;
    struct semid_ds *buf;
    unsigned short *array;
};
int sem_id;
int set_semvalue()
{
    union semun sem_union;
    sem_union.val = 1;
    if(semctl(sem_id,0,SETVAL,sem_union)==-1)
        return 0;
    return 1;
}
int semaphore_p()
{
    struct sembuf sem_b;
    sem_b.sem_num = 0;
    sem_b.sem_op = -1;
    sem_b.sem_flg = SEM_UNDO;
    if(semop(sem_id,&sem_b,1)==-1)
    {
        fprintf(stderr,"semaphore_p failed\n");
        return 0;
    }
    return 1;
}
int semaphore_v()
{
    struct sembuf sem_b;
    sem_b.sem_num = 0;
    sem_b.sem_op = 1;
    sem_b.sem_flg = SEM_UNDO;
    if(semop(sem_id,&sem_b,1)==-1)
    {
        fprintf(stderr,"semaphore_v failed\n");
        return 0;
    }
    return 1;
}
void del_semvalue()
{
    //删除信号量
    union semun sem_union;
    if(semctl(sem_id,0,IPC_RMID,sem_union)==-1)
        fprintf(stderr,"Failed to delete semaphore\n");
}
int main(int argc,char *argv[])
{
    char message = 'x';
    //创建信号量
     sem_id = semget((key_t)1234,1,0666|IPC_CREAT);
    if(argc>1)
    {
        //初始化信号量
        if(!set_semvalue())
        {
            fprintf(stderr,"init failed\n");
            exit(EXIT_FAILURE);
        }
        //参数的第一个字符赋给message
        message = argv[1][0];
    }
    int i=0;
    for(i=0;i<5;i++)
    {
        //等待信号量
        if(!semaphore_p())
            exit(EXIT_FAILURE);
        printf("%c",message);
        fflush(stdout);
        sleep(1);
        //发送信号量
        if(!semaphore_v())
            exit(EXIT_FAILURE);
        sleep(1);
    }
    printf("\n%d-finished\n",getpid());
    if(argc>1)
    {
        //退出前删除信号量
        del_semvalue();
    }
    exit(EXIT_SUCCESS);
}
```

### 套接字

见网络内容

参考：https://www.cnblogs.com/tshua/p/5756465.html


这几种进程间通信的方式的优缺点和应用场景

**管道**

1. 匿名管道

   只存在于内存，没有存在于文件系统中，通信的数据是无格式的流并且大小受限。

   匿名管道是只能用于存在父子关系的进程间通信，匿名管道的生命周期随着进程创建而建立，随着进程终止而消失。

2. 命令管道

   文件系统中创建一个类型为p的设备文件，两个没有关系的进程可以通过这个设备文件进行通信。

应用场景：

管道这种通信方式效率低，不适合进程间频繁地交换数据 。


**消息队列**

消息队列是保存在内核中的*消息链表*。

消息队列不合适比较大数据的传输。

消息队列通信过程中，存在用户态与内核态之间的数据拷贝开销。


**共享内存**

共享内存的机制，就是拿出一块虚拟地址空间来，映射到相同的物理内存中。


**信号量**

信号量其实是一个整型的计数器，主要用于实现进程间的互斥与同步，而不是用于缓存进程间通信的数据。


**socket**

要与不同主机的进程间通信，那么就需要 Socket通信。

---
title: 'C++多线程'
published: 2019-12-05
description: '梳理 Linux 环境下 C++ 多线程编程的基本模型、同步方式与实践经验。'
image: '/assets/desktop-banner/1.webp'
tags: ['编程语言', 'C/C++', '线程']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++多线程

梳理 Linux 环境下 C++ 多线程编程的基本模型、同步方式与实践经验。


## 1 线程

### 1.1 创建线程

```cpp
//创建线程
int pthread_create(
    pthread_t *pid,
    const pthread_attr_t *attr,
    void *(*start_routine),
    void *arg)

```

>参数一：创建线程后返回的线程id
>参数二：线程参数
>参数三：线程函数
>参数四：指向传给线程函数的参数
>
>返回值：0表示成功 非0表示失败


#### 1.1.1 创建一个不传参的线程

> 主线程不等待子线程执行，主线程先退出，子线程没有机会执行。
>
> 下面的列子，如果没有sleep，子线程根本不会有机会执行

```cpp
#include <pthread.h>
#include <iostream>
#include <unistd.h>

using namespace std;

void *func(void * arg)
{
    cout<<"I am child thread"<<endl;
    return (void*)0;
}


int main()
{
    pthread_t tidp;
    int ret;

    ret = pthread_create(&tidp,NULL,func,NULL);
    if (ret)
    {
        cout <<"pthread create failed:"<< ret <<endl;
    }
    sleep(1); //如果没有行代码 main线程会先执行结束，子线程没有机会执行，程序就结束了
    cout<<"in main:thread "<<endl;
    return 0;
}

结果：

I am child thread
in main:thread

```


#### 1.1.2 创建有参数的线程

```cpp
#include <pthread.h>
#include <iostream>
#include <stdio.h>
#include <string.h>

using namespace std;

typedef struct{
    int age;
    char * name;
}MYSTRUCT;


//int型参数
void *thfunc(void *arg)
{
    int *pn = (int*)(arg);
    int n = *pn;

    cout<<"线程1的参数："<< n << endl;
    return (void *)0;
}

//str型参数
void *strfunc(void * arg)
{
    char * str = (char *)(arg);
    cout<<"线程2的参数："<<str <<endl;
    return (void*)0;
}

//结构体参数
void *structfunc(void* arg)
{
    MYSTRUCT * pMystruct = (MYSTRUCT*)(arg);
    cout<<"线程3的参数："<< "age= "<<pMystruct->age <<" name= "<<pMystruct->name<< endl;
    char * str = new char[10];
    strcpy(str,"ABC");
    return (void *)str;
}

int main()
{
    pthread_t tidp;
    pthread_t tidp1;
    pthread_t tidp2;

    int n = 1;
    int ret = pthread_create(&tidp,NULL,thfunc,&n);
    if(ret)
    {
        cout<< "pthread_create failed:%d\n" <<endl;
        return -1;
    }
    pthread_join(tidp,NULL); //等待线程结束
    const char * str = "yuandongbin";
    int ret1 = pthread_create(&tidp1,NULL,strfunc,(void *)str);
    if(ret1)
    {
        cout<< "pthread_create failed:%d\n" <<endl;
        return -1;
    }
    pthread_join(tidp1,NULL); //等待线程结束
    MYSTRUCT mystruct;
    mystruct.age = 26;
    mystruct.name = new char[10];
    strcpy(mystruct.name,"yuandongbin");
    int ret2 = pthread_create(&tidp2,NULL,structfunc,(void *)&mystruct);
    if(ret2)
    {
        cout<< "pthread_create failed:%d\n" <<endl;
        return -1;
    }
    pthread_join(tidp2,NULL);
    void *str1;
    pthread_join(tidp2,&str1);//获取线程函数的返回值
    cout<<"线程3返回值"<<(char *)str1<<endl;//打印返回值
    cout<<"主线程结束"<<endl;
    return 0;
}

/*
输出结果：

线程1的参数：1
线程2的参数：yuandongbin
线程3的参数：age= 26 name= yuandongbin
主线程结束

*/
```

#### 1.1.3 创建一个线程，共享线程数据

```cpp
#include <iostream>
#include <stdio.h>
#include <pthread.h>
using namespace std;

//全局变量
int gn = 10;

//线程函数
void* func(void * arg)
{
    gn++;
    cout<<"in func:gn= "<<gn<<endl;
    return (void *)0;
}

int main()
{
    pthread_t tip;

    int ret = pthread_create(&tip,NULL,func,NULL);
    if(ret)
    {
        cout<<"pthread_create failed: "<< ret <<endl;
    }

    pthread_join(tip,NULL);

    gn++;

    cout<<"in main:gn= "<<gn<<endl;

    return 0;
}
```


### 1.2 等待线程结束

```cpp
//用来等待一个线程的结束
int pthread_join(
    pthread_t thread,
    void **retval);

```

> 参数一：thread: 线程标识符，以阻塞的方式等待thread指定的线程结束。
> 参数二：retval: 用户定义的指针，用来存储被等待线程的返回值。
>
> 返回值： 0代表成功。 失败，返回的则是错误号。
>
> 作用：
> 1.用于等待其他线程结束：当调用 pthread_join() 时，当前线程会处于阻塞状态，直到被调用的线程结束后，当前线程才会重新开始执行。
> 2.对线程的资源进行回收：如果一个线程是非分离的（默认情况下创建的线程都是非分离）并且没有对该线程使用 pthread_join() 的话，该线程结束后并不会释放其内存空间，这会导致该线程变成了“僵尸线程”。


### 1.3 初始化线程属性

```cpp
int pthread_attr_init(pthread_attr_t *attr);
```

> 参数一：指向一个线程属性结构的指针，结构中的元素分别对应着新线程的运行属性。属性对象主要包括是否绑定、是否分离、堆栈地址和大小、优先级等。默认属性为非绑定、非分离、默认1MB堆栈、与父进程有相同优先级。
>
> 返回值： 0代表成功。 失败，返回的则是错误号。


### 1.4 设置线程参数

```cpp
int pthread_attr_setdetachstate(pthread_attr_t * attr,int detchstate);
```

> 参数一：指向一个线程属性结构的指针
>
> 参数二：设置分离状态值，可以取值PTHREAD_CREATE_DETACHED或者PTHREAD_CREATE_JOINABLE
>
> 返回值： 0代表成功。 失败，返回的则是错误号。


### 1.5 获取线程参数

```cpp
int pthread_attr_getdetachstate(pthread_attr_t * attr,int& detchstate)
```

> 参数一：指向一个线程属性结构的指针
>
> 参数二：

### 1.6  分离线程

```cpp
#include <pthread.h>
int pthread_detach(
    pthread_t thread  //thread to detach
);
```

**可分离线程:**

POSIX下的线程要么是分离的，要么是非分离状态的，`默认创建的线程是可连接的`，一个可结合的线程是可以被其他线程来回收其资源，并且不会主动释放资源，必须等待其他线程收回其资源，因此我们可以使用pthread_join()函数，这个函数是一个阻塞函数，当它返回时，所等待的线程的资源也就被释放了。

如果父进程不退出并且你没有调用pthread_join(),所以这些可连接的线程资源一直得不到释放，子进程变成僵尸进程，僵尸进程越来越多，以后再想要创建线程就没有资源可用了。

如果不用pthread_join()，并且父进程先于可连接的子线程退出，那么会不会泄露资源呢？答案是不会的，如果父进程先于子进程退出，子进程就会被init进程所收养，这个时候init进程就是它的父进程，将调用wait系列函数为其回收资源。

一个线程不能被多个线程等待，否则第一个接受到信号的线程成功返回，其余调用pthread_join的线程将得到错误ESRCH。

#### 1.6.1 创建一个可分离线程

```cpp
#include <iostream>
#include <stdio.h>
#include <unistd.h>

using namespace std;

void * func(void * arg)
{
    cout<<"sub thread is running"<<endl;
   	return NULL;
}

int main()
{
    pthread_t thread_id;

    //线程属性 在pthread_create的第二个参数
   	pthread_attr_t thread_attr;
    size_t stack_size;

    //初始化线程属性
    int res = pthread_attr_init(&thread_attr);
    if(res)
    {
        cout<<"pthread_attr init failed:"<<res<<endl;
    }
    //设置线程属性 分离状态是PTHREAD_CREATE_DETACHED
    res = pthread_attr_setdetachstate(&thread_attr,PTHREAD_CREATE_DETACHED);
    if(res)
    {
        cout<<"pthread_attr_setdetachstate failed"<<res<<endl;
    }
    //创建线程
    res = pthread_create(&thread_id,&thread_attr,func,NULL);
    if(res)
        cout<<"pthread_create failed:"<<res<<endl;

    pthread_exit(NULL);//调用这个函数，主线程退出，但是进程不会此刻退出，下面的语句不会在执行了
    cout<<"main thread will exit\n"<<endl;

    return 0;
}

例2：
#include <iostream>
#include <pthread.h>
#include <unistd.h>

using namespace std;
//线程函数
void* func(void *arg)
{
    int index = 0;
    while (index++ < 50){
        sleep(1);
        cout<<"I am "<< index <<endl;
    }
}

int main() {
    pthread_t tid;
    pthread_attr_t thread_attr;

    //初始化线程属性
    if(pthread_attr_init(&thread_attr))
    {
        cout<<"pthread_attr init failed:"<<endl;
    }
    //设置线程属性 分离状态是PTHREAD_CREATE_DETACHED
    if(pthread_attr_setdetachstate(&thread_attr,PTHREAD_CREATE_DETACHED))
        cout<<"pthread_attr_setdetachstate failed"<<endl;

    //创建线程
    if(pthread_create(&tid,&thread_attr,func,NULL))
        cout<<"pthread_create failed:"<<endl;

    pthread_exit(NULL);//调用这个函数，主线程退出，但是进程不会此刻退出，下面的语句不会在执行了
    cout<<"main thread will exit\n"<<endl;

    return 0;
}
```

#### 1.6.2 将可连接的线程转换为分离线程

```cpp
#include <iostream>
#include <pthread.h>
#include <unistd.h>

using namespace std;
//线程函数
void* func(void *arg)
{
    cout<<"I am yuandongbin"<<endl;
}

int main() {
    pthread_t tid;

    //创建线程
    if(pthread_create(&tid,&thread_attr,func,NULL))
        cout<<"pthread_create failed:"<<endl;
	if(pthread_detach(tid))
        cout<<"pthread_detach faileds"<<endl;

    //pthread_exit(NULL);//调用这个函数，主线程退出，但是进程不会此刻退出，下面的语句不会在执行了
    cout<<"main thread will exit\n"<<endl;

    return 0;
}
```


### 1.7  线程主动结束

```cpp
void pthread_exit(void * retval);

//当前线程中调用
```


### 1.8 线程被动结束

```cpp
int pthread_kill(pthread_t threadid,int signal)

//其他线程中调用
```


#### 1.8.1 判断线程是否已经结束

```cpp
int kill_rc = pthread_kill(tid,0);

if(kill_rc == ESRCH)
    cout<<"the specified thread did not exists or already quit\n";
else if(kill_re == EINVAL)
    cout<<"signal is invaild\n"
else
    cout<<"the specified thread is alive\n";
```


### 1.9 线程清理函数

```cpp
//函数入栈
void pthread_cleanup_push(void (*routine)(void *),void *arg);
/*
参数一：清理函数
参数二：清理函数参数
*/

//函数出栈
void pthread_cleanup_pop(int execute);
/*
参数一：非0表示将清理函数弹出栈顶同时执行清理函数，0表示弹出栈顶不清理
*/

//这两个函数是成对出现，不能单独使用。
```


## 2 线程同步

### 2.1 互斥锁

在多任务操作系统中，同时运行的多个任务可能都需要使用同一种资源。这个过程有点类似于，公司部门里，我在使用着打印机打印东西的同时（还没有打印完），别人刚好也在此刻使用打印机打印东西，如果不做任何处理的话，打印出来的东西肯定是错乱的。

在线程里也有这么一把锁——互斥锁（mutex），互斥锁是一种简单的加锁的方法来控制对共享资源的访问，互斥锁只有两种状态,即上锁( lock )和解锁( unlock )。

- 定义锁

```cpp
  pthread_mutex_t lock;
  ```



- 初始化锁

```cpp
  int pthread_mutex_init(pthread_mutex_t *mutex,
  					   const pthread_mutexattr_t *attr);
  ```



- 加锁解锁

```cpp
  // 对互斥锁上锁，若互斥锁已经上锁，则调用者一直阻塞，
  // 直到互斥锁解锁后再上锁。
  int pthread_mutex_lock(pthread_mutex_t *mutex);

  // 调用该函数时，若互斥锁未加锁，则上锁，返回 0；
  // 若互斥锁已加锁，则函数直接返回失败，即 EBUSY。(非阻塞)
  int pthread_mutex_trylock(pthread_mutex_t *mutex);

  // 当线程试图获取一个已加锁的互斥量时，pthread_mutex_timedlock 互斥量
  // 原语允许绑定线程阻塞时间。即非阻塞加锁互斥量。
  int pthread_mutex_timedlock(pthread_mutex_t *restrict mutex,
  const struct timespec *restrict abs_timeout);

  // 对指定的互斥锁解锁。
  int pthread_mutex_unlock(pthread_mutex_t *mutex);
  ```


### 2.2 读写锁

读写锁与互斥量类似，不过读写锁允许更改的并行性，**也叫共享互斥锁**。互斥量要么是锁住状态，要么就是不加锁状态，而且一次只有一个线程可以对其加锁。读写锁可以有3种状态：**读模式下加锁状态、写模式加锁状态、不加锁状态**。

**一次只有一个线程可以占有写模式的读写锁，但是多个线程可以同时占有读模式的读写锁（允许多个线程读但只允许一个线程写）**。

【读写锁的特点】：

- 如果有其它线程读数据，则允许其它线程执行读操作，但不允许写操作；

- 如果有其它线程写数据，则其它线程都不允许读、写操作。


【读写锁的规则】：

- 如果某线程申请了读锁，其它线程可以再申请读锁，但不能申请写锁；

- 如果某线程申请了写锁，其它线程不能申请读锁，也不能申请写锁。

```cpp
#include <pthread.h>
// 初始化读写锁
int pthread_rwlock_init(pthread_rwlock_t *rwlock,
						const pthread_rwlockattr_t *attr);

// 申请读锁
int pthread_rwlock_rdlock(pthread_rwlock_t *rwlock );

// 申请写锁
int pthread_rwlock_wrlock(pthread_rwlock_t *rwlock );

// 尝试以非阻塞的方式来在读写锁上获取写锁，
// 如果有任何的读者或写者持有该锁，则立即失败返回。
int pthread_rwlock_trywrlock(pthread_rwlock_t *rwlock);

// 解锁
int pthread_rwlock_unlock (pthread_rwlock_t *rwlock);

// 销毁读写锁
int pthread_rwlock_destroy(pthread_rwlock_t *rwlock);

```


### 2.3 条件变量

```cpp
#include <pthread.h>
// 初始化条件变量
int pthread_cond_init(pthread_cond_t *cond,
						pthread_condattr_t *cond_attr);

// 阻塞等待
int pthread_cond_wait(pthread_cond_t *cond,pthread_mutex_t *mutex);

// 超时等待
int pthread_cond_timewait(pthread_cond_t *cond,pthread_mutex *mutex,
						const timespec *abstime);

// 解除所有线程的阻塞
int pthread_cond_destroy(pthread_cond_t *cond);

// 至少唤醒一个等待该条件的线程
int pthread_cond_signal(pthread_cond_t *cond);

// 唤醒等待该条件的所有线程
int pthread_cond_broadcast(pthread_cond_t *cond);
```


### 2.4 信号量

信号量广泛用于进程或线程间的同步和互斥，信号量本质上是一个非负的整数计数器，它被用来控制对公共资源的访问。

编程时可根据操作信号量值的结果判断是否对公共资源具有访问的权限，当信号量值大于 0 时，则可以访问，否则将阻塞。PV 原语是对信号量的操作，一次 P 操作使信号量减１，一次 V 操作使信号量加１。

```cpp
#include <semaphore.h>
// 初始化信号量
int sem_init(sem_t *sem, int pshared, unsigned int value);

// 信号量 P 操作（减 1）
int sem_wait(sem_t *sem);

// 以非阻塞的方式来对信号量进行减 1 操作
int sem_trywait(sem_t *sem);

// 信号量 V 操作（加 1）
int sem_post(sem_t *sem);

// 获取信号量的值
int sem_getvalue(sem_t *sem, int *sval);

// 销毁信号量
int sem_destroy(sem_t *sem);
```


## C++11 thread线程库

> C++11 thread线程库就是在posix线程库基础上进行了封装

### 创建线程

```cpp
#include <thread>
#include <iostream>

using namespace std;

void func()
{
    cout << "无参线程函数" << endl;
}

void func1(int a, int b)
{
    cout << "有参线程函数"
         << "a: " << a << " "
         << "b: " << b << endl;
}

int main()
{
    thread t1(func);
    thread t2(func1, 1, 2);
    t1.join();
    t2.join();

    cout << "主线程" << endl;

    return 0;
}
```

### 创建线程，线程函数为类成员函数

```cpp
#include <iostream>
#include <thread>
using namespace std;

class A
{
public:
    void func()
    {
        cout << "类的成员函数作为线程函数" << endl;
    }
};

int main()
{
    A a;
    thread t1(&A::func, &a);	//第一个参数参数线程函数的地址，第二个参数传入类的实例
    t1.join();

    cout << "主线程" << endl;
    return 0;
}
```

### 获取线程id

```cpp
#include <iostream>
#include <thread>

using namespace std;

void fun()
{
    cout << "在线程函数获取"
         << "线程id为: " << this_thread::get_id() << endl;
}

int main()
{
    thread t1(fun);
    cout << "在主线程中获取t1线程的id为：" << t1.get_id() << endl;
    t1.join();
    return 0;
}
```

### 线程的所有权拷贝

> 有thread类的拷贝构造函数被禁用，想要拷贝thread对象，可用通过std::move

```cpp
#include <thread>
#include <iostream>

using namespace std;

void func()
{
    cout << "无参线程函数" << endl;
}

void func1(int a, int b)
{
    cout << "有参线程函数"
         << "a: " << a << " "
         << "b: " << b << endl;
}

int main()
{
    thread t1(func);
    thread t2(func1, 1, 2);
    thread t1_bak = move(t1); //这里将t1线程的所有权移交给t1_bak,原先t1不可用了
    //t1.join();	//不可以用
    t1_bak.join();
    t2.join();

    cout << "主线程" << endl;

    return 0;
}
```

### join和detaching

```cpp
#include <iostream>
#include <thread>
#include <unistd.h>
using namespace std;

void func()
{
    cout << "加入式线程，主线程需要等待我" << endl;
    sleep(10);
}

void func1()
{
    cout << "分离式线程，主线程不需要等待我" << endl;
    sleep(11);
    cout << "分离式线程自行结束" << endl;
}

int main()
{
    thread t1(func);
    thread t2(func1);
    t1.join();	//主线程会阻塞，等待t1线程的执行结束
    t2.detach();

    cout << "主线程结束" << endl;

    sleep(15);  //不能让进程结束，不然分离式的线程也会结束
    return 0;
}
```

### 线程同步，mutex锁使用

```cpp
#include <iostream>
#include <thread>
#include <mutex>

using namespace std;

//票的总数
volatile int ticketNum = 100;	//线程共享资源
mutex mtxlock;

void sellTicketTask(string windowName)
{
    while (ticketNum > 0)
    {
        mtxlock.lock();	//每个线程访问需要加锁
        if (ticketNum > 0)
        {
            cout << windowName << "买出第" << ticketNum << "票" << endl;

            ticketNum--;
        }
        mtxlock.unlock();
        this_thread::sleep_for(std::chrono::milliseconds(100));	//标准库提供的线程睡眠函数
    }
}

int main()
{
    thread t1(sellTicketTask, "1号窗口");
    thread t2(sellTicketTask, "2号窗口");
    thread t3(sellTicketTask, "3号窗口");

    t1.join();
    t2.join();
    t3.join();

    return 0;
}
```

### 条件变量

头文件: ` #include <condition_variable> `

```cpp
#include <iostream>
#include <string>
#include <thread>
#include <mutex>
#include <condition_variable>

std::mutex m;
std::condition_variable cv;
std::string data;
bool ready = false;
bool processed = false;

void worker_thread()
{
    // 等待直至 main() 发送数据
    std::unique_lock<std::mutex> lk(m); //加锁
    cv.wait(lk, []{return ready;}); //第二个参数为false，就释放第一个参数的锁，并阻塞

    // 等待后，我们占有锁。
    std::cout << "Worker thread is processing data\n";
    data += " after processing";

    // 发送数据回 main()
    processed = true;
    std::cout << "Worker thread signals data processing completed\n";

    // 通知前完成手动解锁，以避免等待线程才被唤醒就阻塞（细节见 notify_one ）
    lk.unlock();
    cv.notify_one();
}

int main()
{
    std::thread worker(worker_thread);

    data = "Example data";
    // 发送数据到 worker 线程
    {
        std::lock_guard<std::mutex> lk(m);	//等待子线程将锁释放，然后加锁
        ready = true;
        std::cout << "main() signals data ready for processing\n";
    }
    cv.notify_one();	//通知其他线程

    // 等候 worker
    {
        std::unique_lock<std::mutex> lk(m);	//等待子线程将锁释放，然后加锁
        cv.wait(lk, []{return processed;});
    }
    std::cout << "Back in main(), data = " << data << '\n';

    worker.join();
}
```

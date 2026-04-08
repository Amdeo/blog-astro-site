---
title: 'Python 多进程 multiprocessing'
published: 2020-04-18
description: '围绕 multiprocessing 的基础用法、进程创建和进程间通信，整理 Python 多进程编程的核心知识。'
tags: ['python']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Python 多进程 multiprocessing

这篇文章聚焦 Python 标准库 `multiprocessing` 的基础用法，适合在理解 GIL 之后继续学习多进程时快速建立整体认识。

由于 Python 存在 GIL，多线程在 CPU 密集型任务里往往无法真正吃满多核。`multiprocessing` 则提供了真正的多进程能力，可以让 Python 更充分地使用机器上的多个核心。

## 使用进程池 Pool

下面这个例子来自 Python 官方文档，使用 `Pool` 创建进程池：

```python
from multiprocessing import Pool


def f(x):
    return x * x

if __name__ == '__main__':
    with Pool(5) as p:
        print(p.map(f, [1, 2, 3]))
```

`Pool(5)` 表示进程池里最多允许 5 个进程同时运行。

## 使用 `Process` 类创建进程

如果需要更直接地管理进程，可以使用 `Process` 类：

```python
from multiprocessing import Process
import os


def info(title):
    print(title)
    print('module name:', __name__)
    print('parent process:', os.getppid())
    print('process id:', os.getpid())


def f(name):
    info('function f')
    print('hello', name)


if __name__ == '__main__':
    info('main line')
    p = Process(target=f, args=('bob',))
    p.start()
    p.join()
```

## 三种启动方式

`multiprocessing` 支持三种常见的启动方式：

### spawn

父进程启动一个新的 Python 解释器进程。子进程只继承运行所需的最小资源，安全性更高，但启动速度相对更慢。

- 可用于 Unix 和 Windows
- 是 Windows 默认方式

### fork

父进程通过 `os.fork()` 分叉出子进程。子进程启动时与父进程几乎一致，父进程资源会被继承。

- 只存在于 Unix
- 是很多 Unix 系统的默认方式

### forkserver

程序启动时先创建一个服务器进程，之后需要新进程时，由父进程向这个服务器发请求，再由服务器去 fork 新进程。

- 可用于部分 Unix 平台
- 适合更可控的创建方式

## 进程间通信

### Queue

`Queue` 适合在进程间传递结构化数据：

```python
from multiprocessing import Process, Queue


def f(q):
    q.put([42, None, 'hello'])


if __name__ == '__main__':
    q = Queue()
    p = Process(target=f, args=(q,))
    p.start()
    print(q.get())
    p.join()
```

### Pipe

`Pipe` 更适合点对点通信：

```python
from multiprocessing import Process, Pipe


def f(conn):
    conn.send([42, None, 'hello'])
    conn.close()


if __name__ == '__main__':
    parent_conn, child_conn = Pipe()
    p = Process(target=f, args=(child_conn,))
    p.start()
    print(parent_conn.recv())
    p.join()
```

## 进程同步

### Lock 进程锁

```python
from multiprocessing import Process, Lock


def f(l, i):
    l.acquire()
    try:
        print('hello world', i)
    finally:
        l.release()


if __name__ == '__main__':
    lock = Lock()

    for num in range(10):
        Process(target=f, args=(lock, num)).start()
```

## 共享内存

```python
from multiprocessing import Process, Value, Array


def f(n, a):
    n.value = 3.1415927
    for i in range(len(a)):
        a[i] = -a[i]


if __name__ == '__main__':
    num = Value('d', 0.0)
    arr = Array('i', range(10))

    p = Process(target=f, args=(num, arr))
    p.start()
    p.join()

    print(num.value)
    print(arr[:])
```

## Manager 服务器进程

`Manager()` 返回的管理器对象会启动一个服务器进程，用来保存 Python 对象，并允许其他进程通过代理来访问这些对象。

它支持的类型包括：`list`、`dict`、`Namespace`、`Lock`、`Queue`、`Value`、`Array` 等。

示例：

```python
from multiprocessing import Process, Manager


def f(d, l):
    d[1] = '1'
    d['2'] = 2
    d[0.25] = None
    l.reverse()


if __name__ == '__main__':
    with Manager() as manager:
        d = manager.dict()
        l = manager.list(range(10))

        p = Process(target=f, args=(d, l))
        p.start()
        p.join()

        print(d)
        print(l)
```

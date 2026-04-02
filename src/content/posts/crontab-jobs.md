---
title: 'crontab定时任务'
published: 2020-12-24
description: 'crontab crond 和crontab是不可分割的。crontab是一个命令，常见于Unix和类Unix的操作系统之中，用于设置周期性被执行的指令。该命令从标准输入设备读取指令，并将其存放于“crontab”文件中…'
image: '/assets/desktop-banner/2.webp'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# crontab定时任务

> crond 和crontab是不可分割的。crontab是一个命令，常见于Unix和类Unix的操作系统之中，用于设置周期性被执行的指令。该命令从标准输入设备读取指令，并将其存放于“crontab”文件中，以供之后读取和执行。该词来源于希腊语chronos(χρόνος)，原意是时间。
>
> 而crond正是它的守护进程。cron服务是一个定时执行的服务，可以通过crontab 命令添加或者编辑需要定时执行的任务。

## crontab操作

```
crontab -u //设定某个用户的cron服务
crontab -l //列出某个用户cron服务的详细内容
crontab -r //删除某个用户的cron服务
crontab -e //编辑某个用户的cron服务
crontab -i //打印提示，输入yes等确认信息
```


![1461714-20181016024833855-614863675](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1461714-20181016024833855-614863675.png)


## 例子

每一分钟执行一次 /bin/ls

```
* * * * * /bin/ls
```

每小时的第3和第15分钟执行command

```
3,15 * * * * command
```

每天上午8-11点的第3和15分钟执行command：

```
3,15 8-11 * * * command
```

每隔2天的上午8-11点的第3和15分钟执行command：

```
3,15 8-11 */2 * * command
```

每个星期一的上午8点到11点的第3和第15分钟执行command

```
3,15 8-11 * * 1 command
```

每晚的21:30

```
30 21 * * * command
```

每月1、10、22日的4 : 45

```
45 4 1,10,22 * * command
```

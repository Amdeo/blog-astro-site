---
title: 'Linux 常用命令'
published: 2019-12-05
description: '整理 Linux 日常使用中高频出现的命令，包括程序定位、系统信息查看、链接、SFTP 和 SSH 等基础操作。'
image: '/src/assets/blog-placeholder-2.jpg'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Linux 常用命令

这篇文章整理 Linux 日常使用中最常遇到的一批基础命令，覆盖程序定位、系统信息查看、链接、SFTP 和 SSH 等场景，适合做速查。


## whereis

用来查找本地程序

```shell
whereis -- locate programs
```

## which

在用户路径中定位程序文件

```shell
which -- locate a program file in the user's path

which [-as] program ...
```

![image-20200102225812732](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200102225812732.png)


## 修改用户密码


```shell
passwd username
```


## 硬链接和软连接


我们都知道，在linux系统中，本质上是通过inode(index node)来对文件进行访问（或者说数据控制）的。linux的人性化设置，使得平时我们可以通过文件名来访问文件。其实吧，不是一般性的说，**文件名，就是inode的别名。**


**认识目录项，inode以及block**


这里有几个简单的知识点：


1. 一个文件可以被存储在一个或者多个block中；
2. 每个文件都会并且`只能占用一个inode`,inode可以指向该文件所在的block，inode中还存储该文件的各种属性，如rwx...;
3. 想读取该文件，必须经过目录项的文件名来指向到正确的inode号码才能读取。


看到这里，该提出两个问题了：


1. **什么是目录项？**当新建一个目录时，文件系统会分配一个inode和至少一块block给该目录。其中，inode记录该目录的相关权限和属性，并记录分配到的那块block号码。而**block则是记录在这个目录下的文件名和这些文件名所对应的inode号码数据，这就是我们所说的数据项**。
2. **当几个不同文件名，指向同一个inode号码时，会发生什么事？**这就引出了我们要说的内容了，硬连接（hard link）和软连接（symbolic link）。
   这幅图可以完美说明这一切：


软连接


```shell
ln -s myfile soft //dest相当于source的快捷方式，可以是目录
```


硬链接


```shell
ln myfile hard ##只能是文件
```


- 硬链接： 与普通文件没什么不同，`inode` 都指向同一个文件在硬盘中的区块
- 软链接： 保存了其代表的文件的绝对路径，是另外一种文件，在硬盘上有独立的区块，访问时替换自身路径。


## 查看系统信息


```shell
free #查看内存

df #查看磁盘

top #查看cpu占用率

uname #查看内核版本
```

## sftp

### 登入

（1）sftp xxx.xxx.xxx.xxx 登入（默认root用户），若指定用户sftp username@xxx.xxx.xxx.xxx 进行登录

（2）登入成功后，会提示输入密码

（3）进入目录，ls查看目录下内容

（4）cd切换目录，get获取文件，put上传文件

（5）quit / bye / exit 退出sftp

### 常用命令

```
ls 查看当前目录下文件
help 查看sftp支持哪些命令
cd 指定目录
pwd 查看当前目录
get xxx.txt 下载xxx文件
put xxx.txt 上传文件
```
## ssh

**centos**

安装

```
yum install openssh-server
```

查看是否开放22端口

```
iptables -nL
```
开启sshd服务

```
sudo service sshd start
```

重新启动

```
sudo service sshd restart
```

设置开机自启

```
chkconfig sshd on
```
检查 sshd 服务是否已经开启，输入

```
ps -e | grep sshd
```

检查 **22** 号端口是否开启监听

```
netstat -an | grep 22
```

### 怎么使用ssh免密登入服务器

客户端生成ssh key

```shell
ssh-keygen -t rsa
```

在客户机的客户目录下会生成 **.ssh**目录

![1580882279416](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1580882279416.png)

里面会包含id_rsa、id_rsa.pub(密钥和公钥)，将id_rsa.pub 传到服务器上。

登入服务端

```shell
mkdir ~/.ssh
chmod 700 -R .ssh

touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

cat id_rsa.pub >> ~/.ssh/authorized_keys  #将客户机上的公钥写入 authorized_keys
```

## 网络相关命令

```
curl

wget

ping

mtr

host

whois

dhclient

netstat

ps -ax|grep 程序名称

lsof -i:8000  # 查看端口占用
```

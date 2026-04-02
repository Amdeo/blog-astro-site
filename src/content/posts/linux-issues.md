---
title: 'Linux 常见使用与配置'
published: 2019-12-05
description: '整理 Linux 日常使用中常见的环境变量、端口开放和基础配置问题，适合做运维速查。'
image: '/assets/desktop-banner/2.webp'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Linux 常见使用与配置

这篇文章收集的是 Linux 日常使用里最常见的一些配置问题，内容偏实用，适合遇到问题时快速回查。

### 显示环境变量

- set显示当前shell的变量，包括当前用户的数量
- env命令显示当前用户的变量
- export命令显示当前导出成用户变量的shell变量

### 设置环境变量

**设置临时的环境变量：**

```
export AA="hello world"
```


你可以使用`echo $AA`打印环境变量内容

**删除环境变量：**

```
unset AA
```

**添加常用环境变量路径：**

```
export PATH="$PATH:/root/"
```


**创建长期的环境变量**


- /etc/profile ：


  此文件为系统的每个用户设置永久环境信息,当用户第一次登录时,该文件被执行并从/etc/profile.d目录的配置文件中搜集shell的设置.


- /etc/bashrc:


  为每一个运行bash shell的用户执行此文件.当bash shell被打开时,该文件被读取。


- ~/.bash_profile:


  *每个用户*都可使用该文件输入专用于自己使用的shell信息,当用户登录时,该文件 仅仅执行一次!默认情况下,他设置一些环境变量,执行用户的.bashrc文件.


- ~/.bashrc:


  该文件包含专用于你的bash shell的bash信息,当登录时以及每次打开新的shell时,该文件被读取


- ~/.bash_logout:


  当每次退出系统(退出bash shell)时,执行该文件.

（1）全局配置文件
功能：定义全局的环境变量。
包含的配置文件：
/etc/profile
/etc/profile.d/*.sh
/etc/bashrc

（2）全局配置文件
功能：自定义当前用户的环境变量
包含的配置文件：
 ~/.bash_profile
 ~/.bashrc


## CentOS 7 如何开放端口

检查防火墙是否已经启动, running说明防火墙已经开启了。

```shell
firewall-cmd --state
```

开启防火墙

```
systemctl start firewalld.service
```

设置开机启动

```
systemctl enable firewalld.service
```

重启防火墙

```
systemctl restart firewalld.service
```

查看防火墙规则

```
firewall-cmd --list-all
```

查看22端口是否开放：yes为开放，no为未开放。

```shell
firewall-cmd --zone=public --query-port=22/tcp
```

开放22端口

```
firewall-cmd --zone=public --add-port=22/tcp --permanent
```

重新载入

```
firewall-cmd --reload
```

### centos设置软件源

```
yum install wget
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup #备份
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo #设置阿里源
yum makecache #生成缓存
```

### Centos 安装man手册

```
yum install -y man man-pages
```


linux压缩和解压

打包压缩

```
tar -zcvf filename.tar.gz pack/  #打包压缩为一个.gz格式的压缩包
tar -jcvf filename.tar.bz2 pack/ #打包压缩为一个.bz2格式的压缩包
tar -Jcvf filename.tar.xz pack/  #打包压缩为一个.xz格式的压缩包
```

解包解压

```
tar -zxvf filename.tar.gz /pack  #解包解压.gz格式的压缩包到pack文件夹
tar -jxvf filename.tar.bz2 /pack #解包解压.bz2格式的压缩包到pack文件夹
tar -Jxvf filename.tar.xz /pack  #解包解压.xz格式的压缩包到pack文件夹

unzip filename.zip
tar -Zxvf filename.tar.Z

tar -xvf filename.tar
```

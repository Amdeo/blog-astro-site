---
title: 'centos安装'
published: 2016-12-05
description: '各种Linux安装步骤 一、centos最小系统安装后基本配置 在弹出的“虚拟网络编辑器”窗口中选择NAT模式的，编辑为其分配地址池： 由于安装是最小系统，安装后的不能使用网络。'
image: '/assets/desktop-banner/2.webp'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# centos安装

# 各种Linux安装步骤

## 一、centos最小系统安装后基本配置

在弹出的“虚拟网络编辑器”窗口中选择NAT模式的，编辑为其分配地址池：

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/784924-20170708202419878-583878644.png)

由于安装是最小系统，安装后的不能使用网络的需要配置下

```shell
ls /etc/sysconfig/network-scripts/
```


修改网卡信息

```shell
vi /etc/sysconfig/network-scripts/ifcfg-ens33
```

将ONBOOT改为yes：

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1567432884062.png)



重启网络


``` shell
service network restart
```

ping下百度

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1567432985759.png)

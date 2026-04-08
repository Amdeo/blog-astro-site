---
title: 'Linux 常用命令：程序定位、链接、SFTP 与 SSH 速查'
published: 2019-12-05
description: '整理 Linux 日常使用里最常见的一批基础命令，覆盖程序定位、用户密码、软硬链接、系统信息查看、SFTP、SSH 服务管理和网络排查。'
tags: ['Linux', '操作系统', '命令行']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Linux 常用命令：程序定位、链接、SFTP 与 SSH 速查

这篇文章整理 Linux 日常使用中高频出现的一批基础命令，适合做快速回查。

内容主要覆盖这些场景：

- 查找本地程序位置
- 修改用户密码
- 理解硬链接和软链接
- 查看系统信息
- 使用 SFTP 传文件
- 管理 SSH 服务
- 配置 SSH 免密登录
- 排查常见网络问题

## 程序定位

### `whereis`

`whereis` 用来查找程序相关文件，例如可执行文件、源码和帮助文档。

```shell
whereis program_name
```

例如：

```shell
whereis ssh
```

### `which`

`which` 用来在当前用户的 `PATH` 路径中定位命令实际对应的可执行文件。

```shell
which program_name
```

例如：

```shell
which python
which gcc
```

可以简单这样理解：

- `whereis`：查得更宽，适合看程序相关文件在哪
- `which`：查得更准，适合看当前终端真正执行的是哪个程序

## 修改用户密码

```shell
passwd username
```

如果要修改当前用户密码，很多系统里也可以直接执行：

```shell
passwd
```

## 硬链接和软链接

Linux 文件系统底层是通过 inode 来管理文件的。

平时我们通过文件名访问文件，但文件名本质上更像是指向 inode 的入口。理解这一点之后，再看硬链接和软链接就比较顺了。

### 硬链接

```shell
ln myfile hard
```

特点：

- 硬链接和原文件共享同一个 inode
- 更像是“同一个文件的另一个名字”
- 一般只能对文件创建，不能像软链接那样方便地指向目录

### 软链接

```shell
ln -s myfile soft
```

特点：

- 软链接是一个独立文件
- 它保存的是目标文件的路径信息
- 更像快捷方式
- 可以指向文件，也可以指向目录

### 怎么区分

可以先记住最实用的区别：

- **硬链接**：同 inode，更像别名
- **软链接**：独立文件，更像快捷方式

## 查看系统信息

下面这些命令是最常用的一批系统信息查看命令：

```shell
free     # 查看内存使用情况
df       # 查看磁盘使用情况
top      # 查看 CPU / 进程占用情况
uname -a # 查看内核与系统信息
```

其中：

- `free`：看内存
- `df`：看磁盘
- `top`：看系统负载和进程
- `uname -a`：看系统内核版本和架构

## SFTP

SFTP 适合在 SSH 通道上做文件传输。

### 登录

```shell
sftp user@server_ip
```

如果不写用户名，很多环境会默认使用当前用户名。

登录成功后，常见操作包括：

- `ls`：查看目录内容
- `cd`：切换目录
- `pwd`：查看当前远端目录
- `get`：下载文件
- `put`：上传文件
- `exit` / `bye` / `quit`：退出

### 常用命令

```text
ls              查看当前目录下文件
help            查看 sftp 支持哪些命令
cd /path        切换目录
pwd             查看当前目录
get xxx.txt     下载文件
put xxx.txt     上传文件
```

## SSH 服务管理

下面这些命令主要针对较传统的 CentOS / Linux 环境。

### 安装 OpenSSH Server

```shell
yum install openssh-server
```

### 查看 22 端口规则

```shell
iptables -nL
```

### 启动 SSH 服务

```shell
sudo service sshd start
```

### 重启 SSH 服务

```shell
sudo service sshd restart
```

### 设置开机自启

```shell
chkconfig sshd on
```

### 检查 sshd 是否已启动

```shell
ps -e | grep sshd
```

### 检查 22 端口是否处于监听状态

```shell
netstat -an | grep 22
```

如果你在新一点的系统里工作，也可能会用到 `systemctl`：

```shell
sudo systemctl start sshd
sudo systemctl restart sshd
sudo systemctl enable sshd
```

## SSH 免密登录

### 第一步：在客户端生成密钥

```shell
ssh-keygen -t rsa
```

生成后，用户目录下通常会出现：

- `~/.ssh/id_rsa`
- `~/.ssh/id_rsa.pub`

其中：

- `id_rsa`：私钥
- `id_rsa.pub`：公钥

### 第二步：把公钥写到服务端

在服务端执行：

```shell
mkdir -p ~/.ssh
chmod 700 ~/.ssh

touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

然后把客户端的公钥内容追加到：

```shell
~/.ssh/authorized_keys
```

例如：

```shell
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

这样后续再登录时，就可以通过密钥认证，减少反复输密码的麻烦。

## 常见网络相关命令

下面这些命令在 Linux 日常排查里也很常见：

```shell
curl
wget
ping
mtr
host
whois
dhclient
netstat
ps -ax | grep 程序名称
lsof -i:8000
```

它们大致可以这样理解：

- `curl`：请求 URL，看接口或页面返回
- `wget`：下载文件
- `ping`：测试网络连通性
- `mtr`：查看网络路径与延迟
- `host`：查 DNS 解析
- `whois`：查域名注册信息
- `dhclient`：重新获取 DHCP 地址
- `netstat`：查看网络连接与监听端口
- `ps -ax | grep xxx`：查进程
- `lsof -i:8000`：看某个端口被谁占用

## 小结

如果只是日常使用 Linux，这篇里最常回头查的通常就是下面这些内容：

- `which` / `whereis`：找程序
- `passwd`：改密码
- `ln` / `ln -s`：建链接
- `free` / `df` / `top` / `uname -a`：看系统状态
- `sftp`：传文件
- `service sshd` / `systemctl sshd`：管 SSH 服务
- `ssh-keygen` + `authorized_keys`：配免密登录
- `lsof -i` / `netstat` / `ping` / `curl`：做基础排查

先把这批命令记熟，Linux 的很多日常操作就已经够用了。
---
title: '在私人服务器创建 Git 仓库'
published: 2019-11-26
description: '记录在私人服务器上创建 Git 远程仓库、配置 SSH Key 以及迁移现有仓库时的基础流程。'
image: '/src/assets/blog-placeholder-4.jpg'
tags: ['工具']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# 在私人服务器创建 Git 仓库

这篇文章记录在私人服务器上搭一个私有 Git 远程仓库的基础流程，包含创建用户、初始化 bare 仓库、配置 SSH Key，以及迁移已有仓库时要注意的权限问题。

## 安装 Git

创建 `git` 账户并登录，直接把用户目录指定到 `/home/git`。

## 创建 Git 用户

```shell
useradd git -d /home/git -m -s /bin/bash
su git
```

## 创建仓库

```shell
cd ~
git init --bare mygit.git
```

## 设置 SSH Key

客户端和服务端都执行一遍：

```shell
ssh-keygen -t rsa # 生成密钥对
# 把 id_rsa.pub 传到服务器后执行：
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

## 克隆仓库

```shell
git clone git@<服务器公网IP>:/home/git/myserver.git
```

## 数据仓库迁移

增加一个远端仓库：

![1574780797750](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1574780797750.png)

推送时选择新增的地址：

![1574780839801](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1574780839801.png)

## 常见问题

### 利用公钥私钥解决 Linux 中 git clone 需要输入密码的问题

```shell
chmod 700 .ssh
chmod 600 .ssh/authorized_keys
```

另外还要确认：

- Git 上的仓库对 `git` 用户有写权限。
- `/etc/ssh/sshd_config` 中已经打开 RSA 认证：

```text
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

- `/home/git` 属于 `git` 用户所有，权限为 `755`，即 `drwxr-xr-x`。

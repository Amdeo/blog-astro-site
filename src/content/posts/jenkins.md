---
title: 'Docker 安装 Jenkins 持续集成环境'
published: 2021-04-22
description: '记录通过 Docker Compose 搭建 Jenkins、配置插件源、补充 Python 环境以及处理 SSH Key 与远程构建问题的过程。'
image: '/assets/desktop-banner/1.webp'
tags: ['工具']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Docker 安装 Jenkins 持续集成环境

这篇文章记录用 Docker 搭 Jenkins 持续集成环境时的一套实际流程，包含挂载目录、`docker-compose.yml`、插件源、Node / Python 环境补充，以及 SSH Key 和远程触发构建时遇到的问题。

## 前置准备

环境先需要安装 Docker。

先创建挂载目录：

```shell
mkdir -p /data/jenkins_home
chown -R 1000 /data/jenkins_home
```

## 编写 docker-compose.yml

```yaml
version: '3'
services:
  jenkins:
    image: 'jenkins/jenkins:2.289-centos7'
    container_name: jenkins
    privileged: true
    restart: always
    ports:
      - '8080:8080'
      - '50000:50000'
    volumes:
      - '/data/jenkins_home:/var/jenkins_home'
    environment:
      - JAVA_OPTS=-Dhudson.security.csrf.GlobalCrumbIssuerConfiguration.DISABLE_CSRF_PROTECTION=true
```

## 配置国内插件源

```text
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```

## 安装 NodeJs 插件

配置 Node：

![image-20210423160953979](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20210423160953979.png)

## 在 Jenkins 中安装 Python 2

先下载 Python 包：

```text
https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tgz
```

进入 Jenkins 容器：

```shell
docker exec -it -u root 容器id /bin/bash
```

查看系统版本：

```shell
cat /etc/issue
```

这里是：

```text
Debian GNU/Linux 10 \n \l
```

## 配置 Debian 10 国内源

`/etc/apt/source.list`

```text
deb http://ftp.cn.debian.org/debian buster main
deb http://ftp.cn.debian.org/debian buster-updates main
deb http://ftp.cn.debian.org/debian-security/ buster/updates main
deb http://ftp.cn.debian.org/debian buster-backports main
```

更新 `apt-get`：

```shell
apt-get update
```

安装常用包：

```shell
apt-get install vim
apt-get -y install gcc automake autoconf libtool make
apt-get -y install make*
apt-get -y install zlib*
apt-get -y install openssl libssl-dev
apt-get install sudo
```

## 安装 Python 2

```shell
cd /var/jenkins_home/
mkdir python2
cd /python2
docker cp Python-2.7.18.tgz jenkins:/var/jenkins_home/python2
tar -xvf Python-2.7.18.tgz
cd Python-2.7.18
./configure --prefix=/var/jenkins_home/python2

./configure --prefix=/var/jenkins_home/python3 --with-ssl
make
make install

ln -s /var/jenkins_home/python2/bin/python2 /usr/bin/python2
```

## SSH Key 报错处理

报错：`Failed to add SSH key. Message [invalid privatekey:`

Jenkins SSH Server 不支持 `-----BEGIN OPENSSH PRIVATE KEY-----` 这种格式的私钥，可以通过下面的命令重新生成 PEM 格式私钥：

```shell
ssh-keygen -m PEM -t rsa -b 4096
```

## 触发远程构建报 403

*触发远程构建* 时如果报 403，可以先从 Jenkins 的安全配置和 CSRF 配置方向排查。

![image-20210423221344799](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20210423221344799.png)

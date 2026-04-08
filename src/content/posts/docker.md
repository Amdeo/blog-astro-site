---
title: 'docker'
published: 2017-02-16
description: '安装 windows安装docker 使用阿里云镜像来下载 http://mirrors.aliyun.com/docker toolbox/windows/docker toolbox/ centos安装docker …'
tags: ['DevOps']
category: 'DevOps'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

## 安装

windows安装docker

使用阿里云镜像来下载 http://mirrors.aliyun.com/docker-toolbox/windows/docker-toolbox/


centos安装docker

```shell
sudo yum remove docker docker-common docker-selinux docker-engine
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

wget -O /etc/yum.repos.d/docker-ce.repo https://repo.huaweicloud.com/docker-ce/linux/centos/docker-ce.repo

sudo sed -i 's+download.docker.com+repo.huaweicloud.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo

sudo yum makecache fast
sudo yum install docker-ce
```

配置阿里云镜像加速器

![image-20200929204854511](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20200929204854511.png)

```
# docker
server docker start

server docker restart
```


测试hello-world

```
docker run hello-world
```

`hello-world`其实就是镜像容器，本地没有hello-world镜像，就会去云上下载hello-world镜像


## 命令

帮助

```
docker version
docker info
docker --help
```

镜像命令

```
docker images	#列出本地镜像信息
docker search	#查询镜像
docker pull		#获取镜像
docker rmi		#删除某个镜像
docker rmi -f $(docker images -qa) # 删除所有镜像
```

容器命令

```

docker run [options]

docker ps # 列出docker所有容器

# 退出容器
exit # 容器停止退出
ctrl + p + q 	#容器不停止退出

docker start + 容器id		#启动容器
dokcer stop + 容器id		#停止容器

docker kill + 容器id		#强制停止容器

docker rm + 容器id		# 删除已经停止的容器
docker rm -f $(docker ps -a -q)	# 一次性删除多个容器
docker ps -a -q | xargs docker rm  # 一次性删除多个容器
```

重要命令

```
docker run -d 容器名 # 以守护方式运行容器	在docker ps中看不到
docker logs -f -t --tail 容器id 	#查看容器日志
docker top 容器id		#查看容器内运行的进程
docker inspect	#容器id
# 进入正在运行的容器
docker exec -it 容器id bashshell # 不进入容器，但是返回容器的执行shell的结果
docker exec -it 容器id /bin/bash # 进入容器中
docker attach + 容器id	# 直接进入容器，入会启动新的进程

# 从容器内拷贝文件到主机上
docker  cp 容器id:目录 当前用户路径
```

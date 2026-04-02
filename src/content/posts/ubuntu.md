---
title: 'ubuntu'
published: 2019-12-05
description: 'WSL Ubuntu WSL ubuntu修改root密码，登入powershell 重新打开终端,使用命令 修改软件源 备份软件源文件 修改文件并添加国内源 下面软件源随意选择一个 更新源 更新软件 ubuntu的软件…'
image: '/src/assets/blog-placeholder-2.jpg'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

## WSL Ubuntu

WSL ubuntu修改root密码，登入powershell

```
ubuntu config --default-user root
```

重新打开终端,使用命令

```
passwd username
```

## 修改软件源

### 备份软件源文件

```shell
sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup
```

### 修改文件并添加国内源

```
vi /etc/apt/sources.list
```



下面软件源随意选择一个

```
#Ubuntu 官方源
deb http://archive.ubuntu.com/ubuntu/ gutsy main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ gutsy-security main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ gutsy-updates main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ gutsy-proposed main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ gutsy-backports main restricted universe multiverse
deb-src http://archive.ubuntu.com/ubuntu/ gutsy main restricted universe multiverse
deb-src http://archive.ubuntu.com/ubuntu/ gutsy-security main restricted universe multiverse
deb-src http://archive.ubuntu.com/ubuntu/ gutsy-updates main restricted universe multiverse
deb-src http://archive.ubuntu.com/ubuntu/ gutsy-proposed main restricted universe multiverse
deb-src http://archive.ubuntu.com/ubuntu/ gutsy-backports main restricted universe multiverse
```

```
#阿里云
deb http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse

#网易163
deb http://mirrors.163.com/ubuntu/ trusty main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ trusty-security main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ trusty-updates main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ trusty-proposed main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ trusty-backports main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ trusty main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ trusty-security main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ trusty-updates main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ trusty-proposed main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ trusty-backports main restricted universe multiverse

#清华大学软件源
# ubuntu
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse

#中科大开源
# 默认注释了源码仓库，如有需要可自行取消注释
deb https://mirrors.ustc.edu.cn/ubuntu/ xenial main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ xenial main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ xenial-backports main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ xenial-backports main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ xenial-security main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ xenial-security main restricted universe multiverse
```

### 更新源

```shell
sudo apt-get update
```

### 更新软件

```
sudo apt-get dist-upgrade
sudo apt-get upgrade
```



ubuntu的软件安装命令


```
sudo apt-get update  更新源
sudo apt-get install package 安装包
sudo apt-get remove package 删除包
sudo apt-cache search package 搜索软件包
sudo apt-cache show package  获取包的相关信息，如说明、大小、版本等
sudo apt-get install package --reinstall  重新安装包
sudo apt-get -f install  修复安装
sudo apt-get remove package --purge 删除包，包括配置文件等
sudo apt-get build-dep package 安装相关的编译环境
sudo apt-get upgrade 更新已安装的包
sudo apt-get dist-upgrade 升级系统
sudo apt-cache depends package 了解使用该包依赖那些包
sudo apt-cache rdepends package 查看该包被哪些包依赖
sudo apt-get source package  下载该包的源代码
sudo apt-get clean && sudo apt-get autoclean 清理无用的包
sudo apt-get check 检查是否有损坏的依赖
```



## 问题

### ubuntu中vim下按上下左右键时输入A、B、C、D

```shell
sudo apt-get install vim-gtk
```

### 将Ubuntu主文件夹里的中文文件夹名称改成英文

**方法一**

首先修改现有主文件夹下各文件夹名称：

Desktop、 Documents、 Download、 Music、 Pictures、 Public、 Templates、 Videos ……

然后编辑配置文件：

```
gedit ~/.config/user-dirs.dirs
```

把文件夹指向改掉，例如：

```
XDG_DESKTOP_DIR="$HOME/Desktop"

XDG_DOWNLOAD_DIR="$HOME/Download"

XDG_TEMPLATES_DIR="$HOME/Templates"

XDG_PUBLICSHARE_DIR="$HOME/Public"

XDG_DOCUMENTS_DIR="$HOME/Documents"

XDG_MUSIC_DIR="$HOME/Music"

XDG_PICTURES_DIR="$HOME/Pictures"

XDG_VIDEOS_DIR="$HOME/Videos"
```

**方法二**

为了使用起来方便，装了ubuntu中文版，自然在home文件里用户目录的“桌面”、“图片”、“视频”、“音乐”……都是中文的。

  很多时候都喜欢在桌面上放一些要操作的文件，[Linux](http://lib.csdn.net/base/linux)里命令行操作又多，难免会用命令行操作桌面上的东西，那么就要 “cd 桌面”，打“桌面”的时候要输入法切换，麻烦……所以就想办法把用户目录下的路径改成英文，而其他的中文不变，方法如下：

打开终端，在终端中输入命令:

```
export LANG=en_US
xdg-user-dirs-gtk-update
```

跳出对话框询问是否将目录转化为英文路径,同意并关闭.
在终端中输入命令:

```
export LANG=zh_CN
```

关闭终端,并重起.下次进入系统,系统会提示是否把转化好的目录改回中文.选择不再提示,并取消修改.主目录的中文转英文就完成了~

### Ubuntu关闭图形界面

**1、按ALT+CTRL+F1切换到字符界面（Linux实体机）**

如果是VMware虚拟机安装的Linux系统，则切换到字符界面的时候需要以下操作     按下ALT+CTRL+SPACE(空格)，ALT+CTRL不松开，再按F1。这样就可以切换到字符界面了。

**2、按ALT+CTRL+F7切换到图形界面（Linux实体机）**

如果是VMware虚拟机安装的Linux系统，则切换到图形界面的时候需要以下操作     按下ALT+CTRL+SPACE(空格)，ALT+CTRL不松开，再按F7。这样就可以切换到图形界面了。

在Linux中一般有ALT+CTRL+F1----F6为字符终端（字符界面），ALT+CTRL+F7为图形界面。不同的发行版本可能有一些差别，但切换方法都是一样的。可以自己试试就可以知道哪些是字符终端，哪些是图形界面。

如果想 Ubuntu 在每次启动到 command prompt ，可以输入以下指令:

```
$echo “false” | sudo tee /etc/X11/default-display-manager
```

当下次开机时，就会以命令行模式启动（text模式，字符界面登录），如果想变回图形界面启动（X windows启动），可以输入:

```
$echo “/usr/sbin/gdm” | sudo tee /etc/X11/default-display-manager
```

如果在Ubuntn以命令行模式启动，在字符终端想回到图形界面的话只需以下命令:

```
$startx
```

### linux下多窗口分屏

![image-20191113224500939](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20191113224500939.png)

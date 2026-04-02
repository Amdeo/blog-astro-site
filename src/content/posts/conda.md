---
title: 'Anaconda'
published: 2017-12-05
description: '创建环境： 配置国内镜像： 修改用户目录下.condarc'
image: '/assets/desktop-banner/4.webp'
tags: ['python', '工具']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Anaconda

创建环境：

```shell
conda create -n <环境名> --no-default-package python=3.7 # 创建一个干净的环境
```

配置国内镜像：

[清华开源镜像]( https://mirror.tuna.tsinghua.edu.cn/help/anaconda/ )

修改用户目录下.condarc

```python
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

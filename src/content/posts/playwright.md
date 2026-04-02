---
title: 'Playwright'
published: 2021-03-05
description: 'Playwright Playwright是一个强大的Python库，仅用一个API即可自动执行 Chromium 、 Firefox 、 WebKit 等主流浏览器自动化操作。'
image: '/assets/desktop-banner/1.webp'
tags: ['python', '编程语言']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Playwright

Playwright是一个强大的Python库，仅用一个API即可自动执行 Chromium 、 Firefox 、 WebKit 等主流浏览器自动化操作，并同时支持以 无头模式 、 有头模式 运行。

Playwright提供的自动化技术是绿色的、功能强大、可靠且快速，支持 Linux 、 Mac 以及 Windows 操作系统。

[项目地址](https://github.com/microsoft/playwright-python)

[文档地址](https://playwright.dev/python/)

## 安装

安装playwright-python依赖库（需要Python3.7以上）

```shell
pip3 install playwright
```

安装主流的浏览器驱动

```shell
python3 -m playwright install
```

## 录制功能

这个工具与常用selenium等其他工具的区别，就是其录制功能

```
python -m playwright codegen --help
```

![image-20210312092809080](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20210312092809080.png)

```
python -m playwright codegen --target=python -o test.py -b chromium https://www.baidu.com
```

![image-20210312093149634](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20210312093149634.png)

最终在本地生成test.py文件

![image-20210312093246755](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20210312093246755.png)

参考文档：https://www.bookstack.cn/read/playwright-1.12/e41f24080616ff9c.md

Centos依赖

```
yum install -y pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc
```

然后

```
yum update nss -y
```

Ubuntu

```
apt-get gconf-service
libasound2
libatk1.0-0
libatk-bridge2.0-0
libc6
libcairo2
libcups2
libdbus-1-3
libexpat1
libfontconfig1
libgcc1
libgconf-2-4
libgdk-pixbuf2.0-0
libglib2.0-0
libgtk-3-0
libnspr4
libpango-1.0-0
libpangocairo-1.0-0
libstdc++6
libx11-6
libx11-xcb1
libxcb1
libxcomposite1
libxcursor1
libxdamage1
libxext6
libxfixes3
libxi6
libxrandr2
libxrender1
libxss1
libxtst6
ca-certificates
fonts-liberation
libappindicator1
libnss3
lsb-release
xdg-utils
wget
libgbm1
```

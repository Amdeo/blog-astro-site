---
title: 'mac使用'
published: 2019-12-18
description: '| name | 简介 | 获取方式 | | | | | | | markdown编辑器 | 官网免费开源 | | | 搜索工具 | 官网免费开源 | | | git图形化界面工具 | 官网免费开源 | | | 视频播放…'
image: '/src/assets/blog-placeholder-about.jpg'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# mac使用

| name | 简介 | 获取方式 |
| --------------------- | ----------------- | ------------ |
| [typora](https://www.typora.io/) | markdown编辑器 | 官网免费开源 |
| [utools](https://www.u.tools/) | 搜索工具 | 官网免费开源 |
| [fork](https://git-fork.com/) | git图形化界面工具 | 官网免费开源 |
| [IINA](https://www.iina.io/) | 视频播放工具 | 官网免费开源 |
| [Free download manager](https://www.freedownloadmanager.org/zh/) | 下载工具 | 官网免费开源 |
| [Google Chrome](https://www.google.cn/intl/zh-CN/chrome/) | 浏览器 | 官网免费开源 |
| [腾讯柠檬清理](https://lemon.qq.com/) | 清理工具 | 官网免费 |
| [腾讯看图](https://jietu.qq.com/) | 看图工具 | 官网免费 |
| [腾讯截图](https://kantu.qq.com/) | 截图工具 | 官网免费 |
| [Snipaste](https://www.snipaste.com/) | 截图工具 | 官网免费 |
| [Clion](https://www.jetbrains.com/clion/) | C++开发工具 | 官网收费 |
| [Pycharm](https://www.jetbrains.com/pycharm/) | python开发工具 | 官网收费 |
| [webstorm](https://www.jetbrains.com/webstorm/) | 前端开发工具 | 官网收费 |
| [为知笔记](https://www.wiz.cn/zh-cn) | 云笔记工具 | 官网收费 |
| [福昕pdf阅读器](https://www.foxitsoftware.cn/) | pdf阅读器 | 官网免费 |
| ZenTermLite | ssh工具 | AppStore |
| Onedrive | 云存储 | AppStore |
| [百度网盘](https://pan.baidu.com/download#pan) | 云存储 | 官网免费 |
| [Visual Studio Code](https://code.visualstudio.com/) | 编辑器 | 官网免费开源 |
| SiteSucker | 离线网站下载神器 | 收费软件 |

安装brew

```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

更新brew

```shell
brew update
```

刷新DNS缓存

```shell
sudo killall -HUP mDNSResponder
```

查看端口使用

```
lsof

lsof | less

lsof -i:8080
```

配置免密码登入ssh

https://zhanqi.net/post/180814/

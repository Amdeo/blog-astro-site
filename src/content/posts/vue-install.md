---
title: 'Vue'
published: 2019-12-05
description: '安装 1. 独立版本 在官网下载vue.js，并在 <script 标签中应用，开发环境不要使用最小压缩版，不然会没有错误提示和警告。 2. 使用CDN 相当于加载网络上独立版本，不需要下载到本地。 以下推荐国外比较稳定…'
image: '/assets/desktop-banner/3.webp'
tags: ['前端', '框架']
category: '前端'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Vue

# 安装

## 1. 独立版本

在官网下载vue.js，并在`<script>`标签中应用，开发环境不要使用最小压缩版，不然会没有错误提示和警告。

## 2. 使用CDN
相当于加载网络上独立版本，不需要下载到本地。

以下推荐国外比较稳定的两个 CDN，国内还没发现哪一家比较好，目前还是建议下载到本地。

- **Staticfile CDN（国内）** : https://cdn.staticfile.org/vue/2.2.2/vue.min.js
- **unpkg**：https://unpkg.com/vue/dist/vue.js, 会保持和 npm 发布的最新的版本一致。
- **cdnjs** : https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.8/vue.min.js

## 3. NPM方法

###  安装node.js
从[node.js官网](https://nodejs.org/en/)下载并安装node，安装过程很简单，一直点下一步就ok了，安装完之后，我们通过打开命令行工具（win+R）,输入node -v 命令，查看node的版本，若出现相应的版本号，则说明你安装成功了。

 ![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/716ae44b-8a77-4cbf-bf86-7ca96efd2b9f.png)



npm包管理器，是集成在node中的，所以安装了node也就有了npm,直接输入 npm -v 命令，显示npm的版本信息。

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/d1179368-35b0-4fda-91b7-8a709020e868.png)

到目前为止，node的环境已经安装完成，npm 包管理器也有了，由于有些npm资源被屏蔽或者是国外资源的原因，经常会导致npm安装依赖包的时候失败，所以我们还需要npm的国内镜像----cnpm.

### **(1) 方法一**
在用Vue.js构建大型应用的时候推荐使用NPM安装方法，NPM能很好的和诸如[Webpack](https://webpack.js.org/)或者[Browserify ](http://browserify.org/)模块打包器配合使用。Vue.js 也提供配套工具来开发单文件组件。

```
# 最新稳定版
$ npm install vue
```
![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/1fc42e00-6663-4141-a0cd-2f0eb466e253.jpg)





### **(2) 方法二**

  首先，先列出我们接下来需要的东西：

- node.js环境（npm包管理器）
- vue-cli 脚手架构建工具
- cnpm npm的淘宝镜像

###  安装cnpm

在命令行中输入npm install -g cnpm --registry=http://registry.npm.taobao.org然后等待，安装完成如下图。


将npm的仓库地址改为淘宝镜像

也可以使用[华为镜像]( https://mirrors.huaweicloud.com/ )

```
npm config set registry https://registry.npm.taobao.org --global

npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/  --global

npm config set disturl https://npm.taobao.org/dist --global
```

### 安装vue-cli脚手架构建工具

```
#安装vue-cli 3.xx之前的版本
npm install -g vue-cli

卸载vue-cli
<<<<<<< Updated upstream
npm uninstall vue-cli -g
=======
npm uninstall vue-cli -g
>>>>>>> Stashed changes


#安装最新版本的vue-cli
npm install -g @vue/cli

#卸载vue-cli
npm uninstall -g @vue/cli
```

在桌面目录下，在命令行中运行命令vue init webpack firstVue。解释一下这个命令，这个命令的意思是初始化一个项目，其中webpack是构建工具，也就是整个项目是基于webpack的。其中firstVue是整个项目文件夹的名称，这个文件夹会自动生成在你指定的目录中（我的实例中，会在桌面生成该文件夹），如下图。
![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/a06711f2-b6be-4f66-bd2c-8d6d50764020.jpg)

vue项目初始化命令如下，若没有安装webpack，则先安装webpack

```
npm install -g webpack

vue init webpack my-project
```

注：安装过程 中有个选项（Use ESLint to line your code ?选择 No ）

进入到myVue目录下，使用npm install 安装package.json包中的依赖

```
cd myVue

npm install
```

运行项目：

```shell
npm run dev
```

Vue样式绑定

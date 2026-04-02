---
title: 'Zsh 配置入门'
published: 2019-12-05
description: '从安装、默认 Shell 设置到 oh-my-zsh 与常用插件，整理一套更顺手的 Zsh 基础配置流程。'
image: '/src/assets/blog-placeholder-2.jpg'
tags: ['工具', '操作系统']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Zsh 配置入门

这篇文章按“安装 → 切换默认 Shell → 配置主题和插件”的顺序整理 Zsh 的基础配置流程，适合第一次折腾终端环境时直接照着过一遍。

## 先确认当前 Shell

```shell
echo $SHELL
```

## 查看系统支持哪些 Shell

```shell
cat /etc/shells
```

## 安装 Zsh

```shell
yum -y install zsh # CentOS 安装 zsh
pacman -S zsh      # Arch 安装 zsh
```

## 将 Zsh 设置为默认 Shell

```shell
chsh -s /bin/zsh
```

## 查看与修改配置文件

```shell
cat $HOME/.zshrc

# 主题示例
ZSH_THEME="robbyrussell"
```

## 安装 oh-my-zsh

```shell
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

安装完成后，可以先看一下自带主题：

```shell
ls ~/.oh-my-zsh/themes
```

## 常用插件

### zsh-syntax-highlighting

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.zsh/zsh-syntax-highlighting
echo "source ${(q-)PWD}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc
source ~/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

### zsh-autosuggestions

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions
```

然后把下面这行加入 `.zshrc`：

```shell
source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
```

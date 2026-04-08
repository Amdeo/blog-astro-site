---
title: 'Shell 脚本基础'
published: 2020-04-19
description: '从变量、作用域到环境变量，整理 Shell 脚本入门阶段最常见的一批基础知识。'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Shell 脚本基础

这篇文章主要整理 Shell 脚本里最常见的基础概念，适合刚开始接触脚本时打底。

查看目前使用的shell
`echo $SHELL`

## 变量

定义变量

```shell
var1=value
var2='value1'
var3="value2"
```
使用变量

```shell
$var1
```

`=号之间不能有空格`

## 作用域
shell的变量作用域分为三种：
- 有的变量只能在函数内使用的，被称为局部变量
- 可以在当前的shell进程中使用的，是被称为全局变量
- 有的变量还可以在子进程中使用，被称为环境变量


## 局部变量
shell脚本在函数中定义的变量，默认也是`全局变量`
```shell
#!/bin/bash

#定义函数
function func(){
    a=99
}

#调用函数
func

#输出函数内部的变量
echo $a
```
想要变量的作用域仅可以使用在函数内部，可以在定义时加上local
```shell
#!/bin/bash
#定义函数
function func(){
    local a=99
}
#调用函数
func
#输出函数内部的变量
echo $a
```
此时的输出结果就是为空的

shell的全局变量
每一个shell进程都有自己的作用域，它们之间互不影响，
在shell中定义的变量，默认就是全局变量

`全局变量的作用范围是当前的shell进程，而不是当前的shell脚本文件`

## Shell 环境变量
全局变量只在当前 Shell 进程中有效，对其它 Shell 进程和子进程都无效。如果使用export命令将全局变量导出，那么它就在所有的子进程中也有效了，这称为“环境变量”。

环境变量被创建时所处的 Shell 进程称为父进程，如果在父进程中再创建一个新的进程来执行 Shell 命令，那么这个新的进程被称作 Shell 子进程。当 Shell 子进程产生时，它会继承父进程的环境变量为自己所用，所以说环境变量可从父进程传给子进程。不难理解，环境变量还可以传递给孙进程。

`两个没有父子关系的Shell进程是不能传递环境变量的，并且环境变量只能向下传递而不能向上传递，即传子不传父`

如何创建shell子进程
```shell
bash
```

## 输出和输入
输出
```shell
echo "string" # 直接输出一个字符串

url=xxx
echo $url # 将变量输出的终端
```

输入
read


|   选项   |   说明   |
| ---- | ---- |
|   -a   |    把读取的数据赋值给数组 array，从下标 0 开始。  |
|  -d    |  用字符串 delimiter 指定读取结束的位置，而不是一个换行符（读取到的数据不包括 delimiter）。    |
|   -e   |   在获取用户输入的时候，对功能键进行编码转换，不会直接显式功能键对应的字符。   |
|   -n  |  读取num个字符，而不是整行字符  |
|   -p   |   显示提示信息，提示内容为 prompt。   |
|   -r | 原样读取（Raw mode），不把反斜杠字符解释为转义字符。 |
|   -s | 静默模式（Silent mode），不会在屏幕上显示输入的字符。当输入密码和其它确认信息的时候，这是很有必要的。 |
|  -t | 设置超时时间，单位为秒。如果用户没有在指定时间内输入完成，那么 read 将会返回一个非 0 的退出状态，表示读取失败。 |
|  -u | 使用文件描述符 fd 作为输入源，而不是标准输入，类似于重定向。 |


```shell
#! /bin/bash

read -p "Enter some information >" name url age
echo "网站名字: $name"
echo "网址：$url"
echo "年龄：$age"
```
注意，必须在一行内输入所有的值，不能换行，否则只能给第一个变量赋值，后续变量都会赋值失败。
`每个输入之间需用空格`

## 如何运行shell脚本
`交互式`：在Shell中一个个地输入命令并及时查看它们的输出结果，整个过程都在在跟Shell不停地互动
`非交互式`：让所有命令批量化、一次性地执行,使用shell就是非交互式
`登入式`：需要使用用户名和密码登入后，才可以使用shell
`非登入式`：不需要登入直接使用shell

Shell一共有四种运行方式：
- 交互式的登入的Shell
- 交互式的非登入Shell
- 非交互式的登入Shell
- 非交互式的非登入Shell

### 判断shell是否式交互式
```shell
echo $-
# 输出的值中包含i,表示交互式
```
输出
```shell
himBH
```

我们在shell脚本中在执行下这个命令
```shell
#!/bin/bash

echo $-
```
输出
```shell
hB
```

## 判断shell是否为登入式
在命令行中输入：
```shell
shopt login_shell
```
输出
```shell
login_shell    on    登入shi

login_shell    off  非登入式
```


运行方法：

方法一：

```shell
./test.sh
```

方法二：

```shell
bash ./test.sh   # 作为一个新程序运行
```

## Shell命令替换

一般有两种方式：

```shell
variable=`commands`
variable=$(commands)
```

 variable 是变量名，commands 是要执行的命令。commands 可以只有一个命令，也可以有多个命令，多个命令之间以分号`;`分隔。


` 将命令的输出结果赋值给某个变量 `

```shell
var1=`date` # 多个命令使用;隔开  例如`data;ps;env`
echo $var1
```

#### 反引号和 $()

` 有些情况必须使用 $()：$() 支持嵌套，反引号不行。 `


## Shell命令行参数

我执行shell脚本可以传递参数的

```shell
./test.sh -V
```

在脚本中可以使用$1、$2 获取脚本第一个和第二个参数，`$0`第0个参数就是脚本本身

```shell
#!/bin/bash
echo "第一个参数: $1"
echo "第二个参数: $2"
```

给函数传递位置参数

```shell
#!/bin/bash
#定义函数
function func(){
    echo "Language: $1"
    echo "URL: $2"
}
#调用函数
func C++ http://c.biancheng.net/cplus/
```

注意：

` 如果参数个数太多，达到或者超过了 10 个，那么就得用`${n}`的形式来接收了 `


### 特殊变量的使用

| 变量      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| $0        | 当前脚本的文件名。                                           |
| $n（n≥1） | 传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是 $1，第二个参数是 $2。 |
| $#        | 传递给脚本或函数的参数个数。                                 |
| $*        | 传递给脚本或函数的所有参数。                                 |
| $@        | 传递给脚本或函数的所有参数。当被双引号`" "`包含时，$@ 与 $* 稍有不同，我们将在《[Shell $*和$@的区别](http://c.biancheng.net/view/vip_4559.html)》一节中详细讲解。 |
| $?        | 上个命令的退出状态，或函数的返回值，我们将在《[Shell $?](http://c.biancheng.net/view/808.html)》一节中详细讲解。 |
| $$        | 当前 Shell 进程 ID。对于 Shell 脚本，就是这些脚本所在的进程 ID。 |

```shell
#!/bin/bash
echo "Process ID: $$"
echo "File Name: $0"
echo "First Parameter : $1"
echo "Second Parameter : $2"
echo "All parameters 1: $@"
echo "All parameters 2: $*"
echo "Total: $#"
```

给函数传递参数

```shell
#!/bin/bash
#定义函数
function func(){
    echo "Language: $1"
    echo "URL: $2"
    echo "First Parameter : $1"
    echo "Second Parameter : $2"
    echo "All parameters 1: $@"
    echo "All parameters 2: $*"
    echo "Total: $#"
}
#调用函数
func Java http://c.biancheng.net/java/
```


$*和$@的区别

- `"$*"`会将所有的参数从整体上看做一份数据，而不是把每个参数都看做一份数据。
- `"$@"`仍然将每个参数都看作一份数据，彼此之间是独立的。

```shell
#!/bin/bash
echo "print each param from \"\$*\""
for var in "$*"
do
    echo "$var"
done
echo "print each param from \"\$@\""
for var in "$@"
do
    echo "$var"
done
```

$?获取上一个命令的退出状态

```shell
#!/bin/bash
if [ "$1" == 100 ]
then
   exit 0  #参数正确，退出状态为0
else
   exit 1  #参数错误，退出状态1
fi
```

 `exit`表示退出当前 Shell 进程，我们必须在新进程中运行 test.sh，否则当前 Shell 会话（终端窗口）会被关闭，我们就无法取得它的退出状态了。

```shell
bash ./test.sh 100  #作为一个新进程运行
echo $?
```

获取函数的返回值

```shell
#!/bin/bash
#得到两个数相加的和
function add(){
    return `expr $1 + $2`
}
add 23 50  #调用函数
echo $?  #获取函数返回值
```

## expect 使用

**安装**

```shell
yum -y install tcl-devel
yum -y install expect
```


**set timeout 30**

设置超时时间，单位是秒，如果设为timeout -1 意为永不超市

**spawn**

spawn是进入expect环境后才能执行的内部命令，不能直接在默认的shell环境中进行执行

主要功能：传递交互指令

**expect**

主要功能：判断输出结果是否包含某项字符串，没有则立即返回，否则就等待一段时间后返回，等待时间通过timeout进行设置

**send**

执行交互动作，将交互要执行的动作进行输入给交互指令

命令字符串串结尾加上"r"，如果出现异常等待的状态可以进行稽查

**interact**

执行完后保持交互状态，把控制权交给控制台

如果不加这一项，交互完成会自动退出

**exp_continue**

继续执行接下来的交互操作

**$argv**

expect脚本可以接受从bash传递过来的参数，可以使用[lindex $argv n]获得，n从0开始，分别表示第一个，第二个，第三个......参数

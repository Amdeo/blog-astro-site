---
title: 'gdb调试'
published: 2020-07-19
description: '编译程序，加上 g选项 进入gdb 在gdb中运行程序 退出gdb 设置断点 查看断点信息 删除断点 使断点失效或恢复生效 设置观察点 捕捉 追踪变量 执行下一条语句 打印内部变量 继续执行 修改变量的值 显示变量的数据…'
image: '/src/assets/blog-placeholder-5.jpg'
tags: ['C/C++', '调试']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

编译程序，加上-g选项
```shell
gcc -g main.cpp -o test.out
```

## 进入gdb
```shell
gdb test.out
```

## 在gdb中运行程序
```shell
(gdb) run
```

## 退出gdb
```shell
(gdb) quit 或者q
```


## 设置断点
```shell
# gdb调试
(gdb) break + main(func)

# 在代码中的某一行处设置断点
(gdb) break + 行号

# 用于在指定文件对应行设置断点
(gdb) break + filename:行号

# 内存地址断点
(gdb) break + <0x...>

#用于设置条件断点，在循环中使用非常方便
(gdb) break + 行号 + if + 条件
(gdb) break 10 if i==3
```

## 查看断点信息
```shell
# 查看断点信息
(gdb) info breakpoints
# 查看观察点信息
(gdb) info watchpoints
```

## 删除断点
```shell
# 删除所有断点
(gdb) clear
# 删除指点断点
(gdb) delete + 断点编号
```

## 使断点失效或恢复生效
```shell
(gdb) disable/enable + 断点编号
```

## 设置观察点
```shell
# 设置观察点，当变量被读出或吸入时程序被暂停
(gdb) awatch/watch + 变量
# 设置观察点，当变量被读出时，程序被暂停
(gdb) rwatch + 变量
```
## 捕捉
```shell
# 设置捕捉点来捕捉程序运行时的一些事件，如：载入共享库、或者C++的异常
(gdb) catch

# 只设置一次捕捉点，当程序停住以后，应点被自动删除
(gdb) tcatch
```
## 追踪变量
```shell
# 每次程序停下来，都会打印变量的值。
(gdb) display + 变量

# 查看追踪列表
info display

# 删除追踪
(gdb) delete + 编号

# 使追踪列表设置成失效或者生效
(gdb) disable/enable + display 编号ß
```

## 执行下一条语句
```shell
# 执行下一条语句,如果该语句为函数调用,则进入函数执行其中的第一条语句
(gdb) step

# 执行下一条语句,如果该语句为函数调用,不会进入函数内部执行(即不会一步步地调试函数内部语句)
(gdb) step
```

## 打印内部变量
```shell
(gdb) print
# 打印动态内存的值
(gdb) p *array@len
```

## 继续执行
```shell
(gdb) continue
```

## 修改变量的值
```shell
(gdb) set variable <变量>=<表达式>
```

## 显示变量的数据类型
```shell
(gdb) whatis + 变量
```

## 显示栈帧
```shell
(gdb) bt

# 不仅显示backtrace，还显示局部变量
(gdb) bt full
# 显示开头N个栈帧
(gdb) bt N

(gdb) bt full N
```

## 显示寄存器
```shell
(gdb) info reg

# 使用print 打印寄存器的内容
(gdb) p $寄存器 # p $pc
# 十六进制显示寄存器内容。
(gdb) p/x $寄存器

(gdb) x $寄存器 # 显示程序指针内容

(gdb) x/i $寄存器 # 显示程序指针汇编。

(gdb) x/10i $寄存器 # 显示程序指针之后10条指令。
```

## 生成coredump文件
```shell
(gdb) generate-core-file
```

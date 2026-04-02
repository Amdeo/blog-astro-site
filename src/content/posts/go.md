---
title: 'go语言'
published: 2021-05-05
description: 'go 入门 go基本组成 直接运行 编译 基础语法 规则 一行代表一个语句结束 标识符用来命名变量、类型等程序实体。标识符组成是字母、数字、下划线，第一个字符必须是字母或下划线而不能是数字 关键字 Go代码中使用25个关…'
image: '/assets/desktop-banner/3.webp'
tags: ['工具', 'hexo']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# go语言

go 入门 go基本组成 直接运行 编译 基础语法 规则 一行代表一个语句结束 标识符用来命名变量、类型等程序实体。标识符组成是字母、数字、下划线，第一个字符必须是字母或下划线而不能是数字 关键字 Go代码中使用25个关…


## 入门

### go基本组成

```go
package main	// 定义报名

import "fmt"	// 导入外部包

// 程序开始执行的函数
func main() {
   /* 这是我的第一个简单的程序 */
   fmt.Println("Hello, World!")
}
```

直接运行

```shell
go run hello.go
```

编译

```shell
go build hello.go

# 执行./hello
./hello
```

## 基础语法

规则

- 一行代表一个语句结束

- 标识符用来命名变量、类型等程序实体。标识符组成是字母、数字、下划线，第一个字符必须是字母或下划线而不能是数字

### 关键字

Go代码中使用25个关键字或保留字：

| break    | default     | func   | interface | select |
| -------- | ----------- | ------ | --------- | ------ |
| case     | defer       | go     | map       | struct |
| chan     | else        | goto   | package   | switch |
| const    | fallthrough | if     | range     | type   |
| continue | for         | import | return    | var    |

36个预定义标识符

| append | bool    | byte    | cap     | close  | complex | complex64 | complex128 | uint16  |
| ------ | ------- | ------- | ------- | ------ | ------- | --------- | ---------- | ------- |
| copy   | false   | float32 | float64 | imag   | int     | int8      | int16      | uint32  |
| int32  | int64   | iota    | len     | make   | new     | nil       | panic      | uint64  |
| print  | println | real    | recover | string | true    | uint      | uint8      | uintptr |

### 定义变量

> 这个部分和C语言一样，就是多了一个简短写法和类型自动推导

```go
// 标准格式 声明变量
var a int = 1
// 简短格式 定义变量
b := 2
// 类型自动推导
var c = "xx"
d := "xxx"
fmt.Println(a,b,c,d)
```
匿名变量

> 当你不想获取一个值，可以使用_来处理
>
> 匿名变量不占用内存空间，不会分配内存。匿名变量与匿名变量之间也不会因为多次声明而无法使用。

```
a,_ := getdata()
```

批量声明变量

```
var (
	name string
	age int
)
```


## 数据类型

- bool
- string
- int、int8、int16、int32、int64
- uint、uint8、uint16、uint32、uint64、uintptr
- byte // uint8 的别名
- rune // int32 的别名 代表一个 Unicode 码
- float32、float64
- complex64、complex128

### 如何定义字符串？

单行字符串-`字符串字面量`，使用双引号，不能跨行。

```
const str = "12344"
```

多行字符串-使用`反引号`

```go
const str = `0
1
2
3
`
```

拼接字符串

```
str := "123" + "111"

// + 号必须放在第一行末尾
str := "1123" +
"111"
```

### 如何定义枚举？

```go
const (
     Arrow Weapon = iota    // 开始生成枚举值, 默认为0
     Shuriken
     SniperRifle
     Rifle
     Blower
)
```

**常量生成器iota**

```
type Weekday int	// 类似typedef的
const (
    Sunday Weekday = iota
    Monday
    Tuesday
    Wednesday
    Thursday
    Friday
    Saturday
)
```

### 如何定义类型别名、类型声明

```
type D = int   // 类型别名
type I int    // 类型声明
```

类型声明的类型是一个新的类型，只是它们的功能一样

类型别名它们就是一种类型

## 流程控制

### 条件语句if

但分支语句

`````go
x := 0
if n == 0 {
	println(n)
}
`````

多分支语句

```go
x := 0
if n == 0 {
	println(n)
} else if n > 1 {
  // ...
} else if n > 2 {
  // ...
} else {
  // ...
}
```

### 条件语句switch

switch 语句

```go
switch var1 {
    case val1:
        ...
    case val2:
        ...
    default:
        ...
}

// var1 可以是为任何类型，而val1和val2则可以为同类型的任意值。
```

type switch

> switch 语句还可以被用于 type-switch 来判断某个 interface 变量中实际存储的变量类型。

```go
package main

import "fmt"

func main() {
	var x interface{}
	x = 1	// 可以赋值不同类型的值
	switch i := x.(type) {
	case nil:
		fmt.Printf(" x 的类型 :%T\r\n", i)
	case int:
		fmt.Printf("x 是 int 型")
	case float64:
		fmt.Printf("x 是 float64 型")
	case func(int) float64:
		fmt.Printf("x 是 func(int) 型")
	case bool, string:
		fmt.Printf("x 是 bool 或 string 型")
	default:
		fmt.Printf("未知型")
	}
}
```

### 条件语句select

> TODO

### 循环语句for

```go
for init; condition; post {}
```

上面这个语句和C语言类似, for少了个括号

```go
for condition {}

// 类似C语言中， while (n > 0) for (; n > 0;)
```

```go
for {} // 无限循环

// 类似C语言中 while (true) {} 或者 for (;;) {}
```

### 循环语句range

> 类似迭代器的操作，返回(索引，值)或(键，值)

```go
for key, value := range oldMap {
  newMap[key] = value
}
```


```go
package main

func main() {
    s := "abc"
    // 忽略 2nd value，支持 string/array/slice/map。
    for i := range s {
        println(s[i])
    }
    // 忽略 index。
    for _, c := range s {
        println(c)
    }
    // 忽略全部返回值，仅迭代。
    for range s {

    }

    m := map[string]int{"a": 1, "b": 2}
    // 返回 (key, value)。
    for k, v := range m {
        println(k, v)
    }
}
```

循环控制Goto、Break、Continue

break

```go
func main() {
LABEL1:
	for {
		for i := 0; i < 10; i++ {
			if i > 3 {
				break LABEL1
			}
			fmt.Println(i)
		}
	}
}

// 可以跳出标签指定的那层循环
```

goto

```go
func main() {
	for {
		for i := 0; i < 10; i++ {
			if i > 3 {
				goto label1
			}
			fmt.Println(i)
		}
	}
label1:
	fmt.Println("over")
}

// 表示将运行位置跳到标签所在的位置
```

continue

```go
func continueDemo() {
forloop1:
    for i := 0; i < 5; i++ {
        // forloop2:
        for j := 0; j < 5; j++ {
            if i == 2 && j == 2 {
                continue forloop1    // 跳转到 forloop1 标签的循环。
            }
            fmt.Printf("%v-%v\n", i, j)
        }
    }
}
```


## 局部变量

生命周期

- 函数体内定义的变量
- 函数的参数和返回值

## 全局变量

生命周期

- 函数体外声明的变量
- 在一个源文件中定义，所有源文件都可以使用
- 全局变量必须以var关键字开头，如果想要在外部中使用全局变量的首字母必须`大写`

Go语言中字符串中实现使用UTF-8编码，通过rune类型，可以方便地每个UTF-8字符进行访问。

## 类型转换

> 和C语言差不多，目前还未发现有细节差别

```
valueOfTypeB = typeB(valueOfTypeA)
```

### int转换string

> strconv包

```
func Itoa(i int) string

str := strconv.Itoa(int)
```

### string转换int

> strconv包

```
func Atoi(s string) (i int, err error)

num, err := strconv.Atoi(str)
```

### Parse 系列函数

> strconv包

包含ParseBool()、ParseFloat()、ParseInt()、ParseUint()


## 容器

### 数组

> 长度是不可变的

定义数组

```
var var_name [元素数量]type
```

声明

```
var a [3]int
a[0] = 1
a[1] = 2
a[2] = 3
```

声明并初始化

```
var a [3]int{1,2,3}

var a [...]int{1,2,3,4} //会自动计算长度
```

获取数组长度

```
len(array)
```

多维数组

```
var array [3][4]int{{1,2,3,4},{5,6,7,8},{9,10,11,12}}
```

数组切片

> 切片是一段连续的内存区域，可以是数组，也可以是切片本身
>
> 切片是一个引用类型，类似于Python list类型
>
> 长度可以变化的

```
var a  = [5]int{1, 2, 3, 4, 5}
fmt.Println(a, a[1:2])
a[3:]	// 4,5
a[:4]	// 1,2,3,4
a[:] // 1,2,3,4,5
```

创建切片

```
make( []Type, size, cap) // cap预分配的数量

a := make([]int, 2)
b := make([]int, 2, 10)
[]int{}
[]int{1,2,3,4}
```


### 映射

定义map

```
var varname map[keytype]valuetype

var a map[string]int // 定义一个类型为string,值为int的map
```


## 指针

> 指针变量是存储其他变量的内存地址
>
> go的指针不支持加减运算

```
var a int = 1
ptr := &a // 断定义
var ptr *int = &a
```

取址符`&`获取一个变量的地址

## 内存管理

go语言不需要关心变量是分配在栈上或者堆上。


## 常量

```
const name [type] = value
```

## 批量声明常量

```
const (
    e  = 2.7182818
    pi = 3.1415926
)

const (
    a = 1
    b
    c = 2
    d
)
fmt.Println(a, b, c, d) // "1 1 2 2"
```

> 所有常量的运算都是在编译器完成的，这样不仅可以减少运行时的工作，也方便其他代码的编译优化。

## 函数

函数的声明

```
func 函数名(形参) (返回值列表) {
	函数体
}
```

## 网络学习

```go
package main

import (
	"fmt"
	"net/http"
)

func sayHello(w http.ResponseWriter,r *http.Request) {
	_,_ = fmt.Fprintf(w,"hello Golang")
}

func main() {
	http.HandleFunc("/hello",sayHello)
	err := http.ListenAndServe(":9090",nil)
	if err != nil {
		fmt.Printf("http serve failed,err:%v\n", err)
		return
	}
}
```


## 接口

> 方法的集合
>
> 可以实现类似C++多态的能力

定义

```
type 接口类型名 interface{
    方法名1( 参数列表1 ) 返回值列表1
    方法名2( 参数列表2 ) 返回值列表2
    …
}
```

空接口

> 可以作为函数参数 Println 实现
>
> 空接口类型可以作为map的value

```
type xxx interface{
}
```

Go判断变量

```
```

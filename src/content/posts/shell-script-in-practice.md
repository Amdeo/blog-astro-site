---
title: 'Shell 脚本实战'
published: 2019-12-05
description: '围绕脚本执行、打印、变量等基础内容，整理一份适合入门和速查的 Shell 实战笔记。'
tags: ['操作系统']
category: '操作系统'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Shell 脚本实战

这篇文章偏向实用整理，主要覆盖 Shell 脚本刚上手时最先接触的一批内容。

指定一个解释器

以#！开头 + 解释器的路径

```shell
#! /bin/bash
```

shell脚本的执行方法

第一种方法：

使用sh命令 + 脚本路径

```shell
 sh script.sh
```

第二种方法

```shell
1. 赋予shell脚本权限
chmod a+x script.sh

2. 执行
./script.sh
```

# 打印

**echo**

使用echo打印，每次代用会默认添加一个换行符

```shell
#输出双引号的字符串
echo "Welcome to Bash"

#输出不带双引号的文本
echo Welcome to Bash

#输出单引号的文本
echo 'Welcome to Bash'
```

**printf**

```shell
#! /bin/bash

printf "Hello world\n"

printf "%-5s %-10s %-4s\n" NO Name Mark
# “-” 指明一个格式为左对齐（默认的使用右对齐方式）
# 5s 指定一个字符串长度，不够的添加空格
```

-  使用printf不会添加换行符，需要换行需要自己增加


# 变量

**定义变量**

```shell
#定义变量 = 左右两边不能有空格
fruit=apple
count=5
```

**使用变量**

- $变量名

- ${变量名}

```shell
echo "We have $count ${fruit}(s)"
```


```shell
#! /bin/bash

fruit=apple
count=5
#变量的使用
echo "We have $count ${fruit}(s)"

#output
#We have 5 apple(s)
#
```

# **获取变量的长度**

```shell
var=0123456789
length=${#var}

#output : 10
```

# **获取当前shell的版本**

```shell
echo $SHELL
或者
echo $0
```

# 判断当前的用户是为超级用户

使用$UID这个变量，因为root用户的UID是0

```shell
if [$UID -ne 0];then
echo Non root user.Please run as root.
else
echo "Root user"
fi
```

# 通过shell进行数学运算

let命令可以直接执行基本的算数操作

```shell
#! /bin/bash
no1=4;
no2=5;

let result=no1+no2;
echo $result

#output：9
```

自增和自减

```shell
let no1++
let no1--
```

简写

```shell
let no+=6   #等价于 let no=no+6
```

使用操作符[]的使用方法和let命令类似：

```shell
#! /bin/bash
no1=4;
no2=5;

result=$[no1 + no2]

result=$[$no1 + 5]

result=$((no1 + 50))

result=`expr 3 + 4`

#这些方法只能用于整数运算，而不支持浮点数
```

## 浮点数运算

bc是一个用于数学运算的高级工具，这个精密计算器包含了大量的选项

```shell
echo "4 * 0.56" | bc  #2.24

no=54;
result=`echo "$no * 1.5" | bc`
echo $result

#ourput 81.0
```

- 设定小数精度（数值范围）：在下面的例子中，参数scale=2将小数位个数设置为2

```shell
echo "scale=2;3/8" | bc
#output 0.37
```

参数scale=2将小数位个数设置为2

- 进制转换：用bc可以将一种进制系统转换为另一种，来看看如何将十进制转换成二进制，然后再将二进制转换回十进制：

```shell
#! /bin/bash
no=100
echo "obase=2;$no" | bc

no=1100100
echo "obase=10;ibase=2;$no" | bc
```

obase=2 二进制 obase=10 十进制

## 计算平方以及平方根：

```shell
echo "sqrt(100)" | bc #Square root
echo "10^10" | bc #Square
```


# 输出重定向

```shell
echo "This is a sample text 1" > temp.txt
```

- 先清空temp.txt文件内容
- 将“This is  a sample text 1” 写入文件

```shell
echo "This is a sample text 2" >> temp.txt
```

将输出的内容以追加的方式写入文件中。

# 数组和关联数组

定义一个数组

```shell
array_var=(1 2 3 4 5 6)
```

数组赋值

```shell
array_var[0]="test1"
array_var[1]="test2"
array_var[2]="test3"
array_var[3]="test4"
array_var[4]="test5"
array_var[5]="test6"

echo ${array_var[0]}
```

获取所有的数组元素

```shell
array_var[*]
```

# 获取、设置日期和延时

```shell
date
#output: Thu Aug  1 09:50:07  2019
```

获取秒数

```shell
date +%s
#output: 1564653113
```

获取星期

```shell
date +%A #output: Sat
date +%a #output: Saturday
```

获取月

```shell
date +%B #output: Nov
date +%b #output: November
```

获取日

```shell
date +%d #output：01
```

固定日期格式

```shell
date +"%Y%m%d%H%M%S" #output: 20190801192735

date +"%Y %m %d %H %M %S" #output: 2019 08 01 19 28 35

date +"%d %B %Y" #output:01 August 2019
```

# 函数和参数

```shell
function fname()
{
statements;
}

或者
fname()
{
statements;
}

```

```shell
fname()
{
	echo $1,$2;  #访问参数1和参数2
	echo "$@";   #以列表的方式一次性打印所有参数
	echo "$*";	 #类似于$@,但是参数被作为实体
	return 0;    #返回值
}
```

# 循环

## for循环

```shell
for i in $list;
do
	actions;
done
#或者
for((i=0;i<10;i++))
{
	commands;
}
```

## while循环

用true作为循环条件能够产生无限循环。

```shell
while condition
do
	conmmands;
done
```

## until循环

它的功能是一直执行循环知道给定的条件为真

```shell
x=0;
until [$x -eq 9]; # [$x -eq 9] is the condition
do let x++;echo $x;
done
```

# 比较

| 参数 | 说明           |
| ---- | -------------- |
| -eq  | 等于则为真     |
| -ne  | 不等于则为真   |
| -gt  | 大于则为真     |
| -ge  | 大于则为真     |
| -lt  | 小于则为真     |
| -le  | 小于等于则为真 |

- [-f $file_var] : 如果给定的变量包含正常的文件路径或文件名，则返回真。
- [-x $var] : 如果给定的变量包含的文件可执行，则返回真
- [-d $var] : 如果给定的变量包含的是目录，则返回真
- [-e $var] : 如果给定的变量包含的文件存在，则返回真
- [-c $var] : 如果给定的变量包含的是一个字符设备文件的路径，则返回真
- [-b $var] : 如果给定的变量包含的是一个块设备的路径，则返回真
- [-w $var] :如果给定的变量包含的文件可写，则返回真
- [-r $var] : 如果给定的变量包含的文件可读，则返回真
- [-L $var] : 如果给定的变量包含的是一个符号链接，则返回真


## 字符串比较

使用字符串比较时，最好用双中括号，因为有时候采用单个中括号会产生错误，所以最好避开它们。

可以检查两个字符串

- `[[ $str1 = $str2]]` : 当str1等于str2时，返回真，也就是说，str1和str2包含的文本是一模一样。
- `[[ $str1 == $str2]]`：这是检查字符串是否相等的另一种写法，也可以检查两个字符串是否不同。
- `[[ $str1 ！= $str2]]`：这是str1和str2不相同，则返回真。
- `[[$str1 > $str2]]`: 如果str1的字母序比str2大，则返回真
- `[[$str1 < $str2]]`: 如果str1的字母序比str2小，则返回真
- `[[-z $str1]]`: 如果str1包含的是空字符串，则返回真
- `[[-n $str1]]`: 如果str1包含的是非空字符串，则返回真

# cat 命令

1.压缩空白行

文本中有多个空行需要被压缩成单个

```shell
cat -s file
```

2.将制表符显式^|

```shell
cat -T file.py
```

3.显示行号

```shell
cat -n lines.txt
```

# 文件查找与文件列表find

find命令的工作方式如下：沿着文件层次结构向下遍历，匹配符合条件的文件，并执行相应的操作。

要列出当前目录及子目录下所有的文件和文件夹，

```shell
find base_path
```

bash_path可以是任何位置，find会从改位置开始向下查找。

```shell
find . -print
#打印文件和目录的列表
```

. 指定当前目录， .. 指定父目录。

- -print指明打印出匹配文件的文件名（路径）。当使用-print时，’\n'作为用于分隔文件的定界符。
- -print0指明使用’\0’作为定界符来打印每一个匹配的文件名，当文件名中包含换行符时

**根据文件名或正则表达式匹配搜索**

```shell
find . -name ".txt" -print
#查找当前目录中所有的txt文件
```

匹配多个条件

```shell
find . \( -name "*.txt" -o -name "*.pdf" \) -print
#查找当前目录中所有txt和pdf文件
```

-iregex用于忽略正则表达式的大小写

```shell
find . -iregex ".*\(\.py\|\.sh\)$"

#搜索py（无视大小写）和sh（无视大小写）的后缀的文件，
```

否定参数

```shell
find . ! -name ".txt" -print
#查找除了txt之外的文件
```

目录深度搜索

- mindepth 最小深度
- maxdepth 最大深度

```shell
find . -mindepth 2 *
```

根据文件类型搜索

linux文件类型包括普通文件、目录、字符设备、块设备、符号链接、硬链接、套接字以及FIFO

-type可以对文件搜索进行过滤

```shell
find . -type d -print
```

根据文件时间进行搜索

- 访问时间（-atime）：用户最近一次访问文件的时间
- 修改时间（-mtime）：文件内容最后一次被修改的时间
- 变化时间（-ctime）：文件元数据最后一次改变的时间

```shell
#打印出在最近七天被访问过的所有文件：
find . -type f -atime -7 -print
#打印出在七天前被访问过的所有文件：
find . -type f -atime 7 -print
#打印出访问时间超过七天的所有文件:
find . -type f -atime +7 -print
```

按分钟作为计量单位的

- -amin(访问时间)
- -mmin（修改时间）
- -cmin（变化时间）

```shell
#打印出访问时间超过7分钟的所有文件
find . -type f -amin +7 -print
```

-newer参数

```shell
#查找比参考文件更新的所有文件
find . -type -newer file.txt -print
```

基于文件大小的搜索

```shell
find . -type f -size +2k
#大于2KB的文件
```

```shell
find . -type f -size -2k
#小于2kb的文件
```

```shell
find . -type f -size 2k
#大于等于2kB的文件
```

-delete可用来删除find查找的匹配文件

```shell
#删除当前目录下所有的.swp文件
find . -type f -name "*.swp" -delete
```

```shell
#打印出权限为644的文件
find . -type f -perm 644 -print
```

```shell
#打印出用户slynux拥有的所有文件
find . -type f -user alynux -print
```

 结合find执行命令或动作

```shell
find . -type f -user root -exec chown slynux{} \;
```

# xargs命令

xargs命令把从stdin接收到的数据重新格式化，再将其作为参数提供给其他命令

将多行输入转换成单行输出

```shell
cat example.txt | xarga #将输出的文件内容，输出内容转换为一行
```

将单行输入转换成多行输出

```shell
cat example.txt | xargs -n 3 #将输出的文件内容，输出内容转换为一行(按照空格为定界符)
```

使用-d选项为输入指定一个定制的定界符

```shell
echo "splitXsplitXsplitXsplitXsplit" | xargs -d X
#output: split split split split
```

```shell
echo "splitXsplitXsplitXsplitXsplit" | xargs -d X -n 2
#output:
#split split
#split split
```

# 校验与核实

我们从网上下载大文件，经常要求我们校验文件完整性，将从软件中带的MD5和下载后文件生成的MD5进行比较，一样就表示文件完整，否则反之。

```shell
md5sum script.sh

#output md5sum是32个字符的十六进制串
4556bd00d254115c92fb55169e1567ae  script.sh
```


```shell
md5sum file1 file2 file3

#[checksum1] file1
#[checksum1] file2
#[checksum1] file3
```

生成md5文件

```shell
md5sum file > file_sum.md

md5su -c file_sum.md # 注意file_sum.md和待检验的文件放在同一目录中
```

# Sort

sort命令能够帮助我们对文本文件和stdin进行排序（按行进行排序）

## example

```shell
cat file_sum.md5
#output: 4556bd00d254115c92fb55169e1567ae  script.sh

### ###################################################
cat script.sh
#output:
#! /bin/bash

for i in {1..20};
do
echo $i;
done;
#djisjs

### ##################################################
sort file_sum.md5 script.sh
#output:
4556bd00d254115c92fb55169e1567ae  script.sh
#! /bin/bash
#djisjs
do
done;
echo $i;
for i in {1..20};

#可以看出上面输出将两个文件的内容进行了合并，并按照按照行的首字符进行了排序
````

按照数字进行排序：

```shell
sort -n file.txt
```

按照逆序进行排序：

```shell
sort -r file.txt
```

按月份进行排序

```shell
sort -M months.txt
```

如果需要合并两个排过序的文件，而且不需要对合并后的文件再进行排序，可以使用。

```shell
sort -m sorted1 sorted2
```

按列进行排序

```shell
cat data.txt
#output:
1 mac       2000
2 winxp     4000
3 bsd       1000
4 linux     1000
```

```shell
#依据第1列，以逆序形式排序 k:指定了排序按照哪一个键（key)来进行， r:sort命令按照逆序进行排序
sort -nrk 1 data.txt
#output:
4	linux	1000
3	bsd     1000
2	winxp   4000
1	mac     2000
```

-b选项

用于忽略文件中的前导白字符，

-d选项

用于指明以字典序进行排序

# uniq

uniq命令通过消除复杂内容，从给定输入中（stdin或命令行参数文件）找出单一的行，它也可以用来找出输入中出现的复杂行，uniq只能用于排过序的数据输入。

uniq命令通过消除复杂内容，从给定输入中（stdin或命令行参数文件）找出单一的行，它也可以用来找出输入中出现的复杂行，uniq只能用于排过序的数据输入。


# 分割文件和数据

## spilt

生成一个大小为100KB的测试文件

```shell
dd if=/dev/zero bs=100k count=1 of=data.file
```

上面的命令会创建一个伪100KB而文件内容全部是0的文件

```shell
#将文件分割成多个更小的文件
spilt -b 10k data.file

#将会生成很多文件 xaa xba xac xad ..........
```

```shell
split -b 10k data.file -d -a 4
#-d 生成文件名是以数据进行结尾
#-a length就可指定后缀长度
```

如果不想按照数据块大小进行分割，而是需要根据行数来分割文件的话，可以使用`-l`

```shell
split -l 10 data.file
```

## cspilt

cspilt是spilt工具的一个变体，spilt只能够根据大小或行数分割文件，而cspilt可以根据文本自身的特点进行分割，是否存在某个单词或文本内容都作为分割文件的条件。

```shell
cat server.log
```

```shell
output:
SERVER-1
[connection] 192.0.0.1 xxxxx
[connection] 192.0.0.1 xxxxx
[connection] 192.0.0.1 xxxxx
SERVER-2
[connection] 192.0.0.1 xxxxx
[connection] 192.0.0.1 xxxxx
[connection] 192.0.0.1 xxxxx
SERVER-3
[connection] 192.0.0.1 xxxxx
[connection] 192.0.0.1 xxxxx
[connection] 192.0.0.1 xxxxx
```

```shell
cspilt server.log /SERVER/ -n 2 -s {*} -f server -b "%02d.log" ;
```

```shell
ls
server01.log server02.log server03.log server.log
```

- /SERVER用来匹配某一行，分割过程即从此处开始

- /[REGEX]/表示文本样式。包括从当前行（第一行）直到（但不包括）包含“SERVER”的匹配行

- {*}表示根据匹配重复执行分割，直到文件末尾为止。可以用{整数}的形式来指定分割执行的次数。

- -s 使命令进入静默模式，不打印其他信息

- -n指定分割后的文件名后缀的数字个数，

- -f 指定分割后的文件名后缀

- -b 指定后缀格式。例如“%02d.log”，类似于C语言中printf的参数格式。在这里文件名=前缀+后缀=server + %02d.log



## 根据扩展名切分文件名

获取文件名

```shell
file_jpg="sample.jpg"
name=${file_jpg%.*}
echo File name is :$name
```

```shell
output:

File name is: sample
```

获取文件扩展名

```shell
extension=${file_jpg#*.}
echo Extension is:$extension
```

```shell
output:
echo Extension is:jpg
```

${VAR%.*}

- 从$VARIABLE中删除位于%左侧的通配符（在前例中是.*）所匹配的字符串。通配符从右向左进行匹配。
- 给VAR赋值，VAR=sample.jpg.那么，通配符从右向左就会匹配到.jpg，因此，从$VAR中删除匹配结果，机会得到输出“sample”.

%属于非贪婪操作，它从右到左找出匹配通配符的最短结果，还有另一个操作符%%，这个操作符与%相似，但行为模式却是贪婪的，这意味着它会匹配符合条件的最长的字符串。

```shell
Var=hack.fun.book.txt

echo ${Var%.*}

output:hack.fun.book

### #########################
echo ${Var%%.*}
output:hack
```

${VAR#*.}

```shell
VAR=hack.fun.book.txt

echo ${VAR#*.}
output:fun.book.txt

echo ${VAR##*.}
output:txt
```

example

```shell
URL="www.googl.com"

echo ${URL%.*} #output:www.google
echo ${URL%%.*} #output:www
echo ${URL#*.} #output:google.com
echo ${URL##*.} #com
```


# 批量重命名和移动

## example

```shell
#! /bin/bash
#文件名rename.sh
#用途： 重命名.jpg和.png

count=1;
for img in *.log *.png
do
new=image-$count.${img##*.}

mv "$img" "$new" 2> /dev/null
#2> /dev/null 有时候，我并不想看到任何输出，我只想看到这条命令运行是不是正常，那么我们可以同时禁止标准输出和标准错误的输出,比如上面这个命令有任何错误信息都不会在终端上打印了

if [$? -eq 0] #$? 判断最后的命令的推出状态，0表示没有错误，其他任何值表明有错误
then
echo "Renaming $img to $new"
let count++

fi
done
```

执行：

./rename.sh

Renaming hack.jpg to image-1.jpg

Renaming new.jpg to image-2.jpg

Renaming next.jpg to image-3.jpg

该脚本将当前目录下所有的.jpg和.png文件重命名,新文件的格式image-1.jpg、image-2.jpg、image-3.jpg、image-4.png等

# 拼写检查与词典操作

```shell
#! /bin/bash
#文件名：checkwork.sh
word=$1
grep "^$1$" /usr/share/dict/british-english -q
#在grep中，^标记着单词的开始，$标记着单词的结束，-q禁止产生任何输出

if [$? -eeq 0]; then
	echo $word is a dictionary word;
else
	echo $word is not dictionary word;
fi
```

```shell
./checkword.sh ful

ful is not a dictionary word

./checkword.sh fool

fool is a dictionary word
```


```shell
#! /bin/bash
#文件名：aspellcheck.sh

word=$1
output=`echo \"$word\" | aspell list`
if [-z $output];then
#-z用于确定$output是否为空
	echo $word is a dictionary word;
else
	echo $word is not a dictionary word;
fi
```

当给定的输入不是一个词典单词，aspell list命令产生输出文本，反之则不产生任何输出。 -z用于确认$output是否为空

# 交互输入自动化

下写一个读取交互式输入的脚本，然后用这个脚本进行自动化的演示：

```shell
#! /bin/bash
#文件名：interactive.sh
read -p "Enter number:" no;
read -p "Enter name:" name
echo You have entered $no,$name;
```

```shell
echo "1\nhello\n" | ./interactive.sh

output:
You have entered 1,hello
```

用expect实现自动化

expect等待特定的输入提示，通过检查输入提示来发送数据

```shell
#! /usr/bin/expect
#文件名：automate_expect.sh

spawn ./interactive.sh
expect "Enter number:"
send "1\n"
expect "Enter name:"
send "hello\n"
expect eof
```

- spawn参数指定需要自动化哪个命令；
- expect参数提供需要等待的消息；
- send是要发送的消息
- expect eof指明命令交互结束


# 文件处理

## 生成任意大小的文件

创建特定大小的大文件最简单的方法就是利用dd命令。dd命令会克隆给定的输入内容，然后将一模一样的一份副本写入到输出。stdin、设备文件、普通文件等都可作为输入，stdout、设备文件、普通文件等也作为输出

```shell
dd if=/dev/zero of=junk.data bs=1M count=1
```

该命令会创建一个1MB大小的文件junk.data。来看下命令参数：if代表输入文件（input），of代表输出文件（output），bs代表以字节为单位的块大小（Block size），count代表被复制的块数

/dev/zero是一个字符设备，它会不断返回0值字符（\0）

## 文本文件的交集与差集

comm命令可用于两个文件之间的比较。

交集：打印出两个文件所共有的行

求集：打印出指定文件所包含的且不相同的那些行

差集：打印出包含在文件A中，但不包含在其他指定文件中的那些行

comm命令必须使用排过序的文件作为输入

```shell
cat A.txt
apple
orange
gold
silver
steel
iron

cat B.txt
orange
gold
cookies
carrot
```

```shell
sort A.txt -o A.txt;sort B.txt -o B.txt

comm A.txt B.txt
apple
		carrot
		cookies
				gold
iron
				orange
silver
steel
```

选项：

- -1从输出中删除第一列
- -2从输出中删除第二列
- -3从输出中删除第三列

## 查找并删除重复文件

xxx

创建长路劲目录

```shell
mkdir dirpath
```

```shell
if [-e /home/slynux];then
#如果目录存在，返回真
fi
```

```shell
mdkir /home 2> /dev/null
mdkri /home/slynux 2> /dev/null
mdkri /home/slynux/test 2> /dev/null
mdkri /home/slynux/test/hello 2> /dev/null
mdkri /home/slynux/test/hello/child 2> /dev/null
```

如果遇到“Directory exists”这种错误，该命令会被忽略，错误信息通过2>被重定向到/dev/null

```shell
mkdir -p  /home/slynux/test/hello/child
```

这条命令可以替代前面5条命令，它会忽略所有有已存在的目录，同时创建缺失的部分。

# 文件权限、所有权

linux中文件类型：

- “-” 普通文件
- “d” 目录
- “c” 字符设备
- “b” 块设备
- “l” 符号链接
- “s” 套接字
- “p” 管道

u = 指定用户权限

g = 指定用户组权限

o = 指定其他实体权限

```shell
chmod o+x filename #给其他实体权限增加可执行权限
```

```shell
chmod a+x filename #给（用户、用户组、其他用户）增加可执行权限
```

```shell
chmod a-x filename #删除（用户、用户组、其他用户）增加可执行权限
```

r-- = 4

-w- = 2

--x = 1

rwx = 4 +２＋１＝７

rw = 4 +２＝６

```shell
chmod 764 filename
#为用户增加读写执行
#为用户组增加读写
#为其他用户增加写执行
```

## 更改所有权

```shell
chown user.group filename
#变更文件所有权为user，user是用户，group是组
```

### 以递归的方式设置权限

```shell
chmod 777 . -R
```

选项-R指定以递归的方式修改权限，“.”指定当前工作目录

### 以递归的方式设置所有权

用chown命令结合-R就可以以递归的方式设置所有权

```shell
chown user.group . -R
```

### 以不同的用户运行可执行文件

一些可执行文件需要以不同的用户身份（除启动该文件的当前用户之外的用户），用文件路径来执行（如./executable_name）。有一个叫做setuid的特殊文件权限，他允许其他用户以文件所有者的身份来执行文件

首先将该文件的所有权替换为该用户，这项操作每次都会执行，使改用户能以文件所有者的身份登入。

```shell
chmod +s executable_file
chmod root.root executable_file
chmod +s executable_file
./executable_file
```

setuid的使用不是无限制的。为了确保安全，它只能应用在Linux ELF格式二进制文件上，而不能用于脚本文件。


## 创建不可修改文件

```shell
chattr +i file #将一个文件设置为不可修改
```

使用rm file也不可使用删除文件

如果需要使文件重新可写，可以移除不可修改属性：

```shell
chattr -i file
```

批量生成空白文件

```shell
for name in {1..100}.txt
do
touch $name
done
```

touch -a 只更改文件访问时间

touch -m 只更改文件内容修改时间

除了将时间更改为当前时间，我们还能够为时间戳指定特定的时间和日期：

```shell
touch -d "Fri Jun 25 20:50:14 IST 1999" filename
```

-d使用的日期串不一定总是以同样的格式呈现，-d可以接受任何的目标标准日期格式。

## 查看文件类型信息

```shell
file filename
```


## 显示文件内容

```shell
cat filename
```

### 打印文件的前10行和后10行

```shell
head file #默认前10行
tail file #默认后10行

head -n 4 file #打印前4行

head -n -N file #打印除了最后N行之外的所有行
```

### 统计文件的行数、单词数、字符数

使用wc工具

```shell
#统计行数
wc -l file

#统计file文件的行数
cat file | wc -1

#统计单词书
wc -w file

#统计字符数
wc -c  file
cat file |wc -c

#它会打印出文件的函数、单词数、字符数，彼此之间用制表符分隔
wc file

#打印最长行的长度
wc file -L
```

## 打印目录树

tree命令（这个命令需要自行安装）

```shell
tree 目录
```
# 文本操作

## 正则表达式

| 正则表达式 | 描述                                       | 实例                                                         |
| ---------- | ------------------------------------------ | ------------------------------------------------------------ |
| ^          | 行起始标记                                 | ^tux匹配以tux起始的行                                        |
| $          | 行尾标记                                   | tux$匹配以tux结尾的行                                        |
| .          | 匹配任意一个字符                           | yua. 可以匹配yuan或者yua1                                    |
| []         | 匹配[字符]之中的任意的一个字符             | coo[kl]匹配cook或cool                                        |
| [^]        | 匹配[^]之外的任意一个字符                  | 9[^01]匹配92、93，但是不匹配91或90                           |
| [-]        | 匹配[]中指定范围内任意一个字符             | [1-5]匹配从1~5的任意一个数字                                 |
| ?          | 匹配之前的项一次或0次                      | colou?r匹配color或colour,但是不能匹配colouur                 |
| +          | 匹配之前的项1次或多次                      | Rollno-9+匹配ROLLno-99、Rollno-9，但是不能匹配Rollno-        |
| *          | 匹配之前的项0次或多次                      | co*l匹配cl、col、coool等                                     |
| ()         | 创建一个用于匹配的字串                     | ma(tri)?匹配max或maxtrix                                     |
| {n}        | 匹配之前的项n次                            | [0-9]{3}匹配任意一个三位数，[0-9]{3}                         |
| {n,}       | 之前的项至少需要匹配n次                    | [0-9]{2,}匹配任意一个两位或更多位的数字                      |
| {n,m}      | 指定之前的项所必需匹配的最小次数和最大次数 | [0-9]{2,5}匹配从两位数到五位数之间的任意一个数字             |
| \|         | 交替--------匹配\|两边的任意一项           | Oct (1st \| 2nd)匹配Oct lst或Oct 2nd                         |
| \          | 转义符可以将上面介绍的特殊字符进行转义     | a\ .b匹配a.b,但不能匹配ajb，通过在. 之间加上前缀\,从而忽略了.的特殊意义 |

## 匹配文本中所有单词

```shell
( ?[a-zA-Z]+ ?)
```

- "?"用于匹配单词前后可能出现的空格。[a-zA-Z]+代表一个或多个字母（a~z和A~Z）.

```shell
[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}
或者
[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}
```

[0-9]或者[:digit:]匹配数字0~9。{1，3}匹配1到3个数字，\.匹配"."。

## 用grep在文件中搜索文本

在文件中搜索一个单词

```shell
grep match_pattern filename
```

会输出包含单词的所在行

命令会返回包含给定match_pattern的文本行。

```shell
echo -e "this is a word\nnext line" | grep word
```

一个grep命令也可以对多个文件进行搜索：

```shell
grep "match_text" file1 file2 file3 ..
```

用--color选项可以在输出行中重点标记出匹配到的单词：

```shell
grep word filename --color=auto
```

grep也可以使用正则表达式，也可以使用默认允许正则表达式的grep命令-----egrep

```shell
grep -E "[a-z]+"
或者
egrep "[a-z]+"
```

为了只输出文件中匹配的文本部分，可以使用选项-o

```shell
echo this is a line.|grep -o -E "[a-z]+\." #output line
```

```shell
grep -v match_pattern file #打印除包含match_pattern的行之外的所有行
选项-v可以将匹配结果进行反转
```

统计文件或者文本中包含匹配字符的行数：

```shell
grep -c "text" filename #10
```

需要注意的是-c只是统计匹配行的数量，并不是匹配的次数。

```shell
echo -e "1 2 3  4\nhello\n5 6" | egrep -c "[0-9]"  #输出2
```

为了文件中统计匹配项的数量，可以使用下面的技巧：

```shell
echo -e "1 2 3  4\nhello\n5 6" | egrep -c "[0-9]" | wc -l #output:6
```

打印除包含匹配字符串的行数

```shell
grep "match_pattern" -n sample1.txt
```

递归搜索文件

```shell
grep "text" . -R -n
```

选项-i可以使匹配样式不考虑字符的大小写，

```shell
echo hello world | grep -i "HELLO" #output:hello
```

用grep匹配多个样式

在进行匹配的时候只指定一个样式。然而。我们可以用选项-e来指定多个匹配样式：

```shell
echo this is a line of text | grep -e "this" -e "line" -o #this line
```

在grep搜索中包括或排除文件

```shell
#递归搜索所有的.c和.cpp文件
grep "main()" . -r --include *.(c,cpp)
#排除所有的README文件：
grep "main()" . -r --include "README"
#如果需要从文件中读取所需排除的文件列表，使用--exclude-from FILE
grep "main()" . -r -exclude-from FILE
```

项目-q（grep的静默输出）

在静默模式下，grep命令不会像标准输出打印任何输出。它仅是运行命令。然后根据命令执行成功与否返回退出状态


## 测试文件是否包含的文件内容

```shell
#! /bin/bash

#判断参数个数
if [$# -ne 2];
then
echo "$0 match_text filename"
fi

match_text=$1 #第一个参数
filename=$2 #第二个参数

grep -q $match_text $filename

if [$? -eq 0];then
echo "The text exists in the file"
eles
echo "Text does not exist in the file"
fi
```

打印出匹配文本之前或之后的行

```shell
grep "xxx" -A 3 #打印查找的结果后的前3行
```

```shell
grep "xxx" -B 3 #打印查找的结果后的后3行
```

```shell
grep "xxx" -C 3 #打印查找的结果之前以及之后的3行，使用-c选项
```

## 用cut按列切分文件

```shell
cut -f 2,3 filenaem #第2列和第3列
```

制表符是字段或列的默认定界符，没有定界符的行也会被打印出来，要避免打印出这种不包含定界符的行，则可以使用cut的-s选项

```shell
cat student_data.txt
```

```shell
NO	Name　Mark	percent
1	11	  45       90
2	22    49       98
3	33    45       90
```

# sed

sed是stream editor的缩写。sed命令众所周知的一个用法是进行文本替换。

sed可以替换给定文本中的字符串。它可以利用正则表达式进行匹配。

sed是一种在线编辑器，它一次处理一行内容，处理时，把当前处理的行存储在临时缓冲区，，称为“模式空间”（pattern space），接着用sed命令处理缓冲区中的内容，处理完成后，把缓冲区的内容送往屏幕。接着处理下一行，这样不断重复，直到文件末尾。文件内容并没有改变，除非你使用量定向存储输出。Sed主要用来自动编辑一个或多个文件，简化对文件的反复操作；编写转换程序等。


## 定址

定址用于决定对哪些行进行编辑。地址的形式可以是数字、正则表达式、或二者的结合。如果没有指定地址，sed将处理输入文件的所有行。

地址是一个数字，则表示行号；是“$”符号，则表示最后一行。例如：

```shell
sed -n '3p' datafile #只打印第三行
```

值显示指定行范围的文件内容，例如

```shell
sed -n '100,200p' mysql_slow_query.log
```

地址是逗号分隔的，那么需要处理的地址是这两行之间的范围（包括这两行在内）。范围可以用数字、正则表达式、或二者的组合表示。例如：

```shell
sed '2,5d' datafile
#删除第二到第五行

sed '/My/,/You/d' datafile
#删除包含“My”的行到包含"You"的行之间的行

sed '/My/,10d' datafile
#删除包含“My”的行到第十行的内容
```


3.命令与选项

sed命令告诉sed如何处理有地址指定的各输入行，如果没有指定地址则处理所有的输入行。

选项：

-n：使用安静（silent）模式。在一般sed的用法中，所有来自STDIN的数据一般都会被列出到终端上，加上-n参数后，则只有被sed处理的那些行才会被输出。

-e：指定在指令列模式上执行的命令文本。默认不需要指定，只有同时要执行多个命令文本时才需要显示的指定-e选项。

-f：同时要执行多个命令文本时，可以将这些命令文本写到一个文件中，然后通过-f filename 的方式使用。

-r：sed默认使用基础正则表达式语法，指定-r选项后使用扩展正则表达式语法。

-i：直接修改读取的文档，而不是输出到终端。

命令：

a：新增行，a的后面接字串，这些字串会被添加到匹配行的下面。

c：替换行，c的后面接字串，这些字符串替换掉匹配到的行。

d：删除行，删除匹配到的行。

i：插入行，i的后面接字符串，这些字符串会被插入到匹配行的上面

p：打印，将某些行输出，通常p会与参数-n一起使用这样会输出匹配到的行。

s：字符串替换，主要搭配正则表达式


## 选项i

如果想要直接在原文件上进行修改（其实是先修改文件的内容，然后保存到原文件中，需要使用选项I：

```shell
sed -i '1d' test.txt
```

注意，应用-i选项后命令行上没有输出内容，但是源文件被更新了。

## 新增行

a命令可以在匹配的行下面新增行：

```shell
sed 'la Hello world' test.txt	#在第一行下面新增一行，内容为“Hello world”
sed '$a Hello world' test.txt	#在最后一行下面新增加一行，内容为"Hello world"
sed '1,3a Hello world' test.txt #在第一行，第二行和第三行下面分别增加一行

sed '1a Hello world!\nHello China!' test.txt #一次增加多行需要使用换行符
```

## 选项-e

-e选项用来指定命令文本，如果只有一个命令文本时-e选项可以省略。如果要指定多个命令文本就需要使用-e选项。

```shell
sed -e 'la xxx' -e '2a yyy' test.txt
```

## 插入行

i命令可以在匹配的行上面插入行，语法与新增行相同，只能新行在指定行的上面（与a命令的区别）：

## 选项-f

前面我们通过选项-e添加了多个命令文本，但是如果需要添加比较多的命令文本，使用选项-e就不合适了，应为把所有的命令文本全部写在命令行中会导致维护困难。我们可以把多个命令文本写入到文本文件中，然后通过-f选项进行引用。


## 替换行

使用c命令可以轻松的进行整行替换：

```shell
sed '1c Hello world' test.txt 	#把第一行替换为“Hello world”
sed '1,3c Hello world' test.txt #把第一行到第三行替换为“Hello world”
```

注意，上图中命令把三行文本替换成一行文本

## 字符串替换

与行替换不同，s命令只替换匹配到的内容（一般为字符串）：

```shell
sed 's/Hello/Hi' hello.txt   #把Hello 替换为Hi （只能匹配第一行）
```

```shell
sed 's/Hello/Hi/g' hello.txt #把匹配到的所有Hello都替换为Hi（匹配整个文件）
```

我们还可以限制执行替换操作的行：

```shell
sed '2,3s/Hello/Hi/g' hello.txt  #只在第二行和第三行替换操作
```

当然也可以通过替换来删除不需要的字符串：

```shell
sed 's/hello//g' hello.txt  #删除字符串hello
```

## 匹配

sed所有的操作都是建立在行定位之上的。也就是说无论你要干什么，都要先找到（匹配）目标行。连最简单的删除‘1d’，也得先定位到第一行，然后才能删除，所以唯一能限制我们发挥sed能力的因素就是：如何匹配到期望的行？

p命令sed只输出哪些匹配到的行，

```shell
sed -n '1p' test.txt
```

# awk

**结构**

awk "BEGIN {print "start"} pattern  {commands} END {print "end"}" file


**工作原理**

awk命令的工作方式如下所示：

（1）执行BEGIN{commands} 语句块中语句。

（2）从文件或stdin中读取一行，然后执行pattern{commands}。重复这个过程，直到文件全部被读取完毕。

（3）当读至读入流末尾是，执行END{commands}语句块。

BEGIN语句块在awk开始从输入流中读取行之前被执行，这是一个可选的语句块，诸如变量初始化、打印输出格式的表头等语句通常都可以写入BEGIN语句块。

END语句块和BEGIN语句块类似。END语句块在awk从输入流中读取完所有的行之后即被执行。像打印所有行的分析结果这类汇总信息，都是在END语句块中实现的常见任务。它也是一个可选的语句块。

最重要的部分就是pattern语句块中的通用命令。这个语句块同样是可选的。如果不提供该语句块，则默认执行{print}，即打印每一个读取到的行，都会执行这个语句块。

```shell
echo -e "line1\nline2" | awk 'BEGIN {print "Start"} {print} END{print "End"}'
```

输出如下：

Start

line1

line2

End


```shell
echo | awk '{var1="v1";var2="v2";var3="v3"; \
print var1,var2,var3;}'
```

v1 v2 v3

**特殊变量**

- NR：表示记录数量（number of records）,执行过程中国对应于当前行号。
- NF：表示字段数量（number of fields），在执行过程中对应于当前行的字段数。
- $0：这个变量包含执过程中当前行的文本内容。
- $1：这个变量包含第一个字段的文本内容。
- $2：这个变量包含第二个字段的文本内容。

```shell
echo "line1 f2 f3\nline2 f4 f5\nline3 f6 f7" | \
awk '{print "Line no:"NR",No of fields:"NF, "$0="$0,"$1="$1,"$2="$2,"$3="$3}'
```

打印每一行第2和第3个字段:

```shell
awk '{print $3,$2}' file
```

统计文件中行数

```shell
awk ‘END {print NR}’ file
```


# 对文件中的行、单词和字符进行迭代

## (1)迭代文件中的每一行

```shell
while read line;
do
echo $line
done < file.txt
```

## (2)迭代一行中的每一个单词

```shell
for word in $line;
do
echo $word
done
```

## (3)迭代一个单词中每一字符

```shell
for((i=0;i<${#word};i++))
do
echo $(word:i:1);
done
```

# 按列合并文件

## 可以用paste命令实现按列拼接

```shell
paste file1 file2 file3 ...
```

```shell
cat paste1.txt
1
2
3
4
5
```

```shell
cat paste2.txt
slynux
gnu
bash
back
```

```shell
paste paste1.txt paste2.txt
1slynux
2gnu
3bash
4hack
5
```

## 打印文件或行中的第n个单词或列

```shell
awk '{print $5}' filename
```

也可以打印多列数据

```shell
ls -l | awk '{print $1" : " $8}' #打印第1列和第8列进行
```

# 网站下载

wget是一个用于文件下载的命令行工具

```shell
wget URL
```

-o指定一个日志文件，从而不必将日志信息打印到stdout。

```shell
wget ftp://xxxxxxxx,img -o xxx.img -o log
```

运行改命令，屏幕上不会显示任何内容，日志或进度信息会被写入文件log，输出文件为xxx.img

-t指定重试次数

```shell
wget -t 5 URL
```

--limit-rate按照下面的方式对wget限速：

```shell
wget --limit-rate 20k URL
```

--quota 或 -Q指定下载量

```shell
wget -Q 100m URL
```

-c断点续传

```shell
wget -c URL
```

--mirror以递归的方式收集网页上所有的URL的链接

```shell
wget --mirror URL
```

--user和--password提供认证信息

```shell
wget --user username --password pass URL
```

# 网络

### 打印网络接口列表

```shell
ifconfig | cut -c-10 |tr -d ' ' | tr -s '\n'
```

ifconfig 输出到前10个字符是保留用于打印网络接口的名称，因此我们用cut命令提取每一行前10个字符。tr -d ' '删除每一行的所有空格。

```shell
ifconfig wlan0
```

- HWaddr 00:-1c:bf:87:25:d2是硬件地址（MAC地址）
- inet addr:192.168.0.82是IP地址
- Bcast:192.168.3.255是广播地址
- MASK:255.255.252.0是子网掩码

### FTP自动传输

```shell
#! /bin/bash

HOST='domain.com'
USER='foo'
PASSWD='password'
ftp -i -n $HOST <<EOF
user ${USER} ${PASSWD}
binary
cd /home/slynux
put testfile.jpg
get serverfile.jpg
quit
EOF
```

## SFTP

```shell
cd /home/slynux
put testfile.jpg
get serverfile.jpg
```

运行sftp：

```shell
sftp user@domainname
```

SCP

scp是一项比传统远复制工具rcp更安全的文件复制技术。文件都是通过SSH加密通道进行传输

```shell
scp filename user@remotehost:/home/path
```

## 网络流量与端口分析

要列出系统中的开发端口已经在端口上的服务的详细信息

```shell
lsof -i
```

用netstat查看开放端口与服务

```shell
netstat -tnp
```

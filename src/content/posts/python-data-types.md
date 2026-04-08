---
title: 'Python 数据类型'
published: 2019-12-05
description: '从数字、浮点数到进制转换，整理 Python 基础数据类型里最常用的一批知识点与示例。'
tags: ['python', '编程语言']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Python 数据类型

这篇文章聚焦 Python 中最基础的数据类型和常见转换操作，适合作为入门阶段的速查笔记。

## 数字 int

```python
a = 1
```

#### 输出二进制数0b

```python
print(ob110011)
```

#### 输出八进制数0o

```python
print(0o123)
```

#### 输出十六进制数0x

```python
print(0xF15)
```

#### 将二进制、八进制、十六进制转换为十进制

```python
int(二进制数,2)
int(八进制数,8)
int(十六进制数,16)
```

#### 将十进制转换为二进制、八进制、十六进制

```python
bin(十进制数)
oct(十进制数)
hex(十进制数)
```

## 长整型 long

在python3中没有长整型Long

## 浮点数 float

```python
a = 1.1
print('浮点数',a)
```

转换位float

```python
float(2)
```

#### 保留小数点

```python
print(round(1.1234,2)) #第二个参数指保留两位小数
```

#### 取整方式

```python
# 向下取整
print(int(12.23))

# 向上取整
import math
print(math.ceil(3.33))

# 四合五入
print(round(4.4))
print(round(4.6))

# 拆分整数和小数部分
print(math.modf(4.25))  #返回元组 （小数部分，整数部分）
```

**相关的一些方法**

```python
print(abs(-45)) # 绝对值

import operator

## 比较函数
print(operator.lt(1,2)) # less than小于，成立为True，反之False

print(operator.le(2,1)) # less than or equal to小于等于

print(operator.eq(2,1)) # equal相等

print(operator.ne(2,1)) # not equal不相等

print(operator.gt(2,1)) # greater than大于

print(operator.ge(2,1)) # great than or equal to大于等于
```

### 复数complex

```python
a = 1 + 2j
print('复数'，a)
```

# 字符串

```python
b = 'StringA' # 单引号字符串
c = 'StringB' # 双引号字符串
```

使用

```python
# 拼接字符串
print(b + c)

'''
分割字符串，首先需要确定起点与结尾，
字符串每个字符对应的index
-------------------------------
 s  t  r  i  n  g  A
 0  1  2  3  4  5  6 #正序index
-7 -6 -5 -4 -3 -2 -1 #逆序index
-------------------------------
分割规则，是左闭右开
a = 'stringA'
b[1:3] 分别对应index为1、2，输出tr
'''
print(b[1:3]) # 从index为1，开始输出到2。

# 输出所有的字符
print(b[:])
print(b[::])
print(b[0:])
print(b[0::])

print(b[::-1]) #逆序所有字符串
print(b[-1])
print(b[-2])
print(b[-3])
print(b[-7:-1])


# 返回子串在字符串中出现的字数
print(string1.count('n'))
print(string1.count('n',0,5)) # 也可以指定检查的范围
```

## 字符串替换

```python
# 字符串的编解码,将字符串编码成UTF-8
string1 = '一点半'
utf8 = string1.encode("UTF-8")
print('UTF-8编码格式:',utf8)
utf8_decode = utf8.decode('UTF-8','strict')
print("utf8编码:%s" % utf8_decode)

#将字符串种的tab符号转为空格
string2 = 'hello\tworld'
print(string2)
print(string2.expandtabs(4))
print(string2.expandtabs(16)) # 将tab符号（'\t'）转为空格后生成的新字符串

# 用于将序列中的元素以指定的字符连接生成一个新的字符串。
s1 = '-'
seq = ("y","d","b")
print(s1.join(seq))

# 用于创建字符映射的转换表，对于接受两个参数，第一个参数是字符串，表示需要转换的字符，第二参数也是字符串表示转换的目标。

intab = "aeiou"
outtab = "12345"
trantab = str.maketrans(intab, outtab)

str = "this is string example....wow!!!"
print (str.translate(trantab))

# 将字符串中的str1替换成str2
print("hello world".replace('llo',' is',1)) # 第三个参数，替换次数不能超过max次
```

## 字符串对齐方式

```python

# 需要输出的字符串总长度，不够的部分使用第二给参数，从中间往两边填充
print(string1.center(50,'#'))

# 返回一个原字符串左对齐，并使用空格填充指定长度的新字符串。如果指定的长度小于原字符串的长度则返回原字符串
print("ydb".ljust(50,"*")) # 输出字符串的总长度为50，源字符左对齐，不够部分使用*补齐

# 输出定长字符串，源字符串右对齐，不够的部分设置固定字符。
str1 = 'yuandongbin'
print(str1.rjust(50,'*'))

# 返回指定长度的字符串，原字符串右对齐，前面填充0
print("this is dog".zfill(50))
```

## 字符串查找

```python
# 返回字符串中最大的字母
print(max("ydb"))

# 返回字符串中最小的字母
print(min("ydb"))


# 返回字符串的str在字符串中的最后的出现的位置。
"""
参数：
str -- 需要查找的字符串
begin -- 开始查找的位置，默认为0
end -- 结束查找位置，默认为字符串的长度
"""
str1 = "this is dog"
str2 = "is"
print(str1.rindex(str2))
print(str1.rindex(str2,8))


# 返回字符串最后出现的位置
str1 = "this is dog"
str2 = "is"

print(str1.rfind(str2))
```

## 大小写转换

```python
string1 = 'yuandongbin'
# 字符串首字母大写
print(string1.capitalize())

# 将字符串中的所有大写字符转换为小写
print("123Ydb".lower())

# 将字符串中大写转为小写，小写转换为大写
print("Ydb".swapcase())

# 将每个单词的首个字母转化为大写，其余均为小写
print("this is Dog".title())

# 将字符串中的小写字母转为大写字母
print("ydb".upper())
```

## 去除指定字符

```python
# 截掉字符串左边的空格或指定重复字符。
print("1ydb".lstrip("1"))

# 删除string字符串末尾的重复指定字符（默认为空格）
print("ydb1".rstrip("1"))

# 同时去除头尾字符
print("1ydb1".strip("1"))
```

## 分割字符串

```python
# 通过指定分隔符对字符串进行切片，返回分割后的字符串列表
str = "this is string example....wow!!!"
print (str.split( ))       # 以空格为分隔符
print (str.split('i',1))   # 以 i 为分隔符
print (str.split('w'))     # 以 w 为分隔符

# 按照行('\r', '\r\n', \n')分隔，返回一个包含各行作为元素的列表，如果参数keepends为False，不包含换行符，如果为True,则保留换行符。

print('ab c\n\nde fg\rkl\r\n'.splitlines())
print('ab c\n\nde fg\rkl\r\n'.splitlines(True))
```

## 字符串检查

```python
# 判断字符串是否以指定后缀结尾
string1 = '有点不!!!'
suffix = '!!'
print(string1.endswith(suffix))
print(string1.endswith(suffix,0,5)) # 开始和结束的位置

# 检查字符是否是由字母和数字组成
str1 = 'ydb123'
print(str1.isalnum())

# 检查字符串中是否包含字符串str
"""
str -- 指定检索的字符串
begin -- 开始索引，默认为0
end -- 结束索引，默认为字符串的长度
"""
str1 = 'hello world'
str2 = 'llo'
print(str1.find(str2)) # 返回包含字符串返回开始的索引值，否则返回-1
print(str1.find(str2,4))


# 字符串是否包含检测字符串是否只由字母或文字组成。
print(str1.isalpha())
print("ydb".isalpha())

# 判断字符串是否只包含数字则返回True，否则False
print("123".isdigit())

# 判断字符串中是否由小写字母组成
print("abc".islower())

# 判断字符串中是否只包含数字字符则返回True，否则返回False
# 数字可以是： Unicode 数字，全角数字（双字节），罗马数字，汉字数字。
print("123".isnumeric())

# 判断字符串是否只包含空格
print("  ".isspace())

# 判断字符串中所有字母是否都为大写
print("YDB".isupper())

# 检查字符串是否以指定子字符串"xxxx"开头，是则为True，否则为False，如果beg和end指定值，则在指定范围内检查。
print("this is dog".startswith('this'))
print("this is dog".startswith('this',8))
print("this is dog".startswith('this',2,4))

# 检查字符串是否只包含十进制字符。
print("ydb".isdecimal())
print("213131".isdecimal())

```

## 字符串查找

```python

# 返回字符串中最大的字母
print(max("ydb"))

# 返回字符串中最小的字母
print(min("ydb"))


# 返回字符串的str在字符串中的最后的出现的位置。
"""
参数：
str -- 需要查找的字符串
begin -- 开始查找的位置，默认为0
end -- 结束查找位置，默认为字符串的长度
"""
str1 = "this is dog"
str2 = "is"
print(str1.rindex(str2))
print(str1.rindex(str2,8))


# 返回字符串最后出现的位置
str1 = "this is dog"
str2 = "is"

print(str1.rfind(str2))
```


# 列表

```python
# 列表
d = [1, 1.1, 'string']

# 长度
print(len(d))

# 读取列表元素的值
print(d[0])
print(d[1])
print(d[2])

# 列表截断
print(d[0:2])

# 更新列表
d.append('yuandongbin')
print('更新后:',d)

# 删除列表元素
del(d[3])
print('删除d[3]元素后:',d)


# 拼接两个列表
a = [1,2,4]
b = [5,6,7]
print("拼接后：",a + b)

# 重复列表
a = ['Hi']*4
print("列表重复4倍",a)

# 判断元素是否存在列表中(el in list)
a = [1,2,3,4,5,6]
print("元素是否在列表中",1 in a)

# 迭代
print("开始迭代")
for i in [1,2,34,5]:
    print(i)
print("迭代结束")

# 比较两个列表
a = [1,2,3,4]
b = [5,6,7,8]

import operator
# 比较使用operator


# 列表最大值和最小值
a = [1,2,3,4]
print(max(a))
print(min(b))

# b = [1,'2','abc',4]
# print(max(b)) 这里列表元素中必须是同一种数据类型，不然比较会报错

# 将元组转换为列表
a = (1,2,3,4)
print(list(a))

# 往一个列表尾部添加新的列表
a = [1,2,3,4]
b = [5,6,7,8]
a.extend(b)
print(a)

# 统计一个list中元素的个数
a = [1,1,2,2,2,3,3,1,5,5,5]
print(a.count(1))

# 获取list中元素的第一个位置
print(a.index(2))

# 将对象插入列表
a.insert(3,'yuan')
print(a)

# 通过index移除列表中的一个元素（默认最后一个元素），并且返回该元素的值
a.pop(3)
print(a)

# 移除列表中第一匹配值
a.remove(1)
print(a)

# 反向列表中的元素
a.reverse()
print(a)

# list排序
a = [5,3,1,4,2]

a.sort() # 默认升序
print(a)

a.sort(reverse=True) # 降序
print(a)

stu=[("winnie","A",12),("lucy","C",16),("john","B",14)]
# 这里的key是通过每个元组元素的第三个元素进行排序
stu.sort(key=lambda x:x[2])
print(stu)
```

# 元组

```python
# 新建元组
a = (1,2,3,5,6)
b = ('yuan','dong','bin')

# 访问元组
print(a[1])
print(b[1])

# 修改元组(元组不能修改，但是可以拼接)
# a[0] = 100 这个修改是非法的

c = a + b
print(c)

# 删除元组
# del(a[0]) 不支持
c = (1,2,3,4)
del c

# 添加元素,元组类型是不可变类型，是不支持增加元素或者修改元素

# 计算元组长度
print(len(a))

# 计算元素出现次数
print(a.count(1))

# 获取元素第一个index
print(a.index(1))

# 判断对象是否在元组内
print(1 in a)

# 复制元组
e = ('yuan',) *3
print(e)

# 遍历元组
for i in a:
    print(i)
```

# 集合

集合是一种无序的并且里面存放不同元素的序列

特点：不重复、无序

```python
f = {1, 2, 3, 4, 5, 6}
```

#### 基本使用集合去除列表重复的元素

```python
f = [1, 2, 3, 1, 2]
print(set(f))

f = {1,2,3,2,1,1,2,2,3,4} # 集合默认会将重复元素去除
print(f)
```

> 使用print输出的集合是无序的

```python
f = {1, 2, 3, 4, 5, 6}
# 计算集合元素个数
print(len(f))

# 清空集合
f.clear()

# 给集合添加元素
f.add(1) # 可以添加不重复的元素
print(f)  # 不会有相同的元素

# 给集合添加元素或者集合
f.update({1,2,3,4})


# output: {1, 2, 3, 4, 5, 6}

# pop随机删除一个元素
f.pop()

# remove删除指定元素,如果删除的元素不存在就会报错
f.remove(2)

# discard 和remove用法一样，但是元素不存在，不会报错

# 判断元素是否在集合中存在
print(2 in f)

# 拷贝一个集合
print(f.copy())
```

#### 关系

```python
set1 = set([1,2,3,4,5])
set2 = set([3,4,5,6,7])

# 交集
print(set1.intersection(set2)) # 方法一
print(set1 & set2) # 方法二

# 并集
print(set1.union(Set2)) # 方法一
print(set1 | set2) # 方法二

# 差集
print(set1.difference(set2)) # 方法一
print(set1 - set2)

print(set2.difference(set1))
print(set2 - set2)

# 子集判断
print(set1.issubset(set2)) # 判断set1是否是set2的子集

# 父集判断
print(set1.issuperset(set2))
```

# 字典

字典是另一种可变容器模型，且可存储任意类型对象。

```python
d = {key1 : value1, key2 : value2}
```

键必须是唯一，但是值则不需要。

```python
# 访问字典的值
dict = {'Name': 'ydb','Age': '27'}
print(dict['Name'])
print(dict['Age'])
# 使用get方法进行获取key的值
print(dict.get('Name')) # 返回字典key 'Name'对应的值，如果值不在字典中返回默认值。


# 修改字典, 一个值如果
dict['Age'] = 28 # 更新Age
dict['School'] = "菜鸟教程" # 添加学校

# 删除字典元素
del dict['Name'] # 删除键

# 清空字典
dict.clear()

# 删除字典
del dict

site= {'name': 'yuandongbin site','url': 'www.yuandongbin.xyz'}
pop_obj = site.pop('name','xx') # 返回删除的字典的value，如果key不存在，就返回默认值
print(pop_obj) s

# 字典中的键不可变，所以可以用数字，字符串或元组充当，而使用列表不行。

dict1 = dict.copy() # 深拷贝，修改dict的值不会影响拷贝之后的值

# 判断key是否在字典中
print('Name' in dict)

dict.items()

# 获取字典中所有的key
print(dict.keys()) # 返回dict_keys的对象

# 获取字典中所有的values
print(dict.values()) # 返回dict_values对象

# 增加字典元素，如果key不存在于字典，添加key和value到字典
dict.setdefault(key, default=None)

dict2 = {'school':'清华大学'}

# 一个字典增加另一个字典中
dict.update(dict2)

# popitem()方法随机返回并返回删除字典中的最后一对键和值

site= {'name': 'yuandongbin site','url': 'www.yuandongbin.xyz'}
pop_obj = site.popitem() # 返回删除的字典的value，如果key不存在，就返回默认值
print(pop_obj)
```

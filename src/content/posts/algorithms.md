---
title: '算法'
published: 2020-01-01
description: '算法基础知识： 质数：又被称为素数，一个大于1的自然数，除了1和它自身外，不能被其他自然数整除的数 任何一个数，其因子只需要找小于其开根号的整数即可 进制转换 将10进制转换为2进制 C++ 刷题中常用的STL操作汇总 …'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# 算法

算法基础知识：

质数：又被称为素数，一个大于1的自然数，除了1和它自身外，不能被其他自然数整除的数

任何一个数，其因子只需要找小于其开根号的整数即可


进制转换

将10进制转换为2进制


C++ 刷题中常用的STL操作汇总

## string

查找子串 find

```cpp
string str1, str2;
str1.find(str2, 0); // 第二个参数为起始位置
str1.find(str2, 5);
```

截取

```cpp
string str1;
str1.substr(0,1);  // 从index = 0 截取一个字符， 包含0
str1.substr(2,5);
```

删除子串

```cpp
string str = "012345";
str = str.erase(1,2); // 从位置1开始，删除2个字符
```

弹出最后一个字符

```cpp
string s = "12345"
s.pop_back();
```

在末尾添加字符/字符串

```cpp
string s = "a", s2="xyz";
s1.append("bcd");
s1.append(5, 'e');
s1.append(s2);
```

替换字符串

```cpp
string s = "abcde";
s.replace(0,2,"fg");
```

Vector

```cpp
vector<int> a; // size 为0

a.resize(8); // 将a的size变为8

a.erase(a.begin()+2, a.end());  // 删除a[2]及后面所有的元素
a.erase(a.begin()+2)  // 删除a[2]
a.erase(a.begin()+2, a.begin()+5)  // 删除a[2]——a[4]

// 指定大小和初始值
vector<vector<int>> b(5,vector<int> (5,1)); //得到5x5初始值为1的向量矩阵

// 1. 初始化时拷贝
vector<int> data(raw);  // raw为被拷贝数据，类型同样为 vector<int>

// 2. assgin
data.assign(raw.begin(), raw.end());

// 1. 插入单个元素
vector<int> a;
a.insert(a.end(), 100);	// [100]
// 2. 插入多个相同元素
a.insert(a.end(), 3, 100);	// [100, 100, 100]
// 3. 插入某个连续空间范围
vector<int> a;
int arr[] = {1, 2, 3};
a.insert(a.end(), arr, arr+3);	// [1, 2, 3]
```

队列

```cpp
queue<int> q;
q.push(4); // 入队列
q.push(6);
cout<<q.front()<<endl; // 队列首部元素
cout<<q.back()<<endl;	// 队列尾部元素
q.pop();		// 出队列
```

### 双端队列 deque

```cpp
#include <deque>	// 头文件
// 基本操作
deque<int> q;
q.push_back(4); // 插入队尾
q.push_front(6);	// 插入队首
cout<<q.front()<<endl; // 队列首部元素
cout<<q.back()<<endl;	// 队列尾部元素
q.pop_back();		// 删除队尾元素
q.pop_front();	// 删除队首元素
```

### 优先队列 priority_queue

```cpp
//升序队列
priority_queue <int,vector<int>,greater<int> > q;
//降序队列
priority_queue <int,vector<int>,less<int> >q;
```

栈

```cpp
stack<int> s;
s.push(1);  // 入栈
s.push(2);
s.top();  // 获取栈顶元素
s.pop();  // 出栈
```

### unordered_set 无序集合

```cpp
unordered_set<string> a{"01", "02", "03"};
string str[]={"01", "02", "03"};
unordered_set<string> b(str, str+3);

a.count("01"); // 元素是否存在unordered_set中，count()函数本来是用来查找出现次数的

unordered_set<string> a,b;
a.find("01")!=a.end();  // 返回0 / 1

unordered_set<string> a;
a.insert("05");

unordered_set<int> st={1,2,3};
st.erase(1);
```

### unordered_map 无序哈希

```cpp
unordered_map<int, string> m = {{1, "Huang"},{2, "Zi"}};
m[3]="X";
m.insert(make_pair(4,"Y"));

m.find(3)!=m.end();     // 1 or 0 元素是否在map中

for(it=m.begin(); it!=m.end(); it++){
	cout<<"key: "<<it->first <<" value: "<<*it->second<<endl;
    delete it->second;
    m.erase(it++);
}
```

### accumulate 求和

```cpp
// 求和
vector<int> num;
accumulate(num.begin(), num.end(), 0)
// string
vector<string> s;
accumulate(s.begin(), s.end(), string(" "))
```

### bitset二进制

```cpp
bitset<4> a;	// 0000
bitset<4> b(10);	// 1010
bitset<4> c(string("1011"));	// 1011

b.count() // 返回1的个数
```

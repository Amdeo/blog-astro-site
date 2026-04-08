---
title: 'C++ STL'
published: 2019-06-09
description: 'STL 组成 容器（containers） 算法（algorithms) 迭代器（iterators） 仿函数（function） 配接器（adapter） 空间配置器（allocator） STL容器种类和功能 序列容…'
tags: ['C/C++', 'STL']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++ STL

STL 组成 容器（containers） 算法（algorithms) 迭代器（iterators） 仿函数（function） 配接器（adapter） 空间配置器（allocator） STL容器种类和功能 序列容…


## 组成

- 容器（containers）
- 算法（algorithms)
- 迭代器（iterators）
- 仿函数（function）
- 配接器（adapter）
- 空间配置器（allocator）

### STL容器种类和功能

- 序列容器	(vector、list、deque)
- 排序容器    (set、multiset、map、multimap)
- 哈希容器    (unordered_set、unordered_multiset、unordered_map、unordered_multimap)

| 容器                               | 对应的迭代器类型 |
| ---------------------------------- | ---------------- |
| array                              | 随机访问迭代器   |
| vector                             | 随机访问迭代器   |
| deque                              | 随机访问迭代器   |
| list                               | 双向迭代器       |
| set / multiset                     | 双向迭代器       |
| map / multimap                     | 双向迭代器       |
| forward_list                       | 前向迭代器       |
| unordered_map / unordered_multimap | 前向迭代器       |
| unordered_set / unordered_multiset | 前向迭代器       |
| stack                              | 不支持迭代器     |
| queue                              | 不支持迭代器     |

### 迭代器

| 迭代器定义方式 | 具体格式                                   |
| -------------- | ------------------------------------------ |
| 正向迭代器     | 容器类名::iterator 迭代器名;               |
| 常量正向迭代器 | 容器类名::const_iterator 迭代器名;         |
| 反向迭代器     | 容器类名::reverse_iterator 迭代器名;       |
| 常量反向迭代器 | 容器类名::const_reverse_iterator 迭代器名; |

## 序列式容器

 ![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/2-1P911110REB.jpg)

### string

初始化

```cpp
#include <string>
#include <iostream>

using namespace std;

// 使用assign初始化

int main()
{
  {
    string s;
    cout << s.empty() << endl; // true
    cout << s.length() << endl;	// 0
    cout << s.size() << endl; // 0
  }

  {
    string s(4, '=');
    cout << s << endl; // ====
  }

  {
    string const other("hello");
    string s(other, 0, other.length() - 1);
    cout << s << endl; // hell
	}

  {
    string s("stirng 1234");
    cout << s << endl; // stirn
  }

  {
    char a[] = "another C-style string";
    string s(begin(a)+8, end(a) - 1);
    cout << s << endl;
  }

  {
    string s(3, toupper('a'));
    cout << s << endl;
  }

  {
    string s("hello");
    cout << s.at(1) << endl; // e
    cout << s.front() << endl; // h
    cout << s.back() << endl; // o

  }

  {
    string s("abc");
    s.insert(0, 1, 'a'); // aabc
    s.insert(0, 2, 'a'); // aaabc
  }

  {
    string s("abc");
    s.insert(2, 'a'); // aabc
  }

  {
    string s("abc");
    s.insert(2, "a"); // abac
    cout << s << endl;
  }

  {
    string s("12345");
    s.erase(0,2);
    cout << s << endl; // 345

    s.erase(find(s.begin(), s.end(), '4'));
    cout << s << endl; // 35

    s.push_back('6');
    s.append("7");
    cout << s << endl; // 356

    s.pop_back();
    cout << s << endl; // 356

    string s1 = "890abc";
    s.append(s1, 3, 3);
    cout << s << endl; // 356abc
  }

  {
    string s = "12345";
    s.replace(1, 2, "666");
    cout << s << endl; // 166645
    s.replace(s.begin(), s.begin()+ 3, 1, '2');
    cout << s << endl;
  }

  {
    string s = "0123456789abcdef";
    cout << s.substr(10) << endl; // abcdef
    cout << s.substr(0, 2) << endl; //
  }

  return 0;
}
```


### array

> 数组容器其长度就是固定不变，这意味着能增加或删除元素，只能改变某个元素的值。

#### 创建

```cpp
#include <iostream>
#include <array>

using namespace std;

int main()
{
    //定义个int型数组，大小为5
    array<int, 5> arr = {1, 2, 3, 4, 5};

    array<int, 5> arr1{5, 4, 3, 2, 1};

    return 0;
}
```

#### 元素访问

```cpp
#include <iostream>
#include <array>

using namespace std;

int main()
{
    array<int, 5> arr{1, 2, 3, 4, 5};

    //和数组一样，通过operator[]访问
    cout << arr[2] << endl;

    //指定index，获取元素
    cout << arr.at(2) << endl;

    //获取第一个元素
    cout << arr.front() << endl;

    //获取最后一个元素
    cout << arr.back() << endl;

    //获取指向内存中数组的第一个元素的指针
    cout << arr.data() << endl;

    //get非array的成员方法
    cout << get<2>(arr) << endl;
    return 0;
}
```

#### 获取容量

```cpp
#include <iostream>
#include <array>

using namespace std;

int main()
{
    array<int, 10> arr{1, 2, 3, 4, 5};

    //判断数组是否为空，true为空，false为非空
    cout << boolalpha << arr.empty() << endl;

    //获取数组元素的个数
    cout << arr.size() << endl;

    //获取数组可容纳的最大个数，因为每个 std::array<T, N> 都是固定大小容器，故 max_size 返回的值等于 N
    cout << arr.max_size() << endl;
    return 0;
}
```

#### 操作

```cpp
#include <iostream>
#include <array>

using namespace std;

int main()
{
    //定义个int型数组，大小为5
    array<int, 5> arr = {1, 2, 3, 4, 5};

    array<int, 5> arr1 = {2, 2, 2, 2, 2};

    //将val这个值赋值给容器中的每个元素
    arr.fill(1);

    for (auto i : arr)
    {
        cout << i << endl;
    }

    //交换两个数组的值
    arr.swap(arr1);

    for (auto i : arr)
    {
        cout << i << endl;
    }

    return 0;
}
```

#### 其他操作

```cpp
#include <iostream>
#include <array>
#include <algorithm>

using namespace std;

int main()
{
    //定义个int型数组，大小为5
    array<int, 7> arr = {6, 7, 1, 2, 3, 4, 5};

    //排序
    sort(arr.begin(), arr.end());

    //找到返回迭代器的位置，找不到就返回last
    auto iter = find(arr.begin(), arr.end(), 3);
    cout << *iter << endl;
    return 0;
}
```

### vector

实现原理：元素不够时在重新分配内存，拷贝原来的数组的元素到新分配的数组中。

#### vector创建

```cpp
#include <iostream>
#include <vector>

using namespace std;

#define PRINT(x)                              \
    {                                         \
        for (size_t i = 0; i < x.size(); i++) \
        {                                     \
            cout << x[i] << " ";              \
        }                                     \
        cout << endl;                         \
    }

int main(int argc, const char *argv[])
{
    //空vector
    vector<int> a;

    //vector具有10个整型元素的向量
    vector<int> b(10);

    //vector具有10个整型元素，每个元素为1
    vector<int> c(10, 1);

    //赋值构造函数
    vector<int> d(b);

    //创建新vector，将c向量的第一个元素到第三个元素的值赋值给e向量
    vector<int> e(c.begin(), c.begin() + 3);
    PRINT(e);

    int f[7] = {1, 2, 3, 4, 5, 6, 7};
    //创建新vector，将数组f的第一个元素到第三个元素的值赋值给g向量
    vector<int> g(f, f + 3);
    PRINT(g);
}
```

#### 元素访问

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main()
{
    vector<int> a = {1, 2, 3, 4, 5};
    cout << a[1] << endl;
    cout << a.at(1) << endl;
    cout << a.front() << endl;
    cout << a.back() << endl;
    cout << a.data() << endl;

    return 0;
}
```

#### 容量

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main()
{
    vector<int> a = {1, 2, 3, 4, 5};

    cout << boolalpha << a.empty() << endl;
    cout << a.size() << endl;
    cout << a.max_size() << endl;

    vector<int> b;

    //预留容器空间
    a.reserve(20);

    //改变容器的大小
    a.resize(20);

    cout << a.capacity() << endl;

    //移除未使用的容量
    a.shrink_to_fit();

    return 0;
}
```

#### 操作

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main()
{
    vector<int> a = {1, 2, 3, 4, 5};
    a.insert(a.begin(), 10);

    vector<int> vec = {6, 7, 8};

    cout << vec.size() << endl;

    a.insert(a.end(), vec.begin(), vec.end());

    //在指定位置直接生成元素
    a.emplace(a.begin());

    //在序列尾部生成一个元素
    a.emplace_back();

    //将元素添加到容器末尾
    a.push_back(11);

    //移除末元素
    a.pop_back();

    //改变容器的可存储元素的个数
    a.resize(100);

    //交换内容
    vec.swap(a);

    //倒置容器
    reverse(a.begin(), a.end());

    a.clear();

    return 0;
}
```

利用swap清空vector

```cpp
vector<T>().swap(myvector);	//清空myvector
```

### deque


设计原理：

 ![deque容器的底层实现](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/2-19121316430U40.gif)


#### 创建

```cpp
#include <iostream>
#include <deque>

using namespace std;

int main()
{
	//创建空的deque
    deque<int> d;

    //创建一个具有n个元素的deque容器
    deque<int> d1(10);

    //创建一个具有n个元素的deque容器，并为每个元素都指定初始值
    deque<int> d2(10, 5);

    //拷贝构造函数
    deque<int> d3(d);
}
```

#### 元素访问

```cpp
#include <iostream>
#include <deque>

using namespace std;

int main()
{
    deque<int> a = {7, 5, 16, 8};

    //通过index访问指定的元素，会进行越界检查
    cout << a.at(1) << endl;

    //访问指定的元素
    cout << a[1] << endl;

    //访问第一元素
    cout << a.front() << endl;

    //访问最后一个元素
    cout << a.back() << endl;

    return 0;
}
```

#### 容量

```cpp
#include <iostream>
#include <deque>

using namespace std;

int main()
{
    deque<int> a = {3, 4, 5, 6, 7};

    //检查容器是否为空
    cout << boolalpha << a.empty() << endl;

    //返回容纳的元素数
    cout << a.size() << endl;

    //返回可容纳的最大元素数
    cout << a.max_size() << endl;

    //通过释放未使用的内存，减少内存的使用
    a.shrink_to_fit();
    return 0;
}
```

#### 操作

```
#include <iostream>
#include <deque>

using namespace std;

int main()
{
    deque<int> a = {1, 2, 3, 4, 5};

    //插入元素
    a.insert(a.begin(), 10);
    deque<int> b = {5, 4, 3, 2, 1};
    a.insert(a.begin(), b.begin(), b.end());

    //将元素添加到容器末尾
    a.push_back(10);

    //插入元素到容器起始
    a.push_front(10);

    //移除末元素
    a.pop_back();

    //移除首元素
    a.pop_front();

    //在指定位置，生成一个元素
    a.emplace(a.begin());

    //在容器尾部生成一个元素
    a.emplace_back();

    //在容器首部生成一个元素
    a.emplace_front();

    //移除指定位置的元素
    a.erase(a.begin());

    //移除指定范围的元素
    a.erase(a.begin(), a.begin() + 1);

    //改变容器中可存储元素的个数
    a.resize(100);

    a.swap(b);

    return 0;
}
```

### list

> 双链表

#### 创建

```cpp
#include <iostream>
#include <list>
#include <array>

using namespace std;

int main()
{
    //创建一个任何元素空list容器
    list<int> value;

    //创建一个包含n个元素的list容器
    list<int> value1(10);

    //创建一个包含10个元素并且都为5个容器
    list<int> value2(10, 5);
}
```

#### 元素访问

```cpp
#include <iostream>
#include <list>

using namespace std;

int main()
{
    list<int> l = {7, 5, 16, 8};

    cout << l.front() << endl;

    cout << l.back() << endl;

    return 0;
}
```

#### 容量

```cpp
#include <iostream>
#include <list>

using namespace std;

int main()
{
    list<int> a = {1, 2, 3, 4, 5};

    cout << boolalpha << a.empty() << endl;

    cout << a.size() << endl;

    cout << a.max_size() << endl;

    return 0;
}
```

#### 操作

```cpp
#include <iostream>
#include <list>

using namespace std;

int main()
{
    list<int> value1 = {1, 2, 3, 4, 5};

	 //返回第一个元素的引用
    value1.front();

    //返回最后一个元素的引用
    value1.back();

    //在新元素替换容器中原有内容
    value1.assign(10, 5);

    //在容器头部生成一个元素
    value1.emplace(value1.begin(), 10);

    //在容器头部生成一个元素
    value1.emplace_front();

    //在容器尾部生成一个元素
    value1.emplace_back();

    //在容器头部插入一个元素
    value1.push_front(10);

    //在容器尾部插入一个元素
    value1.push_back(10);

    //删除容器头部一个元素
    value1.pop_front();

    //删除容器尾部一个元素
    value1.pop_back();

    //在容器中的指定位置插入元素
    value1.insert(value1.begin(), 10);

    //删除指定迭代器位置的元素
    value1.erase(value1.begin());


    list<int> value1 = {1, 2, 3, 4, 5};

    std::list<int> list1 = { 5,9,0,1,3 };
    std::list<int> list2 = { 8,7,2,6,4 };

    list1.sort();	//排序
    list2.sort();

    //合并二个已排序
    list1.merge(list2);

    std::list<int> list3 = { 1, 2, 3, 4, 5 };
    std::list<int> list4 = { 10, 20, 30, 40, 50 };

    //从一个 list 转移元素给另一个。
    list1.splice(it, list2);

    list2.splice(list2.begin(), list1, list1.begin();
, list1.end());

    list<int> list5 = { 1,100,2,3,10,1,11,-1,12 };

    list5.remove(1); // 移除两个等于 1 的元素
    list5.remove_if([](int n){ return n > 10; }); // 移除全部大于 10 的元素

    //倒置
    list5.reverse();

    list<int> x = {1, 2, 2, 3, 3, 2, 1, 1, 2};

    //去重
    x.unique();

    //清除内容
    value1.clear();

    return 0;
}
```

#### insert()

| 语法格式                        | 用法说明                                                     |
| ------------------------------- | ------------------------------------------------------------ |
| iterator insert(pos,elem)       | 在迭代器 pos 指定的位置之前插入一个新元素 elem，并返回表示新插入元素位置的迭代器。 |
| iterator insert(pos,n,elem)     | 在迭代器 pos 指定的位置之前插入 n 个元素 elem，并返回表示第一个新插入元素位置的迭代器。 |
| iterator insert(pos,first,last) | 在迭代器 pos 指定的位置之前，插入其他容器（例如 array、vector、deque 等）中位于 [first,last) 区域的所有元素，并返回表示第一个新插入元素位置的迭代器。 |
| iterator insert(pos,initlist)   | 在迭代器 pos 指定的位置之前，插入初始化列表（用大括号 { } 括起来的多个元素，中间有逗号隔开）中所有的元素，并返回表示第一个新插入元素位置的迭代器。 |


#### splice()

| 语法格式                                                     | 功能                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| void splice (iterator position, list& x);                    | position 为迭代器，用于指明插入位置；x 为另一个 list 容器。 此格式的 splice() 方法的功能是，将 x 容器中存储的所有元素全部移动当前 list 容器中 position 指明的位置处。 |
| void splice (iterator position, list& x, iterator i);        | position 为迭代器，用于指明插入位置；x 为另一个 list 容器；i 也是一个迭代器，用于指向 x 容器中某个元素。 此格式的 splice() 方法的功能是将 x 容器中 i 指向的元素移动到当前容器中 position 指明的位置处。 |
| void splice (iterator position, list& x, iterator first, iterator last); | position 为迭代器，用于指明插入位置；x 为另一个 list 容器；first 和 last 都是迭代器，[fist,last) 用于指定 x 容器中的某个区域。 此格式的 splice() 方法的功能是将 x 容器 [first, last) 范围内所有的元素移动到当前容器 position 指明的位置处。 |

### forward_list

forward_list是单链表

链表中数据的存储位置是分散的、随机的，整个链表中数据的线性关系通过指针来维持。

> 效率高是选用forward_list而弃用list容器最主要的原因，如果list和forward_list容器都能实现的操作，应优先选择forward_list容器

#### 创建

```cpp
std::forward_list<int> values;
std::forward_list<int> values(10);
std::forward_list<int> values(10, 5);

std::forward_list<int> values = {1,2,3,4,5};

int a[] = { 1,2,3,4,5 };
std::forward_list<int> values(a, a+5);

std::array<int, 5>arr{ 11,12,13,14,15 };
std::forward_list<int>values(arr.begin()+2, arr.end());//拷贝arr容器中的{13,14,15}
```

其他大多数方法和list一样

#### 元素访问

```cpp
#include <iostream>
#include <forward_list>

using namespace std;

int main()
{
    forward_list<int> value = {1, 2, 3, 4, 5};
    cout << value.front() << endl;
    return 0;
}
```

#### 容量

```cpp
#include <iostream>
#include <forward_list>

using namespace std;

int main()
{
    forward_list<int> value = {1, 2, 3, 4, 5};
    cout << boolalpha << value.empty() << endl;

    cout << value.max_size() << endl;

    return 0;
}
```

#### 操作

```cpp
#include <iostream>
#include <forward_list>

using namespace std;

int main()
{
    forward_list<int> value = {1, 2, 3, 4, 5};
    value.insert_after(value.begin(), 10);
    value.insert_after(value.begin(), {10, 9});

    //在容器中的指定位置后插入新元素
    value.emplace_after(value.begin());

    //插入新元素到容器起始
    value.emplace_front();

    forward_list<int> l = {1, 2, 3, 4, 5, 6, 7, 8, 9};

    //删除元素后的元素
    l.erase_after(l.before_begin());

    //在容器的起始位置
    l.push_front(10);

    //移除首元素
    l.pop_front();

    //改变容器中可存储元素的个数
    l.resize(100);

    //交换两个容器的
    value.swap(l);

    std::forward_list<int> list1 = { 5,9,0,1,3 };
    std::forward_list<int> list2 = { 8,7,2,6,4 };

    list1.sort();
    list2.sort();

    list1.merge(list2);

    std::forward_list<int> l1 = {1, 2, 3, 4, 5};
    std::forward_list<int> l2 = {10, 11, 12};

    l2.splice_after(l2.cbegin(), l1, l1.cbegin(), l1.cend());

    l.remove(1); // 移除两个等于 1 的元素
    l.remove_if([](int n){ return n > 10; }); // 移除全部大于 10 的元素


    list1.reverse();

    list1.unique();

    list1.clear();

    return 0;
}
```

## 关联式容器

### map

> 使用容器存储的数据，其各个元素的键必须是唯一的，改容器会根据元素键的大小，默认进行升序排序

 底层实现都是红黑树（RB-Tree）

#### 创建

```cpp
#include <iostream>
#include <map>

using namespace std;

int main()
{
    //创建一个空的map容器
    map<std::string, int> myMap;

    //创建map容器，也可以进行初始化
    std::map<std::string, int> myMap{{"小明", 10}, {"小李", 20}};

    //通过pair创建map
    std::map<std::string, int> myMap{std::make_pair("小明", 10), std::make_pair("小李", 20)};

    //拷贝构造
    std::map<std::string, int>newMap(myMap);

    return 0;
}
```

#### 元素访问

```cpp
#include <iostream>
#include <map>
#include <string>

using namespace std;

int main()
{
    //创建map容器，也可以进行初始化
    std::map<int, string> myMap{{1, "小明"}, {2, "小李"}};

    //myMap[key] 获取value
    cout << myMap[1] << endl;

    cout << myMap.at(1) << endl;

    return 0;
}
```

#### 容量

```cpp
#include <iostream>
#include <map>

using namespace std;

int main()
{
    std::map<int, string> myMap{{1, "小明"}, {2, "小李"}};

    cout << boolalpha << myMap.empty() << endl;

    cout << myMap.size() << endl;

    cout << myMap.max_size() << endl;

    return 0;
}
```

#### 操作

```cpp
#include <iostream>
#include <map>
#include <string>

using namespace std;

int main()
{
    std::map<int, string> myMap{{1, "小明"}, {2, "小李"}};

    myMap.insert({3, "小袁"});

    std::map<std::string, std::string> m;

    // 使用 pair 的移动构造函数
    m.emplace(std::make_pair(std::string("a"), std::string("a")));

    // 使用 pair 的转换移动构造函数
    m.emplace(std::make_pair("b", "abcd"));

    // 使用 pair 的模板构造函数
    m.emplace("d", "ddd");

    // 使用 pair 的逐片构造函数
    m.emplace(std::piecewise_construct,
              std::forward_as_tuple("c"),
              std::forward_as_tuple(10, 'c'));

    std::map<int, std::string> c = {{1, "one"}, {2, "two"}, {3, "three"}, {4, "four"}, {5, "five"}, {6, "six"}};

    //返回匹配特定键的元素数量数
    cout << c.count(1) << endl;

    c.erase(c.begin());

    //查找
    map<int, char> example = {{1, 'a'}, {2, 'b'}};

    auto search = example.find(2);
    if (search != example.end())
    {
        cout << "Found " << search->first << " " << search->second << '\n';
    }

    const std::map<int, const char *> example1{
        {0, "zero"},
        {1, "one"},
        {2, "two"},
    };

    //返回匹配特定键的元素范围
    auto p = example1.equal_range(2);
    for (auto &q = p.first; q != p.second; ++q)
    {
        std::cout << "m[" << q->first << "] = " << q->second << '\n';
    }

    //返回指向首个不小于给定键的元素的迭代器
    cout << example1.lower_bound(1)->second << endl;

    //返回指向首个大于给定键的元素的迭代器
    cout << example1.upper_bound(1)->second << endl;

    return 0;
}
```

### set

> `set` 是关联容器，含有 `Key` 类型对象的已排序集。

#### 创建

```cpp
#include <iostream>
#include <string>
#include <set>
#include <cmath>

using namespace std;

int main()
{
    //默认初始化器
    set<std::string> a;
    a.insert("cat");
    a.insert("dog");
    a.insert("horse");
    for (auto &str : a)
        std::cout << str << ' ';
    std::cout << '\n';

    //迭代器初始化器
    set<std::string> b(a.find("dog"), a.end());

    //复制构造函数
    set<std::string> c(a);

    //列表构造初始化
    set<std::string> e{"one", "two", "three", "five", "eight"};

    return 0;
}
```

#### 容量

```cpp
#include <iostream>
#include <string>
#include <set>

using namespace std;

int main()
{
    //列表构造初始化
    set<std::string> e{"one", "two", "three", "five", "eight"};

    cout << boolalpha << e.empty() << endl;

    cout << e.size() << endl;

    cout << e.max_size() << endl;

    return 0;
}
```

#### 修改

```cpp
#include <iostream>
#include <string>
#include <set>

using namespace std;

int main()
{
    //列表构造初始化
    set<std::string> e{"one", "two", "three", "five", "eight"};

    e.insert("nine");

    //创建并初始化 set 容器
    std::set<string> myset;
    //向 myset 容器中添加元素
    pair<set<string, string>::iterator, bool> ret = myset.emplace("yuandongbin");
    cout << "myset size = " << myset.size() << endl;
    cout << "ret.iter = <" << *(ret.first) << ", " << ret.second << ">" << endl;

    //创建并初始化 set 容器
    std::set<string> myset1;
    //在 set 容器的指定位置添加键值对
    set<string>::iterator iter = myset1.emplace_hint(myset1.begin(), "yuandongbin");
    cout << "myset size = " << myset1.size() << endl;
    cout << *iter << endl;

    set<int> myset2 = {1, 2, 3, 4, 5};
    cout << myset2.size() << endl;

    //1) 调用第一种格式的 erase() 方法
    int num = myset2.erase(2); //删除元素 2，myset={1,3,4,5}
    cout << "1、myset size = " << myset.size() << endl;
    cout << "num = " << num << endl;

    //2) 调用第二种格式的 erase() 方法
    set<int>::iterator iter1 = myset2.erase(myset2.begin()); //删除元素 1，myset={3,4,5}
    cout << "2、myset size = " << myset2.size() << endl;
    cout << "iter->" << *iter << endl;

    //3) 调用第三种格式的 erase() 方法
    set<int>::iterator iter2 = myset2.erase(myset2.begin(), --myset2.end());//删除元素 3,4，myset={5}
    cout << "3、myset size = " << myset2.size() << endl;
    cout << "iter2->" << *iter2 << endl;

    return 0;
}
```

emplace()的返回值的类型为pair类型，其中包含2个元素，一个迭代器和一个bool值

- 当改方法将目标元素成功添加到set容器中时，其返回的迭代器指向新插入的元素，同时bool值为true
- 当添加失败时，则表明原set容器中已存在相同的元素，此时返回的迭代器指向容器中具有相同键的这个元素，同时bool值为false。

emplace_hint()

- 改方法需要额外传入一个迭代器，用来指明新元素添加到set容器的`具体位置`(新元素会添加到改迭代器指向元素的前面)
- 返回值是一个迭代器，而不再是pair对象，当成功添加元素时，返回迭代器指向新添加的元素，反之，如果添加失败，则迭代器就指向set容器和要添加元素的值相同的元素。


#### 查找

```cpp
#include <iostream>
#include <set>

using namespace std;

int main()
{
    set<int> example = {1, 2, 3, 4};

    auto search = example.find(2);
    if (search != example.end())
    {
        std::cout << "Found " << (*search) << '\n';
    }
    else
    {
        std::cout << "Not found\n";
    }

    return 0;
}
```

### multimap

#### 构造

```cpp
#include <iostream>
#include <map>

using namespace std;

int main()
{
    multimap<int, int> m = {{1, 1},
                            {2, 2},
                            {3, 3},
                            {4, 4},
                            {5, 5},
                            {4, 4},
                            {3, 3},
                            {2, 2},
                            {1, 1}};

    for (auto &p : m)
        std::cout
            << p.first << ' ' << p.second << '\n';

    return 0;
}
```

#### 容量

```cpp
#include <iostream>
#include <map>
#include <string>

using namespace std;

int main()
{
    std::multimap<std::string, std::string> m = {{"xx", "xxx"}, {"11", "111"}};

    cout << boolalpha << m.empty() << endl;
    cout << m.size() << endl;

    cout << m.max_size() << endl;
    return 0;
}
```

#### 操作

```cpp
#include <iostream>
#include <map>
#include <string>

using namespace std;

int main()
{
    std::multimap<int, std::string, std::greater<int>> mmap{{2, "foo"}, {2, "bar"}, {3, "baz"}, {1, "abc"}, {5, "def"}};

    // 用 value_type 插入
    mmap.insert(decltype(mmap)::value_type(5, "pqr"));

    // 用 make_pair 插入
    mmap.insert(std::make_pair(6, "uvw"));

    mmap.insert({7, "xyz"});

    std::multimap<std::string, std::string> m;

    // 使用 pair 的移动构造函数
    m.emplace(std::make_pair(std::string("a"), std::string("a")));

    // 使用 pair 的转换移动构造函数
    m.emplace(std::make_pair("b", "abcd"));

    // 使用 pair 的模板构造函数
    m.emplace("d", "ddd");

    // 使用 pair 的逐片构造函数
    m.emplace(std::piecewise_construct,
              std::forward_as_tuple("c"),
              std::forward_as_tuple(10, 'c'));

    m.emplace_hint(m.begin(), 10, "xyz");

    //删除指定位置
    m.erase(m.begin());

    for (const auto &p : m)
    {
        std::cout << p.first << " => " << p.second << '\n';
    }
    return 0;
}
```

#### 查找

```cpp
#include <iostream>
#include <map>

using namespace std;

int main()
{
    std::multimap<int, std::string, std::greater<int>> mmap{{2, "foo"}, {2, "bar"}, {3, "baz"}, {1, "abc"}, {5, "def"}};
    //返回指定key的元素的个数
    cout << mmap.count(2) << endl;

    auto search = mmap.find(2);
    if (search != mmap.end())
    {
        cout << search->first << " " << search->second << "\n";
    }
    else
    {
        cout << "Not found\n";
    }

    return 0;
}
```

### multiset

#### 创建

```cpp
#include <iostream>
#include <set>

using namespace std;

int main()
{
    multiset<int> mymultiset;

    multiset<int> mymultiset1{1, 2, 2, 2, 3, 4, 5};

    multiset<int> mymultiset2(mymultiset1);

    return 0;
}
```

#### 容量

```cpp
#include <iostream>
#include <set>

using namespace std;

int main()
{
    multiset<int> mymultiset1{1, 2, 2, 2, 3, 4, 5};

    cout << boolalpha << mymultiset1.empty() << endl;

    cout << mymultiset1.size() << endl;

    cout << mymultiset1.max_size() << endl;

    return 0;
}
```

#### 操作

```cpp
#include <iostream>
#include <set>

using namespace std;

int main()
{
    multiset<int> mymultiset{1, 2, 2, 2, 3, 4, 5};

    mymultiset.insert(8);

    //删除容器中所有值为2的元素
    int num = mymultiset.erase(2);

    //插入新元素到容器
    mymultiset.emplace(10);

    mymultiset.emplace_hint(mymultiset.begin(), 11);

    for (auto i : mymultiset)
    {
        cout << i << endl;
    }

    return 0;
}
```

### allocaotr

STL的分配器用于封装STL容器在内存管理上的底层细节。

alloc::allocate()用来申请内存

alloc::deallocate()用来释放内存

 对象构造由::construct()负责，对象析构由::destroy()负责。

 同时为了提升内存管理的效率，减少申请小内存造成的内存碎片问题，SGI STL采用了两级配置器，当分配的空间大小超过128B时，会使用第一级空间配置器；当分配的空间大小小于128B时，将使用第二级空间配置器。第一级空间配置器直接使用malloc()、realloc()、free()函数进行内存空间的分配和释放，而第二级空间配置器采用了内存池技术，通过空闲链表来管理内存。


### 内存池技术

使用目的：

- 减少new、delete的调用，减少运行时间
- 避免内存碎片

内存池的原理是，在真正的使用内存之前，预先申请分配一定数量，大小预设的内存块留作备用，当有新的内存需求时，就从内存池中分出一部分内存块， 若内存块不够再继续申请新的内存，当内存释放后就回归到内存块留作后续的复用，使得内存使用效率得到提升，一般也不会产生不可控制的内存碎片。

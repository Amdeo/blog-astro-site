---
title: 'C++1x标准'
published: 2019-11-25
description: 'C++ C++98到C++11经历了长达十年之久的积累，C++14则是作为对C++11的重要补充和优化，所有这些新标准中补充的特性，给C++这门语言注入新的活力。 C++1x，现在有C++11/14/17甚至还有C++2…'
image: '/assets/desktop-banner/1.webp'
tags: ['编程语言', 'C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C++1x标准

C++98到C++11经历了长达十年之久的积累，C++14则是作为对C++11的重要补充和优化，所有这些新标准中补充的特性，给C++这门语言注入新的活力。

C++1x，现在有C++11/14/17甚至还有C++20，C++一直在进行发展，增加很多新的元素，auto关键字的修改使我们更加有信心来操控复杂的模板的模板类型，同时还对语言运行期进行了大量的强化，Lambda 表达式的出现让 C++ 具有了『匿名函数』的『闭包』特性，而这一特性几乎在现代的编程语言（诸如 Python/Swift/... ）中已经司空见惯，右值引用的出现解决了 C++ 长期以来被人诟病的临时对象效率问题等等。

C++1x 为自身的标准库增加了非常多的工具和方法，诸如在语言层面上提供了 `std::thread` 支持了并发编程，在不同平台上不再依赖于系统底层的 API，实现了语言层面的跨平台支持；`std::regex`提供了完整的正则表达式支持等等。

## 怎么使用C++11或者C++14

使用-std=c++11的编译选项

```cpp
g++ main.cpp -std=c++11
g++ main.cpp -std=c++14
```

## 被弃用的特性

- **如果一个类有析构函数，为其生成拷贝构造函数和拷贝赋值运算符的特性被弃用了。**

- **不再允许字符串字面值常量赋值给一个 char \*。如果需要用字符串字面值常量赋值和初始化一个 char \*，应该使用 const char \* 或者 auto。**

- **C++98 异常说明、 unexpected_handler、set_unexpected() 等相关特性被弃用，应该使用 noexcept。**

- **auto_ptr 被弃用，应使用 unique_ptr。**

- **register 关键字被弃用。**

- **bool 类型的 ++ 操作被弃用。**

- **C 语言风格的类型转换被弃用，应该使用 static_cast、reinterpret_cast、const_cast 来进行类型转换。**

## 与 C 的兼容性

```cpp
extern "C"
```

extern "C"表示的一种编译和连接规约，而不是一种语言，仅指定编译和连接规约，但不影响语义，如果是C++项目指定了extern "C"，仍然要遵守C++的类型检测、参数转换等规则。它只是让程序按照类C的编译和连接规约来编译和链接


## nullptr 与 constexpr

### nullptr

nullptr出现的目的是为了替代了NULL，在某种意义上会把NULL和0视为同一种东西，这取决于编译器如何定义NULL，有的编译器会将NULL定义为((void*)0),

```cpp
char *ch = NULL;
```

那么编译这行代码时，NULL只好被定义为0，二这将导致C++重载特性发生混乱

```cpp
void foo(char *);
void foo(int);
```

对于这两个函数来说，如果 `NULL` 又被定义为了 `0` 那么 `foo(NULL);` 这个语句将会去调用 `foo(int)`，从而导致代码违反直观。

C++11引入了nullptr关键字，专门用来区分空指针，`nullptr` 的类型为 `nullptr_t`，能够隐式的转换为任何指针或成员指针的类型，也能和他们进行相等或者不等的比较。

### constexpr

constexpr可以用来修饰变量、函数、构造函数，一旦以上任何元素被constexpr修饰，那么等于说是告诉编译器 “请大胆地将我看成编译时就能得出常量值的表达式去优化我”。

```cpp
const int func() {
    return 10;
}
main(){
  int arr[func()];
}
//error : 函数调用在常量表达式中必须具有常量值

constexpr func() {
    return 10;
}
main(){
  int arr[func()];
}
//编译通过
```

则编译通过
编译期大胆地将func()做了优化，在编译期就确定了func计算出的值10而无需等到运行时再去计算。

## auto

auto可以进行类型自动推导

使用 `auto` 进行类型推导的一个最为常见而且显著的例子就是迭代器。在以前我们需要这样来书写一个迭代器：

```cpp
for(vector<int>::const_iterator itr = vec.cbegin(); itr != vec.cend(); ++itr)

//使用auto
// 由于 cbegin() 将返回 vector<int>::const_iterator
// 所以 itr 也应该是 vector<int>::const_iterator 类型
for(auto itr = vec.cbegin(); itr != vec.cend(); ++itr);
```

> **注意**：`auto` 不能用于函数传参，因此下面的做法是无法通过编译的（考虑重载的问题，我们应该使用模板）：

## decltype

`decltype` 关键字是为了解决 auto 关键字只能对变量进行类型推导的缺陷而出现的。它的用法和 `sizeof` 很相似：

```cpp
auto x = 1;
auto y = 2;
decltype(x+y) z;//这里我们可以推导出x+y的类型
```

使用

```cpp
template<typename T, typename U>
auto add(T x, U y) -> decltype(x+y) {
    return x+y;
}
```

C++14

```cpp
template<typename T, typename U>
auto add(T x, U y) {
    return x+y;
}
```

## 强类型枚举enum class

原来enum

## 区间迭代

### 基于范围的 for 循环

终于，C++11 引入了基于范围的迭代写法，我们拥有了能够写出像 Python 一样简洁的循环语句：

```cpp
int array[] = {1,2,3,4,5};
//遍历数组
for(auto &x : array) {
    std::cout << x << std::endl;
}
//这里auto &x,在代码块中的x可以修改，不允许修改可以const auto &x修改。
```

### C++ for_each()

std::for_each()函数是基于C++容器的迭代器，实现容器内元素的遍历，并对每个函数执行回调函数。

std::for_each()函数第一个参数是起始迭代器，第二参数是终止迭代器，第三个参数是回调函数（回调函数的形参是元素类型）。for_each()内部遍历起始，终止迭代器中间的每个元素，并把元素对象传递作为回调函数的参数，调用回调函数。

## 列表初始化

在c++11之前列表初始化

传统 C++中，普通数组、没有构造析构和虚函数的类或结构体都可以使用 {} 进行初始化，也就是我们所说的初始化列表。
而对于类对象的初始化，要么需要通过拷贝构造、要么就需要使用 () 进行，不支持{}。

```cpp
//初始化列表
int a = {1,2,3,4,5};    //普通数组

struct A
{
    int x;
    struct B
    {
        int i;
        int j;
    } b;
} a = { 1, { 2, 3 } };  //POD类型
```

C++11新增加初始化列表std::initializer_list<>类型，可以通过{}语法来构造初始化列表，初始化列表是常数；一旦被创建，其成员均不能被改变，成员中的数据也不能够被变动。函数能够使用初始化列表作为参数。

在引入C++ 11之前，有各种不同的初始化语法。在C++ 11中，仍可以使用这些初始化语法，但也可以选择使用新引入的统一的初始化语法。统一的初始化语法用一对大括号{}表示。

```cpp
std::vector<string> v1 = {"hello", "world", "welcome"};
std::vector<int> v2 = {0, 3, 8, 1, 4};
```

C++11引入了一个新的初始化方式，称为初始化列表(List Initialize)，具体的初始化方式如下：

```cpp
int static_arr[5] = { 1, 2, 3, 4 };
int static_arr2[]{ 1, 2, 3, 4 }; // 等号要以省略
int* dynamic_arr = new int[5]{ 1, 2, 3, 4 };
vector<int> stl_vec{ 1, 2, 3, 4 };
set<int> stl_set{ 1, 2, 3, 3 };
map<const char*, int> stl_map
{
    { "Alice", 1 },
    { "Bob", 2 },
    { "Cindy", 3 }
};
```

C++11将初始化列表解释成一个initializer_list<T>类型的变量（T是列表中元素的类型）。
它相当于一个只读的容器，只有三个成员函数：size()，begin()和end()。
在上面这个例子中，我们用初始化列表为STL容器提供初值。
C++11为STL容器新增了一种构造函数，它可以接收一个initializer_list。

```cpp
#include <initializer_list> // This header is required
#include <iostream>

using namespace std;

template <class Tp>
void print_ilist(const initializer_list<Tp> &ilist)
{
    for (auto it = ilist.begin(); it != ilist.end(); ++it)
        cout << *it << endl;
}

struct Foo
{
    int vals[10];
    int n = 0;

    Foo(const initializer_list<int> &ilist) {
        for (int v : ilist)
            vals[n++] = v;
    }
};

int main()
{
    initializer_list<int> empty_ilist;
    empty_ilist = { 1, 2, 3, 4 };
    cout << empty_ilist.size() << endl; // 4

    Foo foo{ 1, 2, 3 };
    Foo bar(empty_ilist);
    cout << "bar.n = " << bar.n << endl; // 4

    initializer_list<float> float_ilist{ 1.0, 1.2, 1.5, 2.0 };
    print_ilist(float_ilist);
    print_ilist({ "Reimu", "Marisa", "Sanae", "Reisen" });
    return 0;
}
```

目前所有的STL容器都支持初始化列表，如下：

```cpp
std::vector<int> v = { 1, 2, 3 };
std::list<int> l = { 1, 2, 3 };
std::set<int> s = { 1, 2, 3 };
std::map<int, std::string> m = { {1, "a"}, {2, "b"} };
```

## 模板增强

在传统C++的编译器中，>>一律被当做右移运算来进行处理，但实际上我们很容易就写出了嵌套模板的代码：

```cpp
std::vector<std::vector<int>> wow;
```

这在传统C++编译器下是不能够被编译的，而 C++11 开始，连续的右尖括号将变得合法，并且能够顺利通过编译。

### 类型别名模板

在了解类型别名模板之前，需要理解『模板』和『类型』之间的不同。仔细体会这句话：**模板是用来产生类型的。**在传统 C++中，`typedef` 可以为类型定义一个新的名称，但是却没有办法为模板定义一个新的名称。因为，模板不是类型。例如：

```cpp
template< typename T, typename U, int value>
class SuckType {
public:
    T a;
    U b;
    SuckType():a(value),b(value){}
};
template< typename U>
typedef SuckType<std::vector<int>, U, 1> NewType; // 不合法
```

C++11 使用 `using` 引入了下面这种形式的写法，并且同时支持对传统 `typedef` 相同的功效：

> 通常我们使用 `typedef` 定义别名的语法是：`typedef 原名称 新名称;`，但是对函数指针等别名的定义语法却不相同，这通常给直接阅读造成了一定程度的困难。

```cpp
typedef int (*process)(void *);  // 定义了一个返回类型为 int，参数为 void* 的函数指针类型，名字叫做 process
using process = int(*)(void *); // 同上, 更加直观

template <typename T>
using NewType = SuckType<int, T, 1>;    // 合法
```

### 默认模板参数

```cpp
template<typename T = int, typename U = int>
auto add(T x, U y) -> decltype(x+y) {
    return x+y;
}
```

### 变长参数模板

模板一直是 C++ 所独有的黑魔法（一起念：**Dark Magic**）之一。在 C++11 之前，无论是类模板还是函数模板，都只能按其指定的样子，接受一组固定数量的模板参数；而 C++11 加入了新的表示方法，允许任意个数、任意类别的模板参数，同时也不需要在定义时将参数的个数固定。

```cpp
template<typename... Ts> class Magic;
```

模板类 Magic 的对象，能够接受不受限制个数的 typename 作为模板的形式参数，例如下面的定义：

```cpp
class Magic<int,
            std::vector<int>,
            std::map<std::string, std::vector<int>>> darkMagic;
```

既然是任意形式，所以个数为0的模板参数也是可以的：`class Magic<> nothing;`。

如果不希望产生的模板参数个数为0，可以手动的定义至少一个模板参数：

```cpp
template<typename Require, typename... Args> class Magic;
```

首先，我们可以使用 `sizeof...` 来计算参数的个数，：

```cpp
template<typename... Args>
void magic(Args... args) {
    std::cout << sizeof...(args) << std::endl;
}
```

我们可以传递任意个参数给 `magic` 函数：

```cpp
magic();        // 输出0
magic(1);       // 输出1
magic(1, "");   // 输出2
```

### **1. 递归模板函数**

递归是非常容易想到的一种手段，也是最经典的处理方法。这种方法不断递归的向函数传递模板参数，进而达到递归遍历所有模板参数的目的：

```cpp
#include <iostream>
template<typename T>
void printf(T value) {
    std::cout << value << std::endl;
}
template<typename T, typename... Args>
void printf(T value, Args... args) {
    std::cout << value << std::endl;
    printf(args...);
}
int main() {
    printf(1, 2, "123", 1.1);
    return 0;
}
```

### **2. 初始化列表展开**

> 这个方法需要之后介绍的知识，读者可以简单阅读以下，将这个代码段保存，在后面的内容了解过了之后再回过头来阅读此处方法会大有收获。

递归模板函数是一种标准的做法，但缺点显而易见的在于必须定义一个终止递归的函数。

这里介绍一种使用初始化列表展开的黑魔法：

```cpp
// 编译这个代码需要开启 -std=c++14
// 因为版本原因，实验环境中的 g++ 尚不支持此特性，此处可以使用 clang++ 替代 g++
template<typename T, typename... Args>
auto print(T value, Args... args) {
    std::cout << value << std::endl;
    return std::initializer_list<T>{([&] {
        std::cout << args << std::endl;
    }(), value)...};
}
int main() {
    print(1, 2.1, "123");
    return 0;
}
```

## 面向对象增强

### 委托构造

C++11 引入了委托构造的概念，这使得构造函数可以在同一个类中一个构造函数调用另一个构造函数，从而达到简化代码的目的：

```cpp
class Base {
public:
    int value1;
    int value2;
    Base() {
        value1 = 1;
    }
    Base(int value) : Base() {  // 委托 Base() 构造函数
        value2 = 2;
    }
};

int main() {
    Base b(2);
    std::cout << b.value1 << std::endl;
    std::cout << b.value2 << std::endl;
}
```

### 继承构造

在传统 C++ 中，构造函数如果需要继承是需要将参数一一传递的，这将导致效率低下。C++11 利用关键字 using 引入了继承构造函数的概念：

```cpp
class Base {
public:
    int value1;
    int value2;
    Base() {
        value1 = 1;
    }
    Base(int value) : Base() {                          // 委托 Base() 构造函数
        value2 = 2;
    }
};
class Subclass : public Base {
public:
    using Base::Base;  // 继承构造
};
int main() {
    Subclass s(3);
    std::cout << s.value1 << std::endl;
    std::cout << s.value2 << std::endl;
}
```

### 显式虚函数重载

在传统 C++中，经常容易发生意外重载虚函数的事情。例如：

```cpp
struct Base {
    virtual void foo();
};
struct SubClass: Base {
    void foo();
};
```

`SubClass::foo` 可能并不是程序员尝试重载虚函数，只是恰好加入了一个具有相同名字的函数。另一个可能的情形是，当基类的虚函数被删除后，子类拥有旧的函数就不再重载该虚拟函数并摇身一变成为了一个普通的类方法，这将造成灾难性的后果。

C++11 引入了 `override` 和 `final` 这两个关键字来防止上述情形的发生。

### override

当重载虚函数时，引入 `override` 关键字将显式的告知编译器进行重载，编译器将检查基函数是否存在这样的虚函数，否则将无法通过编译：

```cpp
struct Base {
    virtual void foo(int);
};
struct SubClass: Base {
    virtual void foo(int) override; // 合法
    virtual void foo(float) override; // 非法, 父类没有此虚函数
};
```

### final

`final` 则是为了防止类被继续继承以及终止虚函数继续重载引入的。

```cpp
struct Base {
        virtual void foo() final;
};
struct SubClass1 final: Base {
};                  // 合法

struct SubClass2 : SubClass1 {
};                  // 非法, SubClass 已 final

struct SubClass3: Base {
        void foo(); // 非法, foo 已 final
};
```

### 显式禁用默认函数

在传统 C++ 中，如果程序员没有提供，编译器会默认为对象生成默认构造函数、复制构造、赋值算符以及析构函数。另外，C++ 也为所有类定义了诸如 `new` `delete` 这样的运算符。当程序员有需要时，可以重载这部分函数。

这就引发了一些需求：无法精确控制默认函数的生成行为。例如禁止类的拷贝时，必须将赋值构造函数与赋值算符声明为 `private`。尝试使用这些未定义的函数将导致编译或链接错误，则是一种非常不优雅的方式。

并且，编译器产生的默认构造函数与用户定义的构造函数无法同时存在。若用户定义了任何构造函数，编译器将不再生成默认构造函数，但有时候我们却希望同时拥有这两种构造函数，这就造成了尴尬。

C++11 提供了上述需求的解决方案，允许显式的声明采用或拒绝编译器自带的函数。例如：

```cpp
class Magic {
public:
    Magic() = default;  // 显式声明使用编译器生成的构造
    Magic& operator=(const Magic&) = delete; // 显式声明拒绝编译器生成构造
    Magic(int magic_number);
}
```

## lambda表达式

lamdba表达式其实在其他语言中广泛使用，它就是一个匿名函数,用于定义并创建一个匿名函数对象，以减缓函数工作。

```cpp
[函数对象参数]（操作符重载函数参数）mutable 或 exception 声明 ->返回类型（函数体）
```

### 1)函数对象参数

Lambda表达式的开始，不能省略。

- `空`   没有任何函数对象参数
  - `=`  函数体中可以使用lambda所在范围所有可见的局部变量（包括lambda所在类的this），并且是值传递方式（相当于编译器自动为我们按值传递了所有局部变量）。
- `&` 函数体内可以使用 Lambda 所在范围内所有可见的局部变量（包括 Lambda 所在类的 this），并且是引用传递方式（相当于是编译器自动为我们按引用传递了所有局部变量）。
- `this` 函数体内可以使用lambda所在类的成员变量
- `a` 将a按值进行传递，按值进行传递时，函数体内不能修改传递进来的a的拷贝，因为默认情况下函数是const的，要修改传递进来的拷贝，可以添加mutable修饰符。
- `a` `&b` ,a将按值传递，b按引用进行传递
- =，&a，&b。除 a 和 b 按引用进行传递外，其他参数都按值进行传递。
- &，a，b。除 a 和 b 按值进行传递外，其他参数都按引用进行传递。

### 2）操作符重载函数参数

标识重载的 () 操作符的参数，没有参数时，这部分可以省略。参数可以通过按值（如: (a, b)）和按引用 (如: (&a, &b)) 两种方式进行传递。

### 3）mutable 或 exception 声明

这部分可以省略。按值传递函数对象参数时，加上 mutable 修饰符后，可以修改传递进来的拷贝（注意是能修改拷贝，而不是值本身）。exception 声明用于指定函数抛出的异常，如抛出整数类型的异常，可以使用 throw(int)。

### 4） -> 返回值类型

标识函数返回值的类型，当返回值为 void，或者函数体中只有一处 return 的地方（此时编译器可以自动推断出返回值类型）时，这部分可以省略。

### 5）{函数体}

标识函数的实现，这部分不能省略，但函数体可以为空。

```cpp
#include <iostream>

//匿名函数lambda

int main(int argc, char const *argv[])
{
    using namespace std;
    //无参匿名函数
    auto func1 = []() { cout << "无参匿名函数不能使用任何外部变量" << endl; return 0; };

    int x = 1, y = 2, z = 5;
    //参数x是值传递,参数y是传引用
    auto func2 = [x, &y](int x, int y) {
        cout << "参数x是值传递,参数y是传引用" << endl;
    };
    auto func3 = [&](int x, int y, int z) {
        cout << "所有参数都是传引用" << endl;
    };
    auto func4 = [=](int x, int y, int z) {
        cout << "所有参数都是值引用" << endl;
    };
    auto func5 = [&, x](int x, int y, int z) {
        cout << "x是按值传递,其他参数都是按引用传递" << endl;
    };
    auto func6 = [=, &x](int x, int y, int z) {
        cout << "x按引用传递,其他参数按照值传递" << endl;
    };
    func1();
    func2(x, y);
    func3(x, y, z);
    func4(x, y, z);
    func5(x, y, z);
    func6(x, y, z);
    return 0;
}
```

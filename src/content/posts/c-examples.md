---
title: 'C语言实例'
published: 2016-02-20
description: '求某一年的某一月的多少天？ 我们需要先清楚一年中每月有多少天，哪些月份是固定的天数，哪些月份是天数不确定。 这里只有二月份的变数，那怎么确认某一年的二月份是28或29。 二月份。'
image: '/assets/desktop-banner/1.webp'
tags: ['C/C++']
category: 'C/C++'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# C语言实例

求某一年的某一月的多少天？ 我们需要先清楚一年中每月有多少天，哪些月份是固定的天数，哪些月份是天数不确定。 这里只有二月份的变数，那怎么确认某一年的二月份是28或29。 二月份。


## 求某一年的某一月的多少天？

我们需要先清楚一年中每月有多少天，哪些月份是固定的天数，哪些月份是天数不确定。

```
一月 = 31

二月 = 28 或者29

三月 = 31

四月 = 30

五月 = 31

六月 = 30

七月 = 31

八月 = 31

九月 = 30

十月 = 31

十一月 = 30

十二月 = 31
```

这里只有二月份的变数，那怎么确认某一年的二月份是28或29。

二月份的天数与闰年有关。闰年的判断依据是：

若某年能被4整除，但不能被100整除，则一年是闰年；若某年能被400年整除，则这一年也是闰年。（闰年为29天）

```cpp
#include <stdio.h>
#include <stdlib.h>

int main()
{
    int year,month,day;
    printf("输入年份：");
    scanf("%d",&year);
    printf("输入月份：");
    scanf("%d",&month);

    switch (month)
    {

    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        day = 31;
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        day = 30;
        break;
    case 2:
        if(year%4 == 0 && year%100 != 100 || year%400 == 0)
        {
            day = 29;
            break;
        }
        else
        {
            day = 28;
            break;
        }


    default:
        printf("月份输入错误！\n");
        exit(1);
        break;
    }
    printf("天数：%d\n", day);
    return 0;
}
```

## 输入一个字符串、统计英文字母、空格、数字和其他字符的个数

分析：

那我们需要确定英文字母、空格、数字的在ASCII码表中对应的十进制。

英文字母 = 65~90 (大写字母)  97~122（小写字母）

空格 = 0

数字 = 48 ~ 57


```cpp
#include <stdio.h>
#include <string.h>
int main()
{
    char a;
    int alphabetNum = 0; //字母个数
    int spaceNum = 0; //空格个数
    int digitNum = 0; //数字个数
    int otherNum = 0;

    printf("请输入一些字符：");
    while ((a = getchar()) != '\n')
    {
        // printf("%c",a[0]);
        if ((a >= 'A' && a <= 'Z') || (a >= 'a' && a <= 'z'))
        {
            alphabetNum++;
        }
        else if (a == ' ')
        {
            spaceNum++;
        }
        else if (a >= '0' && a <= '9')
        {
            digitNum++;
        }
        else
        {
            otherNum++;
        }
    }
    printf("字母个数:%d\n", alphabetNum);
    printf("空格个数:%d\n", spaceNum);
    printf("数字个数:%d\n", digitNum);
    printf("其他个数:%d\n", otherNum);

}
```

## 计算用1分钱、2分钱、5分钱组成1元钱的方式

分析

以其中两种纸币为变量，确定剩下来的那种

```cpp
#include <stdio.h>
#include <string.h>
int main()
{
    int m, n, k = 0;
    for (m = 0; m <= 100 / 5; m++)
    {
        for (n = 0; n <= (100 - 5 * m) / 2; n++)
        {
            printf("1分%d个，2分%d个，5分%d个\n", 100 - 5 * m - 2 * n, n, m);
            k++;
        }
    }
    printf("共有%d种组合方式\n", k);
    return 0;
}
```


## C语言输出九九乘法表

```cpp
#include <stdio.h>
#include <string.h>
int main()
{
    for (int i = 1; i <= 9; i++)
    {
        for (int j = 1; j <= i; j++)
        {
            printf("%d x %d = %-4d", i, j, (i * j));
        }
        printf("\n");
    }
    return 0;
}
```

## C语言输出菱形

```cpp
#include <stdio.h>
#include <stdlib.h>

int main() {
    int line;  // 菱形总行数
    int column;  // 菱形总列数
    int i;  // 当前行
    int j;  // 当前列
    printf("请输入菱形的行数(奇数)：");
    scanf("%d", &line);
    if (line % 2 == 0) {  // 判断是否是奇数
        printf("必须输入奇数！\n");
        exit(1);
    }
    column = line;  // 总行数和总列数相同
    for (i = 1; i <= line; i++) {  // 遍历所有行
        if (i < (line + 1) / 2 + 1) {  // 上半部分（包括中间一行）
            for (j = 1; j <= column; j++) {  // 遍历上半部分的所有列
                if ((column + 1) / 2 - (i - 1) <= j && j <= (column + 1) / 2 + (i - 1)) {
                    printf("*");
                }
                else {
                    printf(" ");
                }
            }
        }
        else {  // 下半部分
            for (j = 1; j <= column; j++) {  // 遍历下半部分的所有列
                if ((column + 1) / 2 - (line - i) <= j && j <= (column + 1) / 2 + (line - i)) {
                    printf("*");
                }
                else {
                    printf(" ");
                }
            }
        }
        printf("\n");
    }
    return 0;
}

```


## C语言百钱买百鸡问题（经典题目）


## C语言求π的值(3种方法)

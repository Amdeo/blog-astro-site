---
title: 'Python 常用库整理'
published: 2019-12-05
description: '围绕 JSON、压缩等常见能力，整理 Python 日常开发里最常遇到的一批基础库与典型用法。'
image: '/src/assets/blog-placeholder-1.jpg'
tags: ['python', '编程语言']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Python 常用库整理

这篇文章整理 Python 日常开发里比较常见的一批基础库，适合在需要快速回忆 API 或使用方式时查阅。

## JSON

#### json.dumps

> 将Python对象编码成JSON字符串

```python
import json

data = [ { 'a' : 1, 'b' : 2, 'c' : 3, 'd' : 4, 'e' : 5 } ]

data2 = json.dumps(data)
print(data2)
```

json.loads

> 用于将JSON数据转化为Python字符串的数据类型

```python
import json

jsonData = '{"a":1,"b":2,"c":3,"d":4,"e":5}';

text = json.loads(jsonData)
print(text)
```

## zlib

> 数据压缩

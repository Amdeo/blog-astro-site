---
title: 'go设计模式'
published: 2022-10-01
description: '以 Go 语言为例整理常见设计模式的实现思路与使用场景。'
tags: ['工具', 'hexo']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# go设计模式

单例模式

```go
package design

import (
	"fmt"
	"sync"
)

type singleTon struct {
}

func (s *singleTon) Show() {
	fmt.Println("hello world")
}

var (
	once   sync.Once
	single *singleTon
)

func GetSingleInstance() *singleTon {
	once.Do(func() {
		single = &singleTon{}
	})
	return single
}
```

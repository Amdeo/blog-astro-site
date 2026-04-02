---
title: '前端开发知识收集'
published: 2022-07-20
description: '汇总前端开发中的核心基础知识，帮助建立更完整的知识结构。'
image: '/src/assets/blog-placeholder-3.jpg'
tags: ['工具']
category: '工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# 前端开发知识收集

### 获取浏览器大小

```js
window.innerWidth
window.innerHeight
```

### var变量提升

```js
// var 的情况
console.log(ar); // 输出undefined
var ar = 512;

// let 的情况
console.log(et); // 报错ReferenceError
let et = 512;
```

### restful 规范

| HTTP动词 | **URI路径**          | **说明**       |
|:------:| ------------------ | ------------ |
| GET    | http://域名/news     | 获取列表数据       |
| GET    | http://域名/news/:id | 根据id获取一条数据   |
| POST   | http://域名/news     | 添加一条数据       |
| PUT    | http://域名/news/:id | 根据id修改一条数据   |
| DELETE | http://域名/news/:id | 根据id“删除“一条数据 |

### 模块化

| 方式              | 年份   | 出处                  |
| --------------- | ---- | ------------------- |
| require/exports | 2009 | CommonJS            |
| import/export   | 2015 | ECMAScript2015（ES6） |

| 环境      | require/exports | import/export                                                |
| ------- | --------------- | ------------------------------------------------------------ |
| Nodejs  | 所有版本            | Node 9.0+（启动需加上 flag --experimental-modules）Node 13.2+（直接启动） |
| Chorme  | 不支持             | 61+                                                          |
| Firefox | 不支持             | 60+                                                          |
| Safari  | 不支持             | 10.1+                                                        |
| Edge    | 不支持             | 16+                                                          |

require/exports是运行时动态加载

import/export是静态编译

require/exports输出的是一个值的拷贝

import/export模块输出的是值的引用

#### require/exports 的用法

```js
const fs = require('fs')
exports.fs = fs
module.exports = fs
```

```js
//utils.js
let a = 100;

exports.a = 200;
console.log(module.exports) //{a : 200}
exports = {a:300}; //exports 指向其他内存区

//test.js

var a = require('./utils');
console.log(a) // 打印为 {a : 200}
```

```js
a.js

function test (args) {
    // body...
    console.log(args);
}

module.exports = {
    test
};

b.js

let { test } = require('./a.js');

test('this is a test.');
```

引入 export default 导出的模块不用加 {},引入非 export default 导出的模块需要加 {}。

```
import fileSystem, {readFile} from 'fs'
```

```js
a.js:

export function test (args) {
    console.log(args);
}

// 默认导出模块，一个文件中只能定义一个
export default function() {...};

export const name = "lyn";

b.js:

// _代表引入的export default的内容
import _, { test, name } from './a.js';

test(`my name is ${name}`);
```

---
title: 'css'
published: 2020-11-24
description: 'CSS 层叠样式表(Cascading Style Sheets)，样式定义如何显示html 如何使用CSS？ 外部引用 在头部中使用link标签引用 xx.css 表示样式文件路径 嵌入样式 使用 <style 标签引…'
tags: ['前端']
category: '前端'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# css

> 层叠样式表(Cascading Style Sheets)，样式定义如何显示html

如何使用CSS？

## 外部引用

在头部中使用link标签引用

```html
<head>
	<link rel="stylesheet" href="xx.css" type="text/css">
</head>
```

`xx.css` 表示样式文件路径

##  嵌入样式

> 使用`<style>`标签引用

```
<style>
p {
	background-color: #fff;
}
</style>
```

## 内联样式

在标签中使用style属性可以定义样式

```
<p style="color:blue">你好</p>
```

### 导入样式

两种方式：

```
@import "xx.css"
@import url("xx.css")
```

在哪使用？

- 在xx.css文件中，可以引用另一个样式文件
- 或者在`<style>`标签中引用

初始样式

> 有些标签默认含有内外边距，且不同浏览器大小也不一样。为了统一我们可以重置标签的CSS默认样式。

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" />
```

## 选择器

> 计算机所有的概念和技术都是演化的产物，因为需要才会产生，在css中拥有很多选择器，选择器的作用就是定位html标签，不同的选择器代表不同的定位方式。

### 类选择器

```
<p class="example1"></p>

.example1{
	color: #fff;
}
```

`example1`就是定义的类选择器，通过这个选择器，定位所有拥有相同class的标签，注意：类选择器可以很多标签

### ID选择器

>id选择器对应的标签是唯一的，不同于类选择器可以到处使用。

```
<p id="example1"></p>

#example1{
	color: #fff;
}
```

### 标签选择器

> 指定具体的标签

```
<p>xx</p>

p{
	color: #fff;
}
```

### 结构选择器

> 我们需要知道整个html的是树结构，多个元素之间存在父子关系、兄弟关系等。

| 选择器           | 示例  | 描述                                               |
| ---------------- | ----- | -------------------------------------------------- |
| element element  | div p | 选择div元素内部的所有的p元素，p是div的后代         |
| element,element  | div,p | 选择所有div元素和所有p元素<br />两个类选择器也可以 |
| element+element  | div+p | 选择紧接在div元素后的p元素， div和p 是兄弟关系     |
| element~element2 | p~ul  | 选择p元素后的所有的ul元素，p和ul 是兄弟关系        |
| element>element  | div>p | 选择div内的所有p元素，div和p是父子关系             |

### 属性选择器

>比如<p class="" style=""> 中的class 和style 就是属性，属性存在标签内部

| 选择器              | 示例                                        | 描述                                                        |
| ------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| [attribute]         | `[target]`<br />`h1[target][id]` 多属性约束 | 带有 target 属性所有元素                                    |
| [attribute=value]   | [attribute=value]                           | targe 属性 等于"_blank" 的所有元素                          |
| [attribute~=value]  | [title~=houdunren]                          | title 属性包含单词 "houdunren" 的所有元素                   |
| [attribute\|=value] | [title\|=hd]                                | `title 属性值为 "hd"的单词，或hd-cms` 以`-`连接的的独立单词 |
| [attribute*=value]  | a[src*="hdcms"]                             | src 属性中包含 "hdcms" 字符的每个 元素                      |
| [attribute^=value]  | a[src^="https"]                             | src 属性值以 "https" 开头的每个 元素                        |
| [attribute$=value]  | a[src$=".jpeg"]                             | src 属性以 ".jpeg" 结尾的所有 元素                          |

### 伪类选择器

>为元素的不同状态或不确定存在的元素设置样式规则。

| 状态                | 示例                  | 说明                                                      |
| ------------------- | --------------------- | --------------------------------------------------------- |
| :link               | a:link                | 选择所有`未被访问`的链接                                  |
| :visited            | a:visited             | 选择所有`已被访问`的链接                                  |
| :hover              | a:hover               | 鼠标`移动到元素`上时                                      |
| :active             | a:active              | 点击`正在发生`                                            |
| :focus              | a:focus               | 选择获得`焦点`的input元素                                 |
| :root               | a:root                | 选择文档的根元素即`html`                                  |
| :empyt              | p:empty               | 选择`没有子元素`的每个元素(包括文本节点)                  |
| :first-child        | p:first-child         | 选择每个层级第一个元素为p的元素                           |
| :last-child         | p:last-child          | 选择每个层级最后一个元素为p的元素                         |
| :first-of-type      | p:first-of-type       | 当前层级的第一个p元素                                     |
| :last-of-type       | p:last-of-type        | 当前层级的最后一个p元素                                   |
| :only-of-type       | p:only-of-type        | 选择当前层级中唯一的一个p元素，`所有兄弟姐妹中唯一的女孩` |
| :only-child         | p:only-child          | p元素是独生子                                             |
| :nth-child(n)       | p:nth-child(2)        | p元素是当前层级的第二个元素                               |
| :nth-child(odd)     | p:nth-child(odd)      | 当前层级第偶数个p元素（可以不连续）                       |
| :nth-child(even)    | p:nth-child(even)     | 当前层级第奇数个p元素（可以不连续）                       |
| :nth-of-type(n)     | p:nth-of-type(2)      | 选择当前层级的第二个p元素（可以不连续）                   |
| :nth-last-child(n)  | p:nth-last-child(2)   | 当前层级的倒数第2个元素为p元素                            |
| p:nth-last-child(2) | p:nth-last-of-type(2) | 当前层级的倒数第2个p元素                                  |
| :not(selector)      | :not(p)               | 除了括号中选择器中之外的元素                              |

### 表单伪类

表单属性样式

```css
input:enabled {
    background: red;
}

input:disabled {
    background: #dddddd;
}

input:checked+label {
    color: green;
}
```

表单必选样式

```css
input:required {
    border: solid 2px blue;
}

input:optional {
	background: #dcdcdc;
	border: none;
}
```

表单验证样式

```css
input:valid {
    border: solid 1px green;
}

input:invalid {
    border: solid 1px red;
}
```

### 字符伪类

| 状态           | 示例           | 说明                         |
| -------------- | -------------- | ---------------------------- |
| ::first-letter | p:first-letter | 选择每个元素的首字母         |
| ::first-line   | p:first-line   | 选择每个元素的首行           |
| ::before       | p:before       | 在每个元素的内容之前插入内容 |
| ::after        | p:after        | 在每个元素的内容之后插入内容 |

## 元素权重

元素会被多个样式一层层作用，这就是层叠样式表的来源。如果多个样式做用在元素上就会产生优先级权重问题。

使用类、ID、伪类都有不同的权重，具体应用哪条规则要看权限大小。

- 相同权重的规则应用最后出现的
- 可以使用 `!important` 强制提升某个规则的权限

### 权重应用

| 规则            | 粒度 |
| --------------- | ---- |
| ID              | 0100 |
| class，类属性值 | 0010 |
| 标签,伪元素     | 0001 |
| *               | 0000 |
| 行内样式        | 1000 |

### 强制优先级

有时在规则冲突时，为了让某个规则强制有效可以使用 !important。

```html
<style>
  h2 {
 	 color: red !important;
  }

  h2 {
 	 color: green;
  }
</style>

<h2>HDCMS</h2>
```

### 继承规则

子元素可以继承父元素设置的样式。

- 子元素并不是全部样式。比如边框、高度等并不会继承。
- 继承的规则没有权重

### 通配符

在开发中使用`*` 选择器会有一个问题。因为通配符的权限为0，而继承的规则没有权重，看以下代码产生的问题。

```html
<style>
  * {
  	color: red;
  }

  h2 {
  	color: blue;
  }
</style>

<article>
	<h2>hdcms <span>内容管理系统</span></h2>
</article>
```

`h2` 中的span并没有继承 `h2` 的颜色，就是因为继承没有权重。而使用了 `*` 权重为0的规则。

https://www.w3cschool.cn/css/dict

### 布局

#### 浮动

#### 定位

#### 显示

#### 盒模型

#### 网格布局

#### 弹性布局

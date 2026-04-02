---
title: 'HTML'
published: 2019-11-25
description: '基础知识 \\\\\\\\u200b HTML 不是一种编程语言，而是一种标记语言 (markup language)，是网页制作所必备的。用于按不同标签声明网页中的内容。 文件命名 使用小写字线命名文件，不要出现中文字符 扩展名标准是.htm…'
image: '/src/assets/blog-placeholder-3.jpg'
tags: ['前端']
category: '前端'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# HTML

基础知识 \\\\u200b HTML 不是一种编程语言，而是一种标记语言 (markup language)，是网页制作所必备的。用于按不同标签声明网页中的内容。 文件命名 使用小写字线命名文件，不要出现中文字符 扩展名标准是.htm…


## 基础知识

​		HTML 不是一种编程语言，而是一种标记语言 (markup language)，是网页制作所必备的。用于按不同标签声明网页中的内容。

![img](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/a11y-html-3.png)

### 文件命名

- 使用小写字线命名文件，不要出现中文字符
- 扩展名标准是.html，当然也可以使用.htm
- 多个单词可以使用`-` 或 `_` 连接，建议使用`-` 字符如`user-create.html`

### 语言标签

​		HTML标签都有具体语义，技术上可以使用div表示大部分内容，单选择清晰的语义标签更容易让人看明白，比如`h1`表示标题、`p`表示内容等。

[标签大全](https://www.runoob.com/tags/html-reference.html)

![](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/a11y-html-1-20210121155501763.png)

### 链接和图片

#### 图像格式

- 网络带宽成本很高，图片处理在保证用户体验好的前提下，文件尺寸也要尽可能小
- 图片属性静态文件，不要放在WEB服务器上，而放在云储存服务器上并使用CDN加速
- 以JPEG类型优先使用，文件尺寸更小
- 小图片使用PNG，清晰度更高，因为文件尺寸小，文件也不会太大
- 网页图标建议使用css字体构建如 [iconfont](https://www.iconfont.cn/)或 [fontawesome](https://fontawesome.com/icons?d=gallery)

| 格式 | 说明                                                         | 透明 |
| ---- | ------------------------------------------------------------ | ---- |
| PNG  | 无损压缩格式，适合图标、验证码等。有些小图标建议使用css字体构建 | 支持 |
| GIF  | 256色，可以产生动画效果（即GIF动画）                         | 支持 |
| JPEG | 有损压缩的类型，如商品、文章的图片展示                       |      |

使用`Photoshop` 可以快速生成透明的png的图片效果

### 锚点链接

锚点可以设置跳转到页面中的某个部分。

```html
<a href="#comment-1">跳转到评论区</a>
<div style="height: 1000px;"></div>

<div id="comment-1" style="background: green;">
	这是后盾人评论内容区
</div>
```

> 通过将href和id进行绑定实现

跳转到不同页面的锚点

```
<a href="article.html#comment-1">跳转到评论区</a>
```

### 下载链接

```html
<a href="文件链接" download='下载文件名'></a>
```

### 表单

**form**

一般情况下表单项要放在 FORM 内提交。

```html
<form method="post" action="http://127.0.0.1:5000/">
    <p> 名字：<input name="name" type="text"> </p>
    <p> 密码：<input name="pass" type="password"> </p>
    <p>
      <input type="submit" name="Button" value="提交" />
      <input type="reset" name="Reset" value="重填" />
    </p>
</form>
```

**input**

文本框用于输入单行文本使用，下面是常用属性与示例。

![image-20210121151206353](https://cdn.jsdelivr.net/gh/Amdeo/blogImg/img/image-20210121151206353.png)

通过设置表单的`type`字段可以指定不同的输入内容。

| 类型     | 说明                         |
| -------- | ---------------------------- |
| email    | 输入内容为邮箱               |
| url      | 输入内容为URL地址            |
| password | 输入内容为密码项             |
| tel      | 电话号，移动端会调出数字键盘 |
| search   | 搜索框                       |
| hidden   | 隐藏表单                     |
| submit   | 提交表单                     |

**hidden**

数据在前台页面不显示，但是数据可以提交到后端。

```html
<input type="hidden" name="id" value="1">
```

**禁用表单**

通过表单的`disable`和`readonly`都可以禁止修改表单，但`readonly`表单的数据可以提交到后台。

```
<input type="text" name="web" value="houdunren.com" readonly>
```

**pattern**

表单可以通过设置`pattern`属性指定正则验证，也可以使用各种前端验证库和 [formvalidator](http://www.formvalidator.net/#default-validators_custom)或 [validator.js](https://github.com/validatorjs/validator.js)。

```html
<form action="">
	<input type="text" name="username" pattern="[A-z]{5,20}"
	oninvalid="validate('请输入5~20位字母的用户名')">
	<button>提交</button>
</form>

<script>
	function validate(message) {
		alert(message);
	}
</script>
```

**textarea**

文本域指可以输入多行文本的表单，当然更复杂的情况可以使用编辑器如`ueditor、ckeditor`等。

**select**

下拉列表项可用于多个值中的选择。

**radio**

单选框指只能选择一个选项的表单，如性别的选择`男、女、保密` 只能选择一个。

**checkbox**

复选框指允许选择多个值的表单。

**文件上传**

文件上传有多种方式，可以使用插件或JS拖放上传处理。HTML本身也提供了默认上传的功能，只是上传效果并不是很美观。

```html
<form action="" method="POST" enctype="multipart/form-data">
	<fieldset>
		<input type="file" name="icon" multiple="multiple" accept="image/png,image/gif">
	</fieldset>
	<button>保存</button>
</form>
```

**日期和时间**

```
<input type="date" step="5" min="2020-09-22" max="2025-01-15" name="datetime">

```

**DATALIST**

input表单的输入值选项列表

**autocomplete**

浏览器基于之前键入过的值，应该显示出在字段中填写的选项。

```html
<form action="">
  <input type="search" autocomplete="on" name="content" />
  <button>提交</button>
</form>
```

### 可访问性

### 搜索引擎优化

#### 什么是搜索引擎？

​		搜索引擎，通常指搜集了万维网上几千万到几十亿网页并对网页中的每一个词(即关键词)进行索引，建立索引数据库的全文搜索引擎。当用户查找某个关键词的时候，所有在页面内容中板含量该关键词的网页都将被搜出来。在经过复杂的算法进行排序，这些结果将按照与搜索关键词的相关度高低，依次排序。

​		搜索引擎一般包括：搜索器、索引器、检索器、用户接口等四个功能模块。

- 搜索器，也叫网络爬虫，是搜索引擎用来抓取网页的一个自动程序，在系统后台不停歇地在互联网各个节点爬行，在爬行过程中尽可能快的发现和抓取网页。
- 索引器。它的主要功能是理解搜索器所采集的网页信息，并从中抽取索引项。
- 检索器。其功能是快速查找文档，进行文档与查询的相关度评价，对要输出的结果进行排序。
- 用户接口。它为用户提供可视化的查询输入和结果输出的界面。

#### 如何优化？

​		搜索引擎优化，又称为SEO，即Search Engine Optimization，它是一种通过分析搜索引擎的排名规律，了解各种搜索引擎怎样进行搜索、怎样抓取互联网页面、怎样确定特定关键词的搜索结果的技术。搜索引擎采用易于被搜索引用的手段，对网站进行有针对性的优化，提高网站在搜索引擎中的自然排名，吸引更多的用户访问网站，提高网站的访问量，提高网站的销售能力和宣传能力，从而提升网站的品牌效应。

优化方法分为`黑帽`和白帽两大类。

**黑帽**

​		通常通过作弊手法欺骗搜索引擎和访问者，最终将遭到搜索引擎惩罚的手段被称为黑帽，比如隐藏关键字、制造大量的meta字、alt标签等。

黑帽方法通过欺骗技术和滥用搜索算法来推销毫不相关、主要以商业为着眼的网页。黑帽SEO的主要目的是让网站得到他们所希望的排名进而获得更多的曝光率，这可能导致令普通用户不满的搜索结果。因此搜索引擎一旦发现使用“黑帽”技术的网站，轻则降低其排名，重则从搜索结果中永远剔除该网站。选择黑帽SEO服务的商家，一部分是因为不懂技术，在没有明白SEO价值所在的情况下被服务商欺骗；另一部分则只注重短期利益，存在赚一笔就走人的心态。

**白帽**

​		通过正规技术和方式，且被搜索引擎所接受的SEO技术。

搜索引擎优化的白帽法遵循搜索引擎的接受原则。他们的建议一般是为用户创造内容、让这些内容易于被搜索引擎机器人索引、并且不会对搜寻引擎系统耍花招。一些网站的员工在设计或构建他们的网站时出现失误以致该网站排名靠后时，白帽法可以发现并纠正错误，譬如机器无法读取的选单、无效链接、临时改变导向、效率低下的索引结构等。

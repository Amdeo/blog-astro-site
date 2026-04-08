---
title: 'HTML 源码显示：原样输出标签的方法'
published: 2019-12-21
description: '整理在网页中原样显示 HTML 标签和源码内容的几种常见方法，适合写教程、演示代码片段时快速查阅。'
tags: ['前端']
category: '前端'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# HTML 源码显示：原样输出标签的方法

有时候写教程、文档或者演示页，需要把 HTML 代码原样显示出来，而不是让浏览器直接解析执行。

这篇文章整理几种常见方法，方便后面遇到类似场景时直接选。

## 方法一

```html
<script type="text/html" style='display:block'>
<div class="banner-text p-5">
<div class="container">
<div class="banner-text-con">
<div>
<h1 style="color:;">html代码不被解析</h1>
</div>
</div>
</div>
</div>
</script>
```

第二种：

```html
<xmp>
xxx
</xpm>
```

第三种

```html
<textarea style="width:'800px';height:300px;">
xxxx
</textarea>
```

注意的是记得写display:block，不然没有效果的，直接输出，没有任何格式化效果

第四种

如果是有空格和回车这样的特殊字符的简单文本可以使用`<pre>` `</pre>`标签

第五种

将<>转换成特殊字符`<` 转化为`&lt`, `>` 转化为`&gt`。

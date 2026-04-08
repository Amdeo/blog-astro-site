---
title: 'Python 爬虫入门'
published: 2020-02-03
description: '从 requests 到浏览器自动化，整理 Python 做网页抓取时最常见的思路、工具和基础示例。'
tags: ['python', '爬虫']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Python 爬虫入门

这篇文章整理 Python 做爬虫时最常见的一些起步方式，重点在于先建立整体思路，再看不同工具适合什么场景。

## 先判断抓取场景

在写爬虫之前，最好先判断目标页面属于哪一类：

- **静态页面**：直接请求 HTML 就能拿到主要内容，通常 `requests` 就够用
- **动态页面**：页面内容依赖 JavaScript 渲染，往往需要 Selenium 这类浏览器自动化工具

## requests：抓静态页面

如果目标站点是静态页面，直接使用 `requests` 请求页面源码，通常就可以完成抓取。

### 小说爬虫示例

下面这段代码是一个完整的小说爬虫示例，核心思路是：

1. 请求小说列表页
2. 拿到每本小说的链接
3. 再进入小说详情页抓章节链接
4. 最后进入章节页提取正文并写入文件

```python
import requests
import re
import threadpool
import os


class novelSpider:
    def __init__(self, domian_url, url):
        self.domian_url = domian_url
        self.url = url
        self.NovelInfoList = self.getEveryNovelUrl()

    def getnovelRequestText(self, url):
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        return response.text

    def getEveryNovelUrl(self):
        allNovelHtml = self.getnovelRequestText(self.url)
        if len(allNovelHtml) > 0:
            maindiv = re.findall(r'<div id="main">(.*?)</div>', allNovelHtml, re.S)
            if len(maindiv) > 0:
                novel_info_list = re.findall(r'<a href="(.*?)">(.*?)<', maindiv[0], re.S)
                return novel_info_list
        return None

    def getEveryChapterUrl(self, novelUrl):
        novelUrl = self.domian_url + novelUrl
        chapterInfoHtml = self.getnovelRequestText(novelUrl)
        div = re.findall(r'<div id="list">(.*?)</div>', chapterInfoHtml, re.S)
        if len(div) > 0:
            allchapter = re.findall(r'<dt><b>.*?</dt>.*?</dt>(.*?)</dl>', div[0], re.S)
            if len(allchapter) > 0:
                chapter_info_list = re.findall(r"href='(.*?)'>(.*?)<", allchapter[0], re.S)
                return chapter_info_list
        return None

    def getchapterContentAndWrite(self, f, chapter_info_list):
        for chapter_info in chapter_info_list:
            chapter_url = self.domian_url + chapter_info[0]
            chapter_title = chapter_info[1]
            print(chapter_url, chapter_title)
            chapterHtml = self.getnovelRequestText(chapter_url)
            context = re.findall(r'<div id="content">.*?</p>.*?<br/>(.*?)<p>.*?</div>', chapterHtml, re.S)
            if len(context) > 0:
                afterTransContent = self.tranStr(context[0])
                self.writeFile(f, chapter_title, afterTransContent)

    def tranStr(self, context):
        context = context.replace('<br/>', '\n')
        context = context.replace('<br />', '\n')
        context = context.replace('&nbsp;', ' ')
        return context

    def openFile(self, novelName):
        return open(novelName, 'w', encoding='utf-8')

    def writeFile(self, f, chapter_title, context):
        f.write(chapter_title)
        f.write(context)

    def run(self):
        func_args = []
        for _, value in enumerate(self.NovelInfoList):
            if len(value) == 2:
                func_args.append(([self, value[0], value[1]], None))

        pool = threadpool.ThreadPool(100)
        requests = threadpool.makeRequests(novelSpider.threadFun, func_args)
        [pool.putRequest(req) for req in requests]
        pool.wait()

    def threadFun(self, novelUrl, novelName):
        nvoelPath = os.path.join(os.getcwd(), 'novelDir')
        f = self.openFile(os.path.join(nvoelPath, novelName + '.txt'))
        chapter_info_list = self.getEveryChapterUrl(novelUrl)
        if len(chapter_info_list) > 0:
            self.getchapterContentAndWrite(f, chapter_info_list)


if __name__ == '__main__':
    domian_url = 'http://www.yuetutu.com/'
    url = 'http://www.yuetutu.com/cbook_all.html'
    novelcollect = novelSpider(domian_url, url)
    novelcollect.run()
```

## Selenium：处理动态页面

现在很多网站都有反爬虫或前端渲染机制，这时单纯请求 HTML 往往拿不到真正内容，就需要使用 Selenium 模拟浏览器操作。

### 安装

```shell
pip install selenium
```

### 准备浏览器驱动

下载 ChromeDriver：<https://mirrors.huaweicloud.com/chromedriver/>

然后打开 Chrome，在地址栏输入：

```text
chrome://settings/help
```

查看浏览器版本，并下载对应版本的驱动。

---
title: 'django'
published: 2018-04-20
description: 'django 安装 django安装 创建项目 运行项目 不指定APP,就导出所有的数据 导入数据 django开发文档 https://docs.djangoproject.'
image: '/src/assets/blog-placeholder-1.jpg'
tags: ['python']
category: 'python'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# django

安装 django安装 创建项目 运行项目 不指定APP,就导出所有的数据 导入数据 django开发文档 https://docs.djangoproject.


## 安装

django安装

```
pip install Django
```


## 创建项目

```
django-admin startproject mysite
```


## 运行项目

```
python manage.py runserver
```

## 不指定APP,就导出所有的数据
```
python manage.py dumpdata [app] > app_data.json
```

## 导入数据
```
python manage.py loaddata app_data.json
```

## django开发文档


https://docs.djangoproject.com/zh-hans/3.0/


## 国际化

### setting配置

```
MIDDLEWARE_CLASSES = (
    ...
    'django.middleware.locale.LocaleMiddleware',
)

LANGUAGE_CODE = 'zh-Hans'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# 指定翻译所在目录
LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

LANGUAGES = [
    ("en", _("English")),
    ("zh-hans", _("Chinese")),
]
```

生成翻译的文件`注意，移动使用zh_hans,而不是zh-hans`

```
python manage.py makemessages -l zh_hans
python manage.py makemessages -l en
```

编译翻译文件

```
python manage.py compilemessages
```

### 第三方库国际化

创建软链接

```
ln -s <库的绝对路径> ./
```

使用以下命令生成翻译文件

```
python manage.py makemessages -l zh_hans --symlinks
python manage.py makemessages -l en --symlinks
```

然后执行翻译文件


## migrate回退

```
python manage.py migrate <app> <migrations script name>
```

`migrations script name` 可以是 0010_auto_20210412_0925 ，也可以是0010 `编号`

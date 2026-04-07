---
title: 'Redis：内存数据库'
published: 2020-02-03
description: '整理 Redis 的基础定位、常见数据类型、连接方式和常用命令，适合日常开发时快速回查。'
image: '/assets/desktop-banner/1.webp'
tags: ['数据库']
category: '数据库'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# Redis：内存数据库

![Redis 常见用途示意图](/assets/post-diagrams/redis-overview.svg)

Redis 是一个基于内存的 key-value 数据库，常用来做缓存、计数器、排行榜、消息队列等场景。

它的特点是：

- 读写速度快
- 支持多种数据结构
- 支持持久化
- 常用于高并发场景

## 常见数据类型

Redis 常见的数据类型有：

- String
- Hash
- List
- Set
- Zset（有序集合）

其中最常用的是 String、Hash、List。

## 连接 redis

如果本机已经安装了 redis，可以直接使用客户端连接：

```shell
redis-cli
```

如果需要指定主机和端口：

```shell
redis-cli -h 127.0.0.1 -p 6379
```

如果设置了密码：

```shell
auth password
```

## 常用操作

### 设置和获取 key

```shell
set name cooper
get name
```

### 判断 key 是否存在

```shell
exists name
```

### 删除 key

```shell
del name
```

### 查看所有 key

```shell
keys *
```

> 需要注意：在生产环境中不要随便使用 `keys *`，因为 key 很多时会阻塞服务。

### 设置过期时间

```shell
expire name 60
```

查看剩余过期时间：

```shell
ttl name
```

## 字符串操作

```shell
set count 1
incr count
decr count
append name _yuan
```

## Hash 操作

Hash 适合保存对象结构的数据。

```shell
hset user name cooper
hset user age 18
hget user name
hgetall user
```

## List 操作

List 常用来做队列。

```shell
lpush list1 a
lpush list1 b
rpush list1 c
lpop list1
rpop list1
lrange list1 0 -1
```

## Set 操作

Set 中的元素不能重复。

```shell
sadd myset a b c
smembers myset
srem myset a
```

## Zset 操作

Zset 在普通 Set 的基础上增加了 score，常用来做排行榜。

```shell
zadd rank 100 tom
zadd rank 90 jack
zrange rank 0 -1 withscores
zrevrange rank 0 -1 withscores
```

## 清空数据

删除所有 key：

```shell
# 删除当前数据库中的所有 key
flushdb

# 删除所有数据库中的 key
flushall
```

> 这两个命令很危险，执行前需要确认环境，避免误删。

## 常见问题

### redis 连接不上

可以先检查：

- redis 服务是否启动
- 端口是否正确
- 防火墙是否放行
- 是否设置了密码

查看 redis 进程：

```shell
ps -ef | grep redis
```

查看端口监听：

```shell
netstat -an | grep 6379
```

### 忘记 key 存了什么类型

可以先查看类型：

```shell
type keyname
```

## 总结

- Redis 是一个常用的内存数据库
- 常见数据类型有 String、Hash、List、Set、Zset
- 日常使用主要是增删改查和过期时间控制
- `flushdb` 和 `flushall` 这类命令要谨慎使用

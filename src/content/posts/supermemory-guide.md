---
title: 'Supermemory：让 AI 应用记住用户和上下文'
published: 2026-04-07
updated: 2026-10-17
description: '先认识它是什么、解决什么问题，再看现有助手和开发者两条接入路径。'
tags: ['supermemory', 'AI', 'RAG', 'Memory']
category: 工具
draft: false
pinned: false
comment: true
lang: 'zh-CN'
permalink: /supermemory/
sourceLink: https://github.com/supermemoryai/supermemory
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

Supermemory 是一个给 AI 应用用的长期记忆服务。你把对话、文档、资料存进去，它整理出关于用户的事实和偏好，等下次对话时再把合适的内容交回给 AI 参考。[1]

它针对的是没有跨会话记忆的应用：新开一轮对话，如果应用没有把过去的信息带回来，模型就不知道用户的偏好和近期情况。Supermemory 不替换对话模型，而是给应用补上保存、整理和找回这些信息的一层服务。[1]

<!--more-->

## 用一个旅行助手理解整个过程

假设你做了一个旅行规划的对话应用。

第一天，用户说："我更喜欢住安静的小旅馆，早上不爱早起。"应用把这句话交给 Supermemory。这一步是**存入**：服务接收原始内容，并承担后续的整理处理；支持的资料包括对话、纯文本、网页和 PDF。[13]

接下来，Supermemory 不只保存原话，还从中抽取事实，比如"用户喜欢安静的小旅馆""用户不爱早起"。这些抽出来的东西叫**记忆**（memory）。它同时会记住这些事什么时候成立、什么时候被后来的话推翻。[9][13]

几天后，用户问："帮我推荐个住的地方。"应用做**找回**：可以拿一句话去搜相关记忆，也可以直接读这个用户的**画像**（profile）。[7]

最后一步是**给 AI 参考**。画像就是持续整理的用户情况摘要。应用把画像和搜到的记忆一起交给模型，让它有机会接上过去的信息。[7] 模型仍可能理解错，记忆也需要更新，不是存过一次就永远正确。

这套流程里有两种东西容易混。**文档**是存进去的原始资料，比如酒店清单、攻略或一段对话。**记忆**是从内容里提炼的事实；在这个例子里，就是用户的住宿与作息偏好。查原始内容和取回提炼后的事实，是不同的用途。[9]

官方文档把两者的分工总结成一句话：检索原文资料的 RAG 回答"我知道什么"，记忆回答"我记得你什么"。[9] 这里的 RAG，指的是让模型先去资料库里找出相关段落、再据此作答的常见做法。

## 两条接入路径，先看你是哪一种

想给现有的 AI 助手加记忆，和给自己开发的产品加记忆，有不同的接法：前者可以使用 MCP，后者通常通过 API，也就是让程序用代码调用服务的接口。

**MCP 是助手连接外部服务的一种接口。** 支持 MCP 的助手可以连到 Supermemory 上，用你的账号存取记忆，你不用写代码。[10]

### 只想给现有助手加记忆

按官方说明把远程地址 `https://mcp.supermemory.ai/mcp` 加到兼容的助手客户端里，再通过浏览器登录并授权相应空间。[10] 这是连接方法介绍，本文没有替账号完成连接；接入后应实际检查一次保存与找回，而不只看客户端显示已连接。

这里的授权走 OAuth：你在浏览器里登录并确认一次，服务拿到一张有时效的通行证，不需要把 API key 交给助手。[10]

数据按**空间**（space）组织，用来集中放一组相关资料。官方说明把工具访问限制在授权空间内。[10] 助手可以调用搜索、读画像、保存或遗忘信息的工具，具体是否正确调用，仍取决于客户端和助手的执行。

有一件事要清楚：通过 MCP 存进去的内容进入的是 Supermemory 的托管服务，助手能碰哪些数据由连接时的授权决定。[10]

### 开发者接进自己的产品

开发者可以安装官方配套代码库（SDK，npm 或 pip 上的 `supermemory`），并在控制台 `console.supermemory.ai` 创建 API 密钥。[1][13] 密钥要保留在服务端或受保护的环境里，不应写进公开网页或代码仓库。

所有 API 请求用 Bearer token 鉴权。Bearer token 就是放在请求头里的一串凭证，代表"持有它的人可以访问"。如果要把访问权交给终端用户，就换成 scoped key：它被限制在一个或一组命名空间内，只能在这些空间里读写。[3]

**命名空间**（namespace）是服务用来分隔用户或项目数据的单位，写在请求的地址路径里。[4] 应按服务文档配置命名空间与密钥权限，不能只起一个不同名字就假定已完成权限隔离；本文也没有实测跨用户的隔离效果。

先认识三个常用接口即可，具体参数再按所用 SDK 版本的文档填写：[5][6][7]

| 接口 | 用来做什么 |
| --- | --- |
| `add` | 把一段原始内容交给服务处理 |
| `search` | 按问题找回相关记忆或文档片段 |
| `profile` | 获取某个用户持续维护的情况摘要 |

写入不是立即完成全部处理。请求被接收后，服务还要整理文档、生成记忆；不能刚调用 `add`，就假定紧接着的搜索或画像一定包含新信息。若下一步依赖新记忆，应按处理状态文档确认记忆已就绪，而不只是文档已就绪。[12][13]

存的时候给一个稳定的 `id` 很有用：它既是你的去重键，也是以后更新这条内容、查询处理状态的句柄。[5]

`search` 默认同时搜记忆和文档段落，也可以只搜其中一种；`profile` 不接受查询，返回的是持续维护的画像。[6][7]

## 画像里到底有什么

读一次画像会得到三段内容：[7]

| 字段 | 装的是什么 | 例子 |
| --- | --- | --- |
| `static` | 长期稳定的事实 | "用户是软件工程师""偏好深色界面" |
| `dynamic` | 近期上下文，每条带日期 | "[2026-10-02] 正在做项目 Alpha" |
| `buckets` | 按主题自定义分组的条目 | 按"偏好""目标"等分类 |

因为 `profile` 不接受查询，如果你还需要"跟这次问题最相关的记忆"，就在它旁边再发一次 `search`。[7]

## 试用时应该看什么

先看实际任务：用户表达新偏好后，信息有没有被存下；改口以后，旧偏好会不会继续影响回答；新开对话时，找回的信息是否真的相关。

项目主页有基准和性能宣传，但不能替代这些检查。[1] 旅行助手如果把过期住宿偏好当作现在的要求，即使检索很快，也没有解决你的问题。

## 不想用托管服务，也可以自行部署

Supermemory 也提供自托管版本，跑的是同一套记忆引擎，用一个二进制启动，默认监听本机 `localhost:6767`，SDK 指过去基本不用改代码。[11]

有个边界要说清楚：Connectors（把 Google Drive、Notion、Gmail 这类外部资料自动同步进来）和托管版 MCP 只在平台版提供，自托管版没有。[11] 自托管的记忆抽取用你自己接的模型，平台版用的是官方调优的长程模型，文档自称后者质量更高、规模化后更省，这同样是官方说法。[11]

## 怎样开始

- 只想给现有助手加记忆：装一个官方插件，或把 MCP 地址加进客户端。[1][10]
- 要写进自己的产品：`npm install supermemory` 或 `pip install supermemory`，拿一个 API key，先跑通"存一条、搜一条"。[2][13]
- 需要自行部署：评估本地版本，把 SDK 的 `baseURL` 指向自己的服务，并配置好模型与访问权限。[11] 自行部署不自动等于所有处理都不联网。

<details>
<summary>资料版本与本次核对范围</summary>

- 仓库 README 固定到提交 `00f48d0378cf2c536cfcd0bb628ad80c41d6f602`；官方文档各页读取于 2026-10-17。文档站没有 commit 概念，页面后续会变。
- 本文的接口说明按文档整理，没有连接真实服务运行，也没有验证真实写入、检索和画像的内容质量。旅行助手是说明性场景，不是跑过的实验。
- 供深入时参考的几个细节：写入请求返回时处理状态是 `queued`，这只代表请求被受理；文档分块就绪（`status: done`）不等于记忆就绪，记忆来自另一个叫 dreaming 的阶段。[13][12] 命名空间长度不超过 100 字符，只允许字母、数字、`-`、`_`、`:`。[4]
- 之前对公开端点做的无鉴权负向请求均返回 4xx，没有成功写入；这类请求无法证明写入与检索链路可用，因此不作为本文依据。

</details>

## Sources

[1] https://github.com/supermemoryai/supermemory/blob/00f48d0378cf2c536cfcd0bb628ad80c41d6f602/README.md — supermemory README (pinned 00f48d0)
[2] https://supermemory.ai/docs/quickstart — Quickstart
[3] https://supermemory.ai/docs/authentication — API keys & auth
[4] https://supermemory.ai/docs/concepts/container-tags — Namespaces
[5] https://supermemory.ai/docs/ingestion/add-memories — Ingesting context
[6] https://supermemory.ai/docs/recall/search — Search
[7] https://supermemory.ai/docs/recall/user-profiles — User profiles
[9] https://supermemory.ai/docs/concepts/memory-vs-rag — Memory vs RAG
[10] https://supermemory.ai/docs/supermemory-mcp/mcp — MCP overview
[11] https://supermemory.ai/docs/self-hosting/overview — Supermemory local
[12] https://supermemory.ai/docs/ingestion/document-operations — Document operations
[13] https://supermemory.ai/docs/concepts/how-it-works — How Supermemory works

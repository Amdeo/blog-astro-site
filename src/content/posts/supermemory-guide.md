---
title: 'supermemory：给 AI 用的长期记忆与上下文引擎'
published: 2026-04-07
description: '根据 supermemory 官方 README 整理，重点说明它到底解决什么问题、适合接在哪些 AI 工具和 AI 产品里，以及用 MCP / SDK 时最值得先记住的接入方式。'
image: '/assets/desktop-banner/2.webp'
tags: ['supermemory', 'AI', 'RAG', 'Memory']
category: 工具
draft: false
pinned: false
comment: true
lang: zh-CN
permalink: /supermemory/
sourceLink: https://github.com/supermemoryai/supermemory
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

# supermemory：给 AI 用的长期记忆与上下文引擎

> supermemory 官方最值得先记住的一句话是：**State-of-the-art memory and context engine for AI**。
>
> 如果翻成以后自己查资料最有用的话，就是：**supermemory 是一个给 AI 产品和 AI 助手补“长期记忆 + 用户画像 + RAG 检索 + 外部连接器”的统一上下文层。**

## 什么是 supermemory

supermemory 不是单独的大模型，也不是一个只做向量检索的小工具。

它更像一层专门给 AI 用的 **memory + context 基础服务**。它要解决的问题是：你的 AI 在跨会话时会忘事，用户偏好记不住，知识库检索和用户记忆是分裂的，接 Google Drive、Gmail、Notion、GitHub 这些外部数据源也很麻烦。

README 里把它拆得很清楚，它主要提供这几类能力：

- **Memory**：从对话里抽取事实，处理时间变化、矛盾、遗忘
- **User Profiles**：自动维护用户画像，分静态事实和动态上下文
- **Hybrid Search**：把 RAG 和 Memory 合并成一次查询
- **Connectors**：同步 Google Drive、Gmail、Notion、OneDrive、GitHub 等数据
- **File Processing**：处理 PDF、图片、视频、代码

所以以后如果自己再回来看这篇文章，先记一句话：

**supermemory 本质上是给 AI 增加“长期记忆 + 用户上下文 + 知识库检索 + 外部数据同步”的统一服务层。**

## 它到底解决了什么问题

### 1. AI 跨会话会忘事

很多 AI 产品的问题不是单轮回答不行，而是下一次对话就忘了：

- 用户喜欢什么
- 用户正在做什么项目
- 之前讨论过什么
- 哪些信息已经过期
- 哪些新事实推翻了旧事实

README 直接点名这一点：

**Your AI forgets everything between conversations. Supermemory fixes that.**

也就是说，它解决的是 **跨会话记忆断裂**。

### 2. 传统 RAG 不等于记忆

README 里有一句很关键：

**Memory is not RAG.**

RAG 做的是“从文档库里取相关片段”，它本质是无状态的；而 memory 做的是“跟踪用户事实随时间怎么变化”。

例如：

- 以前住在纽约
- 后来说搬去旧金山了

RAG 不会天然理解“新事实覆盖旧事实”，但 memory 系统需要处理这个问题。

supermemory 的价值就在于：**它把文档检索和用户记忆一起做了。**

### 3. 想做 AI 产品时，上下文栈太散

如果自己做 AI 产品，通常会遇到这些碎问题：

- 要不要单独配向量库
- embedding 流程怎么搭
- chunking 怎么做
- 用户画像怎么维护
- 文件怎么抽取
- 外部知识怎么同步
- 记忆和文档检索怎么合并

supermemory 的思路是：**把整套 context stack 一次性打包成一个系统。**

README 原话就很直接：

- No vector DB config
- No embedding pipelines
- No chunking strategies

所以它适合不想自己从零拼上下文系统的人。

## supermemory 用在哪些场景里

按 README，supermemory 其实分两种主用法。

### 场景一：给现成 AI 助手加记忆

如果你不是在开发 API，而是自己平时就在用 AI 工具，那么 supermemory 可以直接作为“个人记忆层”去用。

README 里对应的是：

- app
- browser extension
- plugins
- MCP server

也就是：**给现有 AI 助手接上持久记忆。**

### 场景二：给自己的 AI 产品加 memory / RAG / profile / connectors

如果你在做 AI agent、AI app、客服系统、知识助手、工作流产品，那 supermemory 更像后端能力层。

你可以把它理解成：

- 用户记忆系统
- 用户画像系统
- 混合检索系统
- 文件处理系统
- 外部数据同步系统

这些都通过同一套 API 给出来。

## 它接到哪些 AI 工具里

如果以后自己是按“直接用”这个角度看，最值得记的是它已经明确支持哪些客户端。

README 里写到的客户端有：

- Claude Desktop
- Cursor
- Windsurf
- VS Code
- Claude Code
- OpenCode
- OpenClaw

如果是插件实现，README 明确提到这三个开源插件：

- OpenClaw plugin：<https://github.com/supermemoryai/openclaw-supermemory>
- Claude Code plugin：<https://github.com/supermemoryai/claude-supermemory>
- OpenCode plugin：<https://github.com/supermemoryai/opencode-supermemory>

所以它不是一个“理论上的 memory 项目”，而是已经明确往实际 AI 工具里接的。

## 怎么把 supermemory 接进去

### 1. 直接装 MCP

README 给的最快方式是：

```bash
npx -y install-mcp@latest https://mcp.supermemory.ai/mcp --client claude --oauth=yes
```

如果不是 Claude，可以把 `claude` 换成：

- `cursor`
- `windsurf`
- `vscode`

这一条命令适合“先装上再说”。

### 2. 手动配 MCP

如果不想用安装器，也可以直接把它加进 MCP 客户端配置。

```json
{
  "mcpServers": {
    "supermemory": {
      "url": "https://mcp.supermemory.ai/mcp"
    }
  }
}
```

如果要用 API key：

```json
{
  "mcpServers": {
    "supermemory": {
      "url": "https://mcp.supermemory.ai/mcp",
      "headers": {
        "Authorization": "Bearer sm_your_api_key_here"
      }
    }
  }
}
```

### 3. 作为 App 直接用

如果不想写代码，README 说可以直接去：

- <https://app.supermemory.ai>

这条路适合先感受产品，而不是立刻集成。

## 接上以后先会得到什么能力

README 里把 MCP 工具写得很直接，这里值得保留下来。

### `memory`

保存或遗忘信息。
当你讲了值得记的内容时，AI 可以自动调用这个工具。

### `recall`

按查询词搜索相关记忆。
返回相关 memories 和用户 profile 摘要。

### `context`

把用户完整画像注入到对话开头。
在 Cursor 和 Claude Code 里可以直接用 `/context`。

如果以后只是想快速判断它值不值得接，这三个工具就已经足够说明问题了。

## 如果我是开发者，怎么接 API

如果不是给现成 AI 客户端接 MCP，而是自己做产品，那 README 给的最短路径是 SDK。

### 安装

```bash
npm install supermemory
# 或
pip install supermemory
```

### TypeScript 最小示例

```ts
import Supermemory from "supermemory";

const client = new Supermemory();

// 存一段内容
await client.add({
  content: "User loves TypeScript and prefers functional patterns",
  containerTag: "user_123",
});

// 一次拿到用户画像 + 相关记忆
const { profile, searchResults } = await client.profile({
  containerTag: "user_123",
  q: "What programming style does the user prefer?",
});
```

这个例子最重要的不是代码本身，而是它说明了调用形态：

1. 先 `add`
2. 再 `profile`
3. 同时拿到 **用户画像 + 记忆搜索结果**

### Python 最小示例

```python
from supermemory import Supermemory

client = Supermemory()

client.add(
    content="User loves TypeScript and prefers functional patterns",
    container_tag="user_123"
)

result = client.profile(container_tag="user_123", q="programming style")

print(result.profile.static)
print(result.profile.dynamic)
```

如果以后自己要评估语言栈，这里至少可以确认：**它同时支持 Node 和 Python。**

## 平时最值得先记的方法

README 里 API 很多，但如果从“以后自己查”的角度看，先记下面几类就够了。

### 1. 存内容

```ts
client.add()
```

用途：

- 存文本
- 存对话
- 存 URL
- 存 HTML

### 2. 拿用户画像

```ts
client.profile()
```

用途：

- 拿 static facts
- 拿 dynamic context
- 顺便按问题查相关记忆

### 3. 查记忆

```ts
client.search.memories()
```

适合：

- memory-only 搜索
- hybrid 搜索

### 4. 查文档

```ts
client.search.documents()
```

适合：

- 纯文档检索
- 配 metadata filter

### 5. 上传文件

```ts
client.documents.uploadFile()
```

适合：

- PDF
- 图片
- 视频
- 代码文件

### 6. 配置系统行为

```ts
client.settings.update()
```

适合：

- 调 memory extraction
- 调 chunking 行为

## supermemory 在工作流里处在哪一层

你可以把它放在这条链路里理解：

```text
你的应用 / AI 助手
        ↓
   supermemory
        ├── Memory Engine
        ├── User Profiles
        ├── Hybrid Search
        ├── Connectors
        └── File Processing
```

也就是说，supermemory 不是最上层 Agent，也不是最底层模型。

它更像中间那层 **context / memory service**：

- 上面接 AI 助手、Agent、聊天产品
- 下面接知识库、文件、外部数据源、画像系统

## 已经有的框架集成

如果以后是做产品接入，README 里列的框架集成值得直接记下来：

- Vercel AI SDK
- LangChain
- LangGraph
- OpenAI Agents SDK
- Mastra
- Agno
- Claude Memory Tool
- n8n

README 甚至给了这种包装方式：

```ts
import { withSupermemory } from "@supermemory/tools/ai-sdk";
const model = withSupermemory(openai("gpt-4o"), "user_123");
```

这说明它不是只给“自己手写 API 调用”准备的，也在往现成框架里嵌。

## 配置和检索模式里最值得记的点

### Search mode

README 提到两种很关键的模式：

- `hybrid`
- `memories`

例如：

```ts
const results = await client.search.memories({
  q: "how do I deploy?",
  containerTag: "user_123",
  searchMode: "hybrid",
});
```

`hybrid` 的意义在于：**一次查询同时拿知识库文档和用户记忆。**

### User profile

README 里强调 `profile` 很快，约 `~50ms`。

这意味着一个很实用的用法：**在系统提示词前，先注入用户画像。**

## 什么情况下值得上 supermemory

更适合下面这些情况：

- 你要做跨会话 AI 产品
- 你不想自己拼 memory + RAG + profile + connectors
- 你需要用户画像
- 你需要让 AI 记住用户偏好、项目、近期状态
- 你要接外部知识源，比如 Notion、Google Drive、GitHub、Gmail
- 你要同时处理文本、PDF、图片、视频、代码

## 什么情况下没必要急着上

如果你现在只是：

- 单轮问答
- 没有用户长期状态
- 不需要跨会话记忆
- 只做一个很轻的知识库检索
- 没有 connectors 需求

那 supermemory 可能暂时有点重。

这时候一个轻量 RAG 方案可能就够了。

## 和普通 RAG 工具相比，差别在哪

| 方案 | 更适合什么情况 | 局限 |
|---|---|---|
| supermemory | 既要知识检索，又要用户记忆、画像、连接器、文件处理 | 系统比单纯 RAG 更重 |
| 普通 RAG 方案 | 只做文档检索问答 | 不擅长长期用户记忆和事实更新 |
| 自己手拼 memory + vector DB + connectors | 控制权最高 | 工程成本高，维护复杂 |

## 总结

最后直接收成 5 条，方便以后查：

1. **supermemory 的核心定位**：给 AI 加“长期记忆 + 用户画像 + 混合检索 + 连接器”的统一上下文层。
2. **它主要解决的问题**：AI 跨会话会忘事，RAG 和 memory 分裂，外部知识同步麻烦。
3. **它的两种主用法**：一是给 Claude Code、Cursor、OpenClaw 这类工具接记忆；二是给自己的 AI 产品接 API。
4. **最值得先记的接入方式**：MCP 一键安装、手动 MCP 配置、SDK 安装。
5. **最关键的认知区别**：supermemory 不只是 RAG，它做的是“文档检索 + 用户记忆 + 用户画像”一起工作。

---
title: 'supermemory 接入核对：从鉴权、写入到可检索与清理'
published: 2026-04-07
updated: 2026-10-17
description: '按 v5 文档核对鉴权、命名空间、写入就绪与检索边界。'
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

接入 supermemory 最容易踩的坑，不是它记不住，而是你以为写完了。`add` 返回的 `status` 是 `"queued"`，这只说明请求被受理，不说明数据已经能被搜到。[2] 在这一步去查记忆，拿到的空结果和多轮之后才补上的画像，会被误读成“这个库不好用”。

这篇文章只走一条路径：开发者用官方 API 接入托管版 v5，从鉴权走到清理。每一步回答的其实是同一个问题——凭什么认为这一步真的生效了。

> 本文是文档核对型的接入解读。SDK 示例没有连接真实账号运行；本地验证只覆盖示例语法和控制流。另有无鉴权的负向 HTTP 探测，均得到 4xx，没有成功写入，它们不能证明写入与检索链路可用。

<!--more-->

## 先分清托管、SDK、MCP、自托管

这四样经常被当成一回事，混着谈就会得出错误结论。

| | 是什么 | 边界 |
|---|---|---|
| 托管平台 | `console.supermemory.ai` 管 key 和用量，`api.supermemory.ai` 提供 API | 目前唯一提供 Connectors 和托管 MCP 的形态[11] |
| SDK | 客户端封装。官方 TypeScript 与 Python 包都从 `5.0.0` 起是 v5 形态[8] | 早于 `5.0.0` 的版本仍是 v3/v4 形态，装错版本会按旧字段发请求[8] |
| MCP | 给现成助手用的远程服务，走 OAuth 授权[10] | 以 space 为单位，不给你程序化的 namespace 控制[10] |
| 自托管 | 同一个引擎跑在自己机器上，默认监听 `localhost:6767`[11] | Connectors 与托管 MCP 在自托管版没有[11] |

下面主线是开发者接托管 API。个人想让助手有记忆，走文末的 MCP 分支就行。

## 鉴权：Bearer token，和一把作用域更小的钥匙

所有 API 请求都用 Bearer token 鉴权，key 在 `console.supermemory.ai` 的 API Keys → Create API Key 生成，key 与用量都在这个控制台里。[3][2] 官方示例把它放进 `SUPERMEMORY_API_KEY`，值形如 `sm_...`。[2]

```bash
export SUPERMEMORY_API_KEY="sm_..."

curl -X POST "https://api.supermemory.ai/ns/user_123/document" \
  -H "Authorization: Bearer $SUPERMEMORY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"content": "Machine learning enables computers to learn from data"}'
```

要把访问权交给终端用户或第三方，就换成 scoped key：它被限制在一个或一组 namespace 内，只能在这些空间里读写，且不能读计费、不能管组织设置、不能继续签发新 key。[3] 这里有个该知道的历史包袱——文档在 v5 时代仍保留了旧名字：创建接口还是 `/v3/auth/scoped-key`，请求体里的字段也叫 `containerTag`。[3] 看到 v3 别急着“升级”，这就是当前文档的写法。

另一件容易误判的事：namespace 限定不等于只读。可写的 scoped key 照样能更新、删除文档和遗忘记忆；删除或迁移 namespace 才额外需要组织管理员或所有者权限。[3]

## namespace 不是命名习惯，是租户边界

v5 里 namespace 是 URL 路径段，不是请求体字段，而且一个请求只能碰一个 namespace。[4] 按官方架构说明，每个 namespace 使用独立的向量索引，在存储和检索层隔离，而非检索后再过滤。[4] 这是服务方的架构说明；本文没有进行跨租户隔离测试，接入时仍需在应用层绑定用户身份与获准访问的 namespace。

命名规则写在文档里：不超过 100 个字符，只允许字母、数字、`-`、`_`、`:`，匹配 `^[a-zA-Z0-9_:-]+$`。[4] 放行冒号是为了拼出层级结构，例如 `org:acme:user:john`。[4] 还有一条容易被忽略：默认的 `sm_project_default` 不能被永久删除。[4]

### 无鉴权负向探测看到了什么

下面是在 macOS 上对公开端点做的无鉴权负向请求观察。部分请求使用 POST，不能把方法本身叫作只读；这批请求均返回 4xx，没有成功写入，也没有发送个人资料。

| 请求 | 服务端返回 |
|---|---|
| `POST /ns/user%20123/document`（命名空间含空格） | `400`，`pattern: "/^[a-zA-Z0-9_:-]+$/"`，消息为 "containerTag may only contain alphanumeric characters, hyphens, underscores, and colons" |
| `POST /ns/{101 个字符}/document` | `400`，`maximum: 100`，消息为 "containerTag must be 100 characters or less" |
| `POST /ns/{100 个字符}/document` | `401`（命名空间校验通过，接着要求鉴权） |
| `POST /ns/org:acme:user:john/document` | `401`（层级命名合法） |
| `POST /ns/user_123/document`，body 为 `{}` | `400`，`path: ["content"]`，提示 content 应为 string |
| `POST /ns/user_123/search`，body 为 `{}` | `400`，`path: ["query"]` |
| `POST /ns/user_123/profile`，body 为 `{}` | `401` |
| 对上述 `/ns/...` 路由发 `GET` | `404`（这些是 POST 路由） |

```bash
# 上表第一行的负向请求：预期 400，无鉴权
curl -s -X POST "https://api.supermemory.ai/ns/user%20123/document" \
  -H 'Content-Type: application/json' -d '{"content":"x"}' -w '\n%{http_code}\n'
```

在这次探测的这些路由上，命名空间或请求体字段错误先得到 `400`，格式未被拒绝的请求随后得到 `401`。排查时，不能把所有失败都归为 API key 错误；这个观察也不代表所有端点、未来版本都采用相同校验顺序。错误文案仍使用 `containerTag`，与文档保留的旧命名相符。[4][8]

## 写入：`add` 返回 queued 只代表受理

v5 的写入调用是 `supermemory.add(namespace, { content, id, ... })`，namespace 是第一个参数，其余进请求体。[5] 返回体是 `{ id, status: "queued" }`。[2] `namespace` 与 `content` 必填，`id` 是推荐项：它既是你自己的去重键，也是后续更新、查询状态的句柄。[5]

处理状态依次是 `queued → extracting → chunking → embedding → done`，失败落到 `failed`。[12] 除 `done` 和 `failed` 之外都算还在跑。[12]

```ts
// 文档示例整理，未端到端执行
import { Supermemory } from "supermemory";

const supermemory = new Supermemory({ apiKey: process.env.SUPERMEMORY_API_KEY });

// 使用专用实验空间；不要把示例数据写进生产用户空间。
const namespace = "demo_2026_10_17";
const doc = await supermemory.add(namespace, {
  content: "User loves TypeScript and prefers functional patterns",
  id: "note_2026_10_17",
  dreaming: "instant", // 下一步就要读记忆时才用；每篇多计一次 operation [5]
});
// doc.status 在返回时是 "queued"，不是"已完成" [2]
```

## 能被检索，要跨两道坎而不是一道

这是整条链路上最容易误判的一处。

`status: "done"` 说明这个文档的分块已经进索引、可以被搜到。[13] 但记忆是第二个阶段产出的，这个阶段叫 dreaming。[13]

文档单独给了它一个状态字段 `system.dreamingStatus`，取值只有 `dreaming` 和 `done`，并且明确了 `system.status: "done"` 本身不代表记忆就绪。[12]

如果下一步要读记忆或画像，还要等 `dreamingStatus` 变成 `done`。[12] 该状态也可能表示这份内容不需要生成记忆，不保证结果一定非空。[12] 两种处理模式的区别是：

- `dynamic`（默认）：将相关文档凑成批次再生成记忆。文档称这有利于多轮、多文档场景，但新 namespace 可能暂时没有记忆或画像；本文没有对比两种模式的质量与等待时间。[5]
- `instant`：这篇文档单独立刻处理，处理完就能读；代价是每篇多计一次 operation，官方建议只用于演示、测试、调试和基准对比。[5]

写入时还有 `taskType: "superrag"`：只做分块、嵌入、索引，跳过事实抽取与画像更新。文档把它的 token 单价描述为默认 `"memory"` 模式的五分之一，这是服务方口径，不是本文核对过的账单。[5] 参考资料如果只需检索、不应影响用户画像，可以评估这条路径；这种文档不应再等待记忆生成。

```ts
// 文档示例整理，未端到端执行
async function waitForDocument<
  T extends { system: { status: string; dreamingStatus?: string } },
>(read: () => Promise<T>, waitForMemories = false): Promise<T> {
  for (let attempt = 0; attempt < 30; attempt++) {
    const current = await read();
    if (current.system.status === "failed") {
      throw new Error("Document processing failed");
    }
    if (
      current.system.status === "done" &&
      (!waitForMemories || current.system.dreamingStatus === "done")
    ) return current;
    if (attempt < 29) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw new Error("Document not ready within the polling budget");
}
```

这段等待最多查询 30 次，区分处理失败、分块就绪与记忆就绪，预算耗尽就报错，不会无限轮询。它不替代单次 HTTP 请求超时，也不实现限流重试；SDK 抛出的鉴权、网络等错误会直接向上传递。次数是示例预算，不是服务的完成时限承诺。

动手前值得先查一遍版本：Python SDK `5.0.0` 的模型里没有 `dreaming_status` 字段，TypeScript SDK `5.0.1` 也没有生成 `system.dreamingStatus` 类型，要升到 `5.0.2` 才有；在满足这些版本之前想监控记忆生成状态，只能直接看原始 HTTP 响应。[12]

## 取回：search 和 profile 回答的不是同一个问题

这两个调用常被当成“一个带 query、一个不带 query 的同一个东西”，其实检索面不同。

`supermemory.search(namespace, { query, searchMode })` 做语义检索，默认模式 `hybrid`，同时搜记忆和文档分块。[6] 返回结果里两种内容只会出现其一：命中记忆时有 `memory` 字段，命中文档分块时有 `chunk` 字段，代码要按字段存在与否分支。[6] 从 v4 迁过来的要格外注意默认值已经变了：`searchMode` 从 `memories` 变成 `hybrid`，`threshold` 从 `0.6` 变成 `0.3`。[6]

`supermemory.profile(namespace)` 完全不接受 query，返回的是持续维护的画像：`static`、`dynamic`、`buckets` 三段。[7] 需要按 query 排序的记忆，就在它旁边再发一次 search。[7] 官方文档把两条路的分工概括成一句话：RAG 回答"我知道什么"，记忆回答"我记得你什么"。[9]

| 你的问题 | 要调用的东西 |
|---|---|
| 文档里写了什么 | `search` + `searchMode: "chunks"`[6] |
| 这个人是谁、有什么偏好 | `profile`[7] |
| 与他相关的历史记忆 | `search` + `searchMode: "memories"`[6] |
| 画像与按 query 检索的结果都要 | `profile` 加 `search` 两次调用[7] |

接着前面的写入，下面展示等待记忆处理完成后检索；它仍是未连接真实服务的文档示例。SDK 至少要暴露 `system.dreamingStatus`，再使用这一判断。[12]

```ts
await waitForDocument(
  () => supermemory.documents.get(namespace, doc.id),
  true,
);
const found = await supermemory.search(namespace, {
  query: "TypeScript functional patterns",
  searchMode: "hybrid",
  limit: 5,
});
for (const hit of found.results) {
  if ("memory" in hit) console.log("memory", hit.memory);
  else if ("chunk" in hit) console.log("chunk", hit.chunk);
}
```

验收不能停在请求返回成功：应在正确 namespace 里看到与刚写入内容相关的结果；为空时先查状态、模式与筛选条件。相关性命中也不等于内容已经核实，仍应保留原文作为依据。

## 清理示例数据

实验数据和生产记忆混在同一个 namespace，是后面最难拆的麻烦。清理有两个粒度。

删文档用 `supermemory.documents.delete(namespace, { ids: [...] })`，一次 1 到 100 个。[12] 三个坑：只有 `done` 或 `failed` 状态的文档能删，还在处理的会被报成 `Document is still processing`；HTTP 成功也可能包含部分失败，要同时看 `count` 和每个 ID 的 `errors`；派生于被删文档的记忆会被遗忘。[12]

要清掉整个实验空间，用 `supermemory.namespaces.delete(namespace)`，连同其中的文档和记忆一起删，而且不可恢复。[12] 删除或迁移 namespace 需要组织管理员或所有者权限，默认的 `sm_project_default` 不能永久删除。[4]

所以更省事的做法是：一开始就把示例数据关进一个专门的 namespace，而不是事后从生产空间里挑。

## 几个具体的失败模式

**拿 v4 的写法发 v5 请求。** `containerTag` 不再是请求体字段，改成 URL 路径，而且 v5 不提供别名。官方把这次变更定义为破坏性迁移：字段位置变了、检索默认值变了、响应封装也变了。[8]

**用 `status === "done"` 判断“记忆可用”。** 还要看 `dreamingStatus`。[12]

**把版本号塞进路径。** v5 的应用路由不带版本前缀，`/v5/reference` 是交互式文档入口，不是 API 路径前缀。[8]

**以为接上 MCP 就等于接上了 API。** MCP 用 space + OAuth，程序化接入用 namespace + key，是两套东西。[10]

## 分支一：个人给助手加记忆，走 MCP

如果目标是给现有助手加跨会话记忆，可以在支持远程 MCP 与 OAuth 的客户端中接入 `https://mcp.supermemory.ai/mcp`，再完成授权。[10] 它用 OAuth，连接时客户端会打开浏览器让你登录并选择授权哪些 space，不需要 API key，也不需要自定义 header。[10]

两个和旧资料对不上的地方。组织数据的单位是 **space**，不是 namespace。[10] 工具也不是早期文档里的那三个，现在的集合包括 `search_memory`、`get_profile`、`add_memory`、`list_documents`、`get_document`、`list_memories`、`list_spaces`、`who_am_i`。[10] 存和忘共用一个工具：`add_memory` 默认保存，把 `action` 设为 `forget` 才是遗忘，没有单独的遗忘工具。[10]

另外，本次对 MCP 端点发起的未鉴权只读请求返回 `401`，与“连接需要先完成 OAuth”一致。

## 分支二：自托管

自托管跑的是同一个引擎，接口也相同：把 `baseURL` 指到 `http://localhost:6767`，代码基本不用改。[11] 本地默认带嵌入模型，不需要额外的 API key，也可以完全离线，把模型指向本地推理服务。[11] 数据集中在一个目录里，便于备份或迁移。[11]

边界必须说清楚：**Connectors（Google Drive、Notion、Gmail、OneDrive 等）和托管 MCP 只在平台版提供**，自托管没有。[11] 另外自托管的记忆抽取用的是你自己接的模型，平台版用的是官方调优过的长程抽取模型，文档自称后者质量更高、规模化后更省——这是官方口径，不是我的对比测试结果。[11]

## 验证范围与资料版本

- **文档依据：** 仓库 README 固定到提交 `00f48d0378cf2c536cfcd0bb628ad80c41d6f602`[1]；官方文档各页读取于 2026-10-17。文档站没有 commit 概念，页面后续会变。
- **实际执行：** 无鉴权负向 HTTP 探测均返回 4xx，结果摘录在上文。另外做了本地离线语法与控制流检查，包括命名空间规则、轮询的失败/成功/预算耗尽分支和 memory/chunk 字段分支。这些检查使用合成夹具，不是服务端成功响应。
- **未验证：** 任何需要鉴权的行为——真实写入、`done` 与 `dreamingStatus` 在真实负载下的时序、检索与画像的内容质量、删除的级联效果、计费与限流、并发与延迟。文中 SDK 代码块是按文档整理的示例，没有跑通。
- **官方自述，未复现：** README 提到用户画像约 `~50ms`，以及长记忆基准上的召回率与上下文压缩比。[1] 这些是官方给出的数字，既不是我的实测，也不构成你在自己网络下的延迟承诺。
- **文档口径有冲突：** 检索文档页写着“目前还没有 v5 Python SDK，Python 标签展示的是旧客户端”[6]，迁移文档页则说 Python SDK 从 `5.0.0` 起就是 v5 形态[8]。两页当前不一致，以你实际安装到的版本行为为准。

## Sources

[1] https://github.com/supermemoryai/supermemory/blob/00f48d0378cf2c536cfcd0bb628ad80c41d6f602/README.md — supermemory README (pinned 00f48d0)
[2] https://supermemory.ai/docs/quickstart — Quickstart
[3] https://supermemory.ai/docs/authentication — API keys & auth
[4] https://supermemory.ai/docs/concepts/container-tags — Namespaces
[5] https://supermemory.ai/docs/ingestion/add-memories — Ingesting context
[6] https://supermemory.ai/docs/recall/search — Search
[7] https://supermemory.ai/docs/recall/user-profiles — User profiles
[8] https://supermemory.ai/docs/migration/api-v5 — Migrate v3/v4 to v5
[9] https://supermemory.ai/docs/concepts/memory-vs-rag — Memory vs RAG
[10] https://supermemory.ai/docs/supermemory-mcp/mcp — MCP overview
[11] https://supermemory.ai/docs/self-hosting/overview — Supermemory local
[12] https://supermemory.ai/docs/ingestion/document-operations — Document operations
[13] https://supermemory.ai/docs/concepts/how-it-works — How Supermemory works

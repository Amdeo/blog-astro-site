---
title: 'AI Agent 开发学习路线：从工具调用到多 Agent'
published: 2026-04-15
description: '按 Anthropic、OpenAI、MCP 官方文档和 LangGraph 文档整理一条 AI Agent 开发学习路线。重点不是概念堆砌，而是先学什么、为什么学，以及做到什么程度算过关。'
tags: ['AI Agent', 'MCP', 'OpenAI', 'Anthropic', 'LangGraph', 'Eval']
category: 'AI 工具'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
licenseName: 'CC BY-NC-SA 4.0'
licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
---

# AI Agent 开发学习路线：从工具调用到多 Agent

如果以后我自己回来复习这篇，先记住下面三句话：

1. **Agent 不是“会聊天的大模型”本身，而是一个带 instructions、tools、context、memory、guardrails 和 runtime 的执行系统。**
2. **不要一上来就堆多 agent。先把单轮调用、workflow、单 agent 跑稳，再谈 handoff 和 orchestrator。**
3. **真正决定 agent 能不能上线的，不只是 prompt，而是工具设计、状态管理、评测、审批和安全边界。**

## 先把“agent”理解对

Anthropic 在《Building Effective AI Agents》里把两件事分得很清楚：

- **workflow**：LLM 和工具走预先写好的代码路径
- **agent**：LLM 动态决定下一步做什么、调用什么工具、是否交给别的 agent

OpenAI Agents SDK 的定义也很实用：一个 agent，本质上就是一个配置好的 LLM，它有：

- instructions
- tools
- context
- handoffs
- guardrails
- structured outputs
- lifecycle hooks

所以以后如果脑子里又把 agent 想成“一个神奇的万能体”，就把它拉回来：

**agent 开发更像是在做一套可执行的软件系统，而不是在堆一个华丽 prompt。**

## 为什么别一上来就多 agent

这件事官方文档其实态度很一致。

Anthropic 的建议是：**先用最简单的方案，只有在复杂度确实带来收益时再加 agentic 结构。**

OpenAI 在评测文档里也把系统复杂度分成：

- 单轮模型调用
- workflows
- single-agent
- multi-agent

并明确说了一点：**是否要上 multi-agent，应该由 eval 结果驱动，而不是由“听起来更高级”驱动。**

这点非常重要。因为很多人学 agent 时最容易犯的错误不是不会写，而是：

- 还没把工具调用写稳，就想做 handoff
- 还没建立评测，就开始堆多个 agent
- 还没定义审批边界，就让 agent 连外部系统

最后就会得到一个“看起来很聪明，但行为很难预测”的系统。

## 我建议的学习顺序

下面这条路线，核心是**从确定性强的东西，逐步走向开放性更高的东西**。

### 第 1 阶段：单轮调用、结构化输出、函数调用

这一阶段先别急着做 agent，先把最基础的控制面学扎实。

重点学这些：

- system / developer instructions 怎么写
- structured outputs / JSON 输出怎么约束
- function calling / tool schema 怎么设计
- 什么任务适合直接一次调用解决
- 什么任务必须拆成多步

这一阶段的目标不是“做出一个智能体”，而是先搞懂：

- 模型什么时候该自由输出
- 什么时候必须走结构化输出
- 工具参数应该设计成什么样，模型才不容易出错

做到下面这样，就算过关：

- 你能做一个稳定返回 JSON 的抽取器
- 你能给模型挂一个或两个工具，并验证它能选对工具、传对参数
- 你知道什么时候应该禁止模型自由发挥

### 第 2 阶段：workflow 模式

在 Anthropic 的文章里，workflow 是进入 agent 之前最值得先学的层。

最常见的几种 workflow：

- **prompt chaining**：一步接一步
- **routing**：先分类，再走不同分支
- **parallelization**：并行处理多个子任务
- **evaluator-optimizer**：先生成，再反思迭代

这一层的重点不是“自治”，而是**把复杂任务拆成一组可控的小任务**。

如果你现在还没法稳定做出一个 routing 或 evaluator-optimizer 流程，那直接上 autonomous agent 往往只会让调试更痛苦。

做到下面这样，就算过关：

- 你能把一个复杂任务拆成几个固定步骤
- 你会在中间加 gate / checker，而不是一路盲跑
- 你能说清楚每一步为什么存在，失败后应该怎么回退

### 第 3 阶段：single-agent

这时才开始学真正的单 agent 运行时。

OpenAI Agents SDK 文档里，这一层最值得先记的是几个核心对象：

- `instructions`
- `tools`
- `context`
- `output_type`
- `guardrails`
- `hooks`
- `tool_choice`

这一层你要开始处理的问题，不再只是“模型说什么”，而是：

- agent 怎么读状态
- agent 怎么调工具
- 工具结果要不要再回给模型
- 什么输出必须过 guardrail
- 哪些事件要记录进 tracing / logs

做到下面这样，就算过关：

- 你能做出一个单 agent 循环，能根据上下文选择工具
- 你能记录它每一步调了什么工具、为什么结束
- 你知道 tool result 什么时候该直接返回，什么时候该再让模型整理

### 第 4 阶段：MCP

MCP 这一层非常值得单独学，因为它解决的是“怎么把外部能力标准化接进 agent”。

MCP 官方文档里最核心的几个概念是：

- **Host**：Claude Code、VS Code、ChatGPT 这类 AI 应用
- **Client**：Host 里负责和某个 MCP Server 建连接的部分
- **Server**：暴露工具、资源、提示模板的程序
- **Primitives**：
  - tools
  - resources
  - prompts

还有两个 transport 要先记住：

- **stdio**：本地进程间通信，适合本机服务
- **Streamable HTTP**：适合远程服务

OpenAI 的 MCP 文档则更偏实战，重点提醒了几件事：

- remote MCP server 一定要做信任审查
- 默认应该保留 approval
- 用 `allowed_tools` 缩小暴露面
- 大量工具时可以延迟加载，减少 token 和延迟

这一阶段最重要的不是“接得上”，而是**接得安全**。

做到下面这样，就算过关：

- 你能区分本地 MCP 和远程 MCP
- 你能把一个 stdio server 接进 agent
- 你能给远程 MCP 配审批和 allowlist，而不是默认全放开
- 你知道 prompt injection 在 MCP 场景下为什么更危险

### 第 5 阶段：编排、长任务、人工介入

到了这里，再去理解 multi-agent 和长任务编排会自然很多。

OpenAI Agents SDK 里最常见的两种多 agent 结构是：

- **manager / agents-as-tools**
- **handoffs**

LangGraph 则更强调运行时基础设施：

- durable execution
- streaming
- human-in-the-loop
- memory
- tracing / observability

如果把前面的路线串起来看，LangGraph 更像是：

**当你的 agent 已经不再是一次调用，而是会跑很多步、会暂停、会失败重试、会等待人工确认时，用来托底的 orchestration runtime。**

做到下面这样，就算过关：

- 你能说明 manager 和 handoff 分别适合什么场景
- 你能让任务在中断后恢复，而不是从头再来
- 你会把高风险动作挂到人工审批上

### 第 6 阶段：评测、日志和安全

这一步经常被忽略，但它实际上决定你写的是 demo 还是系统。

OpenAI 的评测最佳实践里，有几个点非常值得长期记：

- eval-driven development
- log everything
- task-specific evals
- human feedback calibration
- continuous evaluation

而且它明确提醒：随着架构从单轮变成 workflow、single-agent、multi-agent，系统里的 nondeterminism 会越来越多。你要评测的对象也会从：

- 输出质量
- 指令遵循
- 工具选择
- 参数抽取

进一步扩展到：

- handoff accuracy
- circular handoff
- long context failure
- edge cases
- adversarial inputs

这一阶段做到下面这样，就算真正开始进入工程化：

- 你有一套固定 eval 数据集
- 你会评工具选择和参数提取，不只评最终回答
- 你会把日志和用户反馈变成新的 eval case
- 你知道哪些动作必须审批，哪些数据绝不能出上下文边界

## 这套知识库里建议怎么学

如果后续我自己就是打算靠这个知识库来系统学习 agent 开发，我建议按下面顺序读。

### 先读已有文章

先把这几个本地主题串起来：

- `Graphify`
- `RTK`
- `OpenCLI`
- `supermemory`
- `superpowers`

它们分别对应：

- 知识组织
- CLI 工具代理
- 浏览器 / 网站能力接入
- 长期记忆
- 编码 agent 的流程化开发

### 再读这次新增的 raw 学习笔记

新增的 `raw/agent-learning/` 里，我会放几份官方资料摘要，分别负责不同层面：

- Anthropic：agent 模式和复杂度边界
- MCP 官方：协议架构
- OpenAI Agents SDK：单 agent 和 MCP 接入
- OpenAI eval：如何测 single-agent 和 multi-agent
- LangGraph：长任务编排和可恢复运行时

### 最后用 graphify 反复追问

后面学习时，可以直接围绕这些问题去查：

- agent 和 workflow 的边界是什么
- handoff 和 manager 模式怎么选
- MCP 的 tools / resources / prompts 分别有什么用
- 为什么 eval 必须覆盖 tool selection 和 handoff accuracy
- 什么时候才值得上 multi-agent

## 推荐的实战顺序

如果只是学习，不想空转，我建议按下面三个项目练：

### 1. 文档问答 agent

目标：

- 本地文档检索
- 两三个工具
- 结构化输出
- 基础 eval

这会逼你先把最基础的 tool loop、上下文和输出控制做好。

### 2. 带审批的个人助理

目标：

- 接一个本地 MCP server
- 接一个远程 MCP / connector
- 高风险动作必须 approval

这会逼你真正面对安全边界，而不是只在本地自娱自乐。

### 3. 编码 agent / 研究助理

目标：

- 拆步骤
- 子任务编排
- 记忆 / tracing
- 失败恢复
- eval 回归

这一步最能暴露工程问题，也最能逼你把“agent 开发”从玩具变成系统。

## 这一轮最值得记住的结论

最后浓缩成一句话：

**agent 开发的学习顺序，应该是“工具调用 → workflow → single-agent → MCP → orchestration → eval & safety”，而不是“上来就多 agent”。**

如果这条顺序不乱，后面无论你继续学 OpenAI Agents SDK、Claude 生态、MCP Server、LangGraph，还是做自己的 agent runtime，都会顺很多。

## 参考来源

- Anthropic: <https://www.anthropic.com/engineering/building-effective-agents>
- MCP 官方介绍: <https://modelcontextprotocol.io/introduction>
- MCP 官方架构: <https://modelcontextprotocol.io/docs/learn/architecture>
- OpenAI Agents SDK: <https://openai.github.io/openai-agents-python/agents/>
- OpenAI Agents SDK MCP: <https://openai.github.io/openai-agents-python/mcp/>
- OpenAI MCP and Connectors: <https://developers.openai.com/api/docs/guides/tools-connectors-mcp>
- OpenAI Evaluation Best Practices: <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- LangGraph Overview: <https://docs.langchain.com/oss/python/langgraph/overview>

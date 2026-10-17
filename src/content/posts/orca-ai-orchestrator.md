---
title: 'Orca 与 git worktree：多 Agent 并行之后，代码怎样合回去'
published: 2026-08-05
updated: 2026-10-17
description: '区分方案竞赛与分工接力，用可运行的 Git 示例讲清工作树隔离、提交交接和合并验收。'
tags: ['AI编程', '开源工具', 'Agent编排']
category: 'AI/编程'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://github.com/stablyai/orca'
---

让两个 AI 编程助手同时修改一个仓库，首先遇到的往往不是模型能力问题，而是工程问题：它们会不会覆盖彼此的文件？测试跑的是谁的代码？两个分支分别通过，合起来还能不能工作？

Orca 把多个 CLI agent、工作区、终端和 diff 集中管理，底层的重要支点是 `git worktree`。[1][2] 但有了多个工作区，不代表任务依赖和结果验收会自动解决。理解这两层的区别，比记住它支持多少工具更有用。

<!--more-->

> 本文是机制解读与工作流示例，不是 Orca 客户端体验评测。文中的 Git 与 Node.js 示例已在临时仓库实际运行；没有据此宣称多个 AI 已完成自动协作。

## 工作树隔离了什么，没有隔离什么

Git 允许同一仓库关联多个工作树。每个工作树有自己的检出文件、`HEAD` 和索引；Git 对象库及部分仓库状态仍然共享。它提供的是不同的工作目录，不是不同的操作系统文件系统，更不是权限沙箱。[3]

```text
同一 Git 仓库
├── main/    主分支工作区
├── impl/    实现分支工作区 → agent A
└── review/  验收分支工作区 → agent B
```

这能降低两个 agent 在同一目录里混写未提交改动的风险，但也意味着：**A 在自己的工作树里改完文件，B 不会因此自动看到这些改动。** 交接仍需要明确的提交或其他同步机制。

Orca 官方文档把工作区绑定到起始引用、分支、文件和 agent 终端，并提供创建、工作、审查、交付、清理的生命周期。起点可以是基础分支、其他本地分支或具体提交。[2] 这些能力方便组织工作，但应先决定自己需要哪一种协作模式。

## 多方案竞赛和分工接力，不是同一件事

**多方案竞赛**是让几个 agent 从同一个基线出发，解决同一个任务。Orca README 描述的“一条提示分发给多个 agent，再比较并选择结果”，就是这种模式。[1] 各方案应该接受同一套验收，最后选一版，而不是把所有 diff 都合进去。

**分工接力**则有依赖：实现 agent 产出代码，验收 agent 检查这份实现。验收方可以提前按接口约定编写测试，但运行测试前，必须拿到待验收的具体提交。否则测试的可能仍是旧代码。

一种可检查的交接方式是：

```text
约定接口与验收标准
├── 实现方：修改代码 → 提交实现
└── 验收方：编写测试 → 提交测试
                         ↓
              同步实现提交，检查 diff
                         ↓
              在组合后的代码上运行验收
                         ↓
              集成到主分支，再跑回归
```

这里允许并行准备，但不能跳过依赖。交接物应包含基线、提交、接口变化和验证结果，不能只有一句“我写好了”。

## 一个可以复现的提交交接实验

下面不用安装 Orca，也不调用模型，只用 Git 和 Node.js 演示它所依赖的工作树机制。准备一个全新目录，确保 Git 已配置提交身份，Node.js 支持 `node --test`。实验不连接远端，也不修改已有项目。

任务是实现分页参数 `parseLimit(raw)`：未传值时返回 `20`；接受 `1` 到 `100` 的十进制整数字符串；非法输入抛出 `RangeError`。

### 1. 建立共同基线

```bash
mkdir orca-demo
cd orca-demo
git init -b main main
cd main
```

在当前目录创建 `limit.cjs`，先放入一个故意未完成的实现：

```js
module.exports = { parseLimit: () => 20 };
```

提交基线，再创建两个工作树。以下 shell 命令始终从 `main/` 目录执行：

```bash
git add limit.cjs
git commit -m "chore: seed pagination example"
git worktree add -b impl ../impl main
git worktree add -b review ../review main
git worktree list
```

### 2. 实现和验收分别准备产物

把 `../impl/limit.cjs` 改为下面的实现。先验证完整字符串，再转数字，避免 `parseInt('10abc')` 这类宽松解析悄悄接受错误输入。

```js
function parseLimit(raw) {
  if (raw === undefined) return 20;
  if (typeof raw !== 'string' || !/^[0-9]+$/.test(raw)) {
    throw new RangeError('limit must be an integer from 1 to 100');
  }
  const limit = Number(raw);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new RangeError('limit must be an integer from 1 to 100');
  }
  return limit;
}

module.exports = { parseLimit };
```

```bash
git -C ../impl add limit.cjs
git -C ../impl commit -m "feat: validate pagination limit"
```

与此同时，在 `../review/limit.test.cjs` 中准备验收。测试覆盖默认值、正常输入、混合字符串、边界和越界；这不是完整的生产输入测试集。

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseLimit } = require('./limit.cjs');

test('missing limit defaults to 20', () => {
  assert.equal(parseLimit(undefined), 20);
});

test('numeric query is parsed', () => {
  assert.equal(parseLimit('10'), 10);
});

test('mixed input is rejected', () => {
  assert.throws(() => parseLimit('10abc'), RangeError);
});

test('both boundaries are accepted', () => {
  assert.equal(parseLimit('1'), 1);
  assert.equal(parseLimit('100'), 100);
});

test('out-of-range values are rejected', () => {
  assert.throws(() => parseLimit('0'), RangeError);
  assert.throws(() => parseLimit('101'), RangeError);
});
```

这时运行：

```bash
node --test --test-reporter=tap ../review/limit.test.cjs
```

本次运行是 **1 项通过、4 项失败，退出码为 1**。这是预期结果：虽然实现工作区已经提交了正确代码，验收工作区仍在使用共同基线里那个始终返回 `20` 的旧实现。

### 3. 明确同步提交，再验收组合结果

```bash
git -C ../review add limit.test.cjs
git -C ../review commit -m "test: define pagination acceptance checks"

IMPLEMENTATION=$(git -C ../impl rev-parse HEAD)
git -C ../review cherry-pick "$IMPLEMENTATION"
git -C ../review diff main..HEAD -- limit.cjs limit.test.cjs
node --test --test-reporter=tap ../review/limit.test.cjs
```

本次同步后，Node.js 的测试汇总为：

```text
# tests 5
# pass 5
# fail 0
```

这个实验中实现方只有一个提交，所以同步一个 SHA 就够了。真实任务可能涉及多个有依赖的提交，必须先检查提交范围和前置条件；发生冲突应停下来处理，不能把“cherry-pick 已开始”当成“交接已完成”。

### 4. 合回主分支后再跑一次

```bash
git merge --ff-only review
node --test --test-reporter=tap limit.test.cjs
```

本次主分支同样是 **5 项通过、0 项失败**。`--ff-only` 在这里能成功，是因为主分支仍停在共同基线，没有额外分叉。实际项目若主分支已经前进，需要按项目约定整合最新基线，并在整合结果上重跑测试，而不是强推覆盖。

确认改动已保留、两个工作树没有未提交内容后，可从 `main/` 清理演示工作树：

```bash
git worktree remove ../impl
git worktree remove ../review
```

Git 的这两个命令只移除工作树，分支仍保留。[3] 不要把清理工作目录和删除分支混为一谈。

## 放到 Orca 里，还要处理哪些真实约束

上面的 `impl` 和 `review` 可以对应 Orca 中的两个工作区。官方文档允许选择共同基线，也允许从已有分支或具体提交创建工作区；普通 Git 操作仍然适用。[2] 这不表示必须照搬实验里的所有命令，而是要求交接时能回答：**从哪个基线开始，审的是哪个提交，验证的是哪份组合结果。**

此外，还有三类工作树本身不会解决的问题：

- **依赖与忽略文件。** 新工作树是干净检出，`node_modules`、缓存和本地配置通常不会随提交出现。Orca 提供共享路径、`worktree.sharedDirectories` 和 `.worktreeinclude` 等机制。[2] 共享链接可能让多个工作区实际使用同一份依赖目录，依赖版本不同的任务不宜盲目共享；生产密钥也不该因为“方便启动”就复制给所有 agent。
- **运行中的服务。** 工作目录分开，不代表端口、数据库、对象存储和外部账号分开。两个 agent 启动服务时，需要明确各自的端口、测试数据和可访问范围。涉及不可信代码时，应另配权限限制或沙箱，不能把 worktree 当作安全措施。
- **集成责任。** 固定一个集成角色检查接口变化、组合 diff 和验证结果，避免多个 agent 同时改主分支。本例只测了一个纯函数；真实项目仍需要自己的构建、回归与集成检查，不能拿“分支各自通过”替代最终验收。

## 什么时候值得引入 Orca

如果你经常同时维护多个独立任务，需要反复切换目录、agent 终端和 diff，Orca 的集中工作区管理有明确用途。如果一个任务依赖很强，实际只有一条实现路径，单 agent 实现加一次独立审查往往更直接。这是基于工作流的选型建议，不是吞吐量评测结论。

判断是否需要它，可以先拿一个小任务检查：你花时间最多的究竟是管理多个工作区，还是需求不清、测试不足、提交无法交接？前者适合评估 Orca；后者要先补工程约定，否则只是把混乱放进了更整齐的界面。

## 验证范围与资料版本

- **修订日期：2026-10-17。** 原发布日期保留，删除了缺少历史快照的 star 数及未经验证的体验式推荐。
- **文档依据：** Orca README 与工作树文档固定到提交 `dd3bbf680e80527f5e11f4a0bf0cd89f2e4ecb5b`；界面、菜单与功能可能继续变化。
- **实际执行：** macOS、Git `2.50.1`、Node.js `v26.11.1`，验证了工作树创建、同步前失败、提交交接、同步后通过与主分支整合后通过。
- **未验证：** Orca GUI、模型调用、并行性能、真实 HTTP 服务、数据库隔离与生产安全性。这个实验说明提交交接为何必要，不证明某个编排工具或 AI 方案更优。

## Sources

[1] https://github.com/stablyai/orca/blob/dd3bbf680e80527f5e11f4a0bf0cd89f2e4ecb5b/README.md — orca-readme
[2] https://github.com/stablyai/orca/blob/dd3bbf680e80527f5e11f4a0bf0cd89f2e4ecb5b/docs/site/content/docs/model/worktrees.mdx — orca-worktrees
[3] https://git-scm.com/docs/git-worktree — Git worktree documentation

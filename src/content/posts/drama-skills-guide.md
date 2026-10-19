---
title: 'Drama Skills：把 AI 短剧产线装进编程 Agent 的 11 个技能'
published: 2026-10-19
description: '开源短剧/漫剧 skill 集：11 个技能串起从原著到成片的产线'
tags: ['Agent Skills', 'AI 短剧', '开源项目', '提示词工程']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
sourceLink: 'https://github.com/zenstory-ai/drama-skills'
---

做 AI 短剧或漫剧的人常常卡在同一处：剧本、角色设定、分镜、图片提示词、视频提示词散在四五个工具里，改一处就得手动同步另外几处，人物到第二集就"长歪"了。**Drama Skills** 是 zenstory-ai 开源的一套 Agent Skill 合集，把这套流程拆成 11 个技能，直接装进你在用的编程 Agent（Claude Code、Codex 以及其他支持 Agent Skill 规范的环境），用文件而不是图形界面来推进项目。[3]

它适合三类人：做短剧/漫剧的编剧和编导、需要批量产出的工作室，以及想把这套产出接进自己管线的开发者。它不训练模型、也不提供额度，写作交给 Agent 自己的模型，只有真正生成图片、视频、配音和音乐时才调用外部接口，按供应商计费。[3]

<!--more-->

## 主题概览

Drama Skills 的形态很轻：仓库里没有应用、没有前端，只有 skill 目录、Python 脚本和示例工程。安装后，你在项目目录里用自然语言下达请求，Agent 按阶段把决定写进 Markdown 文件，本地脚本负责索引、检查、生产任务交接与剪辑渲染。[3]

这里说的 Skill，是 Anthropic 定义的模块化能力包：把说明、元数据和可选资源（脚本、模板）打成一份目录，Agent 在任务相关时自动加载使用。Drama Skills 就是按这个规范写的，所以它不绑定某一个 Agent，只依赖对方能读 Skill。[10]

这套技能来自 ZenStory AI 自己的漫剧工作室产线：README 说他们 2025 年至今累计做过上千个 AI 短剧 / 漫剧项目，前后端近 8 万行代码在模型能力迭代面前维护不动，于是把历史工程和提示词蒸馏成 skill，让制作人直接用 Agent 维护工程。[3] 仓库采用 MIT 许可，创建于 2026 年 7 月，本次查询（2026-10-19）时 3056 star、611 fork，最后推送时间 2026-10-15。[4]

所以它的定位不是"下载一个工作流模板"，而是一套把创作决定变成可核对文件事实的做法：规范谁在什么阶段写哪个文件、哪些引用必须对得上、什么时候才允许花钱。[3][5]

## 核心技术

### 十一个技能覆盖的阶段

仓库里每个技能都是独立安装单元，可以只用其中几个。按 README 的职责表：[3]

| 技能 | 职责 |
| --- | --- |
| `short-drama` | 项目初始化、路由、视觉方向/Look Development 与本地创作台 |
| `short-drama-novel-analyze` | 长篇原著的抽样快评、章节索引、剧情单元与分集候选 |
| `short-drama-develop` | 可追溯改编、多集整稿切片、故事引擎、分集地图与导演阐述 |
| `short-drama-write` | 单集目标、因果节拍与可拍剧本 |
| `short-drama-assets` | 人物/造型、地点/视图、道具/状态与连续性决策 |
| `short-drama-image-prompts` | 风格帧、角色/场景/道具参考板提示词与定点修改 |
| `short-drama-storyboard` | 场次视觉计划、镜头、边界与冻结关键帧 |
| `short-drama-video-prompts` | 单镜动作、表演交接、摄影、声音与起止状态 |
| `short-drama-produce` | 展示有边界的图片/视频/TTS/音乐任务，确认后经 adapter 执行 |
| `short-drama-edit` | 逐镜入出点取舍、镜序、字幕与响度，写成剪辑单并渲染 |
| `short-drama-review` | 结构/内容审查与项目级校准诊断 |

主链路是"原著分析 → 故事开发 → 分集剧本 → 资产决策 → 图片提示词 / 分镜 → 视频提示词 → 确认后生产 → 剪辑成片 → 审查"。有原著时才用前两个技能；手上已经有单集点子或提纲，直接写剧本即可，不需要为了流程完整把可选步骤补齐。[3][5]

### 五份文档：同一个镜头，四个层次

每个阶段产出独立的 Markdown：`剧本.md`、`视觉设定.md`、`分镜.md`、`图片提示词.md`、`视频提示词.md`，剪成片时再加 `剪辑单.md`。一次请求只创建它真正需要的文档，不预建空文件；只做部分阶段交付时，就交这一部分。[3][5]

README 用公开样例《让你管账号》EP001 展示了分层的意义。剧本只写发生了什么——谁说了什么、谁绷紧了脸；视觉设定给需要跨镜保持的造型上一条"连续性锁"，锁面是一段能原样贴进提示词的短语，例如 `pine-green lapel service jacket`；分镜写这一镜的起点、终点和运镜理由，冻结关键帧只画起点那一格；视频提示词只写起点到终点之间模型要执行的动作。四份文档各管一层，同一格画面既不会被写两遍，也不会互相矛盾。[3]

这种拆法的实际效果是"改得动"：调整一个造型只改视觉设定里的锁，改动会沿引用扩散到分镜和提示词；而修改某一镜的动作只动分镜与视频提示词。相比之下，把所有要求塞进一条长提示词时，改一处就要重新验证整段。

### 跨镜一致性：把约束写成可核对的引用

人物在第二镜换脸，是这类项目最典型的失败。仓库的做法不是"提示词写得更详细"，而是把一致性拆成三层文件事实：身份与造型写进 `视觉设定.md` 并加连续性锁；提示词条目、外部挂图计划和真实图片分别用 `IMG-*`、`PLAN-*`、`REF-*` 记录；每个镜头先写"冻结关键帧"再回填"视觉依据"。[6]

其中 `REF-*` 只用于项目里确实存在并检查过的图片，`PLAN-*` 表示创作者打算在自己的工具里出图、挂图，套件里没有文件可送。这层区分很重要：只有生产任务实际传入同一张图片文件时，不同镜头才共享像素依据；引用同一个提示词条目只是对齐意图，不等于像素一致。[6][8]

落到分镜文件上，每一镜用一个 `## SHOT-…` 二级标题，同镜下用「### 冻结关键帧提示词」写起始帧正文，需要时再加「### 收尾关键帧提示词」；视觉设定的连续性锁要在生效镜头上原样写进冻结关键帧正文，不因为"参考图会交代"就省略。[7]

冻结关键帧只画起点，动作变化留给视频提示词——这条规则避免"起始帧提前出现动作结果"这类问题：如果首帧已经是人物转身过半，模型再执行一次转身就会崩。[5]

### 确认后生产：钱花在预览之后

生成媒体是唯一有真金白银副作用的环节，所以生产流程被拆成四步：从当前提示词建立有边界的临时 job、`prepare` 并展示本次的数量/正文/参考/参数/输出/adapter、用户看过预览后明确确认、`run` 才调用外部 adapter。内容、输入、参数或输出任何一项变化，都要重新预览和确认，失败重试也一样。[5]

异步视频任务中断后，README 给出的处理顺序是先恢复原任务而不是重投：内置 adapter 拿到供应商任务 ID 就落盘，让生产技能运行 `audit` 会把带任务 ID 的未完成尝试报成 `orphaned_provider_job`，再用 `collect` 取回既有结果，确认原任务终态失败后才重新预览、确认、重投。[3]

### 视频提示词与模型能力边界

视频提示词文档要逐镜实现分镜的"起点 → 唯一动作 → 终点"，并交代触发、接触、落点、次级反应、运镜、声音和可验证终点。这里有个常见误解：指定了目标模型不等于选择文生视频——点名模型要先写进项目配置的 `production_profile`，再让分镜去项目里找已有的角色图、场景图、道具图和本镜起始帧绑成带用途的 `REF-*`；仍缺图就列表停下，不擅自改成文生视频。[3][8]

模型的硬限制会反过来约束分镜。以火山方舟的 Doubao Seedance 2.0 为例，官方文档列出的单次输出时长范围是 4 至 15 秒，支持自定义分辨率、宽高比和时长等输出规格；同时明确不支持直接上传含有真人人脸的参考图或视频。前者意味着超过 15 秒的连续动作必须按语义和可见状态闭合点拆镜，后者意味着真人题材要走平台的肖像便利创作流程，而不是直接把真人照片当 `REF-*` 挂进去。[9][11]

对白估时同理：分镜阶段先用文本估计对白时长再定镜长，README 提到 H3 中文小样本约 4.1 个可发声字/秒，输入过密会赶词或被静默截断；没有录音时按原文、语速、情绪估一个区间，并在文档里明确标成"文本估计"，不谎称已实测。一句台词比目标镜长更长时，标准做法是拆到说话者与听者的几个镜头上、保持语速不变，而不是让人物加快语速硬塞。[3][11]

## 实践应用

### 安装与前置条件

README 给出的安装方式是一条命令，`-g` 表示全局安装、去掉则只装到当前目录，更新时重跑同一条命令：[3]

```bash
npx skills add zenstory-ai/drama-skills -y -g
```

前提是你已经在用支持 Agent Skill 规范的编程 Agent，终端里能跑 `npx`（需要 Node.js）。脚本要求 Python 3.9 或更新版本；要剪辑成片，还需要 `ffmpeg` / `ffprobe` 在 PATH 上。也可以只链接需要的技能目录——只用写作或只用审查时，不必装全部 11 个。[3]

调用写法随环境变化：Claude Code 用 `/short-drama`，Codex 用 `$short-drama`，也可以直接用自然语言描述任务；下文以 `$` 为例。[3]

### 从一集剧本走到成片

下面这段请求序列来自 README 的快速开始，按项目实际情况修改题材、集数和镜头内容即可：[3][5]

```text
# 1. 新建项目
用 $short-drama 初始化一个都市打脸题材的短剧项目，竖屏 9:16

# 2. 写第一集
用 $short-drama-write 写第 1 集：外卖员在高档餐厅被经理羞辱，亮出集团董事身份

# 3. 拆资产，写提示词与分镜（可在同一请求内连续完成）
用 $short-drama-assets 从第 1 集拆人物/场景/道具
用 $short-drama-image-prompts 为已接受的资产写参考图提示词
用 $short-drama-storyboard 给第 1 集做正式分镜与冻结关键帧
用 $short-drama-video-prompts 把分镜逐镜翻译成视频提示词

# 4. 明确确认后投产
用 $short-drama-produce 预览第 1 集已接受的图片、视频、TTS 或时间线音乐任务；等我确认后再执行

# 5. 剪成成片
用 $short-drama-edit 把第 1 集已生产的镜头剪成成片，逐段写清入出点理由
```

如果真的要把人物跨镜保持一致，第 3 步的写法要更具体一点，README 给的例子是这样的：[3]

```text
用 $short-drama-video-prompts 按 MiniMax H3 写第 1 集视频提示词；先在项目里找已有的
角色图、场景图、道具图和本镜起始帧绑成参考，缺哪张就列出来，不要改成文生视频
```

### 静态漫剧的近路

漫剧不全是动态视频，很多题材用"关键帧切换 + 配音"就能成片。这条路线可以跳过视频提示词那一层：分镜关键帧与图片提示词直接进入生产预览，成片按静态路线装配——逐张接受已经看过的关键帧，用生产技能的 TTS 模态按剧本逐句生成配音（同样先预览、确认再执行），写《剪辑单.md》时按配音长度定每镜时长，`check` 通过后 `render`，再 `verify`。[3][5]

README 说静态漫剧是从关键帧与配音进入生产和剪辑的，不为流程完整性补造无用的视频提示词文档——这一点对只想快出片的人比完整的 11 步流程更有用。[3]

### 判断跑得对不对

三个可用的检查入口。第一是文档检查脚本 `creator_markdown_check.py`：它核对五份文档之间的引用，README 里故意改坏两处的报错是这样——

```text
ERROR: SHOT-EP001-003: 分镜时长 2 秒与视频提示词 3 秒不一致；视频提示词只能原样照抄已接受的镜头时长
```

这类报错能直接定位到镜头号和原因，也是升级到新版本后要重跑它的原因：收紧过的规则会在这里报出来。[3]

第二是本地创作台，在 Agent 里发一句 `/short-drama dashboard` 启动，以 `--detach` 独立进程运行，`--status` 打印链接、`--stop` 关闭。创作台在 macOS、Linux、WSL 与 Windows 原生都可跑，服务只监听本机，项目内容不上传，适合在浏览器里按分镜视图检查阶段、节奏与镜头卡。[3]

第三是导出：全部跑完后用 `project_tool.py export <project> --out <项目外目录>` 把每集现有的创作文档、剪辑单和 `制作成果/` 复制成带清单和校验和的交付目录；只交文本时加 `--no-media`，缺少哪些创作文档会被记在清单里。[3]

## 使用边界

- 生成成本要自己估：写作、分镜和提示词由你正在用的 Agent 模型完成，不需要 GPU；图片、视频、配音、音乐走外部 adapter，用项目外配置的供应商凭据按量计费。README 给的样例是 68 秒竖屏成片、20 章原著改编、20 镜，视频生成成本约 40 元，实际金额随供应商与模型变化。[3]
- 一致性约束是"可核对 + 需验收"，不是保证。文字层面的锁和引用能让设定在生成前就核对，但生成后的身份、造型与空间一致性仍须逐镜检查。[6]
- 触发条件写的是"要求、建议与预期行为"：文档规定了该在什么阶段写什么、哪些引用必须对得上，模型是否每次都严格遵守，仍要靠检查脚本和人工检查兜底。[5]
- 短视频里的说法与一手资料有差别。公开的 README 写的是 11 个技能，不是"三个 skill"；"涵盖 120 位顶级导演创作模型"在这套技能的公开资料里找不到依据；官方安装入口列的是 Claude Code、Codex 及其他支持 Agent Skill 规范的环境，没有点名豆包；"一天一部漫剧、90% 靠这三个 skill"属于创作者说法，仓库自述的是"2025 年至今累计上千个项目"。[1][3]
- 本文没有安装这套技能、没有调用任何生成接口，上面的命令与请求示例来自 README 与流程文档，是文档示例而非本机实测；star、fork、时间与许可为 2026-10-19 查询值，会随时间变化。[3][4]

## Sources

[1] https://www.douyin.com/video/7694621205415922994 — 视频来源：抖音公开作品 7694621205415922994（AIGC烂番茄，50 秒）
[3] https://raw.githubusercontent.com/zenstory-ai/drama-skills/main/README.md — drama-skills README（中文权威入口）
[4] https://api.github.com/repos/zenstory-ai/drama-skills — GitHub API：drama-skills 仓库元数据
[5] https://raw.githubusercontent.com/zenstory-ai/drama-skills/main/docs/comic-drama-workflow.md — docs/comic-drama-workflow.md（漫剧全流程与五份 Markdown）
[6] https://raw.githubusercontent.com/zenstory-ai/drama-skills/main/docs/character-consistency-across-shots.md — docs/character-consistency-across-shots.md（跨镜一致性三层）
[7] https://raw.githubusercontent.com/zenstory-ai/drama-skills/main/skills/short-drama-storyboard/SKILL.md — skills/short-drama-storyboard/SKILL.md（分镜与冻结关键帧）
[8] https://raw.githubusercontent.com/zenstory-ai/drama-skills/main/skills/short-drama-video-prompts/SKILL.md — skills/short-drama-video-prompts/SKILL.md（视频提示词口径）
[9] https://www.volcengine.com/docs/ark/seedance-2-0 — 火山方舟 Doubao Seedance 2.0 快速入门（输出时长与参考素材上限）
[10] https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview — Anthropic Agent Skills 概览（渐进披露三层加载）
[11] https://raw.githubusercontent.com/zenstory-ai/drama-skills/main/skills/short-drama-storyboard/references/shot-craft.md — skills/short-drama-storyboard/references/shot-craft.md（分镜工艺与对白估时）

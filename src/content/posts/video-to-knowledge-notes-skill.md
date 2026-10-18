---
title: '视频变知识库笔记：一条可自建的 WorkBuddy 解析流水线'
published: 2026-10-18
description: '把视频链接变成可检索的笔记：下载、转写、抽帧、整理四步，以及技能与规范文档怎么分工'
tags: ['AI Agent', 'WorkBuddy', 'Skill', '知识管理']
category: '技术收纳'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

WorkBuddy（腾讯的桌面 AI 智能体工作台）可以这样用：把一个视频链接丢给它，它把视频下下来、把旁白转成文字、看清画面，最后整理成一条能检索的知识库笔记。[1] 分享这套做法的作者把它拆成两半——一个负责产出原材料的技能（Skill），加一份规定笔记长什么样的规范文档。[1] 它适合的场景很具体：平时刷到、收藏的技术视频，想沉淀成以后能翻、能搜的笔记，而不是躺在收藏夹里。[1]

这篇文章沿着「一条视频怎么变成笔记」这条线，讲清每一步为什么要有、用到哪些工具、技能和规范文档各管什么，以及自己搭一遍大概是什么样子。工具能力以各自的官方文档和仓库为准；实际效果来自作者的演示，本文没有复现整条流程。技能本身的机制和常用技能清单，在另一篇 [WorkBuddy 的 Skill 机制](/posts/workbuddy-skills-guide/) 里已经讲过，这里只讲这条流水线。

<!--more-->

## 一条视频要经过哪几步

最朴素的流程只有三步：下载视频、模型理解内容、整理成笔记。[1] 卡点在第二步——能直接「看」视频的模型并不多，遇到没有字幕的视频，只能读音频的模型也无从下手，而且不少顶级推理模型根本不接受视频输入。[1] 所以要插进两步：

1. 用语音识别模型把音轨转成文字；
2. 用 ffmpeg 抽取关键帧，保存为图片。

这样模型就能靠「旁白文本 + 关键几张画面」理解整条视频。[1] 如果手头只有纯文本模型，还可以用 OCR 扫关键帧里的文字，但 OCR 只认文字，画面里的演示和图表变化它读不出来，所以作者并不推荐用纯文本模型干这件事。[1]

## 三个基础工具各管一段

| 环节 | 工具 | 关键事实 |
| --- | --- | --- |
| 下载 | yt-dlp | 命令行音视频下载器，支持上千个站点[2]；支持站点列表里有抖音、B 站、小红书，没有微信视频号[3] |
| 转写 | Whisper / whisper.cpp | Whisper 是 OpenAI 开源的语音识别模型，有六档规格[4]；whisper.cpp 是把同一批模型用 C/C++ 重写、跑得更轻的社区版本[5] |
| 抽帧与格式转换 | ffmpeg | 多媒体框架，负责解码、编码、转码、滤镜等[6] |

Whisper 的规格差异直接决定你的电脑跑不跑得动。官方 README 给的是显存需求：tiny 约 1 GB、base 约 1 GB、small 约 2 GB、medium 约 5 GB、large 约 10 GB、turbo 约 6 GB。[4]

whisper.cpp 的 README 则按运行内存列出 tiny 约 273 MB、base 约 388 MB、small 约 852 MB、medium 约 2.1 GB、large 约 3.9 GB，与视频里给出的对照表一致。[5][1]

规律是：规格越低越省资源、识别越弱。[4][5] 不想在本机装模型，也可以直接调用云端语音识别 API，作者的做法就是配一个在线服务的 key。[1]

## 技能负责产出原材料，规范文档负责「怎么整理」

作者特意没有把笔记格式写进技能里，理由很实在：每个人想要的笔记结构不一样，而且会经常改。[1] 所以分工是——技能只做一件稳定的事，输入一个视频链接，输出下载好的视频、音频、转写文本和关键帧图片；规范文档再告诉模型怎么把这些原材料整理成笔记。[1]

他说明这个技能并非原创，是在一个已有的 video download 技能上改的。[1] 这提示了一个通用做法：视频解析这类「取材料」的能力，社区里已经有了，自己真正要写的往往只是后面那半段整理规则。[1]

规范文档里有两个设计值得直接照抄。[1] 一个是信息完善：校验视频内容是否还有效，给视频里提到的工具补上官网链接，再打上关键词、标签和学习状态，方便以后检索。[1] 另一个是抽帧管理：不做无差别逐帧分析——那样既占空间又费 token，而是先用字幕、转写、平台信息和少量稀疏抽帧建立对视频的整体认识，再对高价值片段定向多抽几张。[1]

什么算高价值信号，作者列得很具体：字幕里出现「大家看这个表」「参数如下」「可以截图保存」这类提示；旁白频繁用「这里」「这个」「如下图」这种依赖画面的指代词；画面里出现大段文字、表格或代码；同一页靠滚动、翻页展示多段信息；演示前后状态发生变化；以及作者没把画面里的关键信息念出来。[1] 抽出来的帧要去重，超出屏幕的内容要用多张画面或局部裁切补全，OCR 结果要结合相邻画面和上下文校对，代码、网址、命令、数字和专有名词重点复核。[1]

## 人不在电脑前也能派活

这套流程的发起端可以放在手机上，靠的是 WorkBuddy 官方的「助理」远程控制：在手机上的即时通讯软件里发一条消息，电脑上的客户端执行任务并把结果回传，官方文档列出的接入平台包括 Slack、Telegram、Discord、微信助理、企业微信、QQ、元宝派、钉钉和飞书，前提是电脑保持开机并运行客户端。[7] 官方实践文档给的远程用法也是同一个思路：移动端要把文件名、所在目录和目标动作说清楚，涉及删除、覆盖、批量移动时先要求预览。[8]

作者补了一条实际会踩到的细节：小程序是通过助理连到电脑端的，指令里要明确「解析后保存到哪个项目目录」，否则模型会在磁盘上到处找项目文件夹；固定路径最好让它记住，省得每次重复。[1] 如果你用的不是 WorkBuddy，而是 Claude Code、Codex、OpenCode 这类 Agent，把 Agent 接到聊天平台的工具是 CC-Connect：它把本机运行的 AI 编程 Agent 桥接到飞书、钉钉、Slack、Telegram、Discord、企业微信等聊天平台。[11][1]

## 自己搭一遍

按作者的顺序，落地的步骤大致是这样：[1]

1. 装齐基础工具：yt-dlp、ffmpeg，再加本地 Whisper（用 whisper.cpp）或准备一个云端语音识别服务的 key。[1][2][6]
2. 装之前先让 AI 读一下机器配置，判断能跑哪一档 Whisper，再决定本地跑还是走 API。[1][5]
3. 找一个现成的视频解析技能安装，或者自己写一个：按 Agent Skills 规范，`SKILL.md` 头部必须写清「做什么、什么时候用」，因为启动时只有 `name` 和 `description` 会进入上下文，正文要等技能被触发才加载。[12] 官方给的第一条建议是第一个自定义技能只解决一个明确问题，并把触发条件说清楚。[10]
4. 单独写一份规范文档，把笔记字段、标签体系和抽帧要求写进去；它和技能分开，改起来不用动技能本身。[1]
5. 用一条真实视频验收：输出目录里应该齐了视频、音频、转写文本和关键帧，笔记里能顺着原始链接回到原视频。[1]

作者自己的清理习惯也放在这里：整理完笔记，他会删掉原视频和音频文件——一是太占空间，二是尊重原作者；笔记顶部保留原视频链接，观看和互动回到平台上去。[1]

## 边界与限制

- 能不能下载取决于平台。作者的更新说明里写着「目前抖音视频无法下（被拦截）」，而 yt-dlp 的官方支持列表本来也不包含微信视频号。[1][3]
- 成本只有一处：模型调用额度。作者强调不需要任何付费的第三方工具，唯一的支出是使用 WorkBuddy 时的模型额度。[1]
- 技能是别人写的代码。技能市场是官方统一的安装与管理入口，装之前仍要看一眼来源和作者。[9]

<details>
<summary>视频来源与核对范围</summary>

- 本文由作者 言说新事 2026 年 8 月 1 日发布的公开视频展开，实际读取了约 3 分 25 秒视频的完整语音，并查看了流程示意、工具界面、抽帧规范页等关键画面。[1]
- 工具能力依据各项目的官方仓库与文档：yt-dlp 的支持范围与支持站点列表、Whisper 与 whisper.cpp 的模型规格、ffmpeg 的能力说明。[2][3]
- Whisper 与 whisper.cpp 的模型规格与内存数据来自两者的官方 README。[4][5]
- ffmpeg 的能力说明来自 ffmpeg 官方站点。[6]
- WorkBuddy 的助理远程控制与远程实践依据官方文档。[7][8]
- 技能市场与创建自定义技能的建议依据官方文档。[9][10]
- 技能与规范文档的分工、抽帧要求、清理习惯属于作者的经验做法，不是官方规范；本文没有安装或运行 WorkBuddy，也没有复现整条解析流程，因此不评价实际产出质量与识别准确率。[1]
- 作者提到的 CC-Connect 依据其公开仓库描述核对。[11]

</details>

## Sources

[1] https://www.douyin.com/video/7669015455805433061 — 抖音视频：用WorkBuddy，把刷视频变成知识库（言说新事，2026-08-01）
    > "- 0:08 只需要一个skill加一份规范文档就能实现
- 0:11 不需要任何付费的第三方工具
- 0:13 唯一的支出就是你使用WorkBuddy时候的模型额度支出"
[2] https://github.com/yt-dlp/yt-dlp — yt-dlp 仓库（README）
    > "yt-dlp is a feature-rich command-line audio/video downloader with support for [thousands of sites](/yt-dlp/yt-dlp/blob/master/supportedsites.md)."
[3] https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md — yt-dlp 支持站点列表
    > "- **Douyin**
- **DouyuShow**
- **DouyuTV**: 斗鱼直播"
[4] https://github.com/openai/whisper — openai/whisper 仓库（README）
    > "There are six model sizes, four with English-only versions, offering speed and accuracy tradeoffs."
[5] https://github.com/ggml-org/whisper.cpp — ggml-org/whisper.cpp 仓库（README）
    > "| Model | Disk | Mem |
| --- | --- | --- |
| tiny | 75 MiB | ~273 MB |
| base | 142 MiB | ~388 MB |
| small | 466 MiB | ~852 MB |
| medium | 1.5 GiB | ~2.1 GB |
| large | 2.9 GiB | ~3.9 GB |"
[6] https://ffmpeg.org/about.html — About FFmpeg
    > "FFmpeg is the leading multimedia framework, able to **decode**, **encode**,  **transcode**, **mux**, **demux**, **stream**, **filter** and **play** pretty much anything that humans and machines have created."
[7] https://www.workbuddy.ai/docs/zh/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Assistant — WorkBuddy 官方文档：助理远程控制
    > "助理是 Tencent WorkBuddy 的远程控制功能，让您可以通过手机上的即时通讯软件（Slack、Telegram、Discord、微信助理Bot、企业微信、QQ、元宝派、钉钉、飞书）远程控制电脑上的 Tencent WorkBuddy 执行任务。"
[8] https://www.workbuddy.ai/docs/zh/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Claw-Slack — WorkBuddy 官方文档：实践六 远程遥控 WorkBuddy
    > "本文介绍如何通过移动端与远程对话能力，让 `Tencent WorkBuddy` 在不坐在电脑前的情况下继续协助处理任务，适用于通勤、出差和跨设备办公场景。"
[9] https://www.workbuddy.ai/docs/zh/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market — WorkBuddy 官方文档：技能（技能市场）
    > "技能市场用于统一管理和安装 Skills，扩展 Tencent WorkBuddy 的能力范围。"
[10] https://www.workbuddy.ai/docs/zh/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Create-Skills — WorkBuddy 官方文档：实践八 创建自己的 Skills
    > "**先定义单一能力**：首个自定义 `Skill` 建议只解决一个明确问题。"
[11] https://github.com/chenhg5/cc-connect — chenhg5/cc-connect 仓库
    > "Bridge local AI coding agents (Claude Code, Cursor, Gemini CLI, Codex) to messaging platforms (Feishu/Lark, DingTalk, Slack, Telegram, Discord, LINE, WeChat Work)."
[12] https://agentskills.io/specification — Agent Skills 规范
    > "Agents load skills *progressively*, pulling in more detail only as a task calls for it. Skills should be structured to take advantage of this:"

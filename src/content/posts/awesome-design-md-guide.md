---
title: 'DESIGN.md 入门：让 AI 按一份设计说明书做页面'
published: 2026-04-09
updated: 2026-10-17
description: '一份写给 AI 的网页设计说明书，记录颜色、字体、间距和组件规则。'
tags: [AI, UI设计, Design System, DESIGN.md, GitHub, VoltAgent, 效率工具]
category: AI 工具
draft: false
lang: zh_CN
sourceLink: https://github.com/VoltAgent/awesome-design-md/tree/main
licenseName: MIT
licenseUrl: https://github.com/VoltAgent/awesome-design-md/blob/main/LICENSE
---

DESIGN.md 是一份写给 AI 看的设计说明书。它用文字和表格记下网页的颜色、字体、间距和组件规则，供 AI 生成页面时参考。[1] 这里的组件，就是按钮、输入框、导航栏等可以反复使用的界面部分。

它本身是一个 Markdown 文件，也就是带简单排版标记的文本，不需要为这份文件单独安装软件。[1] 如果你准备用 AI 做网页，希望多个页面沿用同一套样式，这种说明书就有用。

`awesome-design-md` 是别人整理的一批现成 DESIGN.md，来源是公开网站。[1] 它是一个第三方示例合集，不是这些品牌的官方规范。

<!--more-->

## 先看一个场景：让 AI 做一个风格一致的页面

假设你要做一个定价页，希望它看起来接近某个你已经喜欢的网站。

你把这个网站对应的 DESIGN.md 放进项目，对 AI 说“照这份说明书做一个定价页”。

没有说明书时，AI 会根据自己的印象挑颜色和尺寸。同一个项目里多生成几次，主按钮的颜色、字重、圆角和间距可能每次都不一样。

有了说明书，你可以要求 AI 从同一份清单里选颜色、字号和间距，减少每做一个页面就重新猜一套的情况。它仍然需要把文字要求落实成页面代码；说明书不会强制模型遵守，也不会自动证明页面效果正确。

## 说明书里记了什么

打开 Linear 那份 DESIGN.md，前面是一份设计变量表。[2] 变量就是给常用取值起个名字，例如把主色叫作 `colors.primary`，后面直接引用这个名字。

表里用 YAML 这种结构化文本写「名称：取值」，下面是节选，不必先学语法也能看出大意：[2]

```yaml
colors:
  primary: "#5e6ad2"
  canvas: "#010102"
  surface-1: "#0f1011"
spacing:
  xxs: 4px
  sm: 12px
  section: 96px
rounded:
  md: 8px
  lg: 12px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 8px 14px
```

后面的说明会用 `{colors.primary}`、`{rounded.md}` 指回这些变量。[2] 例如按钮的背景色用主色、圆角用中等圆角，具体取值则查前面的表。

这样可以集中维护样式取值，而不是在说明里重复写许多次。但这些引用是给 AI 或配套工具理解的，不是浏览器直接能执行的网页样式；修改说明后，仍要相应更新页面实现。

这份表管的不只是颜色。字体粗细、字与字的距离、各类留白和圆角都在里面，这些细节合起来，才会让页面看起来属于同一个项目。

## 两份样例：字段一样，做法完全不同

Linear 和 Stripe 这两份样例使用了相近的字段，具体取值和搭配却不同：[2][3]

| | Linear | Stripe |
| --- | --- | --- |
| 主色 | `#5e6ad2` 薰衣草蓝 | `#533afd` 靛蓝 |
| 画布 | `#010102` 近黑 | `#ffffff` 白 |
| 展示字号 | 80px、600 字重、-3.0px 字距 | 56px、300 字重、-1.4px 字距 |
| 按钮形状 | `rounded.md` 8px、内边距 8px 14px | `rounded.pill` 9999px、内边距 8px 16px |
| 层次来源 | surface 深色阶梯 | 渐变网格 |

有两个地方容易踩：

- 同名变量不代表同一个值。Linear 的 `spacing.sm` 是 12px，Stripe 的 `spacing.sm` 是 8px。把两份文件的变量名混着抄，会直接抄错尺寸。
- 只抄配色通常做不出气质。Stripe 把 300 字重当作整套视觉的基调，字距随字号收窄，[3] 单纯换个主色达不到那个观感。

Stripe 那份还给了实现建议：那组渐变网格用分层 SVG 或大背景图来做，而不是叠加 CSS 渐变。[3] 这是整理者对某个效果的复现方案，不是对 CSS 能力的判断，但比“做得高级一点”更能落地。

## 怎么挑、怎么放进项目

仓库里每份文件对应一个网站，你可以只取需要的那部分规则。[1] 常见做法是：

1. 挑一份和你要做的页面接近的 DESIGN.md，先看其中的设计变量表。
2. 把文件放进项目（README 的说法是项目根目录）。不必照抄全部变量，可以先定自己的，再对照参考。
3. 向 AI 说清楚用哪份文件、要做什么页面，并把你的约束一起讲明，比如“只参考它的间距和圆角，配色沿用我现有的”。

有两点需要提醒：

- 字体通常是整理者给的替代建议，不是原品牌的授权。实际发布前要另外检查字体许可。[2][3]
- 复杂效果（比如渐变网格）建议在本地直接试，光靠文字描述不一定能还原。[3]

## 这是第三方整理，不是品牌官方规范

同一套文件里，README 和文件本身的说法并不完全相同。

README 说，这是一个“从公开网站提取的设计系统文档合集”，提取出来的令牌“代表公开可见的 CSS 取值”，并且“不主张任何网站视觉身份的所有权”。[1]

两份文件自己的开场更谨慎：Linear 那份的名字是 `Linear-design-analysis`，[2] Stripe 那份是 `Stripi-Inspired-design-analysis`，描述开头写着 “An inspired interpretation of Stripi's design language”。[3]

按后者对待更稳妥。把它当风格参照，别当官方设计系统，也不要对外宣称“还原了某网站”。另外，仓库 README 列出的 `preview.html`、`preview-dark.html` 对照页，在对应提交里并没有找到，实际能拿到的只有 DESIGN.md 文本。

<details>
<summary>核验范围与资料版本</summary>

- 取材固定到 awesome-design-md 提交 `3b605329240ce735b510037cca322f1831fdd7f8`（2026-10-14），引文来自该提交的文本。仓库持续更新，结构与内容可能已变。
- 曾对样例做离线的变量引用检查：Linear 与 Stripe 的候选引用能找到对应定义；其他样例存在命名不一致或文本解析问题。[4][5] 这类检查只核对文档内部结构，不证明设计取值或页面效果正确。
- 未验证：目标网站 CSS 与这些取值的逐条比对、preview 页的实际效果、AI 依此生成页面的真实效果，以及各品牌对这份提炼的态度。

</details>

## Sources

[1] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/README.md — awesome-design-md README @3b60532
[2] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/design-md/linear.app/DESIGN.md — design-md/linear.app/DESIGN.md @3b60532
[3] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/design-md/stripe/DESIGN.md — design-md/stripe/DESIGN.md @3b60532
[4] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/design-md/claude/DESIGN.md — design-md/claude/DESIGN.md @3b60532
[5] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/design-md/supabase/DESIGN.md — design-md/supabase/DESIGN.md @3b60532

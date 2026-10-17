---
title: 'awesome-design-md 拆解：两份 DESIGN.md 的颜色角色、字阶与组件规则'
published: 2026-04-09
updated: 2026-10-17
description: '把第三方整理的 DESIGN.md 当机器可读契约前：两份样例的角色/字阶对比与离线校验。'
tags: [AI, UI设计, Design System, DESIGN.md, GitHub, VoltAgent, 效率工具]
category: AI 工具
draft: false
lang: zh_CN
sourceLink: https://github.com/VoltAgent/awesome-design-md/tree/main
licenseName: MIT
licenseUrl: https://github.com/VoltAgent/awesome-design-md/blob/main/LICENSE
---

把一份 `DESIGN.md` 拷进项目、让 AI 按它生成页面之前，有三个问题值得先问清楚：仓库实际提供了什么文件、每份 `DESIGN.md` 用什么结构承载规则、这些规则在严格解析下站不站得住。

这篇拆两份样例（Linear 与 Stripe），再检查 Claude、Supabase 两份文件的解析问题。四份中有一份 YAML 解析失败；其余三份共 456 个候选引用，脚本标出了 15 处，其中 14 处是命名空间不一致，另一处只是占位符误报。自动检查能找问题，也需要人解释结果。

> 取材与核查说明：本文是资料解读加可复现检查，不是视觉还原度评测。引文固定到 awesome-design-md 的提交 `3b605329`，取值来自仓库中的 DESIGN.md 文本本身；我没有逐页比对目标网站的 CSS，也没有生成任何页面截图或效果图。

<!--more-->

## 仓库实际提供了什么

README 说每份 DESIGN.md 遵循 Stitch DESIGN.md format，并列了一张“每个站点包含哪些文件”的表：`DESIGN.md`、`preview.html`、`preview-dark.html`。[1]

但在提交 `3b605329` 的目录树里，`design-md/<site>/` 下只有 `DESIGN.md` 和 `README.md`，全树没有任何 `preview*` 文件。仓库 badge 自称 84 份，`design-md/*/DESIGN.md` 的实际计数也是 84，这个数对得上；preview 那张表对不上。

这不影响 DESIGN.md 本身的可用性，但决定了你能拿到什么：只有文本规范，没有可视对照页。取证时以目录树为准，不要以 README 的表格为准。

README 还把 DESIGN.md 归为 Google Stitch 引入的概念。[1] 我尝试打开它引用的 Stitch 文档页，抓到的只有 JS 外壳、没有正文，所以这里只按“仓库如此归因”记录，不作为已验证事实。

## 一份 DESIGN.md 的结构：front matter 是令牌表，正文是引用

Linear 那份的前 100 多行是 YAML front matter，全是结构化令牌：

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

正文用 `{colors.primary}`、`{spacing.lg}` 这样的引用指回 front matter，而不是重复写颜色值。组件规则也放在 front matter 里，正文负责解释它在页面上怎么落地——比如按钮那条写的是 “Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`”。[2]

这个结构带来一个实际好处：引用可以机械校验。既然是纯文本加引用，就能检查有没有引用指向不存在的令牌。

## 取样校验：先区分真实缺失和脚本误报

校验规则是解析 front matter，抽出正文里形如 `{group.token}` 的候选引用，再沿层级找键。下面是对上述四份来源副本的实际输出；非零退出码表示有解析错误或未解析的候选项，不直接等于这些项全是规范错误。

```text
design-md_linear.app_DESIGN.md: refs=158 unresolved=0
design-md_stripe_DESIGN.md: refs=121 unresolved=0
claude.md: refs=177 unresolved=15
supabase.md: invalid front matter (ScannerError)
TOTAL: refs=456 unresolved=15 invalid=1
```

复现需要 Python 3.11 与 PyYAML 6.0.3。保存来源 [2]—[5] 的四份文件，将下面的程序存为 `check_design_refs.py`，然后执行 `python check_design_refs.py <文件路径...>`。程序只读本地文件；它仅验证候选引用的键是否存在，不验证设计值、视觉效果或完整规范兼容性。

```python
from pathlib import Path
import re
import sys
import yaml  # PyYAML 6.0.3

refs_total = unresolved_total = invalid = 0
for name in sys.argv[1:]:
    path = Path(name)
    lines = path.read_text(encoding="utf-8").splitlines()
    try:
        if not lines or lines[0] != "---":
            raise ValueError("missing front matter")
        end = lines.index("---", 1)
        tokens = yaml.safe_load("\n".join(lines[1:end]))
        if not isinstance(tokens, dict):
            raise ValueError("front matter must be a mapping")
    except (ValueError, yaml.YAMLError) as error:
        invalid += 1
        print(f"{path.name}: invalid front matter ({type(error).__name__})")
        continue
    body = "\n".join(lines[end + 1:])
    refs = re.findall(r"\{([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+)\}", body)
    unresolved = 0
    for ref in refs:
        node = tokens
        for part in ref.split("."):
            if not isinstance(node, dict) or part not in node:
                unresolved += 1
                break
            node = node[part]
    refs_total += len(refs)
    unresolved_total += unresolved
    print(f"{path.name}: refs={len(refs)} unresolved={unresolved}")
print(f"TOTAL: refs={refs_total} unresolved={unresolved_total} invalid={invalid}")
sys.exit(1 if unresolved_total or invalid else 0)
```

两个问题各有具体成因：

- **命名空间不一致。** claude 那份的 front matter 定义的是复数 `components:`，正文却出现 14 处单数引用（`{component.button-primary}`、`{component.feature-card}` 等 9 个名字）。[4] 按本文的严格键路径检查，这些引用不能解析。（剩下一处是提示词句子里的 `{token.refs}`，只是语法示意，不应算成缺失令牌。）
- **front matter 不是合法 YAML。** supabase 那份第 4 行的 `description` 是未加引号的长标量，里面出现了冒号：“The brand reads as quietly technical: minimal chrome, a near-monochrome palette”。[5] 解析器在这一行直接报错，整份 front matter 都读不出来，更谈不上引用校验。

模型直接阅读自然语言时，可能自己猜对这些含义；严格解析程序却不会自动修正。因此，要把这类文件接进令牌提取或代码生成流程，先明确哪些字段真的能被机器解析，再处理命名与格式问题。

## 同一套字段，两份样例的落地方式完全不同

两份的字段名几乎一样，取值和用法几乎没有一处相同。

| | Linear | Stripe |
| --- | --- | --- |
| 主色与用途 | `#5e6ad2` 薰衣草蓝：品牌标记、焦点环、主 CTA | `#533afd` 靛蓝：每个色带只出现一个实心 pill |
| 强调色纪律 | 无第二鲜艳色，唯一语义色是成功绿 | ruby/magenta 只出现在渐变和图表，不做按钮色 |
| 展示字重与字距 | 600 字重，80px 配 -3.0px 字距 | 300 字重，56px 配 -1.4px 字距 |
| 间距基准 | 4px | 8px（另有 2/4/12 子令牌） |
| 按钮圆角与内边距 | `rounded.md` 8px，8px 14px | `rounded.pill` 9999px，8px 16px |
| 层次来源 | surface 阶梯，不靠阴影 | 渐变网格就是深度系统 |

几个值得记住的点：

- **同名令牌的语义不通用。** Linear 的 `spacing.sm` 是 12px，Stripe 的 `spacing.sm` 是 8px；Linear 用 `rounded.md` 做按钮圆角，Stripe 把 `rounded.pill` 给所有按钮、`md` 留给紧凑卡片。跨文件混抄令牌名会直接抄错值。
- **字重和字距比颜色更能定调。** Linear 的负字距随字号从 -3.0px 收到接近 0；Stripe 把 300 字重当作品牌本身，文件里写明把展示层拉到 400 以上就没有那种编辑感了。[2][3] 只抄配色大概率做不出这两种气质。
- **Stripe 那份给出了具体实现建议**：用 layered SVG 或大背景图表现那组渐变网格，而非只叠 CSS 渐变。[3] 这是整理者对特定效果的复现建议，不是对 CSS 全部能力的判断；它至少比“有高级感”更能指导实现。
- 两份都附了字体替代建议：Linear 指向 Inter/Geist，Stripe 指向 Inter 300 加 `ss01` 特性。[2][3] 这是整理者的方案，不是原品牌的授权声明；实际使用或分发字体前，还要另外检查许可。

## 这是第三方整理，不是品牌官方规范

在自我声明上，两份文件比 README 更谨慎：

- Linear 那份的 front matter 名字是 `Linear-design-analysis`。[2]
- Stripe 那份名字是 `Stripi-Inspired-design-analysis`，description 开头是 “An inspired interpretation of Stripi's design language”，原文就是这么拼的。[3]
- README 则是另一套说法：“The extracted design tokens represent publicly visible CSS values”，并且“We do not claim ownership of any site's visual identity”。[1]

两种表述不完全一致：README 声称是可观察到的 CSS 取值，文件自称是“受启发的诠释”。取用时按后者对待更安全——把它当风格参照，别当官方设计系统，也别宣称任何还原度。另外每份正文有一行 `Source pages:`（例如 Stripe 那份列出 home、/payments、/pricing 和注册页），说明取样范围是自述的；我没有逐页核对 CSS，对取值准确性的判断到此为止。

## 落到用的时候

三条来自上面核查的实际动作：

1. **先校验，再复核告警。** 非法 YAML 会让严格解析失败，命名空间不一致会留下悬空引用，但程序也会把 `{token.refs}` 这类示意语法报成问题。
2. **先定义自己的令牌，再映射参考。** 不要把不同文件里同名的 `spacing.sm` 当成同一尺寸；混用时应明确转换，而非直接拼接。
3. **不只看主色。** 把字体、间距、圆角和层次手段一起读，再判断哪些约束适用于自己的页面。

## 验证范围与资料版本

- **修订日期：2026-10-17。** 原发布日期保留；删去品牌枚举、重复的“值得收藏”总结和对话式收尾。
- **取材版本：** awesome-design-md 提交 `3b605329240ce735b510037cca322f1831fdd7f8`（2026-10-14）。README 与 DESIGN.md 的引文均来自该提交，仓库持续更新，结构与内容可能已变。
- **实际执行：** 从最终成稿提取上述脚本，对四份来源副本运行（Python 3.11 + PyYAML 6.0.3），输出见上文，退出码为 1，符合存在候选缺失与解析错误的预期；脚本只读本地文件，不联网。
- **未验证：** 目标网站 CSS 的逐条比对、preview 页的可视效果（仓库中不存在这些文件）、AI 依此生成页面的实际效果，以及各品牌对这份提炼的态度。

## Sources

[1] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/README.md — awesome-design-md README @3b60532
[2] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/design-md/linear.app/DESIGN.md — design-md/linear.app/DESIGN.md @3b60532
[3] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/design-md/stripe/DESIGN.md — design-md/stripe/DESIGN.md @3b60532
[4] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/design-md/claude/DESIGN.md — design-md/claude/DESIGN.md @3b60532
[5] https://raw.githubusercontent.com/VoltAgent/awesome-design-md/3b605329240ce735b510037cca322f1831fdd7f8/design-md/supabase/DESIGN.md — design-md/supabase/DESIGN.md @3b60532
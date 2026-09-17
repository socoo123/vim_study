# Vim 学习站 — 权威大纲与规范(PLAN.md)

> 本文件是本项目**唯一权威计划**。任何 agent(Claude / 其他)开工前必读。
> 进度唯一真相:**[`STATUS.md`](./STATUS.md)**。聊天记录不是记忆。
> 风格参考 `/Users/zy/ai_web_page/system_design_web`(仅气质参考,不共用框架)。

---

## 0. 恢复协议(每次开局执行,含上下文被清理后)

1. 读 `STATUS.md` → 看「总览」和「下一步」,找到状态非 `done` 的最靠前任务。
2. 按需读本文件对应章节:写内容看 §4–§7,写演示看 §6,验收看 §9。
3. 动手前在 `STATUS.md` 把该任务标 `in_progress` 并写 agent 名与日期(上锁)。
4. 生成 → 自检 `node tools/check.mjs` 全绿 → 立即更新 `STATUS.md`(状态、demo 数、会话日志)。
5. 长章节一次会话写不完:`STATUS.md` 里记录「已写到哪个 section」,下次续写。

**禁止**:重写 `done` 章节;修改本文件 §2–§7 规范(除非用户点名);引入构建步骤或外部 CDN 依赖。

---

## 1. 目标与受众

| 项 | 内容 |
|---|---|
| 用户 | zy,macOS,资深开发者 |
| 目标 | 在 **VSCode(VSCodeVim)** 与 **IntelliJ IDEA(IdeaVim)** 中日常用 Vim 高效写代码 |
| 产出 | 本地静态网页:超详细中文教程 + 动画演示 + 快速参考手册 + 实战案例 |
| 学习哲学 | Vim 是**编辑语言**:动词(operator)+ 名词(motion / text-object)。教程全程贯彻这个心智模型 |

**非目标**:vim 完整手册复刻、vimscript 深度编程、Neovim 配置工程化、终端环境定制、**英文版 / 国际化(用户已明确:全中文,不做英文)**。

---

## 2. 核心设计决策

### 2.1 技术栈:纯静态、零构建

- 纯 HTML + CSS + vanilla JS,**不用** Vite/React/Tailwind(参考站用了,但本项目优先「任何 agent 都能可靠续作」)。
- 理由:① 无 node_modules / 构建产物,上下文清理后零成本恢复;② 每章是独立 HTML 文件,天然增量;③ 双击即开,离线可用。
- 共享逻辑只有 3 个 JS 文件(导航 / 演示播放器 / 进度),由各章 `<script src>` 引入。

### 2.2 动画方案:数据驱动播放器(主)+ vhs GIF(可选)

关于「多模态能不能做 GIF」的结论,写给任何后续 agent:

- **不做**用图像模型逐帧"画"演示动画——不可靠、易错、无法保证按键序列正确。
- **主方案(采用)**:自研 **VimDemoPlayer**——演示是 JSON 数据(每步 = 按键 + buffer 快照 + 注释),浏览器播放。效果优于 GIF:矢量清晰、可暂停/单步/调速、文件极小、任何 agent 都能以纯数据方式可靠产出。
- **可选补充**:用 [vhs](https://github.com/charmbracelet/vhs) 从 `.tape` 脚本确定性渲染真终端 GIF(`brew install vhs`,当前机器**未安装** ffmpeg/ttyd)。若用户点名要真 GIF 再启用,产物放 `assets/gifs/`,优先级最低。

### 2.3 演示引擎 = 快照式,不模拟 Vim

播放器**不实现 Vim 语义**。每一步显式声明该步之后的状态(变更 buffer 的步骤必须给出**完整** `lines` 数组)。引擎只负责渲染。这是可靠性的关键:引擎永远不会"算错 vim",复杂演示(宏、块选择)与简单演示同样容易编写。

### 2.4 内容即 HTML

章节正文直接写成语义化 HTML(不走 Markdown 中间层),用固定 class 骨架(§5),便于校验脚本检查结构完整性。

---

## 3. 站点结构与文件树

```
vim_study/
├── PLAN.md                  # 本文件
├── STATUS.md                # 进度唯一真相
├── CLAUDE.md                # Claude Code 开局入口(指向本文件)
├── index.html               # 封面 + 章节目录 + 总进度
├── cheatsheet.html          # 附录A:可打印快速参考手册
├── faq.html                 # 附录B:常见陷阱与 FAQ
├── playground.html          # 附录C:按键自测(P5,可选)
├── chapters/
│   ├── ch00.html … ch13.html
├── demos/
│   └── chNN.js              # 演示数据注册表(每章一个文件,注册进 window.VIMDEMOS)
                              # 用 .js 而非 .json + fetch:file:// 双击打开也能加载,零构建零 CORS 问题
├── assets/
│   ├── css/style.css        # 全站样式(双主题 CSS 变量)
│   └── js/
│       ├── nav.js           # 顶栏、侧边目录、主题切换
│       ├── vim-player.js    # 演示播放器(核心资产)
│       └── progress.js      # localStorage 学习进度
└── tools/check.mjs          # 结构与演示数据校验(node ≥18)
```

---

## 4. 课程大纲(13 章 + 3 附录)

> 每章列:目标 / 覆盖 / 必备演示(最低数量)/ 练习方向。「IDE 备注」= 该章 `ide-notes` 小节必须说清的差异。

### ch00 使用指南(短)
- 目标:学会用本站(播放器操作、进度勾选);建立学习方法论。
- 覆盖:肌肉记忆训练法(每天专注 5 个新键)、「动词+名词」语言观预告、教程路线图(生存 → 移动 → 语法 → 进阶 → 实战)。
- 演示:1(演示播放器自身用法,自举)。

### ch01 生存篇:模式与 IDE 配置
- 目标:今天就能在 VSCode/IDEA 里"活下来"。
- 覆盖:五种模式(normal/insert/visual/select?/cmdline,重点前四种);`i Esc :wq`;`hjkl x dd o u`;vimtutor 推荐;**VSCodeVim 安装与最小配置**;**IdeaVim 安装与最小 .ideavimrc**;macOS 中文输入法与 Esc 的冲突及解法(autoSwitchIM + macism/im-select,写进 FAQ 链接)。
- 演示:7(进入/退出插入、a、I/A+预习 j、dd、o、x+u、:w)。
- IDE 备注:VSCodeVim 安装即用;IDEA 装 IdeaVim 插件 + `~/.ideavimrc`;两边 `Esc` 行为差异。
- 练习:用 vimtutor 过一遍;在 IDE 里完成"删一行、下面建新行"十次。

### ch02 移动·字符与词
- 目标:手不离主键区横移。
- 覆盖:`w b e ge`、`W B E`(word vs WORD)、`0 ^ $ g_`、`f F t T ; ,`、行内组合案例;`gj gk`(折行)提一句。
- 演示:6(w/b/e 对照、fe、t 组合删词 `dt,`、$ 与 g_ 区别、W vs w、; 重复)。
- IDE 备注:相对行号开启(VSCode `editor.lineNumbers: relative`;IDEA + IdeaVim `set relativenumber`)。

### ch03 移动·行与文件
- 目标:大范围跳跃。
- 覆盖:相对行号思维(`5j 3k`)、`gg G {n}G {`} `( )`、`%` 匹配跳转、`H M L`、`Ctrl-d/u`、`zz zt zb`、书签 `m ' \``。
- 演示:6(相对行号跳跃、段落移动、% 配对、书签往返、滚动定位、( ) 函数跳)。
- IDE 备注:VSCode/IdeaVim 中 `Ctrl-d/u` 可能与 IDE 冲突,给改键建议。

### ch04 文本对象(全站核心章)
- 目标:掌握「i / a × 对象」矩阵,编辑如说话。
- 覆盖:`iw aw i( a( i{ a{ i[ i< i" a" i' i\` it ip ap`;`ciw daw yi( vi{` 全组合演示;嵌套与计数(`di((` 内层)。
- 演示:8(iw/aw 区别、ci"、di(、ya{、vit、cip、d2aw、改引号内字符串)。
- IDE 备注:VSCodeVim 对文本对象支持完整(含 `it` HTML 标签);IdeaVim 大部分支持,个别需插件。

### ch05 编辑动词与语法
- 目标:动词全表 + 「动词+名词」语法固化。
- 覆盖:`d c y` 深入;`x s S r R J ~ gu gU g~ > < =`;count 位置(`2dw` vs `d2w`);`p P` 与行/字符寄存器粘贴行为;语法公式 `[(count)] verb [(count)] noun`。
- 演示:8(ciw 回顾、cis、J 合并行、guu/gUU、>> 缩进、== 格式化、xp 交换字符、rt 快速改字符)。
- IDE 备注:`=` 格式化在 IDE 中的行为(LSP 格式化 vs vim 公式化)。

### ch06 插入与替换模式
- 目标:进插入模式的全部姿势。
- 覆盖:`i a I A o O gi`;插入模式内 `Ctrl-w Ctrl-u Ctrl-t Ctrl-d`;`R` 替换模式;`r` 单字替换回顾。
- 演示:4(A 行尾追加、I 行首、o/O 新行、R 覆写)。
- IDE 备注:VSCodeVim 的自动补全弹出时 Esc 行为;`Ctrl-o` 在插入模式执行单命令。

### ch07 可视化模式与块编辑
- 目标:三种种选择 + 块编辑杀手锏。
- 覆盖:`v V Ctrl-v`;`o O` 端点切换;`gv` 重选;选中后 `d c y > < J U`;**块插入 `I` / 块追加 `A`**;`$` 块尾扩展。
- 演示:6(块选批量加 `// ` 注释、块选行尾加分号、v 选段改大小写、V 整行移动、gv 复用、块删除列)。
- IDE 备注:**VSCode 原生多光标(Cmd-d) vs 块选择**:各自适用场景对照表;VSCodeVim 的 `gb` 添加多光标。

### ch08 查找与替换
- 目标:单文件内搜索与批量替换。
- 覆盖:`/ ? n N`;`* # g*`;`:s` 语法与标志 `g c i e`;`&` `:~` 重复;`:%s` 案例(变量重命名、引号统一);`:g / :v` global 命令;替换确认模式(`y n a q l`)。
- 演示:6(/ 查找+n 跳转、`:%s/oldNew/gc` 带确认、行内单替换、`*` 光标词全文件、`:g/pattern/d`、`:'<,'>s` 区域替换)。
- IDE 备注:VSCode/IdeaVim 中 `Cmd-f/Cmd-r` 与 vim 查找的关系;`/` 查找高亮设置(`set hlsearch incsearch`)。

### ch09 寄存器与剪贴板
- 目标:理解"复制不丢"与系统剪贴板打通。
- 覆盖:无名寄存器 `""`、数字寄存器 `"0-"9`、`"-`、命名寄存器 `"a-"z`(追加 `"A`)、只读 `". ": "%`;`:reg`;系统剪贴板 `"+ "*`;**经典案例:yank 后 delete 不丢(`"0p`)。
- 演示:4(yank-then-delete 陷阱、命名寄存器累加(宏预备)、系统剪贴板粘贴、`:reg` 查看)。
- IDE 备注:VSCodeVim 中 `y` 默认进系统剪贴板的配置(`vim.useSystemClipboard`);IdeaVim `set clipboard+=unnamed`。

### ch10 撤销、重复与宏
- 目标:用 `.` 和宏把重复劳动变成一次录制。
- 覆盖:`u Ctrl-r`;`.` 重复的适用边界;`q{reg}` 录制 / `@` / `@@`;`:normal`;`Ctrl-a Ctrl-x` 数字增减(宏编号神器);宏里 `j` 结尾、计数宏 `22@q`。
- 演示:6(`.` 改词、宏批量行尾加分号、宏生成编号列表(Ctrl-a)、`:normal` 批量执行、宏修正排版、`@q` 回放)。
- IDE 备注:VSCodeVim 宏录制已知限制;IdeaVim 宏与 IDE undo 栈的交互。

### ch11 多文件与窗口
- 目标:buffer 思维 + 分屏。
- 覆盖:`:ls :b{n} :e`;`Ctrl-^` 最近文件往返;分屏 `:sp :vs Ctrl-w {hjkw o c _ =}`;tab 简述;quickfix 简介(`:cn :cp`)。
- 演示:3(Ctrl-^ 往返、分屏移动、:b 切换)。
- IDE 备注:在 IDE 里这些命令映射到什么(gt/gT 切 tab、最近文件弹出、`Ctrl-^` 两边都可用);「能用 IDE 原生就别硬用 vim 等价物」的原则。

### ch12 IDE 集成:配置与特色命令
- 目标:把 Vim 融进 IDE 而不是对抗 IDE。
- 覆盖:**VSCodeVim settings.json 推荐段**(leader、easymotion、surround、smartRelativeLine 等,生成时以官方 README 为准核对);**`.ideavimrc` 推荐全文**(`set relativenumber number`、`set surround`、`set easymotion`、`sethandler` 冲突键仲裁);IDE 特色键:`gd`(跳定义)、`gh`(悬停)、`K`(文档)、`Ctrl-o/Ctrl-i` 跳转链、`gb` 多光标;「vim 键位负责编辑,IDE 负责导航」的分工哲学。
- 演示:4(gd + Ctrl-o 跳转往返、leader 快捷前缀、surround 加引号改引号、多光标 gb)。
- IDE 备注:本章本体就是 IDE 备注;生成前必须查两边官方文档核对配置项现状。

### ch13 实战案例集(毕业考)
- 目标:综合运用,每案例给「Vim 解法动画 + 按键分解 + 鼠标/IDE 原生做法对比 + 按键数对比」。
- 案例(≥10):① 行尾批量加分号 ② 局部变量重命名(`* + ciw + n .`)③ 函数参数删除/重排(`da(` `dw`)④ 批量注释/取消注释(块选)⑤ 提取字符串为常量(`ciw` + `p`)⑥ 日志语句批量清理(`:g/console/d`)⑦ CSV/表格列提取(块选 y)⑧ JSON 键值规范化(`:%s`)⑨ 批量重命名编号(Ctrl-a 宏)⑩ HTML 标签改写(`cit` `ci"`)⑪ 交换赋值语句(`dd p`)⑫ 删掉函数内所有空行(`:g/^$/d`)。
- 演示:每案例 ≥1,合计 ≥12。

### 附录A cheatsheet.html
- 单页快速参考:按「移动 / 文本对象 / 动词 / 可视化 / 查找替换 / 寄存器 / 宏 / IDE 集成」分组的按键表 + 「编辑语言」语法卡片。**打印友好**(独立 print 样式,黑白可读)。

### 附录B faq.html
- 陷阱与 FAQ:Esc 太远(Caps 改 Esc 建议)、中文输入法切换、插入模式里 Cmd-v、可视模式选不完、宏录砸了怎么办、VSCodeVim/IdeaVim 已知坑、学习曲线安抚。

### 附录C playground.html(P5 可选)
- 按键自测 quiz:给出任务描述 + 初始代码,用户输入按键序列,JS 判定(内置小题库,数据驱动,同 demo JSON 格式扩展 `answer` 字段)。不嵌 vim.wasm(重、需网络),列为远期可选。

---

## 5. 章节内容模板(每章 HTML 必须遵守)

```html
<article class="chapter" data-ch="04">
  <header> 章号 · 标题 · 预计阅读 · 前置章节链接 </header>
  <section class="goal">        <!-- 学习目标,3–6 条 bullet -->
  <section class="lesson">      <!-- 正文:多个 <h2>/<h3> 小节;
                                     每个概念配按键表(table.keys)或演示 -->
  <section class="demo-slot" data-src="demos/ch04/01-iw-vs-aw.json"></section>
  <section class="drills">      <!-- 练习 ≥3,每题 <details> 折叠答案 -->
  <section class="pitfalls">    <!-- 常见陷阱 ≥2 -->
  <section class="ide-notes">   <!-- 两栏:VSCode / IDEA 差异,必须非空 -->
  <section class="recap">       <!-- 本章按键速记表 -->
  <footer> 上一章 / 下一章链接 </footer>
</article>
```

写作规范:
- 语言:中文讲解;按键、命令、代码保持英文原文。**不做英文版(用户 2026-09-16 明确)**。
- **详细度基准(用户 2026-09-16 要求翻倍)**:每章正文目标 **3000–8000 字** + 表格;每个按键必须给「什么时候用」的场景;配意图→按键对照表;核心章配决策法则与训练法;时间盒训练计划表(样板:ch01 §7)。
- 按键一律 `<kbd>d</kbd>`;命令/代码用 `<code>`;连续按键写 `<kbd>d</kbd><kbd>a</kbd><kbd>w</kbd>`。
- 术语统一:动词(operator)/ 名词(motion、text-object)/ 文本对象 / 寄存器 / 宏 / 待决状态(pending)。
- 讲解风格:先"为什么/什么时候用",再"怎么按",最后动画 + 练习。避免手册式罗列。
- 演示最低数量在 §4 各章标注基础上统一 **+2**(核心章 ch04/ch05/ch13 维持原数已够;其余章按标注值,总体全站 ≥90)。

---

## 6. 演示数据规范(vim-player.js 的输入)

### 6.1 文件与注册

- 演示数据在 `demos/chNN.js`(每章一个注册表文件),数据结构与 §6.2 的 JSON 完全一致,只是包了一层注册语句:
  ```js
  var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};
  VIMDEMOS['ch01-01-i-esc'] = { version: 1, id: 'ch01-01-i-esc', /* … */ };
  ```
  **禁止**裸全局赋值(`VIMDEMOS.xx = …` 之外的写法不进沙箱);id 必须以章号开头(`chNN-`),章内 HTML 只通过 `<div class="demo-slot" data-demo="id"></div>` 引用。
- 选 `.js` 注册表而非 `.json` + fetch:经典 `<script>` 在 `file://` 下也能加载,保证"双击 index.html 即可用",不需要本地服务器。

### 6.2 Schema(v1)

```json
{
  "version": 1,
  "id": "ch04-01-iw-vs-aw",
  "title": "iw 与 aw:删词的两种边界",
  "lang": "ts",
  "speed": 900,
  "relativeNumbers": false,
  "initial": { "mode": "normal", "cursor": [0, 6], "lines": ["const userName = 1;"] },
  "steps": [
    { "type": "key", "key": "v", "note": "先进入字符可视化,看清对象的范围", "mode": "visual", "sel": [[0,6],[0,6]] },
    { "type": "key", "key": "i", "note": "i = inside,只含单词本身", "sel": [[0,6],[0,13]], "pending": "vi" },
    { "type": "key", "key": "w", "note": "viw 选中了 userName(不含空格)", "sel": [[0,6],[0,13]], "pending": "" },
    { "type": "key", "key": "Esc", "note": "退回 normal,换 aw 对比", "mode": "normal", "sel": null },
    { "type": "key", "key": "d", "note": "这次直接删", "pending": "d" },
    { "type": "key", "key": "a", "note": "a = around,连边界(空格)", "pending": "da" },
    { "type": "key", "key": "w", "note": "daw = 删除单词+尾部空格",
      "lines": ["const = 1;"], "cursor": [0, 6], "pending": "" }
  ]
}
```

### 6.3 字段规则(校验脚本强制)

| 字段 | 规则 |
|---|---|
| `mode` | `normal / insert / visual / visual-line / visual-block / replace` |
| `cursor` | `[行, 列]`,0 起算;**必须**在 buffer 范围内 |
| `lines` | **快照语义**:凡本步改变 buffer,必须给出该步之后**整个 buffer** 的完整行数组;不变则省略 |
| `sel` | 可选,`[[l1,c1],[l2,c2]]` 选择高亮(visual 演示用);`null` 清除 |
| `pending` | 模拟状态栏右下角的待决序列,如 `d`、`gU`、`2d`;无则省略或 `""` |
| step.type | `key`(单键,特殊键写 `C-v` `Esc` `Enter` `<`)/ `type`(连续输入文本,配 `text`)/ `cmd`(命令行,配 `text` 如 `:%s/foo/bar/g`,渲染在状态栏并回车)/ `wait`(纯停顿只显示 note) |
| `note` | 每步必须有,≤ 60 字,讲"这一步发生了什么/为什么" |
| `speed` | 每步默认停留 ms(600–1500) |

### 6.4 播放器行为(实现要求)

- UI:标题栏 + 控制(▶/⏸、⏭ 单步、⟲ 重置、0.5×/1×/2×);代码区(行号、块状光标闪烁、选择高亮、被修改处短暂闪烁);状态栏(模式 + pending);按键流胶囊(已按的键依次点亮,当前键高亮);注释区(当前步 note)。
- 代码区**永远深色**(终端气质),与站点主题无关;带简单语法高亮(`lang` 字段,内置 js/ts/json/html/css 的最小 tokenizer,失败则纯色)。
- 自动播放到每步停 `speed` 毫秒;页面滚到视口内才开始(IntersectionObserver);支持键盘控制。
- 实现 ~300–400 行 vanilla JS,单文件,无依赖。

---

## 7. 视觉与交互风格

- **双主题**:默认浅色「羊皮纸」+ 深色「终端黑」,气质延续参考站(CSS 变量 `--bg-base --bg-card --accent` 等,rgb 三元组写法),localStorage 记忆,顶栏切换。深色主题取终端/Dracula 气但配色自定。
- 版式:正文栏 max-width ≈ 880px;首页章节卡片网格(带完成度圆环,读 localStorage);章节页顶部有返回目录 + 主题切换。
- `<kbd>` 键帽:圆角、描边、底部厚边,像真实键帽;`<code>` 用 chip 样式。
- **零外部依赖**:系统字体栈 + UI 等宽栈;不引 CDN、不引框架;断网双击可用。
- 响应式:≥768px 双栏(正文 + 侧边目录),窄屏单栏。

---

## 8. 实施阶段

| 阶段 | 内容 | 产出 | 验收 |
|---|---|---|---|
| P0(已完成) | 计划三件套 | PLAN / STATUS / CLAUDE | 用户认可计划 |
| P1 | 站点骨架 + vim-player + **ch00 + ch01 样板章** + check 脚本 | index、assets、ch00/01、≥5 demos | 用户验收视觉与播放器风格 |
| P2 | 核心编辑五连 | ch02–ch06 + 各 demos | check 全绿;用户抽查 |
| P3 | 进阶五连 | ch07–ch11 | 同上 |
| P4 | 毕业与手册 | ch12–ch13、cheatsheet | 同上 |
| P5 | 打磨 | faq、playground(可选)、打印样式、进度环 | 收尾 |

- 每阶段完成:更新 STATUS 总览与会话日志。节奏建议:每会话 1–2 章,不贪多。
- P1 是风格基准:用户验收通过后,P2 起严格复用其 class 与组件,不再改样式基调。

---

## 9. 每章验收清单(完成一章前逐项过)

- [ ] HTML 符合 §5 模板,七个 section 齐全(ide-notes 非空)
- [ ] 正文 ≥3000 字(不含表格与演示),详细度符合 §5 新基准(场景 + 决策法则 + 训练法)
- [ ] 演示数 ≥ 该章最低要求,demos 数据符合 §6.3(快照语义、cursor 越界、note 齐全)
- [ ] 练习 ≥3 且带折叠答案;陷阱 ≥2
- [ ] 上/下一章链接正确;index 目录同步
- [ ] `node tools/check.mjs` 全绿
- [ ] STATUS.md 已更新(状态 done、demo 计数、日志)

---

## 10. 跨 agent 协作规则

- `STATUS.md` 是唯一进度;动手先上锁(`in_progress` + agent 名 + 日期),完成立即解锁并写日志。
- 一次只做一个任务;`done` 的章节/资产冻结,除非用户点名重做。
- 多 agent 并行时按章分车道(文件互斥),禁止跨章改他人正文;`assets/` 与 `tools/` 只有 P1 owner 可写,P2 起只读。
- 配置类内容(ch12)生成前必须核对 VSCodeVim / IdeaVim 官方文档,不凭记忆写配置项。
- 不主动 git commit(本目录当前非 git 仓库,是否初始化由用户决定)。

---

## 11. 工具链

- 校验:`node tools/check.mjs`(node ≥18,本机 v23 ✅)。检查:章节必需 section、demo 引用存在且属于本章、注册表 Schema(§6.3)、状态模拟 cursor 越界、快照规则(变更步必须重申 cursor)、index / 章内链接完整性。
- 可选 GIF:`brew install vhs`(带 ffmpeg/ttyd 依赖;当前未装,默认不启用)。
- 本地预览:**直接双击 `index.html` 即可**(演示用 `<script>` 注册表加载,file:// 下无障碍)。
- 视觉自检(推荐):无头 Chrome 截图后用视觉检查 —— 
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/shot.png --window-size=1440,6000 --virtual-time-budget=10000 --hide-scrollbars "file://$PWD/chapters/ch01.html"`

# Vim 学习站 — 进度(跨会话唯一真相)

> **任何会话(含上下文清理后 / 新 agent)第一步读本文件。**
> 聊天记录不是记忆。规范见 [`PLAN.md`](./PLAN.md),写作前按需回读 §4–§7。

## 总览

| 项 | 值 |
|---|---|
| 当前阶段 | **全站内容完成:正文章 ch00–ch13 + 附录A cheatsheet + 附录B faq 全部上线(16 卡全绿)** |
| 下一步任务 | 可选:附录C playground(远期);或按用户指令提交推送 GitHub |
| 已完成章 | 13 / 13 章 + 附录 A/B(首页 16 卡全部真实链接) |
| 演示总数 | 94 |
| 硬性约束 | 全中文,不做英文版;**详细度基准已翻倍**(PLAN §5,2026-09-16 用户反馈) |

## 任务表

### P1 骨架与样板

| 任务 | 状态 | 产出 | 锁 |
|---|---|---|---|
| P1-1 站点骨架(index + style.css + nav/progress) | ✅ done | index.html, assets/css+js | — |
| P1-2 vim-player.js 播放器 | ✅ done | assets/js/vim-player.js(自演示归入 ch00) | — |
| P1-3 tools/check.mjs | ✅ done | tools/check.mjs(当前全绿) | — |
| P1-4 ch00 使用指南 | ✅ done | chapters/ch00.html, demos/ch00.js(1 自举演示,正文约 1500 字,短章定位) | — |
| P1-5 ch01 生存篇(含 IDE 配置) | ✅ done(v2 已扩写) | chapters/ch01.html, demos/ch01.js(7 演示,正文约 3250 字) | — |
| P1-6 用户验收(视觉/播放器风格) | ✅ done(用户要求继续生成后续章节,视为通过;选中 bug 由 Cursor Grok 修复) | — | — |

### P2 核心编辑五连

| 章 | 标题 | 状态 | demo 数(要求) | 日期 |
|---|---|---|---|---|
| ch02 | 移动·字符与词 | ✅ done(7 演示,正文约 3080 字) | ≥6 | 2026-09-16 |
| ch03 | 移动·行与文件 | ✅ done(7 演示,正文约 3170 字) | ≥6 | 2026-09-17 |
| ch04 | 文本对象 | ✅ done(9 演示,正文约 3240 字) | ≥8 | 2026-09-17 |
| ch05 | 编辑动词与语法 | ✅ done(10 演示,正文约 3090 字) | ≥8 | 2026-09-17 |
| ch06 | 插入与替换模式 | ✅ done(5 演示,正文约 3090 字) | ≥4 | 2026-09-17 |

### P3 进阶五连

| 章 | 标题 | 状态 | demo 数(要求) | 日期 |
|---|---|---|---|---|
| ch07 | 可视化模式与块编辑 | ✅ done(7 演示,正文约 3200 字) | ≥6 | 2026-09-17 |
| ch08 | 查找与替换 | ✅ done(7 演示,正文约 3130 字) | ≥6 | 2026-09-17 |
| ch09 | 寄存器与剪贴板 | ✅ done(5 演示,正文约 3150 字) | ≥4 | 2026-09-17 |
| ch10 | 撤销、重复与宏 | ✅ done(7 演示,正文约 3630 字) | ≥6 | 2026-09-17 |
| ch11 | 多文件与窗口 | ✅ done(4 演示,正文约 3130 字) | ≥3 | 2026-09-17 |

### P4 毕业与手册

| 章 | 标题 | 状态 | demo 数(要求) | 日期 |
|---|---|---|---|---|
| ch12 | IDE 集成:配置与特色命令 | ✅ done(6 演示,正文约 2950 字;配置已核对官方文档) | ≥4 | 2026-09-17 |
| ch13 | 实战案例集 | ✅ done(12 演示,正文约 3080 字) | ≥12 | 2026-09-17 |
| 附录A | cheatsheet 快速参考 | ✅ done(根目录 cheatsheet.html:14 组分组表 + 5 张语法卡 + 模式速览,内联 A4 打印样式,每行注明出处章节) | 0(参考页无演示) | 2026-09-17 |

### P5 打磨

| 任务 | 状态 |
|---|---|
| 附录B faq | ✅ done(根目录 faq.html:15 问 × 四类 + 三个忠告;兑现 ch01 两个「见附录 B」承诺 —— Caps→Esc 各平台步骤、VSCodeVim 输入法自动切换官方 im-select 配置已核对 README;beforeprint 自动展开折叠) |
| 打印样式 | ✅ done(附录A 内联 A4 print 样式:黑白可读、kbd 描边、tr 防跨页断裂;附录B 内联 print 补充) |
| 进度环 | ✅ done(P1 已实现进度条 + 卡片已读态,附录卡 data-ch="apxa/apxb" 纳入统计 0/16) |
| 收尾检查 | ✅ done(check.mjs 全绿 94 演示;附录两页 + 首页无头 Chrome 截图复核;ch13 pager 接通 cheatsheet) |
| 附录C playground 按键自测(可选) | ⬜ 远期可选(PLAN §4 明列远期,不阻塞收官) |

## 会话日志(新会话往下追加)

| 日期 | agent | 做了什么 | 备注 |
|---|---|---|---|
| 2026-09-16 | Claude(GLM) | P0:写定 PLAN.md / STATUS.md / CLAUDE.md 三件套 | 待用户认可计划后开 P1 |
| 2026-09-16 | Claude(GLM) | P1 主体:站点骨架(双主题 CSS、nav、progress)、vim-player.js 快照式播放器、check.mjs、ch01 全章 + 6 个演示;无头 Chrome 截图自检通过(含深色主题);PLAN §3/§6/§11 更新为 .js 注册表方案 | P1-4 ch00 与 P1-6 验收待做。用户明确:全中文不做英文版,已写入 PLAN 非目标 |
| 2026-09-16 | Claude(GLM) | 用户三条反馈落实:①全局字号加大(body 17px,组件 +1~2px);②浅色主题键帽对比度修复(新增 --kbd-bg/--kbd-border 变量,亮底深边;深色不变);③ch01 内容详细度翻倍(lesson 约 3250 字,新增 §1.2 场景对照、§3.4 决策法、§3.5 插入模式世界、§6 指法热身、§7 训练计划表、§8 三件事;演示 6→7 新增 I/A;练习 3→4、陷阱 3→4)。PLAN §5 写入新详细度基准(3000–8000 字/章),§9 验收清单同步 | 播放器与浅色主题截图复验通过;check.mjs 全绿 |
| 2026-09-16 | Claude(GLM) | 用户四条反馈落实(v3,纯样式):①全文放开选中复制 —— body 显式 user-select:text(-webkit 同步),删除 .vdp-ln 的 user-select:none,.vdp-editor 光标改 text,无头 Chrome 计算样式探针验证全站 text;②模式地图 NORMAL 盒浅色看不清 → 新增 --fig-hot 变量(浅色实底 #c4dfcd,深色等价实底),.fig-box-hot 改用之;③小节间距与标题 → h2 22→25px/weight 800/上边距 46→70px/侧条 4→5px,h3 17.5→19px/上边距 34px;④侧边目录 right→left(宽 208→200px,隐藏断点 1250→1399px 防与正文重叠) | 双主题截图复验通过(NORMAL 盒、标题、左目录均确认);check.mjs 全绿 |
| 2026-09-16 | Claude(GLM) | v4:①目录贴片化 —— 卡片底/描边/圆角/阴影,定位从贴视口左缘改为锚定居中正文栏(right: calc(50%+490px),与正文 20px 间隙),断点 1419px;h2/h3 加 scroll-margin-top:84px 防锚点被顶栏遮挡;②用户仍报无法选中 → 用 puppeteer-core 驱动系统 Chrome 真实鼠标事件测试:正文拖选正常,说明页面本身无阻;定位到真问题:演示自动播放每步重建 innerHTML 会清掉编辑区内选区 → render() 加选区守卫(编辑区内有活动选区时跳过重绘),::selection 透明度 0.28→0.38;测试验证:播放中选中代码推进 2 步后选区保留 | 若用户仍无法选中,需问清查看环境(浏览器/IDE 内嵌预览) |
| 2026-09-16 | Cursor Grok | 用户再次报 ch01 鼠标无法选中。根因是上次守卫不完整:播放器每步 `keysEl.innerHTML` 仍会清掉**整页**选区,拖选过程中定时器重绘会直接中断选区。改为按下鼠标/存在选区时冻结全部播放器 DOM 改写;按键流改 class 不拆节点;选中高亮改实色(不再用 Safari 非法的 rgba(var(),a));`*` 显式 user-select:text。Chrome CDP 拖选正文出现绿色高亮,播放中选区保持;check.mjs 全绿。删掉遗留 debug-select.html | 请用户 ⌘⇧R 硬刷新后再试 |
| 2026-09-16 | Claude(GLM) | 用户确认选中已修复,要求生成 ch00。产出:P1-4 完成 —— chapters/ch00.html(七段结构齐全:用法/播放器指南/学习方法三铁律+四周曲线表/动词+名词语法条预览/五阶段路线图/约定术语;练习 3、陷阱 3;正文约 1500 字,短章定位符合 PLAN §4)+ demos/ch00.js(ch00-01-player-tour 自举演示,借 x/u/j/A/Esc 教播放器控制);index 卡片 ch00 上线(data-ch 参与进度统计 1/14);ch01 pager 上一章改指 ch00;修正 ch00 内指向未建章节的链接为纯文字 | check.mjs 全绿(8 演示);双主题截图正常。P1 全部收口,下一步 P2 ch02 |
| 2026-09-16 | Claude(GLM) | P2 开工:ch02 移动·字符与词。demos/ch02.js 7 个演示(hjkl+计数、w/b/e、W-vs-w、0^$g_ 行内瞬移含尾随空格对比、f/t/;、dt, 射程预告、两键到达组合拳);chapters/ch02.html 十一节:经济账论证、hjkl 含 ADM-3A 历史典故、词边界三规则、大小词换挡、^$ 正则助记、A=$+a 打包论、射程三连(dw d$ df;)、先粗后细心法、gj/gk 折行一句带过、3 天 30 分钟训练计划表;练习 4(盲走网格/词表朗读/f 跳转游戏/两键挑战盲测)、陷阱 4(方向键复吸/数格子/标点碎步/g_ 不背);index ch02 卡片上线,ch01 pager 下一章指向 ch02;扩写一轮 1913→3076 字达标 | check.mjs 全绿(15 演示);截图复核版式与演示渲染正常 |
| 2026-09-17 | Claude(GLM) | 用户点名跳过 ch03,先写 ch04+ch05 两章。ch04 文本对象:demos/ch04.js 9 个演示(iw/aw 双空格对比、ciw 改名、di(/da( 光标任意位置、ci"+da" 引号、嵌套 i{ 最内层、ip/ap 段落、cit/dat 标签(html lang)、跨行 i(、动词轮换 yiw+p);chapters/ch04.html 十一节:路径思维 vs 指物思维、i/a 语法 + 对象全家族表、a 多吃一口口诀、括号三件套场景表、引号规则两条、有壳用壳没壳用段、嵌套最内层、跨行能力、动词×名词矩阵表(带 ⭐ 标注)、3 天训练计划;练习 4、陷阱 4(全角标点/JSX 标签匹配);正文扩写至 3242 字。ch05 编辑动词与语法:demos/ch05.js 10 个演示(d 射程菜单、2dw=d2w 计数、cw/c$/C/cc、yw/y$/yy+p、dd+p 换行序 dw+P 换词序、r/s/S、~/gUiw/gUU、>>/<</==、J/gJ、毕业演出 capstone 签名重构 ci(+ciw×2);chapters/ch05.html 十二节:语法公式 [count]动词[count]名词 + 三条说话纪律、d=剪切伏笔、cw 不吃空格、大写打包键家族、c 是一口气、y 三习惯、p 形状语义表、xp 交换 callout、== 走 IDE 格式化、J 宁慢勿快、capstone 词法复盘;练习 4、陷阱 4;正文扩写至 3086 字。index ch04/ch05 卡片上线(顺带把 ch01 卡片演示数 6→7 改正);ch04 pager 上一章用禁用占位(ch03 未建),ch05 pager 指向 ch04 | check.mjs 全绿(34 演示);无头 Chrome 截图 + 视觉复核两章演示播放器渲染正确(按键流/光标/最终快照均符合预期) |
| 2026-09-17 | Claude(GLM) | 用户点名补齐 P2 尾巴:ch03 + ch06。ch03 移动·行与文件:demos/ch03.js 7 个演示(相对行号 2j/4k —— 首次启用 relativeNumbers:true 渲染相对行号、gg/G/3G/:5、段落 { } 含 2{、% 配对往返 + d% 删块、书签 ma/'a/`a、H/M/L + zz/zt、跳转表 Ctrl-o/Ctrl-i);chapters/ch03.html 十一节:滚动 vs 到达哲学、相对行号思维 + 混用形态、文件三键 + 报错跳行 + IDE 转到行对照、段落移动落点在空行、% 三层用法(看结构/配对自检/当名词)、书签对照改码场景、窗口地标与滚动家族、跳转表与书签分工、十行决策表「去哪儿用什么」、3 天训练计划;练习 4、陷阱 4(相对号当绝对号/}落点/Ctrl-d 冲突/小写书签不持久);正文 3174 字。ch06 插入与替换模式:demos/ch06.js 5 个演示(I/A 补 const 补分号、o/O 数组头尾插元素、gi 回上次插入点、插入内 Ctrl-w/Ctrl-u/Ctrl-t、R 等长覆写 insert→visual + 半程覆写警示);chapters/ch06.html 十一节:插入模式不是休息区/停留时长指标、十扇门按意图分组表、I/A 缩进行尾体贴、o/O 头部插入 + 与复制行区分、gi 与 ^ 标记、插入内小剪刀表 + Ctrl-w 留空格哲学、Ctrl-o 单发子弹(与普通模式跳转表同名不同物)、R 三工具半径选型(r/R/ciw)、实战节奏纸面推演、3 天训练计划;练习 4、陷阱 4(i 硬闯行首/Esc 关弹窗/R 忘退出/插入内方向键);正文 3083 字。index ch03/ch06 卡片上线;ch02 pager 下一章、ch04 pager 上一章由占位换真链接 | check.mjs 全绿(46 演示);无头 Chrome 截图 + 视觉复核:ch03 相对行号渲染正确(当前行绝对号、余行距离),ch06 三个播放器(o/O、gi、Ctrl 剪刀)渲染正常;P2 至此收官 |
| 2026-09-17 | Claude(GLM) | 用户点名生成 ch07+ch08+ch09(P3 前三连)。ch07 可视化模式与块编辑:demos/ch07.js 7 个演示(v 字符选 U 大写/c 改写 —— 全站首次启用 sel 选区高亮、V 行选 > 缩进 + . 重复、C-v+I 块插入批量 // 注释(延迟满足)、C-v+$+A 行尾批量分号、C-v+$+d 块删列、gv 召回 + o 换端修剪、选区动词菜单 d/c/~ 与 gv 三连击);chapters/ch07.html 十一节:为什么还需要选(眼见为实/不规则/矩形三类不可替代)、v 圈地施工(可视里 i 留给文本对象)、V 按行算账(V 扩 > . 四拍)、块是一等公民($ 拉到各行行尾)、I/A 延迟满足 + 打错就 u 重来 + 块选择权、块删/块替/块涂改 d c r 对照、o/O/gv 微调三键、动词菜单表 + 「选区是先给宾语的语序」、按形状选工具决策表(块 vs 多光标:几何列 vs 内容匹配)、3 天训练计划;练习 4、陷阱 4(没 Esc 以为没生效/可视里按 i 想打字/折行错位/y 后选区没了);正文约 3200 字。ch08 查找与替换:demos/ch08.js 7 个演示(/ + Enter + n/N(查找词用 pending 模拟状态栏)、* + n + ciw + . 重命名流水线、:s 无 g vs 有 g(全站首次用 type:cmd 渲染命令行)、:%s//gc 确认模式 y/n/a、V 选区 + : 自动 '<,'> 前缀(显式 cmdline 字段)、:g/console/d + :g/^$/d + u 整条回滚、:s + j&j& 逐行重播);chapters/ch08.html 十一节:查找是移动替换是批量(含 cnt→count 全章预演)、/ 与 n/N(incsearch/hlsearch/:noh/查找历史)、* 与 #(整词 vs g*)、:s 五段式 + 四旗帜表 + \1 捕获组、range 全家表(含 '<,'>+1 复合微调)、确认模式五键表 + 三档信任度对比、& 与命令历史与换分隔符 #、:g/:v + 常用存货清单(m$ 搬运)、意图→工具决策表 + 文本替换 vs F2 语义重命名安全边界、3 天训练计划;练习 4、陷阱 4(不带 g/正则元字符/手滑 a/分隔符被路径截胡);正文约 3130 字。ch09 寄存器与剪贴板:demos/ch09.js 5 个演示(yy→dd→p 陷阱 + "0p 救场、"a 存 "A 追加收集散行、"yiw→"_dd→p 黑洞隔离对照、"+yy/"+p 系统剪贴板往返、三连删数字梯 + :reg + "2p 取回);chapters/ch09.html 十一节:bug 引出的一章 + 默认通道跑高频设计哲学、48 抽屉总表 + 重构下午场景激活、无名寄存器纪律 + p/P 形状、数字梯传送带 + "0 vs "1 分工 + 显式绕开自动系统、命名抽屉一屉一用 + 宏伏笔、黑洞与只读三件、系统口岸 + 双通道哲学、:reg 与插入内 Ctrl-r、决策表八场景、2 天训练计划;练习 4、陷阱 4(顶掉当 bug/传送带顺延/*与+跨平台/默认互通反混);正文约 3150 字。index ch07/ch08/ch09 卡片上线;ch06 pager 下一章换真链接 | check.mjs 全绿(65 演示);无头 Chrome 截图 + 视觉复核三章:sel 选区高亮、cmd 命令行渲染、寄存器前缀 pending 全部符合预期;正文纯汉字 2614–2665(含标点约 3100–3200,与 ch06 基准持平) |
| 2026-09-17 | Claude(GLM) | 用户点名生成 ch10+ch11(P3 收官)。ch10 撤销、重复与宏:demos/ch10.js 7 个演示(u/Ctrl-r 会话单元与来回重放、`.` 单格记忆被 dd 覆盖的事故演示、A;+j. 补分号节奏、qa 双动作宏 @a/@@ 回放、Ctrl-a+yyp 自推进宏 5@a 造序列、:%normal 批量+u 整体回滚+range/g 组合、`*` 搜索驱动宏 4@a 连发改名自动刹车);chapters/ch10.html 十二节:重复三等级地图、撤销单元粒度表、`.` 记什么不记什么表、黄金节奏、宏=按键序列寄存器(ch09 兑现)+设计三纪律、Ctrl-a 归零再生长、:normal 与 :s 分工、22@q 连发、宏调试修复(u/重录/qA 追加/:reg 看内容)、四工具决策表+判断三问、3 天训练计划;练习 4、陷阱 4(插入中方向键拆单元/错误位置开录/宏内绝对跳转/Ctrl-a 找不到数字)。ch11 多文件与窗口:demos/ch11.js 4 个演示(:ls/:e/:b1/Ctrl-^ 双文件乒乓、:sp 分屏+下窗改上窗同步现(同一缓冲区)+Ctrl-w j/w/o、:tabe/gt/2gt/:tabc 标签页、:vimgrep/:cn/:cclose quickfix 逐条消化);chapters/ch11.html 十一节:缓冲区/窗口/标签页三层心智模型+两大流派、:ls 符号表、Ctrl-^ 交替缓冲区、Ctrl-w 全家表+三大分屏场景、tab=布局桌面、quickfix 与宏连发联动、:wa/:qa!/hidden、IDE 分工「找到靠 IDE 改靠 vim」、决策表、2 天训练计划;练习 4、陷阱 4(+号未存/焦点迷路/标签堆 20 个/上一个被顶掉)。index ch10/ch11 卡片上线;ch09 pager 下一章换真链接;ch11 演示 3 修正一处快照失真(:tabc 后画面应回 app.js) | check.mjs 全绿(76 演示);无头 Chrome 截图复核两章版式与播放器初始化(7+4);正文纯汉字 ch10=3434、ch11=2941(含标点约 3630/3130,超 ch06 基准);全部 11 个新演示初/终快照人工核对无误 |
| 2026-09-17 | Claude(GLM) | 用户点名生成 ch12+ch13(正文章收官)。**ch12 前置动作:按 PLAN §10 核对官方文档**(WebFetch VSCodeVim README + IdeaVim README,WebSearch 定位 sethandler wiki)—— 核实:vim.leader 默认 "\\"、vim.surround 默认 true(无需配置)、vim.easymotion 默认 false、vim.handleKeys 归还键、gd/gb 官方记载、VSCodeVim 无行号设置(归编辑器原生);IdeaVim 的 set surround/easymotion/relativenumber、sethandler <键> <模式>:ide|vim 语法、map gh <Action>(ShowErrorDescription) 与 :actionlist、~/.ideavimrc 路径。**ch12 IDE 集成**:demos/ch12.js 6 个演示(gd 跳定义 + Ctrl-o/Ctrl-i 跨文件往返、<space>d leader 映射、ysiw"/cs"'/ds' surround 三件套、gb×3 多光标 + ciw 一次改三处、Ctrl-a 冲突与 sethandler 仲裁概念、<leader>f easymotion 标签跳);chapters/ch12.html 十二节:融合哲学、settings.json 推荐段(逐项注默认值)、.ideavimrc 推荐全文、五根导航桥表(gd/gh/K/Ctrl-o/Ctrl-i)、leader 发射台、surround 三件套表、gb 多光标与块选/宏三路选型、冲突仲裁清单(Ctrl-a/d/f/y/r)+ sethandler/handleKeys 表、easymotion 屏内瞬移、配置核对速查表(ide-notes 栏改作核对记录,注明来源与日期)、2 天训练计划;练习 4、陷阱 4(凭记忆写配置/.ideavimrc 不重载/弹窗仲裁不落盘/多光标选过头)。**纠错**:发现并把「IDEA Ctrl-a=添加下一个匹配」的初稿错误说法改正为「全选 Select All(多光标是 Alt+J)」,demo 与正文三处同步。**ch13 实战案例集**:demos/ch13.js 12 个演示(①块选 $ A 补分号 ②*+ciw+n. 改名 ③f r+daw+x 参数微创 ④块注释/块取消 ⑤ya"+ggO+p+ci" 提取常量 ⑥:g/console/d+u+:g/console\.time/d ⑦块选 y+p 抽 CSV 列 ⑧:%s 捕获组键名加引号 ⑨归零+Ctrl-a 宏编号重排 ⑩cit+ci" 标签改写 ⑪dd+p 交换两行 ⑫V 选区+'<,'>g/^$/d 删函数内空行);chapters/ch13.html:方法论(兵器谱表)+ 12 案例节(任务/鼠标做法/按键分解/成本账四段式)+ 四种圈法规律表(结构/几何/内容/重复)+ 周末毕业拉练计划 + 三件事;练习 4(含一题多解与组合变式)、陷阱 4(照抄不看语境/追求一次到位/该交 IDE 硬上/块选前不查行齐)、ide-notes 每案例 IDE 原生对照、recap 十二案例一表收。index ch12/ch13 卡片上线、hero 徽标 70+→90+;ch11 pager 下一章换真链接 | check.mjs 全绿(94 演示);无头 Chrome 截图复核两章(6+12 播放器全部初始化,配置代码块渲染正常);18 个新演示初/终快照人工核对全部符合预期;正文纯汉字 ch12=2756、ch13=2901(超 ch06 基准);正文章 13/13 收官,剩附录A/B + P5 |
| 2026-09-17 | Claude(GLM) | 用户点名「把剩下的附录都写完」,附录A/B 一次性收口。**附录A cheatsheet.html(根目录)**:14 组分组速查(生存五分钟/移动×2/文本对象/动词/插入/可视化/查找替换/寄存器/宏/多文件/IDE 集成/语法卡/模式速览),13 张 ktable + 5 张语法公式卡,每行注明出处章节链接;内联 A4 打印样式(assets/ 只读,故 <style> 内联:黑白可读、kbd 强制描边、@page 边距、tr/formula 防跨页断裂)+ 🖨 打印按钮。**附录B faq.html(根目录)**:15 问四类(装备与手感 4/疑难杂症 5/插件已知坑 4/心态曲线 2)+ 三个忠告;兑现 ch01 两处「详细步骤见附录 B」承诺 —— ① Caps Lock→Esc 各平台步骤(系统设置修饰键/Karabiner 双功能/PowerToys)② VSCodeVim 输入法自动切换:按 PLAN §10 先 WebFetch 官方 README 核对,采用官方 im-select 方案四行 JSON(发现官方示例工具是 im-select 而非 ch01 提的 macism —— 写法:官方 im-select 全配置 + 注明 macism 等任一第三方工具同理可换,README 原文即此意);IdeaVim 无对等设置,给通用替代。beforeprint 脚本自动展开全部折叠。**接线**:index 附录A/B 卡片转真实 <a> + data-ch="apxa/apxb"(进度分母 14→16);ch13 pager 敬请期待占位 → ../cheatsheet.html 真链接;附录A pager 接 ch13↔faq,附录B pager 接 cheatsheet↔index。cheatsheet 键位表全部与已教内容对齐(动笔前 grep 核实 ge/?/#/g*/Ctrl-x/:noh/zb/xp/gv/插入内 Ctrl-d 等均有出处) | check.mjs 全绿(94 演示);无头 Chrome 截图复核:cheatsheet 顶部/语法卡区、faq 顶部/展开答案、index 卡片区全部正常;全站 16 卡全上线,课程内容层面收官(仅剩远期可选 playground 与按需 git 推送) |

/* demos/ch13.js — 第十三章「实战案例集」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章 = 毕业考:12 个真实重构案例,每个案例 ≥1 个演示,合计 12 个。
 *    每个演示的 note 同时承担「按键分解」的逐步解说;鼠标做法与按键数
 *    对比写在章节正文里。块插入遵循全站约定:打字步只改光标行,Esc 全生效。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 案例① 行尾批量加分号(块选 $ A) */
VIMDEMOS['ch13-01-semicolons'] = {
  version: 1,
  id: 'ch13-01-semicolons',
  title: '案例① 三行补分号:块追加一套带走',
  intro: '行长不一、行尾不齐 —— Ctrl-v 圈行、$ 拉到各行行尾、A 补分号、Esc。鼠标:每行 End → ; → ↓,三倍按键。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['const a = 1', 'const b = 2', 'const c = 3'] },
  steps: [
    { type: 'key', key: 'Ctrl-v', mode: 'visual-block', cursor: [0, 0],
      note: 'Ctrl-v:块选择 —— 「列」形状的批量任务交给矩形(第 7 章)' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:矩形罩住第二行' },
    { type: 'key', key: 'j', cursor: [2, 0],
      note: 'j:第三行 —— 三行都在圈内' },
    { type: 'key', key: '$', cursor: [2, 11],
      note: '$:右边界拉到【各行自己的行尾】—— 行长不一无所谓,块模式特有语义' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [2, 11],
      note: 'A:块追加 —— 只有光标行显示输入,别处静悄悄(延迟满足)' },
    { type: 'type', text: ';', lines: ['const a = 1', 'const b = 2', 'const c = 3;'], cursor: [2, 12],
      note: ';:打一个分号 —— 前两行纹丝不动,在等 Esc' },
    { type: 'key', key: 'Esc', mode: 'normal',
      lines: ['const a = 1;', 'const b = 2;', 'const c = 3;'], cursor: [0, 11],
      note: 'Esc:三行同时补上分号,收工。7 键 vs 鼠标 9 键,行数越多差距越大' }
  ]
};

/* 案例② 局部变量重命名(* + ciw + n .) */
VIMDEMOS['ch13-02-rename'] = {
  version: 1,
  id: 'ch13-02-rename',
  title: '案例② cnt 改 count:* 巡航 + n . 鼓点',
  intro: '光标词全文件点名(*),第一处 ciw 改好,之后 n(下一处).(重复改)—— 三处出现两键一循环。确认语义安全才这么干。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [1, 6],
    lines: ['function calc() {', '  let cnt = 0;', '  cnt += 1;', '  return cnt;', '}'] },
  steps: [
    { type: 'key', key: '*', cursor: [2, 2],
      note: '*:cnt 设为查找词并跳下一处 —— 先侦查:函数内共 3 处,都是同一变量(语境安全)' },
    { type: 'key', key: 'N', cursor: [1, 6],
      note: 'N:跳回第一处,开工' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改写' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '',
      lines: ['function calc() {', '  let  = 0;', '  cnt += 1;', '  return cnt;', '}'], cursor: [1, 6],
      note: 'ciw:第一处 cnt 吃掉,进入插入' },
    { type: 'type', text: 'count',
      lines: ['function calc() {', '  let count = 0;', '  cnt += 1;', '  return cnt;', '}'], cursor: [1, 11],
      note: 'count:新名字' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 10],
      note: 'Esc:第一处完成 —— 这段修改已被 `.` 存档(第 10 章)' },
    { type: 'key', key: 'n', cursor: [2, 2],
      note: 'n:下一处' },
    { type: 'key', key: '.',
      lines: ['function calc() {', '  let count = 0;', '  count += 1;', '  return cnt;', '}'], cursor: [2, 6],
      note: '`.`:原样重放 —— 改词这件事,n 和 `.` 交替敲,像打鼓' },
    { type: 'key', key: 'n', cursor: [3, 9],
      note: 'n:最后一处' },
    { type: 'key', key: '.',
      lines: ['function calc() {', '  let count = 0;', '  count += 1;', '  return count;', '}'], cursor: [3, 13],
      note: '`.`:收工 —— 3 处改名,11 键;鼠标同名操作每处都要划选+删+打' }
  ]
};

/* 案例③ 函数参数删除(daw + x 微创) */
VIMDEMOS['ch13-03-param-surgery'] = {
  version: 1,
  id: 'ch13-03-param-surgery',
  title: '案例③ 删掉 retry 参数:f r 到位,daw 微创',
  intro: 'f r 两键把光标钉在参数名上,daw 吃掉词和旁边空格,x 收走多余逗号 —— 括号与剩余参数无恙。da( 则一刀清空全部。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['connect(host, port, retry, verbose)'] },
  steps: [
    { type: 'key', key: 'f', pending: 'f',
      note: 'f:行内射程键(第 2 章)' },
    { type: 'key', key: 'r', cursor: [0, 20],
      note: 'r:直达 retry 的首字母 —— 目标参数钉在光标下' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除' },
    { type: 'key', key: 'a', pending: 'da',
      note: 'a:连壳带边(a 多吃一口,第 4 章)' },
    { type: 'key', key: 'w',
      lines: ['connect(host, port,, verbose)'], cursor: [0, 19],
      note: 'daw:吃掉 retry 和它旁边的空格 —— 逗号暴露在光标下' },
    { type: 'key', key: 'x',
      lines: ['connect(host, port, verbose)'], cursor: [0, 19],
      note: 'x:顺手收走多余逗号 —— 参数手术完成' },
    { type: 'wait', cursor: [0, 19],
      note: '另一条路:光标放括号内 da( 一刀清空全部参数;只动一个参数,daw+x 微创最准。全程 6 键,鼠标要划选三次' }
  ]
};

/* 案例④ 批量注释/取消注释(块选 I 与块删) */
VIMDEMOS['ch13-04-comment-toggle'] = {
  version: 1,
  id: 'ch13-04-comment-toggle',
  title: '案例④ 注释三行、再取消:块插入与块删除',
  intro: '注释:Ctrl-v 圈行 I 输入 // Esc;取消:f / 到注释列,Ctrl-v 圈住再 d。IDE 的 Cmd-/ 更省心 —— 但块选不挑语言、不用挪手。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 2],
    lines: ['  alpha();', '  beta();', '  gamma();'] },
  steps: [
    { type: 'key', key: 'Ctrl-v', mode: 'visual-block', cursor: [0, 2],
      note: 'Ctrl-v:块选择,从首行缩进后起圈' },
    { type: 'key', key: 'j', cursor: [1, 2],
      note: 'j:第二行' },
    { type: 'key', key: 'j', cursor: [2, 2],
      note: 'j:第三行' },
    { type: 'key', key: 'I', mode: 'insert', cursor: [2, 2],
      note: 'I:块插入(注意:只有光标行实时显示)' },
    { type: 'type', text: '// ', lines: ['  alpha();', '  beta();', '  // gamma();'], cursor: [2, 5],
      note: '// :打注释符 —— 打完不慌,等 Esc 发货' },
    { type: 'key', key: 'Esc', mode: 'normal',
      lines: ['  // alpha();', '  // beta();', '  // gamma();'], cursor: [0, 2],
      note: 'Esc:三行同时注释。取消呢?接着看' },
    { type: 'key', key: 'f', pending: 'f',
      note: 'f:找注释列' },
    { type: 'key', key: '/', cursor: [0, 2],
      note: '/:光标钉到注释符上' },
    { type: 'key', key: 'Ctrl-v', mode: 'visual-block', cursor: [0, 2],
      note: 'Ctrl-v:再圈块' },
    { type: 'key', key: 'j', cursor: [1, 2],
      note: 'j' },
    { type: 'key', key: 'j', cursor: [2, 2],
      note: 'j:三行注释列都进圈' },
    { type: 'key', key: '2l', cursor: [2, 4],
      note: '2l:右边界拉宽 2 格 —— 注释符 + 后随空格,三列宽' },
    { type: 'key', key: 'd',
      lines: ['  alpha();', '  beta();', '  gamma();'], cursor: [0, 2],
      note: 'd:整块切掉,三行还原。注释 7 键、取消 9 键 —— 或两键交给 Cmd-/(见正文对比)' }
  ]
};

/* 案例⑤ 提取字符串为常量(ya" + gg O + p + ci") */
VIMDEMOS['ch13-05-extract-const'] = {
  version: 1,
  id: 'ch13-05-extract-const',
  title: '案例⑤ 魔法字符串提取常量:ya" + ggOp + ci"',
  intro: 'ya" 连引号复制,gg 回文件头 O 开新行,打出 const 定义后 p 贴入,最后回原处 ci" 换成常量名 —— 寄存器与移动的组合拳。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 12],
    lines: ['const msg = "hello vim";', '', 'show(msg);'] },
  steps: [
    { type: 'key', key: 'y', pending: 'y',
      note: 'y:复制 —— 这次的名词是引号串' },
    { type: 'key', key: 'a', pending: 'ya',
      note: 'a:连壳(yank a quote)' },
    { type: 'key', key: '"', cursor: [0, 12],
      note: 'ya":连引号一起复制 —— 抽字符串,壳也要带走' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:……' },
    { type: 'key', key: 'g', cursor: [0, 0],
      note: 'gg:回文件头 —— 常量的家' },
    { type: 'key', key: 'O', mode: 'insert', cursor: [0, 0],
      lines: ['', 'const msg = "hello vim";', '', 'show(msg);'],
      note: 'O:上方开新行' },
    { type: 'type', text: 'const GREETING = ',
      lines: ['const GREETING = ', 'const msg = "hello vim";', '', 'show(msg);'], cursor: [0, 16],
      note: 'const GREETING = :定义先打好一半' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 15],
      note: 'Esc:退出 —— 引号串还在寄存器里候着' },
    { type: 'key', key: 'p',
      lines: ['const GREETING = "hello vim"', 'const msg = "hello vim";', '', 'show(msg);'], cursor: [0, 26],
      note: 'p:贴出 "hello vim" —— 第 9 章的寄存器,隔着几个跳转依然保鲜' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [0, 27],
      note: 'A:行尾补分号' },
    { type: 'type', text: ';',
      lines: ['const GREETING = "hello vim";', 'const msg = "hello vim";', '', 'show(msg);'], cursor: [0, 28],
      note: ';' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 27],
      note: 'Esc:常量定义完成' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:回原来那行 —— 换引用' },
    { type: 'key', key: 'f', pending: 'f',
      note: 'f:进字符串' },
    { type: 'key', key: '"', cursor: [1, 12],
      note: 'f":光标钉上引号' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改写' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面' },
    { type: 'key', key: '"', mode: 'insert',
      lines: ['const GREETING = "hello vim";', 'const msg = "";', '', 'show(msg);'], cursor: [1, 13],
      note: 'ci":字符串内容吃掉' },
    { type: 'type', text: 'GREETING',
      lines: ['const GREETING = "hello vim";', 'const msg = "GREETING";', '', 'show(msg);'], cursor: [1, 21],
      note: 'GREETING:换成常量引用 —— 抽取完成,魔法值退休(IDE 的「引入常量」重构一键同效,见正文对比)' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 20],
      note: 'Esc:案例⑤通关 —— 复制、跳转、开行、粘贴、改写,五族按键串成一条流水线' }
  ]
};

/* 案例⑥ 日志语句批量清理(:g//d) */
VIMDEMOS['ch13-06-log-clean'] = {
  version: 1,
  id: 'ch13-06-log-clean',
  title: '案例⑥ 清理调试日志::g/console/d 一条清空',
  intro: '提交前删掉所有 console 行::g/console/d 整批消失;u 一步反悔;正则版只清计时打点。鼠标:搜索→逐行删,N 倍时间。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['function run() {', '  console.log("start");', '  doWork();', '  console.log("mid");', '  console.time("x");', '  finish();', '}'] },
  steps: [
    { type: 'cmd', text: ':g/console/d',
      lines: ['function run() {', '  doWork();', '  finish();', '}'], cursor: [0, 0],
      note: ':g/console/d:含 console 的行整批消失 —— 一条命令清三行(第 8 章 :g)' },
    { type: 'wait', cursor: [0, 0],
      note: '反悔成本:u 一步 —— :g 是一个撤销单元' },
    { type: 'key', key: 'u',
      lines: ['function run() {', '  console.log("start");', '  doWork();', '  console.log("mid");', '  console.time("x");', '  finish();', '}'], cursor: [0, 0],
      note: 'u:全部回来 —— 批量永远配着后悔药' },
    { type: 'cmd', text: ':g/console\\.time/d',
      lines: ['function run() {', '  console.log("start");', '  doWork();', '  console.log("mid");', '  finish();', '}'], cursor: [0, 0],
      note: ':g/console\\.time/d:精准版 —— 点号转义,只删 console.time,普通 log 保留。挑行删除的完整语法都在 :g' }
  ]
};

/* 案例⑦ CSV 列提取(块选 y + 块粘贴) */
VIMDEMOS['ch13-07-csv-column'] = {
  version: 1,
  id: 'ch13-07-csv-column',
  title: '案例⑦ 提取 age 列:块选块贴,立成一列',
  intro: '从第二行的数据区起 Ctrl-v 圈住年龄三格,块复制,表格下方 o 开行 p —— 矩形粘贴,三行年龄自己站成一列。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [1, 5],
    lines: ['name,age,city', 'alice,30,bei', 'bob,25,sh', 'carol,41,gz'] },
  steps: [
    { type: 'key', key: 'Ctrl-v', mode: 'visual-block', cursor: [1, 5],
      note: 'Ctrl-v:从第二行的年龄列起圈(避开表头)' },
    { type: 'key', key: 'j', cursor: [2, 5],
      note: 'j:第二行数据' },
    { type: 'key', key: 'j', cursor: [3, 5],
      note: 'j:第三行 —— 三行年龄都进矩形' },
    { type: 'key', key: '2l', cursor: [3, 7],
      note: '2l:右边界拉宽到年龄末位 —— 3 行 × 2 列的块' },
    { type: 'key', key: 'y', cursor: [3, 7],
      note: 'y:块复制(动画画不出高亮,IDE 里此刻矩形是亮的)—— 三行年龄进寄存器' },
    { type: 'key', key: 'G', cursor: [3, 0],
      note: 'G:表格末行 —— 去贴' },
    { type: 'key', key: 'o', mode: 'insert', cursor: [4, 0],
      lines: ['name,age,city', 'alice,30,bei', 'bob,25,sh', 'carol,41,gz', ''],
      note: 'o:表格下方开新行' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [4, 0],
      note: 'Esc:退出插入(块粘贴要在普通模式做)' },
    { type: 'key', key: 'p',
      lines: ['name,age,city', 'alice,30,bei', 'bob,25,sh', 'carol,41,gz', '', '30', '25', '41'], cursor: [4, 0],
      note: 'p:矩形粘贴 —— 30/25/41 自己站成一列。CSV 抽列、日志剥时间戳、对齐数据改列,全是这一套' }
  ]
};

/* 案例⑧ JSON 键值规范化(:%s 捕获组) */
VIMDEMOS['ch13-08-json-keys'] = {
  version: 1,
  id: 'ch13-08-json-keys',
  title: '案例⑧ 键名补引号::%s 捕获组一批规范',
  intro: 'JS 对象改 JSON:键名要加双引号。:%s/\\(\\w\\+\\):/"\\1":/g —— 括号组抓住键名,\\1 原样放回再加引号,值毫发无伤。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['{', '  name: "vim",', '  version: 2,', '  tags: ["a", "b"]', '}'] },
  steps: [
    { type: 'cmd', text: ':%s/\\(\\w\\+\\):/"\\1":/g',
      lines: ['{', '  "name": "vim",', '  "version": 2,', '  "tags": ["a", "b"]', '}'], cursor: [3, 8],
      note: ':%s/\\(\\w\\+\\):/"\\1":/g:括号组抓住「词+:」的键名,替换段 \\1 原样放回再穿引号' },
    { type: 'wait', cursor: [3, 8],
      note: '只匹配「词+冒号」的键位 —— 值里的字符串、数组全不中招。捕获组 = 保留原文改包装,第 8 章的语法在这里兑现' },
    { type: 'key', key: 'u',
      lines: ['{', '  name: "vim",', '  version: 2,', '  tags: ["a", "b"]', '}'], cursor: [3, 7],
      note: 'u:一步回滚。同族任务:去引号(:%s/"\\(\\w\\+\\)":/\\1:/g)、键改大写、统一分隔符 —— 换汤不换药' }
  ]
};

/* 案例⑨ 批量重命名编号(Ctrl-a 宏) */
VIMDEMOS['ch13-09-renumber'] = {
  version: 1,
  id: 'ch13-09-renumber',
  title: '案例⑨ 编号重排:全置 0,宏递增',
  intro: '乱序编号先全部归零(:%s),再录 Ctrl-a + j 的宏连发 —— 「归零再生长」是重排编号的万能套路(第 10 章数字引擎)。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['  id: 0,', '  id: 0,', '  id: 0,'] },
  steps: [
    { type: 'key', key: 'q', pending: 'q',
      note: 'q:开录(前置:编号已用 :%s 归零,详见正文)' },
    { type: 'key', key: 'a', pending: '@a',
      note: 'a:存 a 抽屉' },
    { type: 'key', key: 'Ctrl-a',
      lines: ['  id: 1,', '  id: 0,', '  id: 0,'], cursor: [0, 6],
      note: 'Ctrl-a:当前行 0→1 —— 行内最近的数字自己 +1' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:下一行,自推进结尾' },
    { type: 'key', key: 'q', pending: '',
      note: 'q:收工 —— 宏 = Ctrl-a j,两拍' },
    { type: 'key', key: '2', pending: '2',
      note: '2:剩两行,连发' },
    { type: 'key', key: '@', pending: '2@',
      note: '@:……' },
    { type: 'key', key: 'a',
      lines: ['  id: 1,', '  id: 2,', '  id: 3,'], cursor: [2, 6],
      note: '2@a:编号 2、3 长完。几十行同理:N@a 一次连发 —— 手工改号的时代结束了' }
  ]
};

/* 案例⑩ HTML 标签改写(cit + ci") */
VIMDEMOS['ch13-10-html-tag'] = {
  version: 1,
  id: 'ch13-10-html-tag',
  title: '案例⑩ 按钮文案与类名:cit + ci" 两刀',
  intro: 'cit 改标签内容、ci" 改属性值 —— 文本对象天生为结构化文本设计,不用数第几个引号,鼠标划选两次的事两刀完成。',
  lang: 'html',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 19],
    lines: ['<button class="btn">确定</button>'] },
  steps: [
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改写' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面' },
    { type: 'key', key: 't', mode: 'insert',
      lines: ['<button class="btn"></button>'], cursor: [0, 19],
      note: 'cit:标签内容(确定)吃掉 —— it = inner tag,光标在标签内任何位置都行(第 4 章)' },
    { type: 'type', text: '提交订单',
      lines: ['<button class="btn">提交订单</button>'], cursor: [0, 23],
      note: '提交订单:新文案' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 22],
      note: 'Esc:文案完成,还有类名' },
    { type: 'key', key: 'f', pending: 'f',
      note: 'f:找属性引号' },
    { type: 'key', key: '"', cursor: [0, 14],
      note: 'f":光标钉上 class 的引号' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改写' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面' },
    { type: 'key', key: '"', mode: 'insert',
      lines: ['<button class="">提交订单</button>'], cursor: [0, 15],
      note: 'ci":btn 退休 —— 引号里的内容吃掉' },
    { type: 'type', text: 'btn-primary',
      lines: ['<button class="btn-primary">提交订单</button>'], cursor: [0, 26],
      note: 'btn-primary:新类名' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 25],
      note: 'Esc:两刀完成。cit 改肉、ci" 改属性 —— HTML 里最常用的两个「指物」动词' }
  ]
};

/* 案例⑪ 交换赋值语句(dd + p) */
VIMDEMOS['ch13-11-swap-lines'] = {
  version: 1,
  id: 'ch13-11-swap-lines',
  title: '案例⑪ 交换两行:dd + p 三键',
  intro: 'width/height 声明顺序反了:dd 删上行,p 粘到下方 —— 两行交换三键完成。挪到文件尾就再按 G,行移动恒等于三键。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['let width = 3;', 'let height = 9;', 'let depth = 12;'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除' },
    { type: 'key', key: 'd',
      lines: ['let height = 9;', 'let depth = 12;'], cursor: [0, 0],
      note: 'dd:width 行进寄存器(行级删除,第 9 章 —— 粘贴时按行落位)' },
    { type: 'key', key: 'p',
      lines: ['let height = 9;', 'let width = 3;', 'let depth = 12;'], cursor: [1, 0],
      note: 'p:粘到下方 —— 交换完成!dd+p 是行级「剪切粘贴」,不是删除再手打' },
    { type: 'wait', cursor: [1, 0],
      note: '变体:dd 后 G p = 挪到文件尾;dd 后 P = 粘到上方。鼠标拖拽易手抖,这三键永远精准' }
  ]
};

/* 案例⑫ 删函数内空行(选区 :g/^$/d) */
VIMDEMOS['ch13-12-blank-lines'] = {
  version: 1,
  id: 'ch13-12-blank-lines',
  title: '案例⑫ 只删函数内空行:V 选区 + :g/^$/d',
  intro: ':%s/:g 会伤及全文件 —— V 圈住函数,按 : 自动带 \'<,\'> 前缀,再 g/^$/d:函数内的空行清空,全局分隔空行无恙。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['function f() {', '', '  a();', '', '  b();', '}', '', 'function g() {', '  c();', '}'] },
  steps: [
    { type: 'key', key: 'V', mode: 'visual-line', sel: [[0, 0], [0, 0]], cursor: [0, 0],
      note: 'V:行选 —— 圈住整个 f 函数' },
    { type: 'key', key: 'j', sel: [[0, 0], [1, 0]], cursor: [1, 0],
      note: 'j:圈到空行' },
    { type: 'key', key: 'j', sel: [[0, 0], [2, 0]], cursor: [2, 0],
      note: 'j:a(); 进圈' },
    { type: 'key', key: 'j', sel: [[0, 0], [3, 0]], cursor: [3, 0],
      note: 'j:第二个空行' },
    { type: 'key', key: 'j', sel: [[0, 0], [4, 0]], cursor: [4, 0],
      note: 'j:b(); 进圈' },
    { type: 'key', key: 'j', sel: [[0, 0], [5, 0]], cursor: [5, 0],
      note: 'j:} 收口 —— 六行全进选区,两个空行都在内' },
    { type: 'cmd', text: ":'<,'>g/^$/d",
      lines: ['function f() {', '  a();', '  b();', '}', '', 'function g() {', '  c();', '}'], cursor: [0, 0],
      note: ":'<,'>g/^$/d:选区当 range(第 8 章)+ 空行模式 —— 只清 f 内部,f 与 g 之间的分隔空行安然无恙" }
  ]
};

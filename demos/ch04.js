/* demos/ch04.js — 第四章「文本对象」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角是「名词」:i(inside)/ a(around) × w ( ) { " t p 等对象;
 *    动词只用 d / c / y 各来一次 —— 动词的完整语法在下一章。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. iw 与 aw —— 删词的两种边界 */
VIMDEMOS['ch04-01-iw-aw'] = {
  version: 1,
  id: 'ch04-01-iw-aw',
  title: 'iw 与 aw:删一个词,删到哪条边?',
  intro: '光标在 count 上。diw 只删词本身(留下双空格),daw 连尾部空格一起带走。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 5], lines: ['let count = 10;'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词,等一个名词(第 2 章老朋友)' },
    { type: 'key', key: 'i', pending: 'di',
      note: 'i(inside):我要的是「里面的」—— 不含边界' },
    { type: 'key', key: 'w', pending: '', lines: ['let  = 10;'], cursor: [0, 4],
      note: 'diw:count 没了,但留下两个连续空格(i 不碰词外面的世界)' },
    { type: 'key', key: 'u', lines: ['let count = 10;'], cursor: [0, 5],
      note: 'u 撤销。换 around 版再来一遍' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:再来' },
    { type: 'key', key: 'a', pending: 'da',
      note: 'a(around):连边界一起 —— 词 + 尾部空格' },
    { type: 'key', key: 'w', pending: '', lines: ['let = 10;'], cursor: [0, 3],
      note: 'daw:这次只剩一个空格,排版干净 —— a 比 i「多吃一口」' }
  ]
};

/* 2. ciw —— 改名一气呵成 */
VIMDEMOS['ch04-02-ciw'] = {
  version: 1,
  id: 'ch04-02-ciw',
  title: 'ciw:改掉这个词',
  intro: '把 total 改名成 sum。不用进插入模式、不用选中 —— 三个键加打字,一气呵成。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 4], lines: ['let total = price + tax;'] },
  steps: [
    { type: 'key', key: 'c', pending: 'c',
      note: 'c(change):改 = 删 + 进插入,一步到位' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面的' },
    { type: 'key', key: 'w', mode: 'insert', pending: '', lines: ['let  = price + tax;'], cursor: [0, 4],
      note: 'ciw:total 消失,光标留在原地等你打字 —— 状态栏已是 INSERT' },
    { type: 'type', text: 'sum', lines: ['let sum = price + tax;'], cursor: [0, 7],
      note: '直接输入新名字:sum' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 6],
      note: 'Esc 收工。ciw + 新名 —— 全教程出场率前三的组合' }
  ]
};

/* 3. 括号对象 i( a( —— 光标可以在括号内任意位置 */
VIMDEMOS['ch04-03-parens'] = {
  version: 1,
  id: 'ch04-03-parens',
  title: 'di( / da(:括号里的东西,一步锁定',
  intro: '光标停在 header 的字母 a 上 —— 不在括号上、不在边界上,照样罩得住整对括号。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 9], lines: ['render(header, footer)'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词' },
    { type: 'key', key: 'i', pending: 'di',
      note: 'i:括号的「里面」' },
    { type: 'key', key: '(', pending: '', lines: ['render()'], cursor: [0, 7],
      note: 'di(:括号里的内容整段消失 —— 光标在哪无所谓,在括号【内】就行' },
    { type: 'key', key: 'u', lines: ['render(header, footer)'], cursor: [0, 9],
      note: 'u 撤销。对比 around 版' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:再来' },
    { type: 'key', key: 'a', pending: 'da',
      note: 'a:连「壳」一起' },
    { type: 'key', key: '(', pending: '', lines: ['render'], cursor: [0, 5],
      note: 'da(:连括号带内容全拿走 —— 想去掉一层「包裹」,用它' }
  ]
};

/* 4. 引号对象 i" a" —— ci" 改字符串内容 */
VIMDEMOS['ch04-04-quotes'] = {
  version: 1,
  id: 'ch04-04-quotes',
  title: 'ci":改掉引号里的内容',
  intro: '把 "Ada" 改成 "Grace",再看看 da" 连引号一起删的样子。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 15], lines: ['const name = "Ada";'] },
  steps: [
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:引号里的(光标已在引号之间,位置随便)' },
    { type: 'key', key: '"', mode: 'insert', pending: '', lines: ['const name = "";'], cursor: [0, 14],
      note: 'ci":内容清空,光标停在引号之间等你 —— 不用先 f 到引号' },
    { type: 'type', text: 'Grace', lines: ['const name = "Grace";'], cursor: [0, 19],
      note: '输入新内容,引号原封不动' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 18],
      note: 'Esc 回普通模式' },
    { type: 'key', key: 'u', lines: ['const name = "Ada";'], cursor: [0, 14],
      note: '撤销。再看 a 版:连引号一起' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删' },
    { type: 'key', key: 'a', pending: 'da',
      note: 'a:带壳' },
    { type: 'key', key: '"', pending: '', lines: ['const name = ;'], cursor: [0, 13],
      note: 'da":"Ada" 整段(含引号)消失 —— i 保壳,a 拆壳' }
  ]
};

/* 5. 块对象嵌套 —— i{ 永远取最内层 */
VIMDEMOS['ch04-05-nested-braces'] = {
  version: 1,
  id: 'ch04-05-nested-braces',
  title: '嵌套块:光标在哪层,就动哪层',
  intro: '光标在 y() 上时,di{ 删的是 if 块;把光标挪到 if 上(出了 if 块),删的变成函数体。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [2, 2], lines: ['function f() {', '  if (x) {', '    y();', '  }', '}'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词' },
    { type: 'key', key: 'i', pending: 'di',
      note: 'i:里面' },
    { type: 'key', key: '{', pending: '',
      lines: ['function f() {', '  if (x) {', '  }', '}'], cursor: [2, 2],
      note: '光标在 y() 上 → 删的是【最内层】if 块的内容,花括号都完好' },
    { type: 'key', key: 'u',
      lines: ['function f() {', '  if (x) {', '    y();', '  }', '}'], cursor: [2, 2],
      note: '撤销,准备换个位置再试' },
    { type: 'key', key: 'k', cursor: [1, 2],
      note: 'k 上移一行:光标落在 if 这个词上 —— 它在 if 块【外】、函数块【内】' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词' },
    { type: 'key', key: 'i', pending: 'di',
      note: 'i:里面' },
    { type: 'key', key: '{', pending: '', lines: ['function f() {', '}'], cursor: [1, 0],
      note: '同一个 di{:这回删的是函数体!规则只有一条 —— 取光标所在的最内层' }
  ]
};

/* 6. 段落对象 ip / ap —— 空行分块 */
VIMDEMOS['ch04-06-paragraph'] = {
  version: 1,
  id: 'ch04-06-paragraph',
  title: 'ip 与 ap:按空行分段的「段落」',
  intro: '代码里空行就是分段符。dip 删一段,dap 连段尾空行一起收走。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 6], lines: ['const a = 1;', '', 'const b = 2;'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词' },
    { type: 'key', key: 'i', pending: 'di',
      note: 'i:段落里面' },
    { type: 'key', key: 'p', pending: '', lines: ['', 'const b = 2;'], cursor: [0, 0],
      note: 'dip:删掉第一个段落。注意这里的 p 是 paragraph(段落),不是粘贴键!' },
    { type: 'key', key: 'u', lines: ['const a = 1;', '', 'const b = 2;'], cursor: [0, 6],
      note: '撤销 —— dip 留下了一个空行,看看 around 版' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:再来' },
    { type: 'key', key: 'a', pending: 'da',
      note: 'a:连段落的「边界」(空行)一起' },
    { type: 'key', key: 'p', pending: '', lines: ['const b = 2;'], cursor: [0, 0],
      note: 'dap:段落 + 后面的空行一起删,剩下的干干净净' }
  ]
};

/* 7. 标签对象 it / at —— 前端福音 */
VIMDEMOS['ch04-07-tag'] = {
  version: 1,
  id: 'ch04-07-tag',
  title: 'cit:改标签里的内容,不碰标签',
  intro: '把 h1 里的文案换掉 —— 标签开闭完好;dat 则连标签一起端走。',
  lang: 'html',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 5], lines: ['<h1>Old Title</h1>'] },
  steps: [
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:标签里面' },
    { type: 'key', key: 't', mode: 'insert', pending: '', lines: ['<h1></h1>'], cursor: [0, 3],
      note: 'cit:t = tag。标签内容清空,<h1> 和 </h1> 原样保留' },
    { type: 'type', text: 'New Title', lines: ['<h1>New Title</h1>'], cursor: [0, 12],
      note: '输入新文案 —— 改标题、改文案、改链接文字,都是这三个键' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 11],
      note: 'Esc 回普通模式' },
    { type: 'key', key: 'u', lines: ['<h1>Old Title</h1>'], cursor: [0, 3],
      note: '撤销。a 版试试' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删' },
    { type: 'key', key: 'a', pending: 'da',
      note: 'a:整个元素' },
    { type: 'key', key: 't', pending: '', lines: [''], cursor: [0, 0],
      note: 'dat:整个元素连根拔起 —— 删掉一个 DOM 节点就这么快' }
  ]
};

/* 8. 多行对象 —— i( 跨行也罩得住 */
VIMDEMOS['ch04-08-multiline'] = {
  version: 1,
  id: 'ch04-08-multiline',
  title: '对象不分行:跨多行的括号一样删',
  intro: '参数竖着排的四行调用,di( 一键清空;ci( 直接重写全部参数。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [1, 4], lines: ['render(', '  header,', '  footer,', ')'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词' },
    { type: 'key', key: 'i', pending: 'di',
      note: 'i:括号里' },
    { type: 'key', key: '(', pending: '', lines: ['render(', ')'], cursor: [1, 0],
      note: 'di(:中间三行参数全部消失 —— 对象跨行?对它来说无所谓' },
    { type: 'key', key: 'u',
      lines: ['render(', '  header,', '  footer,', ')'], cursor: [1, 4],
      note: '撤销。换成 c,重写参数列表' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:括号里' },
    { type: 'key', key: '(', mode: 'insert', pending: '', lines: ['render(', ')'], cursor: [1, 0],
      note: 'ci(:清空并进入插入,光标停在 ) 前' },
    { type: 'type', text: '  width, height', lines: ['render(', '  width, height', ')'], cursor: [1, 15],
      note: '新参数随便打,回车继续 —— 打完按 Esc' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 14],
      note: '收工。改一整个参数列表,从头到尾没碰过方向键和鼠标' }
  ]
};

/* 9. 动词轮换 —— 同一个 iw,d / c / y 随便配 */
VIMDEMOS['ch04-09-verbs'] = {
  version: 1,
  id: 'ch04-09-verbs',
  title: '名词不变,动词随便换:d / c / y × iw',
  intro: '同一段代码:ciw 改名、yiw 复制 + p 落位。名词学一个,动词配一生。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 6], lines: ['const total = price + tax;'] },
  steps: [
    { type: 'key', key: 'c', pending: 'c',
      note: '动词一:c(change)—— 改' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '', lines: ['const  = price + tax;'], cursor: [0, 6],
      note: 'ciw:total 让位,等待新名字' },
    { type: 'type', text: 'sum', lines: ['const sum = price + tax;'], cursor: [0, 7],
      note: '输入 sum' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 6],
      note: 'Esc 回普通模式' },
    { type: 'key', key: 'u', lines: ['const total = price + tax;'], cursor: [0, 6],
      note: '撤销。动词二:y(yank)—— 复制' },
    { type: 'key', key: '$', cursor: [0, 25],
      note: '$ 先到行尾,再用 b 回到 tax —— 用第 2 章的移动选靶子' },
    { type: 'key', key: 'b', cursor: [0, 22],
      note: 'b:光标落到 tax 头上' },
    { type: 'key', key: 'y', pending: 'y',
      note: 'y:复制动词' },
    { type: 'key', key: 'i', pending: 'yi',
      note: 'i:里面' },
    { type: 'key', key: 'w', pending: '',
      note: 'yiw:复制 tax。buffer 纹丝不动 —— 复制是无痕的(下一章细说)' },
    { type: 'key', key: '$', cursor: [0, 25],
      note: '$:回到行尾,找个落点' },
    { type: 'key', key: 'p', lines: ['const total = price + tax;tax'], cursor: [0, 28],
      note: 'p 粘贴:d 已会、c 已会、y 已会 —— 换动词不换名词,这就是语法' }
  ]
};

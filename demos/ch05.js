/* demos/ch05.js — 第五章「编辑动词与语法」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角是「动词」:d / c / y / p / r / s / gU / >> / J …
 *    语法公式:[count] 动词 [count] 名词(名词 = 移动键或上一章的文本对象)。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. d 家族 —— 射程系统化 */
VIMDEMOS['ch05-01-d-family'] = {
  version: 1,
  id: 'ch05-01-d-family',
  title: 'd × 各种名词:一张射程菜单',
  intro: 'dw、d$、df;、dd —— 动词不变,名词换,删的范围跟着换。',
  lang: 'ts',
  speed: 900,
  initial: { mode: 'normal', cursor: [0, 4], lines: ['let rate = 0.35;  // tax', 'let base = 100;'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词。它删多少,完全由后面的名词决定' },
    { type: 'key', key: 'w', pending: '', lines: ['let = 0.35;  // tax', 'let base = 100;'], cursor: [0, 4],
      note: 'dw:删一个词(连尾部空格)' },
    { type: 'key', key: 'u', lines: ['let rate = 0.35;  // tax', 'let base = 100;'], cursor: [0, 4],
      note: 'u 撤销,换名词' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:再来' },
    { type: 'key', key: '$', pending: '', lines: ['let rate = 0.35;', 'let base = 100;'], cursor: [0, 15],
      note: 'd$:删到行尾(打包键 D,下一节讲)' },
    { type: 'key', key: 'u', lines: ['let rate = 0.35;  // tax', 'let base = 100;'], cursor: [0, 4],
      note: 'u 撤销' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:再来' },
    { type: 'key', key: 'f', pending: 'df',
      note: 'f:名词是一个「查找到的字符」' },
    { type: 'key', key: ';', pending: '', lines: ['let rate = 0.3', 'let base = 100;'], cursor: [0, 11],
      note: 'df;:删到分号(含)—— f 找的字符也算战利品' },
    { type: 'key', key: 'u', lines: ['let rate = 0.35;  // tax', 'let base = 100;'], cursor: [0, 4],
      note: 'u 撤销' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:最后一次' },
    { type: 'key', key: 'd', pending: '', lines: ['let base = 100;'], cursor: [0, 0],
      note: 'dd:名词是「当前行」。四个句子,同一个动词 —— 这就是语法' }
  ]
};

/* 2. 计数前缀 —— 2dw 与 d2w */
VIMDEMOS['ch05-02-count'] = {
  version: 1,
  id: 'ch05-02-count',
  title: '计数:2dw = d2w,位置随便放',
  intro: '数字可以放在动词前,也可以放在名词前 —— 效果相乘,想放哪放哪。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['alpha beta gamma delta'] },
  steps: [
    { type: 'key', key: '2', pending: '2',
      note: '先按 2:状态栏出现待决的 2 —— 「来两个……」' },
    { type: 'key', key: 'd', pending: '2d',
      note: '接 d:两个……删!' },
    { type: 'key', key: 'w', pending: '', lines: ['gamma delta'], cursor: [0, 0],
      note: '2dw:一次删掉前两个词' },
    { type: 'key', key: 'u', lines: ['alpha beta gamma delta'], cursor: [0, 0],
      note: 'u 撤销' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:这次数字放动词后面' },
    { type: 'key', key: '2', pending: 'd2',
      note: '名词前来一个 2' },
    { type: 'key', key: 'w', pending: '', lines: ['gamma delta'], cursor: [0, 0],
      note: 'd2w:结果一模一样!两个 count 相乘,位置不挑' },
    { type: 'key', key: 'u', lines: ['alpha beta gamma delta'], cursor: [0, 0],
      note: 'u 撤销' },
    { type: 'key', key: '$', cursor: [0, 21],
      note: '$ 到行尾 —— 顺手看看 x 也吃计数' },
    { type: 'key', key: '3', pending: '3',
      note: '数字 3:先报数' },
    { type: 'key', key: 'x', pending: '', lines: ['alpha beta gamma d'], cursor: [0, 18],
      note: '3x:一次删三个字符。计数是通用的,不属于哪个键' }
  ]
};

/* 3. c 家族 —— 删了就开工 */
VIMDEMOS['ch05-03-c-family'] = {
  version: 1,
  id: 'ch05-03-c-family',
  title: 'c 家族:cw / c$ / C / cc',
  intro: 'c = change:删掉范围立刻进入插入模式。要打字就 c,纯删除才用 d。',
  lang: 'ts',
  speed: 850,
  initial: { mode: 'normal', cursor: [0, 4], lines: ['let price = 100;', 'let qty = 2;'] },
  steps: [
    { type: 'key', key: 'c', pending: 'c',
      note: 'c(change):改 = 删 + 插入,一条命令办完' },
    { type: 'key', key: 'w', mode: 'insert', pending: '', lines: ['let  = 100;', 'let qty = 2;'], cursor: [0, 4],
      note: 'cw:改词。注意它不吃尾部空格(dw 才吃)—— 因为你要接着打字' },
    { type: 'type', text: 'amount', lines: ['let amount = 100;', 'let qty = 2;'], cursor: [0, 10],
      note: '输入 amount' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 9],
      note: 'Esc 回普通模式' },
    { type: 'key', key: 'u', lines: ['let price = 100;', 'let qty = 2;'], cursor: [0, 4],
      note: 'u 撤销,下一个姿势' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:再来' },
    { type: 'key', key: '$', mode: 'insert', pending: '', lines: ['let price = ', 'let qty = 2;'], cursor: [0, 12],
      note: 'c$:改到行尾 —— 行尾重新赋值的惯用键' },
    { type: 'type', text: '200;', lines: ['let price = 200;', 'let qty = 2;'], cursor: [0, 16],
      note: '输入新值' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 15],
      note: 'Esc' },
    { type: 'key', key: 'u', lines: ['let price = 100;', 'let qty = 2;'], cursor: [0, 4],
      note: 'u 撤销' },
    { type: 'key', key: 'C', mode: 'insert', lines: ['let price = ', 'let qty = 2;'], cursor: [0, 12],
      note: '大写 C:c$ 的打包键(和 A = $a 一个思路:行尾的事,Shift 一下)' },
    { type: 'type', text: '0;', lines: ['let price = 0;', 'let qty = 2;'], cursor: [0, 13],
      note: '输入新值' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 12],
      note: 'Esc' },
    { type: 'key', key: 'u', lines: ['let price = 100;', 'let qty = 2;'], cursor: [0, 4],
      note: 'u 撤销' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:最后一个姿势' },
    { type: 'key', key: 'c', mode: 'insert', pending: '', lines: ['', 'let qty = 2;'], cursor: [0, 0],
      note: 'cc:清空整行重写(打包键 S)—— 重写一行不用先 dd 再 O' },
    { type: 'type', text: 'const total = 1;', lines: ['const total = 1;', 'let qty = 2;'], cursor: [0, 16],
      note: '整行重打' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 15],
      note: 'Esc。cw / c$ / C / cc —— 四个姿势,一个动词' }
  ]
};

/* 4. y 家族 —— 无痕的复制 */
VIMDEMOS['ch05-04-y-family'] = {
  version: 1,
  id: 'ch05-04-y-family',
  title: 'y 家族:yw / y$ / yy,复制无痕',
  intro: 'y = yank(复制)。它的名词和 d 一模一样 —— 学过一遍的东西,一鱼两吃。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 6], lines: ['const host = "db.local";', 'const port = 5432;'] },
  steps: [
    { type: 'key', key: 'y', pending: 'y',
      note: 'y(yank):复制。复制的东西进了「寄存器」(第 9 章细讲)' },
    { type: 'key', key: 'w', pending: '',
      note: 'yw:复制 host 这个词(含尾部空格)。注意 buffer 纹丝不动 —— 复制无痕' },
    { type: 'key', key: 'y', pending: 'y',
      note: 'y:再来' },
    { type: 'key', key: '$', pending: '',
      note: 'y$:复制到行尾。名词全是第 2 章学过的,一个不用重学' },
    { type: 'key', key: 'y', pending: 'y',
      note: 'y:最后看整行的' },
    { type: 'key', key: 'y', pending: '',
      note: 'yy:复制整行(和 dd 同构)。配上上一章:yiw 复制光标所在的词' },
    { type: 'key', key: 'j', cursor: [1, 6],
      note: 'j 下移一行' },
    { type: 'key', key: 'p', lines: ['const host = "db.local";', 'const port = 5432;', 'const host = "db.local";'], cursor: [2, 0],
      note: 'p:粘贴!整行寄存器 → 粘成下方新的一行。复制粘贴一条龙' }
  ]
};

/* 5. p 与 P —— 行有行的粘法,字有字的粘法 */
VIMDEMOS['ch05-05-p-semantics'] = {
  version: 1,
  id: 'ch05-05-p-semantics',
  title: 'p / P:搬家神器(dd+p 换行序,dw+P 换词序)',
  intro: 'dd+p 把行往下搬,dw+P 把词往前搬 —— 「删了再粘」就是移动。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [1, 0], lines: ['alpha beta gamma', 'first();', 'second();'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词' },
    { type: 'key', key: 'd', pending: '', lines: ['alpha beta gamma', 'second();'], cursor: [1, 0],
      note: 'dd:剪掉 first();(d 删掉的东西默认进寄存器 —— 删即剪切)' },
    { type: 'key', key: 'p', lines: ['alpha beta gamma', 'second();', 'first();'], cursor: [2, 0],
      note: 'p:行寄存器粘到下方 —— 两条语句顺序交换!' },
    { type: 'key', key: 'k', cursor: [1, 0],
      note: 'k 上移一行' },
    { type: 'key', key: 'k', cursor: [0, 0],
      note: 'k 再上移到第一行,玩字级的' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词' },
    { type: 'key', key: 'w', pending: '', lines: ['beta gamma', 'second();', 'first();'], cursor: [0, 0],
      note: 'dw:剪掉 alpha(字符级寄存器)' },
    { type: 'key', key: 'w', cursor: [0, 5],
      note: 'w:走到 gamma 头上' },
    { type: 'key', key: 'P', lines: ['beta alpha gamma', 'second();', 'first();'], cursor: [0, 10],
      note: 'P:粘到光标【前】。p 粘后 / P 粘前;行级字符级 Vim 自己判断' }
  ]
};

/* 6. r 与 s —— 小改不打草稿 */
VIMDEMOS['ch05-06-r-s'] = {
  version: 1,
  id: 'ch05-06-r-s',
  title: 'r 与 s:一个字符的事,别兴师动众',
  intro: 'r 换一个字符不进插入模式;s 删一个字符顺势开工;S 整行重写。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 5], lines: ['let x1 = 10;'] },
  steps: [
    { type: 'key', key: 'r', pending: 'r',
      note: 'r(replace):等一个字符,换掉光标处这一个 —— 不进插入模式' },
    { type: 'key', key: '2', pending: '', lines: ['let x2 = 10;'], cursor: [0, 5],
      note: 'r2:x1 变 x2,完事。改名只差一个字母时,r 是最快的路' },
    { type: 'key', key: 'h', cursor: [0, 4],
      note: 'h 左移一格,到 x 上' },
    { type: 'key', key: 's', mode: 'insert', lines: ['let 1 = 10;'], cursor: [0, 4],
      note: 's(substitute):删掉光标字符并进入插入(= cl 的打包)' },
    { type: 'type', text: 'y', lines: ['let y1 = 10;'], cursor: [0, 5],
      note: '输入 y,变量变 y1 —— s 适合「删一个、补一段」' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 4],
      note: 'Esc' },
    { type: 'key', key: 'S', mode: 'insert', lines: [''], cursor: [0, 0],
      note: 'S:清空整行重写(= cc)。这行不要了,原地重打' },
    { type: 'type', text: 'let y2 = 20;', lines: ['let y2 = 20;'], cursor: [0, 11],
      note: '整行重打' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 10],
      note: 'Esc。r 是「看一眼就换」,s 是「删一个再说」' }
  ]
};

/* 7. 大小写 —— ~ 与 gU / gu */
VIMDEMOS['ch05-07-case'] = {
  version: 1,
  id: 'ch05-07-case',
  title: '~ / gU / gu:大小写切换',
  intro: 'gUiw 把 url 变成 URL(常量命名神器),~ 翻转一个,gUU 整行大写。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 4], lines: ['let url = "example.com";'] },
  steps: [
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:前缀键(第 2 章的 g_ 见过),它后面接一个「带范围的动词」' },
    { type: 'key', key: 'U', pending: 'gU',
      note: 'gU:uppercase 动词,等名词 —— 读作「变大写,范围是……」' },
    { type: 'key', key: 'i', pending: 'gUi',
      note: 'i:里面(文本对象照样当名词!)' },
    { type: 'key', key: 'w', pending: '', lines: ['let URL = "example.com";'], cursor: [0, 6],
      note: 'gUiw:url → URL。变量提为常量名的日常操作' },
    { type: 'key', key: 'u', lines: ['let url = "example.com";'], cursor: [0, 4],
      note: 'u 撤销。看最小号的 ~' },
    { type: 'key', key: '~', lines: ['let Url = "example.com";'], cursor: [0, 5],
      note: '~:翻转光标处一个字符,光标右移 —— 连按就是连续翻转' },
    { type: 'key', key: 'u', lines: ['let url = "example.com";'], cursor: [0, 4],
      note: 'u 撤销' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:前缀' },
    { type: 'key', key: 'U', pending: 'gU',
      note: 'gU:变大写' },
    { type: 'key', key: 'U', lines: ['LET URL = "EXAMPLE.COM";'], cursor: [0, 4],
      note: 'gUU:名词是当前行 —— 整行大写(guu 则整行小写)' }
  ]
};

/* 8. 缩进与格式化 —— >> << == */
VIMDEMOS['ch05-08-indent'] = {
  version: 1,
  id: 'ch05-08-indent',
  title: '>> / << / ==:缩进一键摆正',
  intro: '>> 右移一级,<< 左移一级,== 交给语言规则自动对齐。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [1, 0], lines: ['function area(w, h) {', 'return w * h;', '    }'] },
  steps: [
    { type: 'key', key: '>', pending: '>',
      note: '>:缩进动词(像 d 一样等名词;连按两下 = 当前行)' },
    { type: 'key', key: '>', pending: '', lines: ['function area(w, h) {', '  return w * h;', '    }'], cursor: [1, 2],
      note: '>>:这一行右移一级(一级多宽由编辑器设置决定)' },
    { type: 'key', key: '<', pending: '<',
      note: '<:反向缩进动词' },
    { type: 'key', key: '<', lines: ['function area(w, h) {', 'return w * h;', '    }'], cursor: [1, 0],
      note: '<<:左移一级,撤回' },
    { type: 'key', key: 'j', cursor: [2, 0],
      note: 'j 到最后一行 —— 它缩进多了' },
    { type: 'key', key: '=', pending: '=',
      note: '=:自动缩进动词' },
    { type: 'key', key: '=', lines: ['function area(w, h) {', 'return w * h;', '}'], cursor: [2, 0],
      note: '==:自动缩进当前行 —— 花括号回老家了' },
    { type: 'key', key: 'k', cursor: [1, 0],
      note: 'k 回到中间行,它也没缩进' },
    { type: 'key', key: '=', pending: '=',
      note: '=:再来' },
    { type: 'key', key: '=', lines: ['function area(w, h) {', '  return w * h;', '}'], cursor: [1, 2],
      note: '==:中间行也对齐。三级缩进全修好,没用过一次方向键' }
  ]
};

/* 9. J —— 合并行 */
VIMDEMOS['ch05-09-J'] = {
  version: 1,
  id: 'ch05-09-J',
  title: 'J 与 gJ:把下一行拉上来',
  intro: '被断成两行的代码,J 一键合并(自动补空格);gJ 不补空格,拼字符串更干净。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 13], lines: ['const msg = "hello, "', '  + "world";'] },
  steps: [
    { type: 'key', key: 'J', lines: ['const msg = "hello, " + "world";'], cursor: [0, 21],
      note: 'J(Join):下一行拼上来 —— 缩进自动吃掉,连接处补一个空格' },
    { type: 'key', key: 'u', lines: ['const msg = "hello, "', '  + "world";'], cursor: [0, 13],
      note: '撤销。不想让它补空格呢?' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:前缀' },
    { type: 'key', key: 'J', lines: ['const msg = "hello, "+"world";'], cursor: [0, 21],
      note: 'gJ:原样拼接(不加空格)。引号里已有空格时用它,不会多出一个' }
  ]
};

/* 10. 毕业演出 —— 一次真实的签名重构 */
VIMDEMOS['ch05-10-capstone'] = {
  version: 1,
  id: 'ch05-10-capstone',
  title: '综合实战:参数重命名,全程三句话',
  intro: '把 area(w, h) 改成 area(width, height),函数体同步更新 —— 动词 + 名词,像说话一样编辑。',
  lang: 'ts',
  speed: 800,
  initial: { mode: 'normal', cursor: [0, 14], lines: ['function area(w, h) {', '  return w * h;', '}'] },
  steps: [
    { type: 'key', key: 'c', pending: 'c',
      note: '目标:参数名改成语义完整的名字。第一句:改括号里的' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:括号里' },
    { type: 'key', key: '(', mode: 'insert', pending: '',
      lines: ['function area() {', '  return w * h;', '}'], cursor: [0, 14],
      note: 'ci(:参数列表整体清空(上一章的名词,现用)' },
    { type: 'type', text: 'width, height',
      lines: ['function area(width, height) {', '  return w * h;', '}'], cursor: [0, 27],
      note: '输入新参数列表' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 26],
      note: 'Esc,第一句说完' },
    { type: 'key', key: 'j', cursor: [1, 2],
      note: 'j 进函数体,同步旧名字' },
    { type: 'key', key: 'f', pending: 'f',
      note: 'f:行内直达旧名' },
    { type: 'key', key: 'w', cursor: [1, 9],
      note: 'fw:直达旧名 w(第 2 章的移动当名词用不完)' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:词里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '',
      lines: ['function area(width, height) {', '  return  * h;', '}'], cursor: [1, 9],
      note: 'ciw:换掉它' },
    { type: 'type', text: 'width',
      lines: ['function area(width, height) {', '  return width * h;', '}'], cursor: [1, 14],
      note: '输入 width' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 13],
      note: 'Esc,第二句说完' },
    { type: 'key', key: 'f', pending: 'f',
      note: 'f:再找一个旧名' },
    { type: 'key', key: 'h', cursor: [1, 17],
      note: 'fh:找到另一个旧名 h' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:词里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '',
      lines: ['function area(width, height) {', '  return width * ;', '}'], cursor: [1, 17],
      note: 'ciw:最后一个' },
    { type: 'type', text: 'height',
      lines: ['function area(width, height) {', '  return width * height;', '}'], cursor: [1, 23],
      note: '输入 height' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 22],
      note: 'Esc。签名 + 函数体,三句话改完 —— 你已经在「说 Vim」了' }
  ]
};

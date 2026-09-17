/* demos/ch01.js — 第一章「生存篇」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - mode: normal | insert | visual | visual-line | visual-block | replace;
 *  - type='cmd' 的步骤会在状态栏左下角显示 text,下一步自动消失(模拟回车执行)。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. i / Esc —— 进入与退出插入模式 */
VIMDEMOS['ch01-01-i-esc'] = {
  version: 1,
  id: 'ch01-01-i-esc',
  title: 'i 与 Esc:进出插入模式',
  intro: '光标停在 1 上。目标:把它改成 21。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 10], lines: ['const x = 1;'] },
  steps: [
    { type: 'key', key: 'i', mode: 'insert',
      note: 'i:在光标【前】进入插入模式 —— 状态栏变成 -- INSERT --' },
    { type: 'type', text: '2', lines: ['const x = 21;'], cursor: [0, 11],
      note: '直接打字,2 出现在光标前面,1 变成了 21' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 10],
      note: 'Esc:回到普通模式,光标左移一格,停在最后输入的字符上' }
  ]
};

/* 2. a —— 光标后插入(append) */
VIMDEMOS['ch01-02-a-append'] = {
  version: 1,
  id: 'ch01-02-a-append',
  title: 'a:在光标后进入插入模式',
  intro: '把变量 x 改名成 xs。a 与 i 只差一个字:前 / 后。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 6], lines: ['const x = 1;'] },
  steps: [
    { type: 'key', key: 'a', mode: 'insert', cursor: [0, 7],
      note: 'a(append):在光标【后】进入插入模式,光标先右移一格' },
    { type: 'type', text: 's', lines: ['const xs = 1;'], cursor: [0, 8],
      note: 's 出现在 x 后面 —— 现在变量叫 xs' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 7],
      note: 'Esc 回普通模式。i 与 a 二选一,取决于你要在光标前还是后落笔' }
  ]
};

/* 3. dd —— 删除整行 */
VIMDEMOS['ch01-03-dd'] = {
  version: 1,
  id: 'ch01-03-dd',
  title: 'dd:删除整行',
  intro: '删除中间那行 return。注意状态栏右下角会短暂出现待决的 d。',
  lang: 'ts',
  speed: 850,
  initial: { mode: 'normal', cursor: [1, 2], lines: ['function add(a, b) {', '  return a + b;', '}'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: '按下 d:它是一个删除动词,正在等待目标(状态栏显示 d)' },
    { type: 'key', key: 'd', pending: '', lines: ['function add(a, b) {', '}'], cursor: [1, 0],
      note: '再按 d:dd = 删除【当前整行】,下面的行上移,光标回到行首' }
  ]
};

/* 4. o —— 下方打开新行 */
VIMDEMOS['ch01-04-o'] = {
  version: 1,
  id: 'ch01-04-o',
  title: 'o:在下方打开新行并进入插入模式',
  intro: '在函数第一行下面加一条注释。',
  lang: 'ts',
  speed: 900,
  initial: { mode: 'normal', cursor: [0, 9], lines: ['function add(a, b) {', '  return a + b;', '}'] },
  steps: [
    { type: 'key', key: 'o', mode: 'insert',
      lines: ['function add(a, b) {', '', '  return a + b;', '}'], cursor: [1, 0],
      note: 'o:下方插入一个空行,并直接进入插入模式' },
    { type: 'type', text: '  // TODO ',
      lines: ['function add(a, b) {', '  // TODO ', '  return a + b;', '}'], cursor: [1, 10],
      note: '开始打字 —— 注释内容' },
    { type: 'type', text: '校验参数',
      lines: ['function add(a, b) {', '  // TODO 校验参数', '  return a + b;', '}'], cursor: [1, 14],
      note: '中文也没问题(输入法状态详见附录 B)' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 13],
      note: 'Esc 收工。o 的兄弟 O 是在上方开新行' }
  ]
};

/* 5. x 与 u —— 删字符、撤销 */
VIMDEMOS['ch01-05-x-u'] = {
  version: 1,
  id: 'ch01-05-x-u',
  title: 'x 删字符,u 撤销',
  intro: '手滑多打了个 0?先 x 后 u,一来一回感受撤销粒度。',
  lang: 'ts',
  speed: 900,
  initial: { mode: 'normal', cursor: [0, 16], lines: ['const count = 100;'] },
  steps: [
    { type: 'key', key: 'x', lines: ['const count = 100'], cursor: [0, 15],
      note: 'x:删除光标处的字符(分号),光标停在行尾' },
    { type: 'key', key: 'x', lines: ['const count = 10'], cursor: [0, 14],
      note: '再按 x 又删掉一个 0 —— 删多了!' },
    { type: 'key', key: 'u', lines: ['const count = 100'], cursor: [0, 15],
      note: 'u:撤销,一次撤销一个变更,0 回来了' },
    { type: 'key', key: 'u', lines: ['const count = 100;'], cursor: [0, 16],
      note: '再按 u:分号也回来了。后悔药管够,放心练' }
  ]
};

/* 6. :w —— 命令行模式保存 */
VIMDEMOS['ch01-06-colon-w'] = {
  version: 1,
  id: 'ch01-06-colon-w',
  title: ':w —— 命令行模式:保存',
  intro: '按 : 进入命令行模式,屏幕左下角(状态栏)出现命令,回车执行。',
  lang: 'ts',
  speed: 1100,
  initial: { mode: 'normal', cursor: [1, 2], lines: ['// utils.ts', 'export function add(a, b) {', '  return a + b;', '}'] },
  steps: [
    { type: 'cmd', text: ':w',
      note: '按 : 进入命令行模式,输入 w —— 左下角显示 :w' },
    { type: 'key', key: 'Enter',
      note: '回车执行:文件保存。在 VSCode / IdeaVim 里完全等价 Cmd-S' },
    { type: 'cmd', text: ':q',
      note: ':q 关闭当前文件(标签页);:wq = 保存并退出一步到位' },
    { type: 'key', key: 'Enter',
      note: '按错了?命令行里按 Esc 取消,不执行' }
  ]
};

/* 7. I 与 A —— 行首插入、行尾追加(顺带预习 j) */
VIMDEMOS['ch01-07-I-A'] = {
  version: 1,
  id: 'ch01-07-I-A',
  title: 'I 与 A:行首插入、行尾追加',
  intro: '注释掉 return,再给下一行补分号 —— 顺便偷看一眼 j(下移一行)。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 9], lines: ['  return a + b', '  const x = 1'] },
  steps: [
    { type: 'key', key: 'I', mode: 'insert', cursor: [0, 2],
      note: 'I:跳到行首第一个非空白字符并进入插入模式(缩进自动保留)' },
    { type: 'type', text: '// ', lines: ['  // return a + b', '  const x = 1'], cursor: [0, 5],
      note: '输入 // ,这一行变成注释' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 4],
      note: 'Esc 回家,光标落在最后输入的字符上' },
    { type: 'key', key: 'j', cursor: [1, 4],
      note: 'j:下移一行(下一章的主角,先混个脸熟)' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [1, 13],
      note: 'A:直接跳到行尾进入插入 —— 不用一格格挪到末尾' },
    { type: 'type', text: ';', lines: ['  // return a + b', '  const x = 1;'], cursor: [1, 14],
      note: '行尾补上分号' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 13],
      note: 'Esc 收工。I / A 是 i / a 的「直达版」:省掉移动,直接落笔' }
  ]
};

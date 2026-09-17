/* demos/ch06.js — 第六章「插入与替换模式」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角:进出插入模式的全部姿势(I A o O gi)、插入模式内的编辑键
 *    (Ctrl-w / Ctrl-u / Ctrl-t)、替换模式 R。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. I 与 A —— 行首行尾的体贴 */
VIMDEMOS['ch06-01-I-A'] = {
  version: 1,
  id: 'ch06-01-I-A',
  title: 'I 与 A:有缩进的行首,有内容的行尾',
  intro: 'I 跳过缩进在第一个字符前插入;A 贴着最后一个字符后插入 —— 补 const、补分号专用。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 5], lines: ['  rate = 0.5', 'const qty = 3'] },
  steps: [
    { type: 'key', key: 'I', mode: 'insert', cursor: [0, 2],
      note: 'I(大写 i):在行首【第一个非空白字符】前进入插入 —— 有缩进也不吃亏' },
    { type: 'type', text: 'const ', lines: ['  const rate = 0.5', 'const qty = 3'], cursor: [0, 8],
      note: '补上 const,缩进被 I 自动跳过了(小写 i 会插在行首空格里)' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 7],
      note: 'Esc 回普通模式' },
    { type: 'key', key: 'j', cursor: [1, 7],
      note: 'j 到下一行 —— 这行缺个分号' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [1, 13],
      note: 'A:在行尾进入插入(= $ + a 的打包键)。不用肉眼找行尾' },
    { type: 'type', text: ';', lines: ['  const rate = 0.5', 'const qty = 3;'], cursor: [1, 14],
      note: '分号补上' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 13],
      note: 'Esc。I 管头、A 管尾 —— 行的两端都有专属入口' }
  ]
};

/* 2. o 与 O —— 新行的两个方向 */
VIMDEMOS['ch06-02-o-O'] = {
  version: 1,
  id: 'ch06-02-o-O',
  title: 'o 与 O:在下方 / 上方开新行',
  intro: 'o 在下方开新行、O 在上方开新行,缩进自动带好 —— 往数组、参数列表里加元素全靠它。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [1, 4], lines: ["const items = [", "  'a',", "];"] },
  steps: [
    { type: 'key', key: 'o', mode: 'insert',
      lines: ["const items = [", "  'a',", "  ", "];"], cursor: [2, 2],
      note: 'o:在下方开新行 —— 缩进自动对齐,原下面的 ]; 被顺势推下去' },
    { type: 'type', text: "'b',", lines: ["const items = [", "  'a',", "  'b',", "];"], cursor: [2, 6],
      note: "直接输入新元素 'b', —— 补列表、补参数、补 import 都是 o 开场" },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [2, 5],
      note: 'Esc 回普通模式' },
    { type: 'key', key: 'k', cursor: [1, 2],
      note: 'k 回到 a 元素那一行' },
    { type: 'key', key: 'O', mode: 'insert',
      lines: ["const items = [", "  ", "  'a',", "  'b',", "];"], cursor: [1, 2],
      note: 'O(大写):在上方开新行 —— 缩进同样自动,方向相反' },
    { type: 'type', text: "'first',", lines: ["const items = [", "  'first',", "  'a',", "  'b',", "];"], cursor: [1, 10],
      note: "'first', 落在最前面。想在列表头部插元素,O 是唯一的优雅解" },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 9],
      note: 'Esc。o 向下、O 向上 —— 两个方向的新行,缩进都不用管' }
  ]
};

/* 3. gi —— 回到上次离开的插入点 */
VIMDEMOS['ch06-03-gi'] = {
  version: 1,
  id: 'ch06-03-gi',
  title: 'gi:回到上次打字的地方,接着写',
  intro: '打字 → Esc 去别处看两眼 → gi 一键回到上次离开的插入点,还自带插入模式。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 5], lines: ['const a = 1;', 'const b = 2;'] },
  steps: [
    { type: 'key', key: 'A', mode: 'insert', cursor: [0, 12],
      note: 'A:先在行尾写点什么,制造一个「上次插入点」' },
    { type: 'type', text: ' // tag', lines: ['const a = 1; // tag', 'const b = 2;'], cursor: [0, 19],
      note: '输入注释' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 18],
      note: 'Esc 收工' },
    { type: 'key', key: 'G', cursor: [1, 0],
      note: 'G:跑去文件尾看看 —— 离开插入点远远的' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:前缀' },
    { type: 'key', key: 'i', mode: 'insert', cursor: [0, 19], pending: '',
      note: 'gi:跳回上次离开插入模式的位置,而且已经在插入模式里了!' },
    { type: 'type', text: '!', lines: ['const a = 1; // tag!', 'const b = 2;'], cursor: [0, 20],
      note: '接着刚才的字继续写。反复「查看 → 续写」的工作流里,gi 是隐形传送门' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 19],
      note: 'Esc。记住节奏:打字 → Esc → 逛一圈 → gi' }
  ]
};

/* 4. 插入模式内的编辑键 —— Ctrl-w / Ctrl-u / Ctrl-t */
VIMDEMOS['ch06-04-insert-keys'] = {
  version: 1,
  id: 'ch06-04-insert-keys',
  title: '插入模式内的小剪刀:Ctrl-w / Ctrl-u / Ctrl-t',
  intro: '打错词不用退出插入模式:Ctrl-w 删前一个词,Ctrl-u 清掉整行,Ctrl-t 顺手右缩进。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'insert', cursor: [0, 0], lines: [''] },
  steps: [
    { type: 'type', text: 'const totalPrice = base + tax', lines: ['const totalPrice = base + tax'], cursor: [0, 29],
      note: '正在打字,发现词用错了 —— 别急着重来,插入模式里有自己的编辑键' },
    { type: 'key', key: 'Ctrl-w', mode: 'insert', lines: ['const totalPrice = base + '], cursor: [0, 26],
      note: 'Ctrl-w:删掉光标前的一个词(tax),空格留下 —— 和 cw 同一个哲学' },
    { type: 'type', text: 'margin', lines: ['const totalPrice = base + margin'], cursor: [0, 32],
      note: '换个词直接续上 —— 全程没离开插入模式,节奏不断' },
    { type: 'key', key: 'Ctrl-u', mode: 'insert', lines: [''], cursor: [0, 0],
      note: 'Ctrl-u:清空本行在本次插入里打的字。打了一大段发现全错,它比退格键仁慈' },
    { type: 'type', text: 'const total = base + margin;', lines: ['const total = base + margin;'], cursor: [0, 28],
      note: '重打完成' },
    { type: 'key', key: 'Ctrl-t', mode: 'insert', lines: ['  const total = base + margin;'], cursor: [0, 30],
      note: 'Ctrl-t:本行右移一级缩进(Ctrl-d 反向左移)—— 忘了缩进不用退出去按 >>' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 29],
      note: 'Esc。插入模式不是只能傻打字 —— 它有自己的快捷键方言' }
  ]
};

/* 5. 替换模式 R —— 原位覆写 */
VIMDEMOS['ch06-05-R'] = {
  version: 1,
  id: 'ch06-05-R',
  title: 'R:替换模式,打一个盖一个',
  intro: '状态栏变 REPLACE:打的每个字符原位覆盖旧字符 —— 等宽等长的改写(如 insert→visual)最爽。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 12], lines: ['let mode = "insert";'] },
  steps: [
    { type: 'key', key: 'R', mode: 'replace', cursor: [0, 12],
      note: 'R(大写):进入替换模式 —— 看状态栏:REPLACE。打一个字,盖掉一个字' },
    { type: 'type', text: 'visual', lines: ['let mode = "visual";'], cursor: [0, 18],
      note: '六个字母原位覆写 insert → visual:引号、分号原地不动。等长改写的完美场景' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 17],
      note: 'Esc 回普通模式' },
    { type: 'key', key: 'u', lines: ['let mode = "insert";'], cursor: [0, 12],
      note: 'u 撤销,再看一个「半程覆写」' },
    { type: 'key', key: 'R', mode: 'replace', cursor: [0, 12],
      note: 'R:再来' },
    { type: 'type', text: 'vis', lines: ['let mode = "visert";'], cursor: [0, 15],
      note: '只打三个字母?后半截 ert 还在 —— R 是逐字覆写,不是替换整个词' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 14],
      note: 'Esc。心法:r 换一个、R 覆一串、ciw 换整词 —— 按破坏半径选工具' }
  ]
};

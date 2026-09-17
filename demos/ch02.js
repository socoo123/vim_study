/* demos/ch02.js — 第二章「移动·字符与词」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 本章几乎全是移动命令:多数步骤只改 cursor,不改 lines。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. h j k l —— 主键区的方向键 */
VIMDEMOS['ch02-01-hjkl'] = {
  version: 1,
  id: 'ch02-01-hjkl',
  title: 'h j k l:手不挪窝的方向键',
  intro: '右手食指下面的 j 键上有个小凸点 —— 那是盲打的灯塔。先来最基本的四个方向。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [1, 7], lines: ['let width = 10;', 'let height = 20;', 'let depth = 30;'] },
  steps: [
    { type: 'key', key: 'h', cursor: [1, 6],
      note: 'h:左移一格。从此你的右手不再去够右下角的方向键' },
    { type: 'key', key: 'l', cursor: [1, 7],
      note: 'l:右移一格。h 和 l 在同一行,一左一右' },
    { type: 'key', key: 'j', cursor: [2, 7],
      note: 'j:下移一行,列保持不变(j 键上有凸点,盲摸即知)' },
    { type: 'key', key: '2', pending: '2',
      note: '先按数字 2:状态栏出现待决的 2 —— 移动命令都吃计数前缀' },
    { type: 'key', key: 'h', cursor: [2, 5], pending: '',
      note: '2h:一次左移两格。数格子这件事,交给数字前缀' },
    { type: 'key', key: 'k', cursor: [1, 5],
      note: 'k:上移一行。j/k 一来一回,就是第 1 章说的每日热身' }
  ]
};

/* 2. w b e —— 词的三兄弟 */
VIMDEMOS['ch02-02-w-b-e'] = {
  version: 1,
  id: 'ch02-02-w-b-e',
  title: 'w / b / e:按「词」移动',
  intro: '在一行代码里,真正的单位不是字符,是词。w 前进、b 后退、e 到词尾。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['const total = price + tax;'] },
  steps: [
    { type: 'key', key: 'w', cursor: [0, 6],
      note: 'w(word):跳到下一个词的开头 —— 从 const 直达 total' },
    { type: 'key', key: 'w', cursor: [0, 12],
      note: '再按 w:注意!=(等号)自己算一个「词」—— 标点在 Vim 里自立门户' },
    { type: 'key', key: 'w', cursor: [0, 14],
      note: '继续 w,到达 price 的开头' },
    { type: 'key', key: 'e', cursor: [0, 18],
      note: 'e(end):跳到当前词的最后一个字母 —— price 的 e' },
    { type: 'key', key: 'w', cursor: [0, 20],
      note: 'w 又一次:跳到 +(加号)上,标点依旧是一个词' },
    { type: 'key', key: 'b', cursor: [0, 14],
      note: 'b(back):回到上一个词的开头。w/b 一对,e 管词尾' }
  ]
};

/* 3. W B E —— word 与 WORD */
VIMDEMOS['ch02-03-W-vs-w'] = {
  version: 1,
  id: 'ch02-03-W-vs-w',
  title: 'w 与 W:小词与大词(WORD)',
  intro: '同一条语句,小写 w 逐词碎步,大写 W 按空白大步流星。看清楚了:',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['parse(data_dir, file.txt)'] },
  steps: [
    { type: 'key', key: 'w', cursor: [0, 5],
      note: 'w:parse 是一个词,左括号( 是另一个词' },
    { type: 'key', key: 'w', cursor: [0, 6],
      note: 'w:这才到 data_dir —— 下划线属于词,所以它是一个完整的词' },
    { type: 'key', key: 'w', cursor: [0, 14],
      note: 'w:逗号也是一个词…… 小词的世界里标点很吵' },
    { type: 'key', key: 'w', cursor: [0, 16],
      note: 'w:终于到 file —— 走了四步' },
    { type: 'wait', note: '下面换大写 W 重新走一遍(WORD = 用空白分隔的大词)' },
    { type: 'key', key: '0', cursor: [0, 0],
      note: '0:先借行首键回到起点(下一节主角)' },
    { type: 'key', key: 'W', cursor: [0, 16],
      note: 'W:一步直达 file!它把 parse(data_dir, 当成一个整体跨过去了' }
  ]
};

/* 4. 0 ^ $ g_ —— 行内瞬移 */
VIMDEMOS['ch02-04-line-jump'] = {
  version: 1,
  id: 'ch02-04-line-jump',
  title: '0 / ^ / $ / g_:行首与行尾的四种含义',
  intro: '这行结尾有两个空格 —— 正好用来区分 $ 与 g_。光标现在停在 x 上。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 8], lines: ['  const x = compute(a);  ', '// 光标在上一行活动'] },
  steps: [
    { type: 'key', key: '$', cursor: [0, 24],
      note: '$(Shift-4,像行尾符):绝对行尾 —— 连行尾空格都算,光标停在空格上' },
    { type: 'key', key: 'g', pending: 'g',
      note: '按 g:它是前缀键,状态栏出现待决的 g(和第 1 章的 dd 同理)' },
    { type: 'key', key: '_', cursor: [0, 22], pending: '',
      note: 'g_:最后一个非空白字符(分号)—— 有行尾空格时比 $ 更准' },
    { type: 'key', key: '^', cursor: [0, 2],
      note: '^(Shift-6):本行第一个非空白字符 —— 跳过两个缩进,直达 c' },
    { type: 'key', key: '0', cursor: [0, 0],
      note: '0(数字零):绝对行首,第 0 列。^ 与 0 的区别只在缩进' }
  ]
};

/* 5. f t ; —— 行内查找 */
VIMDEMOS['ch02-05-f-t-semi'] = {
  version: 1,
  id: 'ch02-05-f-t-semi',
  title: 'f 与 t:行内直达,; 连续跳',
  intro: '一行里有好几个逗号?f, 送到第一个逗号,; 一路往下踩。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['const [a, b, c] = [10, 20, 30];'] },
  steps: [
    { type: 'key', key: 'f', pending: 'f',
      note: 'f(find):按下后等你输入一个字符 —— 状态栏显示待决的 f' },
    { type: 'key', key: ',', cursor: [0, 8], pending: '',
      note: 'f, :跳到本行下一个逗号(a 后面那个)' },
    { type: 'key', key: ';', cursor: [0, 11],
      note: ';(分号):重复刚才的 f, —— 跳到下一个逗号' },
    { type: 'key', key: ';', cursor: [0, 21],
      note: '再按 ; 继续踩。, 则是往回找 —— 这对键在左手小指右边' },
    { type: 'key', key: 't', pending: 't',
      note: 't(till):和 f 成对 —— 跳到目标字符的【前一格】' },
    { type: 'key', key: '0', cursor: [0, 23], pending: '',
      note: 't0:停在下一个 0(20 的 0)之前 —— 为什么要差一格?下个演示见分晓' }
  ]
};

/* 6. dt, —— 移动即射程 */
VIMDEMOS['ch02-06-dt-comma'] = {
  version: 1,
  id: 'ch02-06-dt-comma',
  title: 'dt, :移动不只是移动,还是删除的射程',
  intro: '把 level 这个参数删掉,逗号之前全拿走 —— d + t + , 三个键。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 6], lines: ['  log(level, msg, tag);'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词,等待移动目标(第 5 章主角,先感受一次)' },
    { type: 'key', key: 't', pending: 'dt',
      note: 't:射程的终点是……' },
    { type: 'key', key: ',', lines: ['  log(, msg, tag);'], cursor: [0, 6], pending: '',
      note: 'dt, = 删到逗号前:level 整个消失。t 差的那一格,正好保住逗号' },
    { type: 'key', key: 'u', lines: ['  log(level, msg, tag);'], cursor: [0, 6],
      note: 'u 撤销。移动 = 名词,动词 + 名词 = 句子 —— 这就是第 0 章说的语言' }
  ]
};

/* 7. 行内组合 —— 两键到达任何地方 */
VIMDEMOS['ch02-07-two-keys'] = {
  version: 1,
  id: 'ch02-07-two-keys',
  title: '行内组合拳:任何位置,两键以内',
  intro: '一行 35 个字符,光标从行首出发 —— 用本章的键,步数永远 ≤ 2。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['function render(html, data, opts) {'] },
  steps: [
    { type: 'key', key: 'f', pending: 'f',
      note: '目标:data 的 d。先按 f' },
    { type: 'key', key: 'd', cursor: [0, 22], pending: '',
      note: 'fd:两键直达第 22 列 —— 不数格子,不看行号' },
    { type: 'key', key: 'e', cursor: [0, 25],
      note: 'e:顺手到 data 的词尾(a 上)' },
    { type: 'key', key: 'f', pending: 'f',
      note: '目标:opts 的 s' },
    { type: 'key', key: 's', cursor: [0, 31], pending: '',
      note: 'fs:又是两键。f 认识本行所有字符,你只要认识目标' },
    { type: 'key', key: '$', cursor: [0, 34],
      note: '$:一秒到行尾。结论:行内任何位置 ≤2 键 —— 这就是本章的物理学' }
  ]
};

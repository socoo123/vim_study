/* demos/ch08.js — 第八章「查找与替换」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角:/ 查找与 n/N、* 光标词查找、:s 替换与 g/c 标志、
 *    确认模式 y/n/a、:'<,'> 区域替换、:g/pattern/d、& 重复替换。
 *  - 表示法:/pattern 的输入过程用 pending 字段模拟显示在状态栏;
 *    : 命令用 type:'cmd'(播放器会把命令渲染进状态栏);选区内按 : 的
 *    自动前缀用显式 cmdline 字段渲染。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. / 查找 + n/N —— 搜索即跳转 */
VIMDEMOS['ch08-01-slash-n'] = {
  version: 1,
  id: 'ch08-01-slash-n',
  title: '/ 与 n/N:输入词,全文件巡游',
  intro: '/ 打开查找,Enter 跳到下一个匹配;n 下一个、N 上一个 —— 查找本质是一种光标移动。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [1, 8],
    lines: ['function loadUser() {', '  const user = auth();', '  return user;', '}'] },
  steps: [
    { type: 'key', key: '/', pending: '/',
      note: '/:打开查找命令行(状态栏)。? 是反向的 /,日常 90% 用 /' },
    { type: 'type', text: 'user', pending: '/user',
      note: '输入要找的词 —— IDE 里此刻全文的 user 已经实时高亮(增量查找)' },
    { type: 'key', key: 'Enter', cursor: [1, 8], pending: '',
      note: 'Enter:跳到光标之后第一个 user。查找是一个「移动命令」,不是弹窗' },
    { type: 'key', key: 'n', cursor: [2, 9],
      note: 'n(next):跳到下一个匹配。按住 n 就是全文巡游' },
    { type: 'key', key: 'N', cursor: [1, 8],
      note: 'N:跳回上一个。n/N 一对,查环形列表一样把文件绕圈走' }
  ]
};

/* 2. * 光标词查找 + cw + . —— 全文件重命名工作流 */
VIMDEMOS['ch08-02-star-dot'] = {
  version: 1,
  id: 'ch08-02-star-dot',
  title: '* + n + .:三分钟重命名一个变量',
  intro: '* 把光标下的词设为查找词并跳到下一处;n 跳下一个,ciw 换词,. 重复 —— 重命名流水线。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 6],
    lines: ['const total = price * qty;', 'const total = tax * 1;', 'log(total);'] },
  steps: [
    { type: 'key', key: '*', cursor: [1, 6],
      note: '*:把光标下的词(total)设为查找词,立刻跳到下一处 —— 等价 /\\<total\\> Enter 且整词匹配' },
    { type: 'key', key: 'n', cursor: [0, 6], pending: '',
      note: 'n:回到第一处开始干活(* 默认跳到下一处,n 绕回文件头)' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:换词 —— 重命名的主角是 ciw' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '',
      lines: ['const  = price * qty;', 'const total = tax * 1;', 'log(total);'], cursor: [0, 6],
      note: 'ciw:清掉 total,进入插入(留意留下的双空格 —— 第 4 章)' },
    { type: 'type', text: 'sum', lines: ['const sum = price * qty;', 'const total = tax * 1;', 'log(total);'], cursor: [0, 9],
      note: '输入新名' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 8],
      note: 'Esc:第一处改完' },
    { type: 'key', key: 'n', cursor: [1, 6],
      note: 'n:跳到下一个 total —— 查找和替换在这里会师' },
    { type: 'key', key: '.', lines: ['const sum = price * qty;', 'const sum = tax * 1;', 'log(total);'], cursor: [1, 8],
      note: '.:重复刚才的 ciw sum —— 一键把这一处也换掉' },
    { type: 'key', key: 'n', cursor: [2, 4],
      note: 'n:下一处' },
    { type: 'key', key: '.', lines: ['const sum = price * qty;', 'const sum = tax * 1;', 'log(sum);'], cursor: [2, 7],
      note: '.:最后一处。n . n . 交替 —— 全文件重命名,节奏像敲鼓' }
  ]
};

/* 3. :s 行内替换 —— g 标志的有无 */
VIMDEMOS['ch08-03-s-inline'] = {
  version: 1,
  id: 'ch08-03-s-inline',
  title: ':s/旧/新/:g 标志决定一行换一处还是处处',
  intro: '不带 g 只换本行第一处(头号翻车点);加 g 才是本行全局。range 缺省 = 当前行。',
  lang: 'ts',
  speed: 1050,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['let x = f(a) + f(b) + f(c);'] },
  steps: [
    { type: 'cmd', text: ':s/f/g', cursor: [0, 8],
      lines: ['let x = g(a) + f(b) + f(c);'],
      note: ':s/f/g(没带 g 标志):只换本行【第一处】 f —— 最常见的替换翻车点' },
    { type: 'cmd', text: ':s/f/h/g', cursor: [0, 15],
      lines: ['let x = g(a) + h(b) + h(c);'],
      note: '加 g(global):本行剩下的 f 全部换成 h。口诀:一行多处必带 g' }
  ]
};

/* 4. :%s//gc —— 确认模式 y / n / a */
VIMDEMOS['ch08-04-s-confirm'] = {
  version: 1,
  id: 'ch08-04-s-confirm',
  title: ':%s//gc:每换一处都问你一句',
  intro: 'c 标志进入确认模式:y 换这处、n 跳过、a 剩下全换、q 撤退 —— 眼皮底下做替换。',
  lang: 'ts',
  speed: 1050,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['const name = getName();', 'const name = userName();', 'log(name);'] },
  steps: [
    { type: 'cmd', text: ':%s/name/label/gc', cursor: [0, 6],
      note: ':%s 全文件 + g 每行处处 + c 确认:光标停在第一处,等你发话' },
    { type: 'key', key: 'y', lines: ['const label = getName();', 'const name = userName();', 'log(name);'], cursor: [1, 6],
      note: 'y(yes):换掉这处,自动跳到下一处' },
    { type: 'key', key: 'n', cursor: [2, 4],
      note: 'n(no):这处跳过不换 —— 这里的 name 是别人的 name,放过它' },
    { type: 'key', key: 'a', lines: ['const label = getName();', 'const label = userName();', 'log(label);'], cursor: [2, 4],
      note: 'a(all):看明白了,剩下的全换不再问。q 是中途撤退,l 是看完这处就停' }
  ]
};

/* 5. V 选区 + :'<,'>s —— 区域替换 */
VIMDEMOS['ch08-05-visual-range'] = {
  version: 1,
  id: 'ch08-05-visual-range',
  title: '选中后按 ::替换只打在选区里',
  intro: 'V 选两行,按 : 命令行自动带出 :<,> 范围前缀 —— :s 只改选区,选区外的同名毫发无伤。',
  lang: 'ts',
  speed: 1050,
  initial: { mode: 'normal', cursor: [1, 2],
    lines: ['function demo() {', '  const alpha = 1;', '  const beta = alpha + 2;', '  return alpha;', '}'] },
  steps: [
    { type: 'key', key: 'V', mode: 'visual-line', sel: [[1, 0], [1, 17]],
      note: 'V:按行圈地 —— 只想改函数里的前两行' },
    { type: 'key', key: 'j', cursor: [2, 0], sel: [[1, 0], [2, 24]],
      note: 'j:选区盖住两行' },
    { type: 'key', key: ':', cmdline: ":'<,'>", mode: 'visual-line',
      note: "::按冒号,命令行自动填好 '<,'> 范围前缀 —— 这就是「选区当 range」" },
    { type: 'cmd', text: ":'<,'>s/alpha/x/", mode: 'normal', sel: null, cursor: [1, 8],
      lines: ['function demo() {', '  const x = 1;', '  const beta = x + 2;', '  return alpha;', '}'],
      note: '替换只落在选中的两行 —— 第 4 行的 alpha 毫发无伤,区域替换的价值所在' }
  ]
};

/* 6. :g/pattern/d —— global 命令批量删行 */
VIMDEMOS['ch08-06-global-delete'] = {
  version: 1,
  id: 'ch08-06-global-delete',
  title: ':g/console/d:凡含此词的行,整行蒸发',
  intro: ':g/模式/d 把匹配行整行删除 —— 清理调试日志、删空行、删注释块,一条命令一群行。',
  lang: 'ts',
  speed: 1050,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ["function clean() {", "  console.log('a');", '', "  console.log('b');", '', '  doWork();', '}'] },
  steps: [
    { type: 'cmd', text: ':g/console/d', cursor: [0, 0],
      lines: ['function clean() {', '', '', '  doWork();', '}'],
      note: ':g/console/d:对所有含 console 的行执行 d(删除)—— 调试日志一扫光' },
    { type: 'cmd', text: ':g/^$/d', cursor: [0, 0],
      lines: ['function clean() {', '  doWork();', '}'],
      note: ':g/^$/d:正则 ^$ 匹配空行,顺手把删出来的空行也扫掉' },
    { type: 'key', key: 'u', cursor: [0, 0],
      lines: ['function clean() {', '', '', '  doWork();', '}'],
      note: 'u:一条 :g 命令是一个撤销单元,一次 u 整条回滚(不是逐行)。:v/^ /d 可反着删' }
  ]
};

/* 7. & —— 重复上一次 :s */
VIMDEMOS['ch08-07-amp-repeat'] = {
  version: 1,
  id: 'ch08-07-amp-repeat',
  title: '&:把上一条 :s 在本行再放一遍',
  intro: ':s/let/const/ 换完第一行,j & j & —— & 是「上一条替换」的单行重播键,逐行审批式替换。',
  lang: 'ts',
  speed: 1050,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['let a = 1;', 'let b = 2;', 'let c = 3;'] },
  steps: [
    { type: 'cmd', text: ':s/let/const/', cursor: [0, 0],
      lines: ['const a = 1;', 'let b = 2;', 'let c = 3;'],
      note: ':s/let/const/:先把第一行换掉 —— 注意只换了这一行' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:下一行' },
    { type: 'key', key: '&', lines: ['const a = 1;', 'const b = 2;', 'let c = 3;'], cursor: [1, 0],
      note: '&:重复上一次 :s —— 等价于在本行再敲一遍 :s/let/const/,但只要一键' },
    { type: 'key', key: 'j', cursor: [2, 0],
      note: 'j:再下一行' },
    { type: 'key', key: '&', lines: ['const a = 1;', 'const b = 2;', 'const c = 3;'], cursor: [2, 0],
      note: '&:第三行换完。j & j & 的节奏:一行一行看过来,每行亲手放行 —— 比 :%s 多一分掌控' }
  ]
};

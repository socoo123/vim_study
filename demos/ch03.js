/* demos/ch03.js — 第三章「移动·行与文件」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角是「行与文件级」的移动:j/k × 相对行号、gg G {n}G、{ } 段落、
 *    % 配对、H M L、书签 m ' `、跳转表 Ctrl-o / Ctrl-i。
 *  - 演示 1 启用 relativeNumbers: true —— 播放器会把行号渲染成「相对当前行的距离」。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. 相对行号 + 计数 j/k —— 行间传送门 */
VIMDEMOS['ch03-01-relative-jk'] = {
  version: 1,
  id: 'ch03-01-relative-jk',
  title: '相对行号:2j 报地址,一步到达',
  intro: '行号显示的是「离当前行几步」—— 想去哪行,读几步,报数字,j/k 一步传送。',
  lang: 'ts',
  speed: 1000,
  relativeNumbers: true,
  initial: { mode: 'normal', cursor: [4, 2], lines: [
    'const CONFIG = {',
    "  host: 'db.local',",
    '  port: 5432,',
    '};',
    'const POOL = {',
    '  min: 2,',
    '  max: 10,',
    '};',
    'export default CONFIG;'
  ] },
  steps: [
    { type: 'key', key: '2', pending: '2',
      note: '看行号:max 行头上写着 2(当前行显示绝对号 5)—— 离我两步' },
    { type: 'key', key: 'j', cursor: [6, 2], pending: '',
      note: '2j:一步落到 max 上。行号已经替你数完格子了' },
    { type: 'key', key: 'k', cursor: [5, 2],
      note: 'k:单行下退。相对行号下「3」就代表三步外' },
    { type: 'key', key: '4', pending: '4',
      note: '想回顶部的 host?它头上写着 -4(负数 = 在上方)' },
    { type: 'key', key: 'k', cursor: [1, 2],
      note: '4k:四步一次走完。j/k 配上相对行号,行间移动变成「报地址」' }
  ]
};

/* 2. gg / G / {n}G / :n —— 文件三键 */
VIMDEMOS['ch03-02-gg-G'] = {
  version: 1,
  id: 'ch03-02-gg-G',
  title: 'gg / G / 3G:文件的两端书挡与行号传送门',
  intro: 'gg 直奔第一行,G 直奔最后一行,{n}G 精确直达第 n 行 —— 大文件里别滚,报地址。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [4, 2], lines: [
    '// == 配置区 ==',
    'const A = 1;',
    'const B = 2;',
    '// == 逻辑区 ==',
    'function run() {',
    '  return A + B;',
    '}',
    '// == 导出区 ==',
    'export default run;'
  ] },
  steps: [
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:前缀键(g_ 的老朋友),它后面跟一个动作' },
    { type: 'key', key: 'g', cursor: [0, 0], pending: '',
      note: 'gg:直奔文件第一行。改 import、看文件头,都是它' },
    { type: 'key', key: 'G', cursor: [8, 0],
      note: '大写 G(Shift-g):直奔最后一行。gg / G 是文件的两端书挡' },
    { type: 'key', key: '3', pending: '3',
      note: '数字 3:想去第 3 行' },
    { type: 'key', key: 'G', cursor: [2, 0], pending: '',
      note: '3G:精确跳到第 3 行。行号 + G = 传送门(编译器报错「第 42 行」就 42G)' },
    { type: 'cmd', text: ':5', cursor: [4, 0], pending: '',
      note: ':5 回车:命令行版直达 —— 效果同 5G,顺手用哪个都行' }
  ]
};

/* 3. { } —— 段落移动 */
VIMDEMOS['ch03-03-paragraph'] = {
  version: 1,
  id: 'ch03-03-paragraph',
  title: '{ 与 }:按「段」推进,不按行爬',
  intro: '空行就是 Vim 的段落符。} 跳到下一段,{ 跳回上一段 —— 长文件按结构翻页。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [3, 4], lines: [
    "import fs from 'fs';",
    '',
    'function parse(src) {',
    '  return src.trim();',
    '}',
    '',
    'function emit(out) {',
    '  return out;',
    '}',
    '',
    '// TODO: more'
  ] },
  steps: [
    { type: 'key', key: '}', cursor: [5, 0],
      note: '}(:跳到下一段 —— 落在分段的空行上。一个函数就是一个「段」' },
    { type: 'key', key: '}', cursor: [9, 0],
      note: '再按 }:又翻过一段。长文件里 }}} 就是按结构快速翻阅' },
    { type: 'key', key: '{', cursor: [5, 0],
      note: '{:反向,回上一段(同样落在空行上)' },
    { type: 'key', key: '2', pending: '2',
      note: '计数照吃:报个 2' },
    { type: 'key', key: '{', cursor: [1, 0], pending: '',
      note: '2{:一次回跳两段。它和第 4 章的 ip/ap 是同一套「段」概念 —— 移动版' }
  ]
};

/* 4. % —— 配对符任意门 */
VIMDEMOS['ch03-04-percent'] = {
  version: 1,
  id: 'ch03-04-percent',
  title: '%:配对符任意门,还能当删除的名词',
  intro: '光标放在 ( { [ 上,% 一键飞到配对的那一半;配 d 还能删掉整个块。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [1, 21], lines: [
    'function area(w, h) {',
    '  const rect = toRect(w, h);',
    '  if (rect.valid) {',
    '    return rect.w * rect.h;',
    '  }',
    '  return 0;',
    '}'
  ] },
  steps: [
    { type: 'key', key: '%', cursor: [1, 26],
      note: '%:光标在 ( 上 → 瞬移到配对的 )。括号多深、多远都无所谓' },
    { type: 'key', key: '%', cursor: [1, 21],
      note: '再按 %:原路弹回。看一眼另一半再回来,总共两个键' },
    { type: 'key', key: 'k', cursor: [0, 20],
      note: 'k 上一行:列超出行长时 Vim 自动收到行尾字符上(这里是 { )' },
    { type: 'key', key: '%', cursor: [6, 0],
      note: '% 在 { 上:直落数了 6 行的函数结尾!写码时「瞄一眼函数尾巴」就这么快' },
    { type: 'key', key: '%', cursor: [0, 20],
      note: '% 再弹回开头' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词 —— 惊喜是:% 也能当名词用' },
    { type: 'key', key: '%', lines: ['function area(w, h) '], cursor: [0, 19], pending: '',
      note: 'd%:从 { 删到配对的 } —— 整个函数体连壳拿走(比 dd 数行稳得多)' },
    { type: 'key', key: 'u',
      lines: ['function area(w, h) {', '  const rect = toRect(w, h);', '  if (rect.valid) {', '    return rect.w * rect.h;', '  }', '  return 0;', '}'], cursor: [0, 20],
      note: 'u:块回来了。动词 × % —— 第 5 章的语法在文件级继续成立' }
  ]
};

/* 5. 书签 m ' ` —— 文件内的导航锚点 */
VIMDEMOS['ch03-05-bookmarks'] = {
  version: 1,
  id: 'ch03-05-bookmarks',
  title: '书签 ma / \\u0027a / `a:钉个钉子,一键回岗',
  intro: 'm 设书签(静默无提示),\\u0027a 跳回书签所在行,`a 连行带列精确还原。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [2, 10], lines: [
    'const TAX = 0.35;',
    'function net(gross) {',
    '  return gross * (1 - TAX);',
    '}',
    '// ===== 纯函数 =====',
    'function report(x) {',
    '  return net(x) + x * TAX;',
    '}'
  ] },
  steps: [
    { type: 'key', key: 'm', pending: 'm',
      note: 'm(mark):设书签 —— 等你用一个字母给书签起名' },
    { type: 'key', key: 'a', pending: '',
      note: 'ma:书签 a 已钉在当前位置。屏幕毫无动静 —— 静默但可靠' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:前缀' },
    { type: 'key', key: 'g', cursor: [0, 0], pending: '',
      note: 'gg:飞回文件头,比如去改个常量' },
    { type: 'key', key: "'", pending: "'",
      note: "'(单引号):跳书签 —— 它在等书签名" },
    { type: 'key', key: 'a', cursor: [1, 0], pending: '',
      note: "'a:回到书签 a 所在行的行首。改完东西,一键回岗" },
    { type: 'key', key: '`', pending: '`',
      note: '`(反引号):精确版书签跳转' },
    { type: 'key', key: 'a', cursor: [2, 10], pending: '',
      note: '`a:行、列都还原到设书签的那个点。\\u0027a 管到行,`a 管到点' }
  ]
};

/* 6. H M L + zz —— 窗口地标与滚动 */
VIMDEMOS['ch03-06-HML-zz'] = {
  version: 1,
  id: 'ch03-06-HML-zz',
  title: 'H / M / L:窗口的三颗地标',
  intro: 'H 到窗口顶、M 到正中、L 到窗口底 —— 它们的坐标是「屏幕」,不是文件。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [6, 7], lines: [
    '// top of window (H)',
    'const a = 1;',
    'const b = 2;',
    'const c = 3;',
    'const d = 4; // middle (M)',
    'const e = 5;',
    'const f = 6;',
    'const g = 7;',
    '// bottom of window (L)'
  ] },
  steps: [
    { type: 'key', key: 'H', cursor: [0, 0],
      note: 'H(High):窗口第一行。不用知道自己在文件第几行' },
    { type: 'key', key: 'M', cursor: [4, 0],
      note: 'M(Middle):窗口正中。一屏内容的中位锚点,翻页后先按 M 定锚' },
    { type: 'key', key: 'L', cursor: [8, 0],
      note: 'L(Low):窗口最后一行。三兄弟的坐标系是屏幕 —— 滚动后照用不误' },
    { type: 'key', key: 'z', pending: 'z',
      note: 'z:前缀键,专门管「滚动」' },
    { type: 'key', key: 'z', cursor: [8, 0], pending: '',
      note: 'zz:把当前行滚到屏幕中央。演示器不滚动,真编辑器里屏幕会转' },
    { type: 'key', key: 'z', pending: 'z',
      note: 'z:再来一次' },
    { type: 'key', key: 't', cursor: [8, 0], pending: '',
      note: 'zt:当前行顶到屏幕最上(zb 则压到最下)。常见搭配:% 跳到块尾后 zz 拉回视野中央' }
  ]
};

/* 7. 跳转表 Ctrl-o / Ctrl-i —— 编辑器的浏览历史 */
VIMDEMOS['ch03-07-jumplist'] = {
  version: 1,
  id: 'ch03-07-jumplist',
  title: 'Ctrl-o / Ctrl-i:跳转表的「后退 / 前进」',
  intro: 'gg、G、{n}G 这类大跳都会记入跳转表 —— Ctrl-o 后退、Ctrl-i 前进,和浏览器一个逻辑。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [2, 6], lines: [
    'const TAX = 0.35;',
    'function net(g) {',
    '  return g * (1 - TAX);',
    '}',
    'function main() {',
    '  console.log(net(100));',
    '}'
  ] },
  steps: [
    { type: 'key', key: 'G', cursor: [6, 0],
      note: 'G:跳到末行 —— 这种「大跳」自动登记进跳转表(jumplist)' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:前缀' },
    { type: 'key', key: 'g', cursor: [0, 0], pending: '',
      note: 'gg:又一条记录入表。历史:出发地 → 文件尾 → 文件头' },
    { type: 'key', key: 'Ctrl-o', cursor: [6, 0],
      note: 'Ctrl-o:沿跳转表【后退】一步 —— 回到刚才的文件尾' },
    { type: 'key', key: 'Ctrl-o', cursor: [2, 6],
      note: '再 Ctrl-o:退回最初的出发地。连按 Ctrl-o,一路召回浏览历史' },
    { type: 'key', key: 'Ctrl-i', cursor: [6, 0],
      note: 'Ctrl-i:【前进】一步,把刚退掉的跳再走回来 —— 浏览器同款逻辑' }
  ]
};

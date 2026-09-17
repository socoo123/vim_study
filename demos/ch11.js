/* demos/ch11.js — 第十一章「多文件与窗口」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章模拟「多文件」:切换文件时整个 lines 快照换成目标文件的内容,
 *    编辑区等于切到了另一块取景框 —— note 里说明切到了哪。
 *  - Ctrl-w 是「窗口命令前缀」,拆成 Ctrl-w + 字母两步,pending 显示拼到哪一步。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. 缓冲区::ls / :e / :b{n} / Ctrl-^ */
VIMDEMOS['ch11-01-buffers'] = {
  version: 1,
  id: 'ch11-01-buffers',
  title: ':ls 看号,:b 按号切,Ctrl-^ 往返',
  intro: 'vim 的多文件主力是「缓冲区」:文件都在后台,:ls 列清单、:b2 按号切;Ctrl-^ 在当前与上一个之间一键乒乓。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [2, 13],
    lines: ['import { fmt } from "./util";', '', 'const name = "vim";', 'console.log(fmt(name));'] },
  steps: [
    { type: 'cmd', text: ':ls', cursor: [2, 13],
      note: ':ls:列出开着的缓冲区 —— 1 号 main.js(a 当前)、2 号 util.js(# 上一个)。号是关键,后面 :b 按号点名' },
    { type: 'cmd', text: ':e util.js',
      lines: ['export function fmt(s) {', '  return "[" + s + "]";', '}'], cursor: [0, 20],
      note: ':e:打开 util.js —— 编辑区整屏换成它;main.js 仍在后台,缓冲区不会消失' },
    { type: 'key', key: 'G', cursor: [2, 0],
      note: 'G:直接跳到它最后一行 —— 换了文件,第 3 章的导航照常好使' },
    { type: 'cmd', text: ':b1',
      lines: ['import { fmt } from "./util";', '', 'const name = "vim";', 'console.log(fmt(name));'], cursor: [2, 13],
      note: ':b1:按号切回 main.js —— 光标停在你离开时的老位置,每个缓冲区各自记着自己的光标' },
    { type: 'key', key: 'Ctrl-^',
      lines: ['export function fmt(s) {', '  return "[" + s + "]";', '}'], cursor: [2, 0],
      note: 'Ctrl-^(Ctrl 加 6):「当前」和「上一个」之间一键往返 —— 又回到 util.js,连位置都没变' },
    { type: 'key', key: 'Ctrl-^',
      lines: ['import { fmt } from "./util";', '', 'const name = "vim";', 'console.log(fmt(name));'], cursor: [2, 13],
      note: 'Ctrl-^:再按又回来 —— 两个文件对照抄代码时,这个组合键比任何菜单都快' }
  ]
};

/* 2. 分屏::sp 与 Ctrl-w 全家 —— 同一缓冲区的两个取景框 */
VIMDEMOS['ch11-02-split'] = {
  version: 1,
  id: 'ch11-02-split',
  title: ':sp 分屏:两个窗口,一份文件',
  intro: ':sp 上下分屏、:vs 左右分屏,Ctrl-w 加 hjkl/w/o 选窗 —— 分屏是同一文件的两个取景框,改一处两屏齐动。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['const a = 1;', '', 'const b = 2;', '// end'] },
  steps: [
    { type: 'cmd', text: ':sp', cursor: [0, 0],
      note: ':sp:水平分屏 —— 同一个文件上下两个「取景框」,光标留在上面那个' },
    { type: 'key', key: 'Ctrl-w', pending: 'Ctrl-w',
      note: 'Ctrl-w:窗口命令前缀 —— 接下来的字母发给「窗口」而不是文本' },
    { type: 'key', key: 'j', cursor: [0, 0],
      note: 'Ctrl-w j:焦点移到下窗口(h/j/k/l 方向选,w 轮换)—— 画面没换内容,因为两个窗口看的是同一个文件' },
    { type: 'key', key: 'G', cursor: [3, 0],
      note: 'G:在下窗口翻到文件尾 —— 上看头、下看尾,长文件前后对照正是分屏的意义' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [3, 6],
      note: 'A:在下窗口的末行行尾 —— 加点东西,马上有件神奇的事' },
    { type: 'type', text: ' of file', cursor: [3, 14],
      lines: ['const a = 1;', '', 'const b = 2;', '// end of file'],
      note: '打字中……' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [3, 13],
      note: 'Esc:改完 —— 注意这是「在下面窗口里」做的修改' },
    { type: 'key', key: 'Ctrl-w', pending: 'Ctrl-w',
      note: 'Ctrl-w:窗口前缀再来' },
    { type: 'key', key: 'w', cursor: [0, 0],
      note: 'Ctrl-w w:焦点轮换到上窗口 —— 两个窗口之间乒乓' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:……' },
    { type: 'key', key: 'g', cursor: [0, 0],
      note: 'gg:上窗口回到文件头 —— 刚才在下窗口加的 of file【同步出现】了:分屏共享同一个缓冲区,改一处两屏齐动' },
    { type: 'cmd', text: ':vs', cursor: [0, 0],
      note: ':vs:垂直分屏(左右)—— 并排对照两段代码用;Ctrl-w h / l 左右选窗' },
    { type: 'key', key: 'Ctrl-w', pending: 'Ctrl-w',
      note: 'Ctrl-w:' },
    { type: 'key', key: 'o', cursor: [0, 0],
      note: 'Ctrl-w o:只留当前窗口,其余全关 —— 屏幕乱了就一键清屏(窗口关了,文件还在缓冲区)' },
    { type: 'wait', cursor: [0, 0],
      note: '窗口键速查:Ctrl-w h/j/k/w 选窗、o 只留此窗、c 关一扇、_ 纵向最大、= 全部均分 —— 详见章内表格' }
  ]
};

/* 3. 标签页:gt / gT / 2gt —— 一桌多屏 */
VIMDEMOS['ch11-03-tabs'] = {
  version: 1,
  id: 'ch11-03-tabs',
  title: '标签页:gt 转,2gt 直达,:tabc 关',
  intro: 'vim 的标签页像浏览器 tab:gt/gT 循环切换、2gt 直接跳第 n 个;注意它是「取景框的桌面」,关掉 ≠ 删文件。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['import { debug } from "./config";', 'main();'] },
  steps: [
    { type: 'cmd', text: ':tabe config.js',
      lines: ['export const debug = true;', '// TODO: 生产环境记得关'], cursor: [0, 0],
      note: ':tabe:新开标签页装着 config.js —— 整屏切过去;标签页比窗口更彻底,是一整块「桌面」' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:' },
    { type: 'key', key: 't',
      lines: ['import { debug } from "./config";', 'main();'], cursor: [0, 0],
      note: 'gt:下一个标签页 —— 回到 app.js(gT 反向;标签多了 :tabs 看清单)' },
    { type: 'key', key: '2', pending: '2',
      note: '2:数字前缀 —— 不挨个转,直接点名' },
    { type: 'key', key: 'g', pending: '2g',
      note: 'g:' },
    { type: 'key', key: 't',
      lines: ['export const debug = true;', '// TODO: 生产环境记得关'], cursor: [0, 0],
      note: '2gt:直接跳到第 2 个标签页 —— 标签少数着按,标签多就该用缓冲区 :b 了(§1)' },
    { type: 'cmd', text: ':tabc',
      lines: ['import { debug } from "./config";', 'main();'], cursor: [0, 0],
      note: ':tabc:关掉当前标签页(config)—— 画面回到剩下的 app.js。关的是取景框不是文件:config.js 仍在缓冲区,:b 随时回来' }
  ]
};

/* 4. quickfix::vimgrep 收清单,:cn 逐条消化 */
VIMDEMOS['ch11-04-quickfix'] = {
  version: 1,
  id: 'ch11-04-quickfix',
  title: ':vimgrep + :cn:问题清单驱动的导航',
  intro: ':vimgrep 把所有文件的 TODO 收进 quickfix 清单,:cn 一条条跳过去 —— 改一条跳一条,像 IDE 的 Problems 面板。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['import { help } from "./util";', 'help();'] },
  steps: [
    { type: 'cmd', text: ':vimgrep /TODO/ *.js', cursor: [0, 0],
      note: ':vimgrep:把所有 js 文件里含 TODO 的行搜进 quickfix 清单 —— vim 自带的「问题面板」,搜完不自动跳' },
    { type: 'cmd', text: ':cn',
      lines: ['// TODO: 参数校验', 'export function help() {', '  // TODO: 打日志', '}'], cursor: [0, 3],
      note: ':cn:跳到清单第 1 条 —— 屏幕切到 util.js,光标正中第一个 TODO(:copen 可打开清单窗)' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [0, 13],
      note: 'A:处理这条 —— quickfix 只负责导航,干活还是老一套' },
    { type: 'type', text: ' [ok]', cursor: [0, 18],
      lines: ['// TODO: 参数校验 [ok]', 'export function help() {', '  // TODO: 打日志', '}'],
      note: '做个记号' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 17],
      note: 'Esc:第一条办结' },
    { type: 'cmd', text: ':cn', cursor: [2, 5],
      note: ':cn:下一条 —— 光标精准落在第二个 TODO 上。改一条跳一条,清单消化完收工' },
    { type: 'cmd', text: ':cclose', cursor: [2, 5],
      note: ':cclose:收起清单窗(:copen 随时再开)。:cp 回上一条、:cfirst/:clast 跳首末 —— 编译报错、搜索结果全走这套' }
  ]
};

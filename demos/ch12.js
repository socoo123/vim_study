/* demos/ch12.js — 第十二章「IDE 集成」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角:gd/Ctrl-o/Ctrl-i 跳转往返、leader 前缀、surround 三件套、
 *    gb 多光标、sethandler/handleKeys 冲突仲裁、easymotion 标签跳。
 *  - 配置内容已于 2026-09-17 核对双方官方文档(VSCodeVim README、
 *    IdeaVim README + sethandler wiki),详见章节 §2/§3。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. gd 跳定义 + Ctrl-o / Ctrl-i 跳转链往返 */
VIMDEMOS['ch12-01-gd-roundtrip'] = {
  version: 1,
  id: 'ch12-01-gd-roundtrip',
  title: 'gd 跳定义,Ctrl-o 回,Ctrl-i 再去',
  intro: 'vim 键 gd 触发 IDE 的语义索引跳到定义;Ctrl-o / Ctrl-i 沿跳转链后退前进 —— vim 出发,IDE 导航。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [2, 13],
    lines: ['import { fmt } from "./util";', '', 'const text = fmt(name);'] },
  steps: [
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:扩展命令前缀(第 2 章的老朋友)' },
    { type: 'key', key: 'd',
      lines: ['export function fmt(s) {', '  return `[${s}]`;', '}'], cursor: [0, 16],
      note: 'gd:跳到定义 —— 编辑区整屏切到 util.js,vim 的两根手指按下了 IDE 的「转到定义」' },
    { type: 'wait', cursor: [0, 16],
      note: '看一眼实现 —— 回去的时候,跳转链已经记住了来路' },
    { type: 'key', key: 'Ctrl-o',
      lines: ['import { fmt } from "./util";', '', 'const text = fmt(name);'], cursor: [2, 13],
      note: 'Ctrl-o:沿跳转链后退 —— 回到出发点 fmt 前,位置分毫不差(第 3 章的跳转表,跨文件也好使)' },
    { type: 'key', key: 'Ctrl-i',
      lines: ['export function fmt(s) {', '  return `[${s}]`;', '}'], cursor: [0, 16],
      note: 'Ctrl-i:再前进 —— 又到定义。gd 去、Ctrl-o 回、Ctrl-i 去,一根链三个方向' }
  ]
};

/* 2. leader:自定义命令的发射键 */
VIMDEMOS['ch12-02-leader-map'] = {
  version: 1,
  id: 'ch12-02-leader-map',
  title: '<leader>d:空格两键 = 删整行',
  intro: 'leader 是你自定义快捷键的统一前缀(推荐空格):<leader>d 绑成 dd、<leader>w 绑成保存 —— 好记且不与编辑键打架。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['// 临时注释,准备删除', 'const keep = 1;'] },
  steps: [
    { type: 'key', key: 'Space', pending: '<space>',
      note: '空格:leader 键 —— 按下去 vim 挂起等你补后半段,像「待决状态」等名词' },
    { type: 'key', key: 'd',
      lines: ['const keep = 1;'], cursor: [0, 0], pending: '',
      note: '<leader>d:映射触发,整行删除。配置:normalModeKeyBindingsNonRecursive 里 before 写 ["<leader>","d"],after 写 ["d","d"]' },
    { type: 'key', key: 'Space', pending: '<space>',
      note: '空格:再来一个 —— 所有自定义命令共用这个前缀' },
    { type: 'key', key: 'w', cursor: [0, 0], cmdline: ':w',
      note: '<leader>w:绑成保存(命令行冒出来 :w)。发射键一个,命令随你挂' }
  ]
};

/* 3. surround 三件套:ys 加壳 / cs 换壳 / ds 拆壳 */
VIMDEMOS['ch12-03-surround'] = {
  version: 1,
  id: 'ch12-03-surround',
  title: 'ysiw" 加引号,cs"\' 换引号,ds\' 拆引号',
  intro: 'vim-surround 插件(VSCodeVim 默认开启,IdeaVim 写 set surround):ys 给既有文本加壳,cs 换壳,ds 拆壳。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 8],
    lines: ['let x = alpha + 1;'] },
  steps: [
    { type: 'key', key: 'y', pending: 'y',
      note: 'y:这次不是复制 —— 在 surround 里它是 you' },
    { type: 'key', key: 's', pending: 'ys',
      note: 's:surround —— ys 组合 =「you surround」,给谁加壳?' },
    { type: 'key', key: 'i', pending: 'ysi',
      note: 'i:里面(第 4 章的文本对象登场)' },
    { type: 'key', key: 'w', pending: 'ysiw',
      note: 'w:这个词 —— ysiw,就差指定壳了' },
    { type: 'key', key: '"',
      lines: ['let x = "alpha" + 1;'], cursor: [0, 8],
      note: '":双引号壳!alpha 被包住 —— ysiw" 五个键,一个裸词变字符串字面量' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:change —— 换壳时间' },
    { type: 'key', key: 's', pending: 'cs',
      note: 's:surround' },
    { type: 'key', key: '"', pending: 'cs"',
      note: '":旧壳是双引号' },
    { type: 'key', key: "'",
      lines: ["let x = 'alpha' + 1;"], cursor: [0, 8],
      note: "':cs\"' —— 双引号壳整个换成单引号壳,里面的内容一个字符没动" },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:delete —— 拆壳' },
    { type: 'key', key: 's', pending: 'ds',
      note: 's:surround' },
    { type: 'key', key: "'",
      lines: ['let x = alpha + 1;'], cursor: [0, 8],
      note: "':ds' 拆掉单引号。ys 加壳 / cs 换壳 / ds 拆壳 —— 三件套齐了" }
  ]
};

/* 4. gb 多光标:vim 键选人,IDE 光标干活 */
VIMDEMOS['ch12-04-gb-multicursor'] = {
  version: 1,
  id: 'ch12-04-gb-multicursor',
  title: 'gb×3 加光标,ciw 一次改三处',
  intro: 'gb 在下一个相同词上添加光标(VSCodeVim 内置 = Cmd-d;IDEA 用 Alt+J)—— 三个 price 三根光标,一次 ciw 全改名。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 6],
    lines: ['const price = 10;', 'const tax = price * 0.1;', 'show(price);'] },
  steps: [
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:前缀' },
    { type: 'key', key: 'b', cursor: [1, 12],
      note: 'gb:在下一个相同词上添加光标 —— 屏幕此刻有两根光标(动画只画一根,IDE 里会全亮)' },
    { type: 'key', key: 'g', pending: 'g',
      note: 'g:再来' },
    { type: 'key', key: 'b', cursor: [2, 5],
      note: 'gb:第三根光标落在 show 里的 price 上 —— 三行同词,三指同按' },
    { type: 'wait', cursor: [2, 5],
      note: '三根光标都站在 price 上 —— 接下来任何一个编辑动作,三处同时执行' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改写 —— 对三根光标各执行一遍' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '',
      lines: ['const  = 10;', 'const tax =  * 0.1;', 'show();'], cursor: [0, 6],
      note: 'ciw:三处 price 同时被吃掉,进入「三头插入」' },
    { type: 'type', text: 'cost',
      lines: ['const cost = 10;', 'const tax = cost * 0.1;', 'show(cost);'], cursor: [0, 10],
      note: 'cost:打一遍,三处同时长出来' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 9],
      note: 'Esc:三根光标收拢回一根 —— 多光标只租不借,用完即还' }
  ]
};

/* 5. 冲突仲裁:一个键两个主人(sethandler / handleKeys) */
VIMDEMOS['ch12-05-ctrla-sethandler'] = {
  version: 1,
  id: 'ch12-05-ctrla-sethandler',
  title: 'Ctrl-a 是谁的?sethandler 说了算',
  intro: 'vim 里 Ctrl-a = 数字加一;IDEA 原生(Windows/Linux 键位)= 全选 Select All。冲突的钥匙只有一把,sethandler(IDEA)/ handleKeys(VSCode)决定给谁。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 8],
    lines: ['limit = 10;', 'limit = 10;', 'limit = 10;'] },
  steps: [
    { type: 'key', key: 'Ctrl-a',
      lines: ['limit = 11;', 'limit = 10;', 'limit = 10;'], cursor: [0, 8],
      note: 'Ctrl-a:vim 语义赢了 —— 光标行数字 +1(第 10 章的数字引擎)' },
    { type: 'wait', cursor: [0, 8],
      note: '但在 IDEA 里(Windows/Linux 键位),Ctrl-a 原生是全选 Select All —— 同一个键,两个主人都想要' },
    { type: 'key', key: 'u',
      lines: ['limit = 10;', 'limit = 10;', 'limit = 10;'], cursor: [0, 8],
      note: 'u:先回滚 —— 演示怎么换主人' },
    { type: 'wait', cursor: [0, 8],
      note: 'IDEA 写 sethandler <C-a> a:ide 一行,Ctrl-a 交还 IDE 变回全选;VSCode 同理用 vim.handleKeys 把 <C-f> 还给原生查找 —— 冲突不用抢,配置说了算' }
  ]
};

/* 6. easymotion:屏幕内标签瞬移 */
VIMDEMOS['ch12-06-easymotion'] = {
  version: 1,
  id: 'ch12-06-easymotion',
  title: '<leader>f y + 标签:两键直达屏幕任意词',
  intro: '开启 easymotion(VSCodeVim 设 vim.easymotion;IDEA 写 set easymotion)后,<leader>f + 目标首字母,所有候选亮起标签,按标签即达。',
  lang: 'js',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['const a = 1;', 'const b = 2;', 'const c = 3;', '', 'const x = 9;', 'const y = 8;', '', 'const z = 7;'] },
  steps: [
    { type: 'key', key: 'Space', pending: '<space>',
      note: '空格:leader —— easymotion 的入场券(映射成 <leader>f)' },
    { type: 'key', key: 'f', pending: '<space>f',
      note: 'f:easymotion 前跳 —— 屏幕准备给所有可达位置贴标签' },
    { type: 'key', key: 'y', pending: '<space>fy',
      note: 'y:要找 y —— 此刻 IDE 会在屏幕上每个 y 的位置亮起一个字母标签(动画用注释代替)' },
    { type: 'key', key: 'b', cursor: [5, 6],
      note: '按下该位置的标签字母(此处演示为 b):两键直达 —— 视线在哪,光标到哪,屏幕内不再有「远处」' }
  ]
};

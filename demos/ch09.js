/* demos/ch09.js — 第九章「寄存器与剪贴板」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角:无名寄存器 "" 与 yank-then-delete 陷阱、"0 保险柜、
 *    命名寄存器 "a-"z 与追加 "A、黑洞 "_、系统剪贴板 "+、:reg 查看。
 *  - 表示法:寄存器前缀「"x」拆成三步按键(" → x → 动词),
 *    用 pending 字段在状态栏显示当前拼到 "x 哪一步。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. yank-then-delete 陷阱与 "0p 救场 —— 全章引子 */
VIMDEMOS['ch09-01-yank-delete-trap'] = {
  version: 1,
  id: 'ch09-01-yank-delete-trap',
  title: '复制完就删,p 粘出来的是删掉的?!',
  intro: 'yy 复制、dd 删别的行、p 粘贴 —— 粘出来的是刚删的行。无名寄存器只有一个坑,"0p 救场。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['const title = "v1";', 'const note = "v2";', 'const extra = "v3";'] },
  steps: [
    { type: 'key', key: 'y', pending: 'y',
      note: 'y:复制动词(第 5 章)' },
    { type: 'key', key: 'y', pending: '',
      note: 'yy:复制整行 title —— 进了无名寄存器(同时存了一份到 0 号保险柜,伏笔)' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:下一行(note 行)—— 顺手把它删了' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除' },
    { type: 'key', key: 'd', mode: 'normal', pending: '',
      lines: ['const title = "v1";', 'const extra = "v3";'], cursor: [1, 0],
      note: 'dd:note 行没了 —— 无名寄存器被【删除的内容】顶掉了!' },
    { type: 'key', key: 'p',
      lines: ['const title = "v1";', 'const note = "v2";', 'const extra = "v3";'], cursor: [2, 0],
      note: 'p:想粘 title —— 结果粘出来的是刚删的 note 行!这就是本章要解的谜' },
    { type: 'key', key: 'u',
      lines: ['const title = "v1";', 'const extra = "v3";'], cursor: [1, 0],
      note: 'u:撤销这次误粘' },
    { type: 'key', key: '"', pending: '"',
      note: '":寄存器前缀 —— 告诉 vim「下一个动作用指定抽屉」' },
    { type: 'key', key: '0', pending: '"0',
      note: '0:指定 0 号寄存器(yank 专属,删除顶不掉它)' },
    { type: 'key', key: 'p',
      lines: ['const title = "v1";', 'const title = "v1";', 'const extra = "v3";'], cursor: [2, 0],
      note: 'p:这次粘出来的才是 title!"0p = 复制不被删除污染的标准答案' }
  ]
};

/* 2. 命名寄存器 "a 与追加 "A —— 手动抽屉 */
VIMDEMOS['ch09-02-named-append'] = {
  version: 1,
  id: 'ch09-02-named-append',
  title: '"a 存货,"A 追货:命名寄存器当行李箱',
  intro: '"ayy 把行存进 a 抽屉,之后随便 y/d 都不影响它;"Ayy(大写)往 a 里追加 —— 收集散落各处的行。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['keep me: A', 'junk: 1', 'keep me: B', 'junk: 2'] },
  steps: [
    { type: 'key', key: '"', pending: '"',
      note: '"(双引号):寄存器前缀,先声明用哪个抽屉' },
    { type: 'key', key: 'a', pending: '"a',
      note: 'a:指定命名寄存器 a(a–z 共 26 个抽屉,随便挑)' },
    { type: 'key', key: 'y', pending: '"ay',
      note: 'y:还是熟悉的复制动词 —— 抽屉指定了,动作不变' },
    { type: 'key', key: 'y', pending: '',
      note: '"ayy:整行存进 a 抽屉。此后无名寄存器怎么被顶都与它无关' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:到垃圾行' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除(这次不指定抽屉,随它顶无名)' },
    { type: 'key', key: 'd', lines: ['keep me: A', 'keep me: B', 'junk: 2'], cursor: [1, 0], pending: '',
      note: 'dd:删垃圾行 —— 无名寄存器被顶就被顶,a 抽屉毫发无伤' },
    { type: 'wait', cursor: [1, 0],
      note: 'dd 后光标落到下一行 —— 正好就是第二件要收集的 keep me: B' },
    { type: 'key', key: '"', pending: '"',
      note: '":再来一次前缀语法' },
    { type: 'key', key: 'A', pending: '"A',
      note: 'A(大写寄存器名):追加模式 —— 往 a 抽屉里【添】,不覆盖' },
    { type: 'key', key: 'y', pending: '"Ay',
      note: 'y:复制动词跟上,"Ayy 三步拼完' },
    { type: 'key', key: 'y', pending: '',
      note: '"Ayy:第二行也进了 a 抽屉 —— 抽屉里现在有两行' },
    { type: 'key', key: 'j', cursor: [2, 0],
      note: 'j:最后一件垃圾' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:最后一件垃圾也删掉' },
    { type: 'key', key: 'd', lines: ['keep me: A', 'keep me: B'], cursor: [1, 0], pending: '',
      note: 'dd:清场完毕' },
    { type: 'key', key: '"', pending: '"',
      note: '":前缀' },
    { type: 'key', key: 'a', pending: '"a',
      note: 'a:指回 a 抽屉 —— 收了那么久,该验收了' },
    { type: 'key', key: 'p',
      lines: ['keep me: A', 'keep me: B', 'keep me: A', 'keep me: B'], cursor: [2, 0],
      note: '"ap:取回 —— 收集的两行原样都在。散落各行聚一行,这就是行李箱' }
  ]
};

/* 3. 黑洞寄存器 "_ —— 删除不污染 */
VIMDEMOS['ch09-03-blackhole'] = {
  version: 1,
  id: 'ch09-03-blackhole',
  title: '"_dd:黑洞寄存器,删除不留痕',
  intro: '刚 yank 的东西还热乎,又要删垃圾 —— "_d 把删除的内容直接扔黑洞,无名寄存器保持原样。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 6],
    lines: ['const keep = "yanked";', 'const junk = "delete me";'] },
  steps: [
    { type: 'key', key: 'y', pending: 'y',
      note: 'y:复制' },
    { type: 'key', key: 'i', pending: 'yi',
      note: 'i:里面' },
    { type: 'key', key: 'w', pending: '',
      note: 'yiw:把 keep 这个词复制进无名寄存器 —— 待会儿要贴到别处' },
    { type: 'key', key: 'j', cursor: [1, 6],
      note: 'j:到 junk 行,这行要删 —— 但不想顶掉刚复制的 keep' },
    { type: 'key', key: '"', pending: '"',
      note: '":寄存器前缀' },
    { type: 'key', key: '_', pending: '"_',
      note: '_:黑洞寄存器 —— 扔进去的东西【哪都不存】,纯删除' },
    { type: 'key', key: 'd', pending: '"_d',
      note: 'd:删除动词就位' },
    { type: 'key', key: 'd', lines: ['const keep = "yanked";'], cursor: [0, 6], pending: '',
      note: '"_dd:整行删除进黑洞 —— 无名寄存器里 keep 原封不动' },
    { type: 'key', key: 'p',
      lines: ['const keepkeep = "yanked";'], cursor: [0, 10],
      note: 'p:粘出来的是 keep,没被污染!对比:刚才若用裸 dd,p 会贴出整行 junk' }
  ]
};

/* 4. 系统剪贴板 "+ —— 与外界打通 */
VIMDEMOS['ch09-04-clipboard'] = {
  version: 1,
  id: 'ch09-04-clipboard',
  title: '"+:系统剪贴板,vim 与世界的桥',
  intro: '"+yy 复制进系统剪贴板(去微信/浏览器 Cmd-v);"+p 把外部复制的东西贴进 vim。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['const api = "/api/v1";', ''] },
  steps: [
    { type: 'key', key: '"', pending: '"',
      note: '":寄存器前缀' },
    { type: 'key', key: '+', pending: '"+',
      note: '+:系统剪贴板寄存器(macOS 上 "* 与 "+ 等价,Linux 下有区别)' },
    { type: 'key', key: 'y', pending: '"+y',
      note: 'y:复制动词 —— 前缀 + 动词的语法又来了' },
    { type: 'key', key: 'y', pending: '',
      note: '"+yy:整行复制【直接进系统剪贴板】—— 现在可以去微信、浏览器、issue 里 Cmd-v 了' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:反过来试试 —— 假设刚在浏览器里 Cmd-c 复制了一段代码' },
    { type: 'key', key: '"', pending: '"',
      note: '":反向也走口岸 —— 先声明寄存器' },
    { type: 'key', key: '+', pending: '"+',
      note: '+:还是系统剪贴板' },
    { type: 'key', key: 'p',
      lines: ['const api = "/api/v1";', 'const api = "/api/v1";', ''], cursor: [1, 0],
      note: '"+p:外部内容贴进 vim。IDE 里也可以直接 Cmd-v,两边通道都通(见本章 IDE 备注)' }
  ]
};

/* 5. :reg 查看 + 数字寄存器传送带 */
VIMDEMOS['ch09-05-reg-view'] = {
  version: 1,
  id: 'ch09-05-reg-view',
  title: ':reg 与数字寄存器:删除史的传送带',
  intro: '每删一次,"1-"9 向后顺延一格 —— 最近删除永远在 "1;:reg 打开清单,看谁装着什么。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['a = 1;', 'b = 2;', 'c = 3;', 'd = 4;', 'e = 5;'] },
  steps: [
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除动词' },
    { type: 'key', key: 'd', lines: ['b = 2;', 'c = 3;', 'd = 4;', 'e = 5;'], cursor: [0, 0], pending: '',
      note: 'dd 第 1 刀:a 行进 "1' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:再来一刀' },
    { type: 'key', key: 'd', lines: ['c = 3;', 'd = 4;', 'e = 5;'], cursor: [0, 0], pending: '',
      note: 'dd 第 2 刀:b 行进 "1,原 a 行被挤到 "2 —— 数字寄存器像传送带向后顺延' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:第三刀' },
    { type: 'key', key: 'd', lines: ['d = 4;', 'e = 5;'], cursor: [0, 0], pending: '',
      note: 'dd 第 3 刀:c 行进 "1,b 行 "2,a 行 "3 —— 删除史保存了最近 9 条' },
    { type: 'cmd', text: ':reg', cursor: [0, 0],
      note: ':reg:打开寄存器清单 —— 各抽屉装着什么一目了然(只看不改)' },
    { type: 'key', key: '"', pending: '"',
      note: '":指名取某个抽屉' },
    { type: 'key', key: '2', pending: '"2',
      note: '"2:指名要传送带第二格' },
    { type: 'key', key: 'p',
      lines: ['d = 4;', 'e = 5;', 'b = 2;'], cursor: [2, 0],
      note: '"2p:取回倒数第二刀删掉的 b 行!"1 永远是最近一次删除' }
  ]
};

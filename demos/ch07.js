/* demos/ch07.js — 第七章「可视化模式与块编辑」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角:v / V / Ctrl-v 三种选择,o 端点切换,gv 重选,
 *    块插入 I / 块追加 A($ 扩展)、块删除 d,选中后的动词菜单。
 *  - sel 高亮说明:引擎的 sel 按字符区间渲染 —— v(字符)与 V(整行)演示
 *    渲染准确;Ctrl-v(块)演示不用 sel,靠按键流 + 注释说明矩形范围。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. v 字符可视化 —— 选区跟着移动走,选中即舞台 */
VIMDEMOS['ch07-01-v-basics'] = {
  version: 1,
  id: 'ch07-01-v-basics',
  title: 'v:字符可视化,选中后动词随便挑',
  intro: 'v 进入字符可视化,移动命令变成「伸长选区」;选中 U 转大写、c 整段改写。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 4], lines: ['let config = loadConfig();', 'config.path = base;'] },
  steps: [
    { type: 'key', key: 'v', mode: 'visual', sel: [[0, 4], [0, 4]],
      note: 'v:进入字符可视化 —— 从光标处开始选,状态栏亮起 VISUAL' },
    { type: 'key', key: 'e', cursor: [0, 9], sel: [[0, 4], [0, 9]],
      note: 'e:选到词尾。可视模式里移动命令不再是「跳」,而是「伸长/缩短选区」' },
    { type: 'key', key: 'U', mode: 'normal', sel: null,
      lines: ['let CONFIG = loadConfig();', 'config.path = base;'], cursor: [0, 9],
      note: 'U(大写):选区整体转大写。选中即舞台,动词随后就到' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j 到第二行,再来一拍' },
    { type: 'key', key: 'v', mode: 'visual', sel: [[1, 0], [1, 0]],
      note: 'v:再选一次' },
    { type: 'key', key: 'E', cursor: [1, 10], sel: [[1, 0], [1, 10]],
      note: 'E:选到 WORD 尾 —— config.path 不含空格,是一个 WORD,正好整段选中' },
    { type: 'key', key: 'c', mode: 'insert', sel: null,
      lines: ['let CONFIG = loadConfig();', ' = base;'], cursor: [1, 0],
      note: 'c:删掉选区并进入插入 —— 可视模式里 c 同样是「清场重打」' },
    { type: 'type', text: 'settings', lines: ['let CONFIG = loadConfig();', 'settings = base;'], cursor: [1, 8],
      note: '输入新词,选了什么就替换什么' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 7],
      note: 'Esc。心法:v 负责「圈地」,动词负责「施工」' }
  ]
};

/* 2. V 行可视化 —— 整行为单位,> 整体右移 */
VIMDEMOS['ch07-02-V-indent'] = {
  version: 1,
  id: 'ch07-02-V-indent',
  title: 'V:整行选择,一块代码整体挪窝',
  intro: 'V 按行选:j 往下扩行,> 把选中的行整体右移一级缩进 —— 挪代码块不用数行号。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [1, 0], lines: ['if (ok) {', 'run();', 'log();', '}'] },
  steps: [
    { type: 'key', key: 'V', mode: 'visual-line', sel: [[1, 0], [1, 5]],
      note: 'V(大写):进入行可视化 —— 整行整行地选,光标在行间上下移动' },
    { type: 'key', key: 'j', cursor: [2, 0], sel: [[1, 0], [2, 5]],
      note: 'j:多选一行。选区永远是完整的行,不怕列对不齐' },
    { type: 'key', key: '>', mode: 'normal', sel: null,
      lines: ['if (ok) {', '  run();', '  log();', '}'], cursor: [1, 2],
      note: '>:两行同时右移一级缩进。把语句挪进 if/for 块,就靠它' },
    { type: 'key', key: '.', mode: 'normal',
      lines: ['if (ok) {', '    run();', '    log();', '}'], cursor: [1, 4],
      note: '.:普通模式里重复上次的 > —— 同两行再缩一级。V + > + . 是挪块三连拍' }
  ]
};

/* 3. Ctrl-v 块插入 I —— 批量加注释(杀手锏) */
VIMDEMOS['ch07-03-block-comment'] = {
  version: 1,
  id: 'ch07-03-block-comment',
  title: 'Ctrl-v + I:一次打字,三行同时加 // 注释',
  intro: '块可视化从光标拉一个矩形,I 在每行的块左边缘插入 —— Esc 之前只有第一行显示,别慌。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['const a = 1;', 'const b = 2;', 'const c = 3;'] },
  steps: [
    { type: 'key', key: 'Ctrl-v', mode: 'visual-block',
      note: 'Ctrl-v:进入块可视化 —— 选中一个矩形(第 1 行第 0 列为起点)' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:矩形向下盖住第 2 行第 0 列' },
    { type: 'key', key: 'j', cursor: [2, 0],
      note: 'j:再盖第 3 行 —— 现在是 3 行 × 1 列的块(宽度对 I 不重要,列起点才重要)' },
    { type: 'key', key: 'I', mode: 'insert', cursor: [0, 0],
      note: 'I(大写):块插入。注意:此刻只有第一行跟着显示你打的字!' },
    { type: 'type', text: '// ', lines: ['// const a = 1;', 'const b = 2;', 'const c = 3;'], cursor: [0, 3],
      note: '打出 // —— 后两行纹丝不动,不是坏了,是在等 Esc(延迟满足)' },
    { type: 'key', key: 'Esc', mode: 'normal',
      lines: ['// const a = 1;', '// const b = 2;', '// const c = 3;'], cursor: [0, 0],
      note: 'Esc 一按:三行同时补上 //!块编辑的招牌动作,多行注释就这一套' }
  ]
};

/* 4. Ctrl-v 块追加 A + $ —— 行尾批量加分号 */
VIMDEMOS['ch07-04-block-append'] = {
  version: 1,
  id: 'ch07-04-block-append',
  title: 'Ctrl-v + $ + A:行尾批量补分号',
  intro: '$ 把块的右边界拉到「每一行各自的行尾」—— 长短不齐的行也能对齐;A 在每行块尾后追加。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 0], lines: ['const x = 1', 'const y = 2', 'const z = 3'] },
  steps: [
    { type: 'key', key: 'Ctrl-v', mode: 'visual-block',
      note: 'Ctrl-v:块可视化,从第 1 行第 0 列起手' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:向下盖一行' },
    { type: 'key', key: 'j', cursor: [2, 0],
      note: 'j:再盖一行,3 行入块' },
    { type: 'key', key: '$', cursor: [2, 10],
      note: '$:把块右边界拉到行尾 —— 每行拉到【各自的】行尾,长短不齐也不怕' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [2, 10],
      note: 'A(大写):块追加。同样只有最后一行(光标所在行)先显示' },
    { type: 'type', text: ';', lines: ['const x = 1', 'const y = 2', 'const z = 3;'], cursor: [2, 11],
      note: '打出分号,别处的行还没动静' },
    { type: 'key', key: 'Esc', mode: 'normal',
      lines: ['const x = 1;', 'const y = 2;', 'const z = 3;'], cursor: [2, 10],
      note: 'Esc:三行同时补分号。I 是块头插、A 是块尾加,一对镜像杀手锏' }
  ]
};

/* 5. Ctrl-v 块删除 d —— 整列切掉 */
VIMDEMOS['ch07-05-block-delete'] = {
  version: 1,
  id: 'ch07-05-block-delete',
  title: 'Ctrl-v + $ + d:整列删除,切掉注释尾巴',
  intro: '从注释列的第一个空格拉到行尾,d 把这个矩形整块切掉 —— 三行的注释列一次清空。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 5], lines: ['x = 1  // done', 'y = 2  // todo', 'z = 3  // todo'] },
  steps: [
    { type: 'key', key: 'Ctrl-v', mode: 'visual-block',
      note: 'Ctrl-v:块可视化,起点在第 1 行第 5 列(注释前的第一个空格)' },
    { type: 'key', key: 'j', cursor: [1, 5],
      note: 'j:向下盖一行' },
    { type: 'key', key: 'j', cursor: [2, 5],
      note: 'j:三行的第 5 列都入块了' },
    { type: 'key', key: '$', cursor: [2, 13],
      note: '$:右边界拉到行尾 —— 矩形变成「每行从第 5 列到各自行尾」' },
    { type: 'key', key: 'd', mode: 'normal',
      lines: ['x = 1', 'y = 2', 'z = 3'], cursor: [0, 4],
      note: 'd:整个矩形一次消失。删一列、删注释、删行号前缀,都是这一套' }
  ]
};

/* 6. gv 与 o —— 选区的召回与换端 */
VIMDEMOS['ch07-06-gv-o'] = {
  version: 1,
  id: 'ch07-06-gv-o',
  title: 'gv 召回选区,o 跳到选区另一端',
  intro: 'y/d 之后选区被 Vim 记住,gv 一键重选;o 让光标跳到选区另一头,从起点那端继续修剪。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [1, 0],
    lines: ['const keep = true;', 'const tmp1 = 1;', 'const tmp2 = 2;', 'const keep2 = true;'] },
  steps: [
    { type: 'key', key: 'V', mode: 'visual-line', sel: [[1, 0], [1, 14]],
      note: 'V:选中 tmp1 这行(调试垃圾代码,准备处理)' },
    { type: 'key', key: 'j', cursor: [2, 0], sel: [[1, 0], [2, 14]],
      note: 'j:连 tmp2 一起选中' },
    { type: 'key', key: 'y', mode: 'normal', sel: null, cursor: [1, 0],
      note: 'y:先复制存档。选区解除 —— 但 Vim 悄悄记住了这块地盘' },
    { type: 'key', key: 'gv', mode: 'visual-line', sel: [[1, 0], [2, 14]],
      note: 'gv:一键召回上次选区!不用重新 V j —— 同一块地上连续施工必用' },
    { type: 'key', key: 'd', mode: 'normal', sel: null,
      lines: ['const keep = true;', 'const keep2 = true;'], cursor: [1, 0],
      note: 'd:确认没用,删掉。y 看一眼 → gv → d 动手,进可攻退可守' },
    { type: 'key', key: 'v', mode: 'visual', sel: [[1, 0], [1, 0]],
      note: '下半场:字符选择。本想只选 keep2 = true,手一抖……' },
    { type: 'key', key: '$', cursor: [1, 18], sel: [[1, 0], [1, 18]],
      note: '$:选到了整行 —— 起点选多了,重选?不用' },
    { type: 'key', key: 'o', cursor: [1, 0],
      note: 'o:光标跳到选区另一端!现在移动命令改的是「起点」这头' },
    { type: 'key', key: 'w', cursor: [1, 6], sel: [[1, 6], [1, 18]],
      note: 'w:把起点推到 keep2 —— 选区从另一头被修剪整齐' },
    { type: 'key', key: 'c', mode: 'insert', sel: null,
      lines: ['const keep = true;', 'const '], cursor: [1, 6],
      note: 'c:清场重打' },
    { type: 'type', text: 'enabled = 1;', lines: ['const keep = true;', 'const enabled = 1;'], cursor: [1, 18],
      note: '输入替换内容' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 17],
      note: 'Esc。o 是选区的「换头术」:选错了头,换过来继续修' }
  ]
};

/* 7. 选区动词菜单 —— d / c / ~ 与 gv 连击 */
VIMDEMOS['ch07-07-operator-menu'] = {
  version: 1,
  id: 'ch07-07-operator-menu',
  title: '同一块选区,换个动词就是另一种施工',
  intro: '选好 "beta" 之后:d 删、c 改、~ 翻转大小写 —— 每次撤回后 gv 直接重选,连击不重新圈地。',
  lang: 'ts',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 13], lines: ['const tag = "beta";'] },
  steps: [
    { type: 'key', key: 'v', mode: 'visual', sel: [[0, 13], [0, 13]],
      note: 'v:圈住 beta' },
    { type: 'key', key: 'e', cursor: [0, 16], sel: [[0, 13], [0, 16]],
      note: 'e:选满整个词' },
    { type: 'key', key: 'd', mode: 'normal', sel: null,
      lines: ['const tag = "";'], cursor: [0, 12],
      note: '动词一:d —— 删空' },
    { type: 'key', key: 'u', lines: ['const tag = "beta";'], cursor: [0, 13],
      note: 'u 撤销,换动词再试' },
    { type: 'key', key: 'gv', mode: 'visual', sel: [[0, 13], [0, 16]],
      note: 'gv:选区原样召回,不用重新 v e' },
    { type: 'key', key: 'c', mode: 'insert', sel: null,
      lines: ['const tag = "";'], cursor: [0, 12],
      note: '动词二:c —— 清场重打' },
    { type: 'type', text: 'gamma', lines: ['const tag = "gamma";'], cursor: [0, 17],
      note: 'beta 换成 gamma' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 16],
      note: 'Esc 完成' },
    { type: 'key', key: 'u', lines: ['const tag = "beta";'], cursor: [0, 13],
      note: 'u 再撤销,看最后一个动词' },
    { type: 'key', key: 'gv', mode: 'visual', sel: [[0, 13], [0, 16]],
      note: 'gv:第三次召回同一块地盘' },
    { type: 'key', key: '~', mode: 'normal', sel: null,
      lines: ['const tag = "BETA";'], cursor: [0, 16],
      note: '动词三:~ —— 选区内逐字符翻转大小写。选区是名词,动词随叫随到' }
  ]
};

/* demos/ch10.js — 第十章「撤销、重复与宏」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾);
 *  - 每一步都必须有 note(校验强制);
 *  - 本章主角:u / Ctrl-r 的撤销单元、`.` 的重复与边界、q 录制宏、
 *    @a / @@ / n@a 回放、Ctrl-a 数字引擎、:normal 批量发货、搜索驱动可连发宏。
 *  - 表示法:录制宏期间用 pending「@a」示意状态栏的录制指示;
 *    @a / 4@a 的回放把前缀拆成 @ → a 两步,pending 显示拼到哪一步。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

/* 1. u 与 Ctrl-r:撤销单元 = 一次「会话」 */
VIMDEMOS['ch10-01-undo-redo'] = {
  version: 1,
  id: 'ch10-01-undo-redo',
  title: 'u 与 Ctrl-r:一步退掉的是「一段」,不是一个字母',
  intro: '从进入插入到 Esc 是一个撤销单元 —— 插入模式里打再多字,u 一下整体消失;Ctrl-r 沿时间线向前走。',
  lang: 'js',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['let count = 1', 'count = count + 1'] },
  steps: [
    { type: 'key', key: 'A', mode: 'insert', cursor: [0, 13],
      note: 'A:行尾进入插入 —— 故意打一段长注释,看 u 怎么退它' },
    { type: 'type', text: '  // do', cursor: [0, 20],
      lines: ['let count = 1  // do', 'count = count + 1'],
      note: '打字中…… 每个字符此刻都属于同一个「插入会话」' },
    { type: 'type', text: 'ne', cursor: [0, 22],
      lines: ['let count = 1  // done', 'count = count + 1'],
      note: '继续打 —— 记住:退出之前,打多少字都只算【一个】撤销单元' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 21],
      lines: ['let count = 1  // done', 'count = count + 1'],
      note: 'Esc:会话关闭 —— 「A + 打的字 + Esc」整体进入撤销历史,算一步' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:下一行,制造第二个修改单元' },
    { type: 'key', key: 'c', pending: 'c',
      note: 'c:改写动词(第 5 章)' },
    { type: 'key', key: 'i', pending: 'ci',
      note: 'i:里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '',
      lines: ['let count = 1  // done', ' = count + 1'], cursor: [1, 0],
      note: 'ciw:count 没了,进入插入 —— 第二个会话开始' },
    { type: 'type', text: 'total', cursor: [1, 5],
      lines: ['let count = 1  // done', 'total = count + 1'],
      note: 'total:补上新名字' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 4],
      note: 'Esc:第二个单元完成 —— 现在历史里有两步' },
    { type: 'key', key: 'u',
      lines: ['let count = 1  // done', ' = count + 1'], cursor: [1, 0],
      note: 'u:撤销 —— 一步退掉的是整个 ciw 会话,不是一个字母!' },
    { type: 'key', key: 'u',
      lines: ['let count = 1', 'count = count + 1'], cursor: [0, 12],
      note: 'u:再退一步 —— 整段注释也没了。撤销按「会话」计,不按字符计' },
    { type: 'key', key: 'Ctrl-r',
      lines: ['let count = 1  // done', 'count = count + 1'], cursor: [0, 21],
      note: 'Ctrl-r:重做 —— 时间线向前走,注释整段回来了' },
    { type: 'key', key: 'Ctrl-r',
      lines: ['let count = 1  // done', 'total = count + 1'], cursor: [1, 4],
      note: 'Ctrl-r:第二个单元也重做。u / Ctrl-r = 时间线的后退 / 前进,可来回审查' }
  ]
};

/* 2. `.` 的机制与边界:单格记忆会被覆盖 */
VIMDEMOS['ch10-02-dot-boundary'] = {
  version: 1,
  id: 'ch10-02-dot-boundary',
  title: '`.`:只记最近一次修改的单格记忆',
  intro: 'x 之后 `.` 重复 x;可一旦做了 dd,`.` 重复的就变成 dd —— 它永远只记最后一次修改,随时被覆盖。',
  lang: 'js',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['x = 1;;', 'y = 2;;', 'z = 3;;', 'junk'] },
  steps: [
    { type: 'key', key: '$', cursor: [0, 6],
      note: '$:到行尾 —— 任务:每行末尾多了一个分号,删掉' },
    { type: 'key', key: 'x',
      lines: ['x = 1;', 'y = 2;;', 'z = 3;;', 'junk'], cursor: [0, 4],
      note: 'x:删掉一个分号 —— 从此刻起,`.` 记住的就是「x」这个修改' },
    { type: 'key', key: 'j', cursor: [1, 4],
      note: 'j:下一行,列号保持在 4 —— 正好也落在分号上' },
    { type: 'key', key: '.',
      lines: ['x = 1;', 'y = 2;', 'z = 3;;', 'junk'], cursor: [1, 4],
      note: '`.`:原样重放刚才的修改 —— 不用再按 x,一个点搞定' },
    { type: 'key', key: 'j', cursor: [2, 4],
      note: 'j:第三行,同样的位置' },
    { type: 'key', key: '.',
      lines: ['x = 1;', 'y = 2;', 'z = 3;', 'junk'], cursor: [2, 4],
      note: 'j `.` —— 「移动 + 重复」是 Vim 最上瘾的节奏,两键一行' },
    { type: 'key', key: 'G', cursor: [3, 0],
      note: 'G:到最后一行 —— 顺手把 junk 行整个删掉(移动不改变 `.` 的记忆)' },
    { type: 'key', key: 'd', pending: 'd',
      note: 'd:删除……' },
    { type: 'key', key: 'd', pending: '',
      lines: ['x = 1;', 'y = 2;', 'z = 3;'], cursor: [2, 0],
      note: 'dd:新修改发生!`.` 的单格记忆被覆盖 —— 现在它记的是 dd' },
    { type: 'key', key: '.',
      lines: ['x = 1;', 'y = 2;'], cursor: [1, 0],
      note: '`.`:此刻重复的是 dd 不是 x —— z 行整个没了!`.` 永远只记最近一次' },
    { type: 'key', key: 'u',
      lines: ['x = 1;', 'y = 2;', 'z = 3;'], cursor: [2, 0],
      note: 'u:救回来。想让 `.` 换回「删分号」,得重新做一次 x —— 记忆只有一格' }
  ]
};

/* 3. `.` 的黄金节奏:移动 + 重复 */
VIMDEMOS['ch10-03-dot-add-semicolon'] = {
  version: 1,
  id: 'ch10-03-dot-add-semicolon',
  title: 'A; Esc,然后 j `.` j `.` j `.`',
  intro: '四行补分号:完整地修改第一行(A + ; + Esc),之后每行只剩「移动 + 重复」。单动作重复,`.` 是满分答案。',
  lang: 'js',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['const a = 1', 'const b = 2', 'const c = 3', 'const d = 4'] },
  steps: [
    { type: 'key', key: 'A', mode: 'insert', cursor: [0, 11],
      note: 'A:行尾进入插入 —— 修改从「入口」开始,`.` 会连入口一起记住' },
    { type: 'type', text: ';', cursor: [0, 12],
      lines: ['const a = 1;', 'const b = 2', 'const c = 3', 'const d = 4'],
      note: ';:打一个分号' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 11],
      note: 'Esc:会话结束 —— A + ; + Esc 打包成一个修改单元,`.` 已存档' },
    { type: 'key', key: 'j', cursor: [1, 11],
      note: 'j:下一行(列保持在行尾)' },
    { type: 'key', key: '.',
      lines: ['const a = 1;', 'const b = 2;', 'const c = 3', 'const d = 4'], cursor: [1, 11],
      note: '`.`:原样重放 —— 行尾、分号、退出,一步不少' },
    { type: 'key', key: 'j', cursor: [2, 11],
      note: 'j:第三行' },
    { type: 'key', key: '.',
      lines: ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4'], cursor: [2, 11],
      note: 'j `.`:再来一遍 —— 不看键盘也能敲出节奏感' },
    { type: 'key', key: 'j', cursor: [3, 11],
      note: 'j:最后一行' },
    { type: 'key', key: '.',
      lines: ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;'], cursor: [3, 11],
      note: 'j `.`:收工。这就是老手频繁按 Esc 的原因:完整的会话才配被 `.` 重放' }
  ]
};

/* 4. 宏:q 录制,@a / @@ 回放 —— 多动作重复 */
VIMDEMOS['ch10-04-macro-record'] = {
  version: 1,
  id: 'ch10-04-macro-record',
  title: 'q a … q 录制,@a 回放,@@ 再来',
  intro: '一行要做两个动作(var→const + 补分号),`.` 记不住 —— 用宏:q a 开始录制,q 结束,@a 重放,@@ 重复上次宏。',
  lang: 'js',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['var a = 1', 'var b = 2', 'var c = 3', 'var d = 4'] },
  steps: [
    { type: 'key', key: 'q', pending: 'q',
      note: 'q:录制开关 —— 接下来的按键会被完整记下' },
    { type: 'key', key: 'a', pending: '@a',
      note: 'a:存进 a 寄存器(状态栏亮起 @a)—— 宏的本质:寄存器里存的不是文本,是【按键序列】' },
    { type: 'key', key: 'c', pending: '@a',
      note: '(录制中)c:改 var —— 修改一' },
    { type: 'key', key: 'i', pending: '@a',
      note: 'i:里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '@a',
      lines: [' a = 1', 'var b = 2', 'var c = 3', 'var d = 4'], cursor: [0, 0],
      note: 'ciw:var 没了 —— 录制中每个动作照常生效,所见即所录' },
    { type: 'type', text: 'const', cursor: [0, 5],
      lines: ['const a = 1', 'var b = 2', 'var c = 3', 'var d = 4'],
      note: 'const:新名字打上' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 4],
      note: 'Esc:修改一完成' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [0, 11],
      note: 'A:行尾 —— 修改二:补分号。一行两个动作,`.` 管不了,宏的主场' },
    { type: 'type', text: ';', cursor: [0, 12],
      lines: ['const a = 1;', 'var b = 2', 'var c = 3', 'var d = 4'],
      note: ';:分号补上' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 11],
      note: 'Esc:修改二完成' },
    { type: 'key', key: 'j', cursor: [1, 0],
      note: 'j:下一行 —— 宏结尾的「传送带」:每次执行完,自动停到下一个工作位' },
    { type: 'key', key: 'q', pending: '',
      note: 'q:停止录制。a 抽屉里躺着:ciw const Esc A ; Esc j' },
    { type: 'key', key: '@', pending: '@',
      note: '@:执行宏 —— 「把 a 里存的按键序列再敲一遍」' },
    { type: 'key', key: 'a', pending: '',
      lines: ['const a = 1;', 'const b = 2;', 'var c = 3', 'var d = 4'], cursor: [2, 0],
      note: '@a:第二行原样加工,光标自动落到第三行 —— 结尾那个 j 在发力' },
    { type: 'key', key: '@', pending: '@',
      note: '@:再来一次……' },
    { type: 'key', key: 'a', pending: '',
      lines: ['const a = 1;', 'const b = 2;', 'const c = 3;', 'var d = 4'], cursor: [3, 0],
      note: '@a:第三行完成。嫌两键烦?@@ = 重复最近执行的宏' },
    { type: 'key', key: '@', pending: '@',
      note: '@:@@ 有个隐藏形态 —— 连按两次 @ 就是它' },
    { type: 'key', key: '@', pending: '',
      lines: ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;'], cursor: [3, 0],
      note: '@:第四行完成,全表收工。qa…q / @a / @@,宏的三板斧都在这了' }
  ]
};

/* 5. Ctrl-a 数字引擎 + 自推进宏 */
VIMDEMOS['ch10-05-macro-increment'] = {
  version: 1,
  id: 'ch10-05-macro-increment',
  title: 'Ctrl-a + 宏:数字自己长上来',
  intro: 'qayyp 然后按 Ctrl-a,存成宏 —— 5@a 连发,编号 1 到 7 自己生成。Ctrl-x 是反向的减一。',
  lang: 'js',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['id = 1'] },
  steps: [
    { type: 'key', key: 'q', pending: 'q',
      note: 'q:开录 —— 目标:批量生成编号序列' },
    { type: 'key', key: 'a', pending: '@a',
      note: 'a:照旧存进 a' },
    { type: 'key', key: 'y', pending: '@a',
      note: 'y:复制当前行……' },
    { type: 'key', key: 'y', pending: '@a',
      note: 'yy:复制 id = 1(光标还在第一行)' },
    { type: 'key', key: 'p', pending: '@a',
      lines: ['id = 1', 'id = 1'], cursor: [1, 0],
      note: 'p:贴到下一行 —— 光标落在副本上,要加工的正是它' },
    { type: 'key', key: 'Ctrl-a', pending: '@a',
      lines: ['id = 1', 'id = 2'], cursor: [1, 5],
      note: 'Ctrl-a:光标行内最近的数字 +1 —— 1 变 2!序列的引擎(Ctrl-x 则是 -1)' },
    { type: 'key', key: 'q', pending: '',
      note: 'q:收工。宏 = yyp Ctrl-a —— 光标天然停在新行,连 j 都省了,天生自推进' },
    { type: 'key', key: '5', pending: '5',
      note: '5:计数前缀 —— 宏也能像移动一样带数字' },
    { type: 'key', key: '@', pending: '5@',
      note: '@:执行……' },
    { type: 'key', key: 'a', pending: '',
      lines: ['id = 1', 'id = 2', 'id = 3', 'id = 4', 'id = 5', 'id = 6', 'id = 7'], cursor: [6, 5],
      note: '5@a:连发五次 —— 复制、粘贴、+1,数字自己往上长。造测试数据、批量编号全靠这套' }
  ]
};

/* 6. :normal:把按键批量发给每一行 */
VIMDEMOS['ch10-06-normal-batch'] = {
  version: 1,
  id: 'ch10-06-normal-batch',
  title: ':%normal A;:一行命令,四行分号',
  intro: ':normal 把任意普通模式按键「发给 range 里的每一行」—— 演示 3 的任务一行命令版,而且不用写 Esc。',
  lang: 'js',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 0],
    lines: ['const a = 1', 'const b = 2', 'const c = 3', 'const d = 4'] },
  steps: [
    { type: 'cmd', text: ':%normal A;',
      lines: ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;'], cursor: [3, 11],
      note: ':%normal A;:把 A; 这组按键【发给每一行】—— 演示 3 的任务,命令版' },
    { type: 'wait', cursor: [3, 11],
      note: '四行一次到位。注意命令里【不用写 Esc】—— :normal 自动收尾,序列结束强制回普通模式' },
    { type: 'key', key: 'u',
      lines: ['const a = 1', 'const b = 2', 'const c = 3', 'const d = 4'], cursor: [3, 10],
      note: 'u:一条 :normal 是一个撤销单元 —— 一步全回滚,批量也有后悔药' },
    { type: 'key', key: 'Ctrl-r',
      lines: ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;'], cursor: [3, 11],
      note: 'Ctrl-r:改主意了?再拿回来 —— 还是只按一步' },
    { type: 'cmd', text: ':2,3normal I// ',
      lines: ['const a = 1;', '// const b = 2;', '// const c = 3;', 'const d = 4;'], cursor: [2, 0],
      note: ':2,3normal I// :前面还能接 range —— 只加工第 2–3 行;换成 :g/模式/normal 就按内容挑行' }
  ]
};

/* 7. 搜索驱动的可连发宏 */
VIMDEMOS['ch10-07-macro-search'] = {
  version: 1,
  id: 'ch10-07-macro-search',
  title: '宏结尾带 n:4@a 连发改名五处 cnt',
  intro: '* 先设好查找词,宏录成「改当前词 + n 跳下一个」—— 每次执行完正好停在下一个目标上,连发到全改完自动刹车。',
  lang: 'js',
  speed: 950,
  initial: { mode: 'normal', cursor: [0, 6],
    lines: ['const cnt = 1;', 'cnt += 1;', 'print(cnt);', 'return cnt + cnt;'] },
  steps: [
    { type: 'key', key: '*', cursor: [1, 0],
      note: '*:把光标下的 cnt 设为查找词并跳下一处 —— 先侦查敌人分布(第 8 章)' },
    { type: 'key', key: 'N', cursor: [0, 6],
      note: 'N:跳回第一处。查找词已设好 —— 这是宏里 n 能工作的前提' },
    { type: 'key', key: 'q', pending: 'q',
      note: 'q:开录' },
    { type: 'key', key: 'a', pending: '@a',
      note: 'a:还是 a 抽屉' },
    { type: 'key', key: 'c', pending: '@a',
      note: '(录制中)c:改光标下的词……' },
    { type: 'key', key: 'i', pending: '@a',
      note: 'i:里面' },
    { type: 'key', key: 'w', mode: 'insert', pending: '@a',
      lines: ['const  = 1;', 'cnt += 1;', 'print(cnt);', 'return cnt + cnt;'], cursor: [0, 6],
      note: 'ciw:cnt 没了' },
    { type: 'type', text: 'count', cursor: [0, 11],
      lines: ['const count = 1;', 'cnt += 1;', 'print(cnt);', 'return cnt + cnt;'],
      note: 'count:新名字' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [0, 10],
      note: 'Esc:修改完成' },
    { type: 'key', key: 'n', cursor: [1, 0],
      note: 'n:跳到下一个 cnt —— 宏的「自动导航」:执行完正好停在下一个目标上' },
    { type: 'key', key: 'q', pending: '',
      note: 'q:收工。宏 = 改一个 + 跳下一个,天生适合连发' },
    { type: 'key', key: '4', pending: '4',
      note: '4:剩四处,连发四次' },
    { type: 'key', key: '@', pending: '4@',
      note: '@:执行……' },
    { type: 'key', key: 'a', pending: '',
      lines: ['const count = 1;', 'count += 1;', 'print(count);', 'return count + count;'], cursor: [3, 19],
      note: '4@a:四处全改完!最后一次 n 找不到 cnt,宏自动刹车 —— 连停止条件都免费' }
  ]
};

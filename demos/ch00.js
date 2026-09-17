/* demos/ch00.js — 第 0 章「使用指南」演示数据(快照式,规范见 PLAN.md §6)
 *
 * 本章唯一演示是「自举」的:它不教新 Vim 命令,而是教你怎么用播放器本身;
 * 顺带用最简单的 x / u / A 当教具。规则提醒:
 *  - 凡改变 buffer 的步骤,必须给出该步之后【完整】的 lines 数组(快照语义);
 *  - cursor 为 [行, 列],0 起算;列可以等于行长度(表示光标在行尾)。
 */
/* 注册方式:显式走 window(浏览器与 node 校验沙箱都兼容),禁止裸全局赋值 */
var VIMDEMOS = window.VIMDEMOS = window.VIMDEMOS || {};

VIMDEMOS['ch00-01-player-tour'] = {
  version: 1,
  id: 'ch00-01-player-tour',
  title: '播放器导览:把动画变成慢动作教练',
  intro: '这一课教的是「怎么用播放器」:控制条、单步、调速 —— 教具是最简单的 x / u / A。',
  lang: 'ts',
  speed: 1000,
  initial: { mode: 'normal', cursor: [0, 14], lines: ['let msg = "hi";', 'let n = 1;'] },
  steps: [
    { type: 'key', key: 'x', lines: ['let msg = "hi"', 'let n = 1;'], cursor: [0, 13],
      note: 'x 删掉光标处一个字符。每一步下方都有这行解说 —— 不用暂停也看得清' },
    { type: 'key', key: 'u', lines: ['let msg = "hi";', 'let n = 1;'], cursor: [0, 14],
      note: 'u 撤销。想停下来细看?空格暂停,或用 ⏭ 单步往后走' },
    { type: 'key', key: 'j', cursor: [1, 9],
      note: 'j 下移一行(列超出会贴到行尾)。⟲ 随时回到开头重看一遍' },
    { type: 'key', key: 'A', mode: 'insert', cursor: [1, 10],
      note: 'A 跳到行尾进入插入模式 —— 盯住状态栏,模式变了会第一时间告诉你' },
    { type: 'type', text: '0', lines: ['let msg = "hi";', 'let n = 10;'], cursor: [1, 10],
      note: '输入 0,数字变成 10。你按过的每个键都会点亮在下方的按键流里' },
    { type: 'key', key: 'Esc', mode: 'normal', cursor: [1, 9],
      note: 'Esc 收工。右边还能切 1× / 2× / ½× 速度 —— 学会了吗?去玩玩上面的按钮' }
  ]
};

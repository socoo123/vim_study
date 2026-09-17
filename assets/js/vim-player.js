/* vim-player.js — 快照式 Vim 按键回放播放器 v1
 *
 * 规范见 PLAN.md §6。演示数据由 demos/chNN.js 注册到 window.VIMDEMOS:
 *   window.VIMDEMOS = window.VIMDEMOS || {};
 *   VIMDEMOS['ch01-01-i-esc'] = { version:1, id:'ch01-01-i-esc', ... };
 * 页面里放 <div class="demo-slot" data-demo="ch01-01-i-esc"></div> 即可。
 *
 * 设计要点:引擎【不模拟 Vim】。每个演示是一串快照步骤:
 * 凡改变 buffer 的步骤必须显式给出该步之后的完整 lines 数组,
 * 引擎只负责把状态渲染成动画 —— 因此永远不会"演示错"。
 */
(function () {
  'use strict';

  var REG = window.VIMDEMOS || (window.VIMDEMOS = {});

  var MODE_TEXT = {
    normal: '-- NORMAL --',
    insert: '-- INSERT --',
    visual: '-- VISUAL --',
    'visual-line': '-- VISUAL LINE --',
    'visual-block': '-- VISUAL BLOCK --',
    replace: '-- REPLACE --'
  };
  var MODE_CLS = {
    normal: 'm-normal', insert: 'm-insert', visual: 'm-visual',
    'visual-line': 'm-visual', 'visual-block': 'm-visual', replace: 'm-replace'
  };

  /* ---------- 极简语法高亮(js/ts/json/html/css 通用,失败则纯色) ---------- */

  var KWSET = {};
  ('const let var function return if else for while do switch case break continue ' +
    'new class extends super this typeof instanceof in of try catch finally throw ' +
    'delete void yield async await static import export from default true false null undefined')
    .split(' ').forEach(function (w) { KWSET[w] = 1; });

  // 返回 [{start, c, t}]:c 为 token 类(kw/str/num/com/fn),t 为原文
  function tokenize(text) {
    var segs = [];
    if (!text) return segs;
    var re = /(\/\/[^\n]*|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\d[\w.]*)|([A-Za-z_$][\w$]*)/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) segs.push({ start: last, c: null, t: text.slice(last, m.index) });
      var c = null;
      if (m[1]) c = 'com';
      else if (m[2]) c = 'str';
      else if (m[3]) c = 'num';
      else if (m[4]) {
        c = KWSET[m[4]] ? 'kw' : (text[m.index + m[4].length] === '(' ? 'fn' : null);
      }
      segs.push({ start: m.index, c: c, t: m[0] });
      last = m.index + m[0].length;
    }
    if (last < text.length) segs.push({ start: last, c: null, t: text.slice(last) });
    return segs;
  }

  // 每个字符的 token 类(空串 = 无)
  function charClasses(text) {
    var arr = new Array(text.length);
    for (var k = 0; k < arr.length; k++) arr[k] = '';
    tokenize(text).forEach(function (s) {
      for (var i = 0; i < s.t.length; i++) arr[s.start + i] = s.c || '';
    });
    return arr;
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // sel 区间归一化:[[l1,c1],[l2,c2]](含端点,允许乱序传入)
  function normSel(sel) {
    if (!sel || !sel[0] || !sel[1]) return null;
    var a = sel[0], b = sel[1];
    if (a[0] > b[0] || (a[0] === b[0] && a[1] > b[1])) { var t = a; a = b; b = t; }
    return [a, b];
  }

  // 某行的选区字符遮罩
  function selMaskForRow(sel, l, lineLen) {
    var r = normSel(sel);
    if (!r || l < r[0][0] || l > r[1][0]) return null;
    var start = l === r[0][0] ? r[0][1] : 0;
    var end = l === r[1][0] ? r[1][1] + 1 : lineLen; // 含端点 → 开区间
    if (end <= start) return null;
    var mask = null;
    for (var i = start; i < end && i < lineLen; i++) {
      if (!mask) mask = {};
      mask[i] = true;
    }
    return mask;
  }

  /* ---------- 状态机构建 ---------- */

  function snap(s) {
    return {
      mode: s.mode, cursor: s.cursor.slice(), lines: s.lines.slice(),
      pending: s.pending, sel: s.sel, cmdline: s.cmdline
    };
  }

  // 状态 0 = initial;状态 i = 应用第 i 步之后
  function buildStates(demo) {
    var s = {
      mode: (demo.initial && demo.initial.mode) || 'normal',
      cursor: demo.initial.cursor.slice(),
      lines: demo.initial.lines.slice(),
      pending: '', sel: null, cmdline: null
    };
    var states = [snap(s)];
    (demo.steps || []).forEach(function (st) {
      if (st.lines) s.lines = st.lines.slice();
      if (st.cursor) s.cursor = st.cursor.slice();
      if (st.mode) s.mode = st.mode;
      if ('pending' in st) s.pending = st.pending || '';
      if ('sel' in st) s.sel = normSel(st.sel);
      // 命令行文本只在 cmd 步(或显式声明 cmdline 的步)显示,下一步自动消失
      s.cmdline = st.type === 'cmd' ? st.text : (st.cmdline !== undefined ? st.cmdline : null);
      states.push(snap(s));
    });
    return states;
  }

  // 按键流胶囊的文案
  function capLabel(st) {
    if (st.type === 'cmd') return (st.text || ':') + ' ⏎';
    if (st.type === 'type') {
      var t = st.text || '';
      if (t === ' ') return '␣';
      return t.length > 16 ? t.slice(0, 15) + '…' : t;
    }
    if (st.key === ' ') return '␣';
    if (st.key === 'Enter') return '⏎';
    return st.key || '?';
  }

  /* ---------- 播放器 ---------- */

  var PLAYERS = [];
  var mouseDown = false;
  var frozen = false;
  var guardInstalled = false;

  // innerHTML 会清掉整页选区(不限编辑器内)。用户拖选或已有选区时冻结一切 DOM 改写。
  function hasRangeSelection() {
    var sel = window.getSelection && window.getSelection();
    return !!(sel && sel.rangeCount > 0 && !sel.isCollapsed);
  }
  function recomputeFreeze() {
    var next = mouseDown || hasRangeSelection();
    if (next === frozen) return;
    frozen = next;
    PLAYERS.forEach(function (p) {
      clearTimeout(p.timer);
      if (!frozen) {
        p.renderLive();
        if (p.playing) p.schedule();
      }
    });
  }
  function installSelectionGuard() {
    if (guardInstalled) return;
    guardInstalled = true;
    document.addEventListener('mousedown', function (e) {
      if (e.button === 0) { mouseDown = true; recomputeFreeze(); }
    }, true);
    window.addEventListener('mouseup', function (e) {
      if (e.button === 0) { mouseDown = false; recomputeFreeze(); }
    }, true);
    document.addEventListener('selectionchange', recomputeFreeze);
  }

  function Player(slot, demo) {
    this.demo = demo;
    this.speed = demo.speed || 900;
    this.mults = [1, 2, 0.5];
    this.multIdx = 0;
    this.states = buildStates(demo);
    this.i = 0;
    this.playing = false;
    this.timer = null;
    this.started = false;
    this._edHTML = null;
    PLAYERS.push(this);
    this.buildDOM(slot);
    this.render();
    this.watch();
  }

  Player.prototype.buildDOM = function (slot) {
    var self = this;
    var root = document.createElement('div');
    root.className = 'vdp';
    root.tabIndex = 0;
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', 'Vim 按键演示:' + (demo_title(this)));
    function demo_title(p) { return p.demo.title || p.demo.id || ''; }

    root.innerHTML =
      '<div class="vdp-head">' +
      '  <div class="vdp-title"></div>' +
      '  <span class="vdp-count"></span>' +
      '  <div class="vdp-ctrls">' +
      '    <button class="vdp-btn" data-act="play" title="播放/暂停(空格)">▶</button>' +
      '    <button class="vdp-btn" data-act="prev" title="上一步(←)">⏮</button>' +
      '    <button class="vdp-btn" data-act="next" title="单步(→)">⏭</button>' +
      '    <button class="vdp-btn" data-act="reset" title="重置">⟲</button>' +
      '    <button class="vdp-btn" data-act="speed" title="速度">1×</button>' +
      '  </div>' +
      '</div>' +
      '<div class="vdp-editor"></div>' +
      '<div class="vdp-status">' +
      '  <span class="vdp-mode"></span>' +
      '  <span class="vdp-cmdline"></span>' +
      '  <span class="vdp-pending"></span>' +
      '  <span class="vdp-lang"></span>' +
      '</div>' +
      '<div class="vdp-keys"></div>' +
      '<div class="vdp-note"></div>';

    slot.innerHTML = '';
    slot.appendChild(root);
    this.root = root;
    this.titleEl = root.querySelector('.vdp-title');
    this.countEl = root.querySelector('.vdp-count');
    this.ed = root.querySelector('.vdp-editor');
    this.modeEl = root.querySelector('.vdp-mode');
    this.cmdEl = root.querySelector('.vdp-cmdline');
    this.pendingEl = root.querySelector('.vdp-pending');
    this.langEl = root.querySelector('.vdp-lang');
    this.keysEl = root.querySelector('.vdp-keys');
    this.noteEl = root.querySelector('.vdp-note');
    this.playBtn = root.querySelector('[data-act="play"]');
    this.speedBtn = root.querySelector('[data-act="speed"]');

    this.titleEl.textContent = (demo_title(this));
    this.langEl.textContent = this.demo.lang || '';

    root.querySelectorAll('.vdp-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var act = b.getAttribute('data-act');
        if (act === 'play') self.toggle();
        else if (act === 'prev') { self.pause(); self.seek(self.i - 1); }
        else if (act === 'next') { self.pause(); self.next(); }
        else if (act === 'reset') { self.pause(); self.seek(0); }
        else if (act === 'speed') self.cycleSpeed();
        root.focus({ preventScroll: true });
      });
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === ' ') { e.preventDefault(); self.toggle(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); self.pause(); self.next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); self.pause(); self.seek(self.i - 1); }
    });
  };

  // 一行的 HTML:按字符合并 (token类 × 装饰类) 相同的连续段
  Player.prototype.rowHTML = function (text, curCol, mask, mode) {
    var beam = mode === 'insert' || mode === 'replace';
    var tcls = charClasses(text);
    var html = '', runT = null, runD = null, buf = '';
    var self = this;
    function deco(i) {
      if (mask && mask[i]) return 'vsel';
      if (i === curCol) return beam ? 'vcur vcur-beam' : 'vcur';
      return '';
    }
    function flush() {
      if (!buf) return;
      var cls = ((runT ? 'tk-' + runT : '') + ' ' + runD).trim();
      html += cls ? '<span class="' + cls + '">' + esc(buf) + '</span>' : esc(buf);
      buf = '';
    }
    for (var i = 0; i < text.length; i++) {
      var d = deco(i);
      if (d !== runD || tcls[i] !== runT) { flush(); runD = d; runT = tcls[i]; }
      buf += text.charAt(i);
    }
    flush();
    // 光标在行尾:补一个块光标占位
    if (curCol >= text.length && curCol >= 0) {
      html += '<span class="' + (beam ? 'vcur vcur-beam' : 'vcur') + '">&nbsp;</span>';
    }
    return html;
  };

  Player.prototype.render = function () {
    if (frozen) return;
    var st = this.states[this.i];
    var prev = this.i > 0 ? this.states[this.i - 1] : null;
    var relNum = !!this.demo.relativeNumbers;
    var curLine = st.cursor[0];

    // 编辑区(带变更行闪烁)
    var html = '';
    for (var l = 0; l < st.lines.length; l++) {
      var changed = prev && (prev.lines[l] !== st.lines[l] || prev.lines.length !== st.lines.length);
      var ln = relNum ? (l === curLine ? String(l + 1) : String(l - curLine)) : String(l + 1);
      var mask = selMaskForRow(st.sel, l, st.lines[l].length);
      html += '<div class="vdp-row' + (changed ? ' vdp-flash' : '') + '">' +
        '<span class="vdp-ln">' + ln + '</span>' +
        '<span class="vdp-tx">' + this.rowHTML(st.lines[l], curLine === l ? st.cursor[1] : -1, mask, st.mode) + '</span>' +
        '</div>';
    }
    // 相同 HTML 不写 innerHTML,避免无谓清掉页面选区
    if (this._edHTML !== html) {
      this.ed.innerHTML = html;
      this._edHTML = html;
    }

    // 状态栏(textContent 不拆 DOM,可安全写)
    if (st.cmdline) {
      this.modeEl.textContent = '';
      this.cmdEl.textContent = st.cmdline;
    } else {
      this.modeEl.textContent = MODE_TEXT[st.mode] || MODE_TEXT.normal;
      this.modeEl.className = 'vdp-mode ' + (MODE_CLS[st.mode] || '');
      this.cmdEl.textContent = '';
    }
    this.pendingEl.textContent = st.pending || '';

    // 按键流:优先改 class,避免每步 innerHTML 清选区
    var steps = this.demo.steps || [];
    if (this.keysEl.childNodes.length !== steps.length) {
      var keys = '';
      for (var j = 0; j < steps.length; j++) {
        keys += '<span class="kcap">' + esc(capLabel(steps[j])) + '</span>';
      }
      this.keysEl.innerHTML = keys || '';
    }
    var caps = this.keysEl.children;
    for (var k = 0; k < caps.length; k++) {
      var cls = 'kcap';
      if (k < this.i - 1) cls += ' hit';
      if (k === this.i - 1) cls += (this.playing || this.i < steps.length ? ' on' : ' hit');
      if (caps[k].className !== cls) caps[k].className = cls;
    }

    // 解说 + 步数
    var note = this.i === 0
      ? (this.demo.intro || '按 ▶ 播放,或用 ⏭ 逐步查看每个按键')
      : (steps[this.i - 1].note || '');
    this.noteEl.textContent = note;
    this.countEl.textContent = this.i + ' / ' + steps.length;
  };

  Player.prototype.updatePlayBtn = function () {
    var last = this.i >= this.states.length - 1;
    this.playBtn.textContent = this.playing ? '⏸' : (last ? '↻' : '▶');
  };

  Player.prototype.renderLive = function () { this.render(); this.updatePlayBtn(); };

  Player.prototype.toggle = function () {
    if (this.playing) this.pause();
    else this.play();
  };

  Player.prototype.play = function () {
    if (this.i >= this.states.length - 1) this.seek(0); // 结束后再按 → 重播
    this.playing = true;
    this.renderLive();
    this.schedule();
  };

  Player.prototype.pause = function () {
    this.playing = false;
    clearTimeout(this.timer);
    this.renderLive();
  };

  Player.prototype.schedule = function () {
    var self = this;
    clearTimeout(this.timer);
    if (frozen) return;
    this.timer = setTimeout(function () { self.next(true); }, this.speed / this.mults[this.multIdx]);
  };

  // auto=true 表示由自动播放推进
  Player.prototype.next = function (auto) {
    if (frozen) {
      if (auto && this.playing) this.schedule();
      return;
    }
    if (this.i >= this.states.length - 1) {
      this.playing = false;
      this.renderLive();
      return;
    }
    this.i++;
    this.renderLive();
    if (this.playing) this.schedule();
  };

  Player.prototype.seek = function (i) {
    this.i = Math.max(0, Math.min(i, this.states.length - 1));
    this.renderLive();
  };

  Player.prototype.cycleSpeed = function () {
    this.multIdx = (this.multIdx + 1) % this.mults.length;
    var m = this.mults[this.multIdx];
    this.speedBtn.textContent = (m === 0.5 ? '½×' : m + '×');
    if (this.playing) this.schedule();
  };

  // 滚动到视口内自动播放一次
  Player.prototype.watch = function () {
    var self = this;
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !self.started) {
          self.started = true;
          self.play();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(this.root);
  };

  /* ---------- 初始化 ---------- */

  function init(root) {
    installSelectionGuard();
    (root || document).querySelectorAll('.demo-slot[data-demo]').forEach(function (slot) {
      var id = slot.getAttribute('data-demo');
      var demo = REG[id];
      if (!demo) {
        slot.innerHTML = '<div class="vdp-error">演示数据缺失:' + esc(id) +
          '(检查 demos/chNN.js 是否已加载、id 是否匹配)</div>';
        return;
      }
      try { new Player(slot, demo); }
      catch (e) {
        slot.innerHTML = '<div class="vdp-error">演示渲染失败:' + esc(id) + ' — ' + esc(String(e && e.message)) + '</div>';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () { init(); });

  window.VIMPlayer = { init: init, Player: Player };
})();

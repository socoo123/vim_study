#!/usr/bin/env node
/* check.mjs — 站点结构与演示数据校验(node ≥18,零依赖)
 * 规则来源:PLAN.md §5(章节模板)、§6(演示 Schema)。
 * 全绿退出码 0,任何 ❌ 退出码 1。每次生成内容后必须跑:node tools/check.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MODES = new Set(['normal', 'insert', 'visual', 'visual-line', 'visual-block', 'replace']);
const STEP_TYPES = new Set(['key', 'type', 'cmd', 'wait']);

let fails = 0;
const bad = (msg) => { fails++; console.error('  ❌ ' + msg); };
const good = (msg) => console.error('  ✅ ' + msg);

/* ---------- 1. 加载演示注册表(demos/*.js) ---------- */
console.error('== 演示数据(demos/*.js)==');
const demosDir = path.join(ROOT, 'demos');
const registry = {};
const demoFiles = existsSync(demosDir) ? readdirSync(demosDir).filter(f => f.endsWith('.js')) : [];
if (!demoFiles.length) bad('demos/ 下没有任何 .js 注册文件');
for (const f of demoFiles) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  try {
    vm.runInContext(readFileSync(path.join(demosDir, f), 'utf8'), sandbox, { filename: f });
  } catch (e) {
    bad(`${f}: JS 执行失败 — ${e.message}`);
    continue;
  }
  const reg = sandbox.window.VIMDEMOS || {};
  const ids = Object.keys(reg);
  if (!ids.length) bad(`${f}: 没有注册任何演示(VIMDEMOS 为空)`);
  for (const id of ids) {
    if (registry[id]) bad(`演示 id 重复:${id}(${f} 与之前文件冲突)`);
    registry[id] = reg[id];
  }
}

// 逐演示校验 Schema + 状态模拟
let demoCount = 0;
for (const [id, d] of Object.entries(registry)) {
  demoCount++;
  const at = `demos 演示 ${id}`;
  if (d.version !== 1) bad(`${at}: version 必须为 1`);
  if (d.id !== id) bad(`${at}: id 字段(${d.id})与注册键不一致`);
  if (!d.title || typeof d.title !== 'string') bad(`${at}: 缺 title`);
  if (!d.initial || !Array.isArray(d.initial.lines) || !d.initial.lines.length || !d.initial.lines.every(l => typeof l === 'string'))
    bad(`${at}: initial.lines 必须是非空字符串数组`);
  if (!MODES.has(d.initial?.mode)) bad(`${at}: initial.mode 非法(${d.initial?.mode})`);
  if (d.speed !== undefined && (d.speed < 400 || d.speed > 3000)) bad(`${at}: speed 建议在 400–3000 之间(当前 ${d.speed})`);

  // 快照式状态模拟:任何时刻 cursor 必须在 buffer 内
  const st = {
    mode: d.initial?.mode || 'normal',
    cursor: d.initial?.cursor,
    lines: d.initial?.lines || []
  };
  const checkCursor = (label) => {
    const [l, c] = st.cursor;
    if (!Number.isInteger(l) || !Number.isInteger(c) || l < 0 || c < 0) return bad(`${at}: ${label} cursor 非法 [${l},${c}]`);
    if (l >= st.lines.length) return bad(`${at}: ${label} cursor 行 ${l} 越界(buffer 共 ${st.lines.length} 行)`);
    if (c > st.lines[l].length) return bad(`${at}: ${label} cursor 列 ${c} 越界(第 ${l} 行长度 ${st.lines[l].length})`);
  };
  if (!Array.isArray(st.cursor) || st.cursor.length !== 2) bad(`${at}: initial.cursor 必须是 [行,列]`);
  else checkCursor('initial');

  const steps = d.steps || [];
  if (!steps.length) bad(`${at}: steps 不能为空`);
  steps.forEach((s, i) => {
    const label = `第 ${i + 1} 步`;
    if (!STEP_TYPES.has(s.type)) bad(`${at}: ${label} type 非法(${s.type})`);
    if (!s.note || typeof s.note !== 'string') bad(`${at}: ${label} 缺 note`);
    else if (s.note.length > 120) bad(`${at}: ${label} note 太长(${s.note.length} 字,建议 ≤60)`);
    if (s.type === 'key' && !s.key) bad(`${at}: ${label} type=key 缺 key`);
    if ((s.type === 'type' || s.type === 'cmd') && typeof s.text !== 'string') bad(`${at}: ${label} type=${s.type} 缺 text`);
    if (s.type === 'cmd' && !s.text.startsWith(':')) bad(`${at}: ${label} cmd 的 text 应以 : 开头`);
    if (s.lines !== undefined) {
      if (!Array.isArray(s.lines) || !s.lines.every(l => typeof l === 'string')) bad(`${at}: ${label} lines 必须是字符串数组(快照语义:完整 buffer)`);
      else st.lines = s.lines;
    }
    if (s.cursor !== undefined) {
      if (!Array.isArray(s.cursor) || s.cursor.length !== 2) bad(`${at}: ${label} cursor 必须是 [行,列]`);
      else { st.cursor = s.cursor; checkCursor(label); }
    } else if (s.lines && st.cursor[0] >= st.lines.length) {
      bad(`${at}: ${label} 改变了 buffer 但未重申 cursor(行 ${st.cursor[0]} 已越界)— 快照语义要求变更步显式给出 cursor`);
    }
    if (s.mode !== undefined && !MODES.has(s.mode)) bad(`${at}: ${label} mode 非法(${s.mode})`);
    if (s.sel !== undefined && s.sel !== null) {
      const ok = Array.isArray(s.sel) && s.sel.length === 2 && s.sel.every(p => Array.isArray(p) && p.length === 2 && p.every(Number.isInteger));
      if (!ok) bad(`${at}: ${label} sel 形状应为 [[l,c],[l,c]]`);
    }
  });
}
if (demoCount) good(`共 ${demoCount} 个演示,Schema 校验完成`);

/* ---------- 2. 章节文件(chapters/*.html) ---------- */
console.error('== 章节(chapters/*.html)==');
const chDir = path.join(ROOT, 'chapters');
const chFiles = existsSync(chDir) ? readdirSync(chDir).filter(f => f.endsWith('.html')) : [];
if (!chFiles.length) bad('chapters/ 下没有章节文件');
const REQUIRED = ['class="chapter"', 'class="goal"', 'class="lesson"', 'class="drills"', 'class="pitfalls"', 'class="ide-notes"', 'class="recap"', '<header', '<footer'];
for (const f of chFiles) {
  const html = readFileSync(path.join(chDir, f), 'utf8');
  for (const needle of REQUIRED) if (!html.includes(needle)) bad(`${f}: 缺少必需结构 "${needle}"(见 PLAN.md §5)`);

  // 演示引用存在且属于本章
  const chMatch = html.match(/class="chapter"[^>]*data-ch="([^"]+)"/);
  if (!chMatch) { bad(`${f}: article.chapter 缺 data-ch 属性`); continue; }
  const ch = chMatch[1];
  const refs = [...html.matchAll(/data-demo="([^"]+)"/g)].map(m => m[1]);
  if (!refs.length) bad(`${f}: 没有引用任何演示(每章至少 1 个)`); else good(`${f}: ${refs.length} 个演示`);
  for (const r of refs) {
    if (!registry[r]) bad(`${f}: 引用的演示不存在:${r}`);
    else if (!r.startsWith(ch + '-')) bad(`${f}: 引用了他章演示 ${r}(应前缀 ${ch}-)`);
  }

  // 章内链接的文件存在(相对 chapters/ 解析,../index.html → 根)
  for (const m of html.matchAll(/href="([^"]+\.html)"/g)) {
    if (/^https?:/.test(m[1])) continue;
    const target = path.resolve(chDir, m[1]);
    if (!existsSync(target)) bad(`${f}: 链接目标不存在 ${m[1]}`);
  }
}

/* ---------- 3. index.html 链接 ---------- */
console.error('== 首页 ==');
const indexPath = path.join(ROOT, 'index.html');
if (!existsSync(indexPath)) bad('缺 index.html');
else {
  const html = readFileSync(indexPath, 'utf8');
  for (const m of html.matchAll(/href="(chapters\/[^"]+\.html)"/g)) {
    if (!existsSync(path.join(ROOT, m[1]))) bad(`index.html: 链接目标不存在 ${m[1]}`);
  }
  good('index.html 链接检查完成');
}

console.error(fails ? `\n共 ${fails} 个问题 ❌` : '\n全部通过 ✅');
process.exit(fails ? 1 : 0);

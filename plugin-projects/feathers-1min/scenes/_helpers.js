// scenes/_helpers.js — shared helpers for the words-swallow video (1-min sample).
// The swallowed-words device (swallowedWord / goldWord / mirrorWords / wordCount)
// lives at the bottom of this file. sizePill and the other helpers are carried
// over from Change Size — kept, they may be reused by shots that need them.
import { E, V, text, measure, rr, circle, poly, seg, alpha, FONTS, clamp, prog, lerp, ease } from '/engine/core.js';
import { counterPill } from '/engine/counters.js';
import { headPos } from '/engine/rig2d.js';

// Size pill: dark pill above Noah's head ONLY on a size change — "10 m" red
// outline when giant, "0.1 m" green outline when tiny — then fades after ~1 s.
// fig = the drawFigure options object (x, y, s, facing, pose). at = shot-local
// time of the size change; hold = seconds the pill stays fully visible.
export function sizePill(g, fig, label, urgency, t, o = {}) {
  const at = o.at ?? 0, hold = o.hold ?? 1.0;
  const a = clamp(prog(t, at, at + 0.15)) * (1 - clamp(prog(t, at + hold, at + hold + 0.4)));
  if (a <= 0.01) return;
  const [hx, hy, hr] = headPos(fig);
  const size = Math.max(24, V(44, 52) * clamp((fig.s ?? 1.5) / 1.5, 0.55, 1.3));
  counterPill(g, hx, hy, hr, label, { urgency, t, a, size, pulse: urgency === 'red' });
}

// Hard-cut value steps: [[tStart, '6'], [tStart, '5'], ...] — the number JUMPS, never eases.
export function jumpValue(t, steps) {
  let cur = null;
  for (const [t0, label] of steps) if (t >= t0) cur = label;
  return cur;
}

// Simple gold on-screen line (big ALL-CAPS text), used for rules/titles.
export function goldLine(g, str, y, size) {
  text(g, str, E.W / 2, y, { size: size || V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2 });
}

// Gold "FREEZE" label for the frozen moment.
export function freezeLabel(g, t, o = {}) {
  const a = clamp(t / 0.2) * clamp((o.dur ? o.dur - t : 1) / 0.3);
  if (a <= 0) return;
  text(g, 'FREEZE', E.W / 2, o.y || E.H * 0.2, { size: V(72, 80), color: '#9fd8ff', font: FONTS.ui, weight: 900, glow: 26, glowColor: 'rgba(159,216,255,0.6)', alpha: a, spacing: 6 });
}

// World position of a figure's front hand.
export function handPos(o) {
  const p = o.pose, s = (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1), f = o.facing ?? 1;
  return [o.x + p.hF[0] * f * s, o.y + p.hF[1] * s];
}

// A phone (dark slab, glowing screen), drawn at (x, y) with tilt.
export function drawPhone(g, x, y, rot = 0, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -14, -26, 28, 52, 6); g.fillStyle = '#101018'; g.fill();
  g.strokeStyle = '#3a3a48'; g.lineWidth = 2; g.stroke();
  rr(g, -10, -22, 20, 44, 3); g.fillStyle = '#9fd8ff'; g.fill();
  g.restore();
}

// A small gold earring (hoop + glint), drawn at (x, y).
export function drawEarring(g, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.strokeStyle = '#ffd76a'; g.lineWidth = 4;
  g.beginPath(); g.arc(0, 0, 10, 0, Math.PI * 2); g.stroke();
  circle(g, -4, -4, 3, '#fff6e0');
  g.restore();
}

// A raindrop, drawn at (x, y) with tilt — big and heavy for the tiny-Noah shot.
export function drawDrop(g, x, y, r, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = 'rgba(159,216,255,0.9)';
  g.beginPath(); g.moveTo(0, -r * 1.6);
  g.bezierCurveTo(r * 0.9, -r * 0.2, r, r * 0.5, 0, r);
  g.bezierCurveTo(-r, r * 0.5, -r * 0.9, -r * 0.2, 0, -r * 1.6);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,0.85)';
  g.beginPath(); g.ellipse(-r * 0.3, r * 0.1, r * 0.18, r * 0.35, -0.4, 0, Math.PI * 2); g.fill();
  g.restore();
}

// ---------- swallowed-words device ----------
// The heart of this video. Grey ALL-CAPS text floats just above a character's
// head, hangs, then fades out to invisible — once a word fades it is gone forever.
// Placement rule (same spirit as sizePill): the words sit just above the head and
// must NEVER cover another character's face or an on-screen sign. Shots own the
// composition: keep the speaker clear of other faces/signs, or pass o.x / o.y /
// o.dy to move the words. All drawing is in logical units (1920x1080).
const WORD_GREY = '#b8b8c0';
const WORD_GOLD = '#ffd76a';
// Letterbox bar top in LOGICAL units: config bars is output px (40 at 720p),
// and the player draws it as bars / E.PX logical units (60 at 720p) — words
// must stay below that line, never inside the black bar.
const wordBarTop = () => (E.cfg.bars ?? 40) / E.PX + 10;

// Split words into at most 2 lines, breaking at the space nearest the middle,
// so long lines (e.g. "I'M SORRY I MISSED YOUR GAME.") read as two stacked lines.
function splitWordLines(words) {
  const ws = String(words || '').trim().split(/\s+/);
  if (ws.join(' ').length <= 26 || ws.length < 2) return [ws.join(' ')];
  let best = 1, bestDiff = 1e9;
  for (let i = 1; i < ws.length; i++) {
    const a = ws.slice(0, i).join(' ').length, b = ws.slice(i).join(' ').length;
    const d = Math.abs(a - b);
    if (d < bestDiff) { bestDiff = d; best = i; }
  }
  return [ws.slice(0, best).join(' '), ws.slice(best).join(' ')];
}

// Lay out word lines above a head centre (hx, hy, hr): line centres + block box.
// Lines stack UPWARD from just above the head; the block is clamped inside the
// frame and kept below the letterbox bar. Returns { cx, lines, w, h, top }.
function wordLayout(g, hx, hy, hr, lines, size) {
  const lh = size * 1.18;
  const totalH = lines.length * lh;
  const widths = lines.map(l => measure(g, l, size, FONTS.ui, 800));
  const w = Math.max(...widths, 1);
  const cx = clamp(hx, w / 2 + 24, E.W - w / 2 - 24);
  const gap = hr * 0.35; // same gap as the counter pill — almost touching the head
  let top = hy - hr - gap - totalH;
  top = Math.max(top, wordBarTop()); // never inside the letterbox bar
  return { cx, lines: lines.map((l, i) => ({ str: l, x: cx, y: top + lh * (i + 0.5), w: widths[i] })), w, h: totalH, top };
}

function drawWordLines(g, layout, size, color, a, glow, glowColor, dy = 0) {
  for (const l of layout.lines) {
    text(g, l.str, l.x, l.y + dy, { size, color, font: FONTS.ui, weight: 800, spacing: 1, alpha: a, glow, glowColor });
  }
}

// Shared layout for swallowedWord / goldWord: size scaled to the figure, long
// lines shrunk so the widest fits 62% of the frame width.
function layoutWords(g, fig, words, o = {}) {
  const [hx, hy, hr] = headPos(fig);
  const sScale = clamp((fig.s ?? 1.5) / 1.5, 0.55, 1.3);
  let size = (o.size || V(44, 50)) * sScale;
  const lines = splitWordLines(words);
  const widest = Math.max(...lines.map(l => measure(g, l, size, FONTS.ui, 800)));
  if (widest > E.W * 0.62) size *= (E.W * 0.62) / widest;
  const layout = wordLayout(g, o.x ?? hx, (o.y ?? hy) + (o.dy ?? 0), hr, lines, size);
  return { layout, size };
}

// swallowedWord(g, fig, words, t, o) — grey text above a figure's head.
// fig = the drawFigure options object (x, y, s, facing, pose). Fades IN over
// 0.15 s, hangs, then fades OUT over ~0.4 s starting at o.fadeAt (default:
// o.dur - 0.4; if neither dur nor fadeAt is given the words hang to the shot end).
// o: { at=0, dur, fadeAt, size, x, y, dy } — x/y override the head position.
export function swallowedWord(g, fig, words, t, o = {}) {
  if (!words) return null;
  const at = o.at ?? 0;
  const fadeAt = o.fadeAt ?? (o.dur !== undefined ? o.dur - 0.4 : 1e9);
  const a = clamp(prog(t, at, at + 0.15)) * (1 - clamp(prog(t, fadeAt, fadeAt + 0.4)));
  if (a <= 0.01) return null;
  const { layout, size } = layoutWords(g, fig, words, o);
  drawWordLines(g, layout, size, WORD_GREY, a, 18, 'rgba(184,184,192,0.45)');
  return { ...layout, a };
}

// goldWord(g, fig, words, t, o) — the word turns GOLD and RISES like light.
// Before o.at the words hang grey (like swallowedWord, no fade-out); from o.at
// they turn gold, rise ~90 logical px and fade out over ~1 s. Used exactly three
// times in the full video: the girl's apology, Grandma's words, Dad's forgiveness.
// o: { at, greyAt=0, size, rise=90, x, y, dy }.
export function goldWord(g, fig, words, t, o = {}) {
  if (!words) return null;
  const at = o.at ?? 0;
  // Grey phase: the words hang grey from o.greyAt (default 0) — NOT from `at`,
  // which is the moment they turn gold. (First version passed `at` through and
  // the grey phase was invisible before the turn.)
  if (t < at) return swallowedWord(g, fig, words, t, { ...o, at: o.greyAt ?? 0, fadeAt: 1e9 });
  const k = prog(t, at, at + 1);
  const a = clamp(prog(t, at, at + 0.1)) * (1 - clamp(prog(t, at + 0.15, at + 1)));
  if (a <= 0.01) return null;
  const { layout, size } = layoutWords(g, fig, words, o);
  const rise = o.rise ?? 90;
  drawWordLines(g, layout, size, WORD_GOLD, a, 26, 'rgba(255,215,106,0.6)', -rise * k);
  return { ...layout, a, rise: rise * k };
}

// mirrorWords(g, x, y, words[], t, o) — a STACK of grey words above the mirror
// reflection's head (x, y = reflection head centre, o.hr = its head radius).
// Each line fades in slightly after the one below it and fades out at a slightly
// different time (staggered by o.stagger, default 0.3 s), so the stack shimmers
// away line by line. For the bathroom-mirror twist: Eli's own swallowed words.
// o: { at=0, dur, fadeAt, stagger=0.3, size, hr=26, dy }.
export function mirrorWords(g, x, y, words, t, o = {}) {
  const list = Array.isArray(words) ? words : [words];
  if (!list.length || !list[0]) return null;
  const at = o.at ?? 0;
  const fadeAt = o.fadeAt ?? (o.dur !== undefined ? o.dur - 0.4 : 1e9);
  const stagger = o.stagger ?? 0.3;
  const size = o.size || V(34, 40);
  const lh = size * 1.18;
  const totalH = list.length * lh;
  const widths = list.map(l => measure(g, String(l), size, FONTS.ui, 800));
  const w = Math.max(...widths, 1);
  const cx = clamp(x, w / 2 + 24, E.W - w / 2 - 24);
  const hr = o.hr ?? 26;
  const gap = hr * 0.35;
  let top = y + (o.dy ?? 0) - hr - gap - totalH;
  top = Math.max(top, wordBarTop());
  const out = [];
  for (let i = 0; i < list.length; i++) {
    // Line 0 is the TOP line: it fades in last and fades out first, so the stack
    // melts from the top down like smoke.
    const a = clamp(prog(t, at + (list.length - 1 - i) * 0.08, at + (list.length - 1 - i) * 0.08 + 0.15))
      * (1 - clamp(prog(t, fadeAt + i * stagger, fadeAt + i * stagger + 0.4)));
    if (a <= 0.01) { out.push({ str: list[i], a: 0 }); continue; }
    text(g, String(list[i]), cx, top + lh * (i + 0.5), { size, color: WORD_GREY, font: FONTS.ui, weight: 800, spacing: 1, alpha: a, glow: 16, glowColor: 'rgba(184,184,192,0.4)' });
    out.push({ str: list[i], x: cx, y: top + lh * (i + 0.5), a });
  }
  return { x: cx, top, w, h: totalH, lines: out };
}

// wordCount(g, n, t, o) — the "43 words today" infographic: dark tile, big gold
// number, small label "WORDS SWALLOWED TODAY". o: { x=E.W/2, y=E.H*0.38, size,
// label, at=0, from + dur (count up from `from` over dur in hard integer jumps) }.
export function wordCount(g, n, t, o = {}) {
  const a = clamp(prog(t, o.at ?? 0, (o.at ?? 0) + 0.2));
  if (a <= 0.01) return null;
  const size = o.size || V(120, 132);
  let v = n;
  if (o.from !== undefined && o.dur) v = Math.floor(lerp(o.from, n, clamp(t / o.dur)));
  const num = Math.round(v).toLocaleString('en-US');
  const label = o.label || 'WORDS SWALLOWED TODAY';
  const cx = o.x ?? E.W / 2, cy = o.y ?? E.H * 0.38;
  const numW = measure(g, num, size, FONTS.ui, 900);
  const labSize = Math.round(size * 0.26);
  const labW = measure(g, label, labSize, FONTS.ui, 800);
  const w = Math.max(numW, labW) + size * 0.9, h = size * 1.55;
  g.save(); g.globalAlpha *= a;
  rr(g, cx - w / 2, cy - h / 2, w, h, 20);
  g.fillStyle = 'rgba(8,12,24,0.92)'; g.fill();
  g.strokeStyle = 'rgba(255,215,106,0.9)'; g.lineWidth = 3; g.stroke();
  text(g, num, cx, cy - size * 0.08, { size, color: WORD_GOLD, font: FONTS.ui, weight: 900, glow: 22, glowColor: 'rgba(255,215,106,0.55)' });
  text(g, label, cx, cy + size * 0.52, { size: labSize, color: '#cfe2ff', font: FONTS.ui, weight: 800, spacing: 2 });
  g.restore();
  return { x: cx - w / 2, y: cy - h / 2, w, h, n: v, a };
}

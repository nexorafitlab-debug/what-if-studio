// scenes/_feathers.js — the feather device for the feathers video.
// Project-local helper (like words-swallow's swallowedWord) — do NOT touch the shared engine.
// A feather: central shaft, tapered slightly-curved vane, fine barb lines, soft edge.
// White feather: fill #f5f2e8, shade #d8d2c0. Black feather: fill #16161d, shade #2e2e3a.
// Base at (x, y), tip points UP (-y) before rot. All drawing in logical units (1920x1080).
import { E, V, text, measure, rr, circle, poly, seg, alpha, FONTS, clamp, prog, lerp, ease, glow, ring, mix } from '/engine/core.js';
import { headPos } from '/engine/rig2d.js';
import { handPos } from './_helpers.js';

export const FEATHER_WHITE = { fill: '#f5f2e8', shade: '#d8d2c0', shaft: '#b8b2a0' };
export const FEATHER_BLACK = { fill: '#16161d', shade: '#2e2e3a', shaft: '#4a4a5a' };

function featherColors(color, turnWhite = 0) {
  const base = color === 'black' ? FEATHER_BLACK : FEATHER_WHITE;
  const k = clamp(turnWhite);
  if (k <= 0) return base;
  return {
    fill: mix(base.fill, FEATHER_WHITE.fill, k),
    shade: mix(base.shade, FEATHER_WHITE.shade, k),
    shaft: mix(base.shaft, FEATHER_WHITE.shaft, k),
  };
}

// drawFeather(g, x, y, len, opts) — opts: { color:'white'|'black', rot=0, scale=1,
// alpha=1, glow=0 (gold halo strength), turnWhite=0..1 (black -> white lerp) }
export function drawFeather(g, x, y, len, o = {}) {
  const a = o.alpha ?? 1;
  if (a <= 0.01 || len <= 0) return;
  const L = len * (o.scale ?? 1);
  const w = L * 0.32;
  const c = featherColors(o.color || 'white', o.turnWhite ?? 0);
  g.save();
  g.translate(x, y);
  g.rotate(o.rot ?? 0);
  g.globalAlpha *= a;
  if (o.glow) glow(g, 0, -L * 0.5, L * 1.15, o.color === 'black' ? '#9a9aff' : '#fff3d0', o.glow);
  // vane: tapered, slightly curved outline
  poly(g, [[0, 0], [-w * 0.55, -L * 0.18], [-w, -L * 0.5], [-w * 0.72, -L * 0.8], [-w * 0.25, -L * 0.96], [0, -L], [w * 0.25, -L * 0.96], [w * 0.72, -L * 0.8], [w, -L * 0.5], [w * 0.55, -L * 0.18]], c.fill);
  // inner shade — one side, like a folded vane
  poly(g, [[0, -L * 0.06], [-w * 0.42, -L * 0.3], [-w * 0.62, -L * 0.62], [-w * 0.3, -L * 0.9], [0, -L * 0.98]], alpha(c.shade, 0.55));
  // fine barb lines fanning off the shaft
  for (let i = 1; i <= 5; i++) {
    const yy = -L * (0.15 + 0.13 * i);
    const hw = w * 0.72 * (1 - (i / 7));
    seg(g, [[0, yy], [-hw, yy - L * 0.05]], 2, alpha(c.shade, 0.5));
    seg(g, [[0, yy], [hw, yy - L * 0.05]], 2, alpha(c.shade, 0.5));
  }
  // central shaft, with a little quill below the base
  seg(g, [[0, L * 0.09], [0, -L * 1.03]], Math.max(2.5, L * 0.05), c.shaft);
  g.restore();
}

// Where a feather grows on a figure. fig = the drawFigure options object
// (x, y, s, facing, pose — pose must be set, e.g. the breathed pose).
// wrist/hand: the front hand (handPos). collar: just below the head (neck/collar).
// chest: over the heart. shoulder: top of the shoulder on the facing side.
export function featherAnchor(fig, where = 'collar') {
  const [hx, hy, hr] = headPos(fig);
  const f = fig.facing ?? 1;
  if (where === 'wrist' || where === 'hand') return handPos(fig);
  if (where === 'neck') return [hx, hy + hr * 0.95];
  if (where === 'collar') return [hx - f * hr * 0.5, hy + hr * 1.55];
  if (where === 'chest') return [hx, hy + hr * 2.35];
  if (where === 'shoulder') return [hx + f * hr * 1.15, hy + hr * 1.55];
  return [hx, hy + hr * 1.3];
}

// featherPop(g, fig, where, t, o) — the feather POPS out at `at`: scale 0 -> 1
// with ease-out-back over ~0.3 s, plus a tiny white ring burst.
// o: { at=0, len=60, color='white'|'black', xy (override anchor), rot, glow }
export function featherPop(g, fig, where, t, o = {}) {
  const at = o.at ?? 0;
  const k = prog(t, at, at + 0.3);
  if (k <= 0) return null;
  const [x, y] = o.xy || featherAnchor(fig, where);
  const len = o.len ?? 60;
  const scale = ease.outBack(k);
  const ringK = prog(t, at, at + 0.45);
  if (ringK < 1) ring(g, x, y - len * 0.4, lerp(8, len * 0.9, ringK), 4, alpha('#ffffff', 0.8 * (1 - ringK)));
  drawFeather(g, x, y, len, { ...o, scale, alpha: clamp(k / 0.08) });
  return { x, y, scale };
}

// featherFall(g, x0, y0, t, o) — the feather drifts DOWN with sinusoidal sway +
// slow rotation, fading near the end, like snow. When the black feather turns
// white, lerp colour black -> white over the first 30% of the fall.
// o: { at=0, dur=1.5, fall=260, sway=36, rot=0.6, rot0=0, len=60, color='white',
//      turnWhite=false, phase=0, glow=0 }
export function featherFall(g, x0, y0, t, o = {}) {
  const at = o.at ?? 0, dur = o.dur ?? 1.5;
  const k = prog(t, at, at + dur);
  if (k <= 0 || k >= 1) return null;
  const x = x0 + (o.sway ?? 36) * Math.sin(k * Math.PI * 2.2 + (o.phase ?? 0));
  const y = y0 + (o.fall ?? 260) * k * k;
  const rot = (o.rot0 ?? 0) + (o.rot ?? 0.6) * k;
  const a = 1 - clamp(prog(k, 0.8, 1));
  drawFeather(g, x, y, o.len ?? 60, { color: o.color || 'white', rot, alpha: a, glow: o.glow ?? 0, turnWhite: o.turnWhite ? clamp(k / 0.3) : 0 });
  return { x, y, k };
}

// featherCount(g, n, word, labels, t, o) — the lunch count tile: dark tile, big
// gold number word ("FOUR"), small labels below ("WRIST · COLLAR · HAND · NECK").
// Same tile pattern as words-swallow's wordCount. o: { x, y, at=0, size }
export function featherCount(g, n, word, labels, t, o = {}) {
  const a = clamp(prog(t, o.at ?? 0, (o.at ?? 0) + 0.2));
  if (a <= 0.01) return null;
  const size = o.size || V(110, 120);
  const num = word || String(n);
  const label = (labels || []).join('  ·  ');
  const cx = o.x ?? E.W / 2, cy = o.y ?? E.H * 0.38;
  const numW = measure(g, num, size, FONTS.ui, 900);
  const labSize = Math.round(size * 0.24);
  const labW = measure(g, label, labSize, FONTS.ui, 800);
  const w = Math.max(numW, labW) + size * 0.9, h = size * 1.5;
  g.save(); g.globalAlpha *= a;
  rr(g, cx - w / 2, cy - h / 2, w, h, 20);
  g.fillStyle = 'rgba(8,12,24,0.92)'; g.fill();
  g.strokeStyle = 'rgba(255,215,106,0.9)'; g.lineWidth = 3; g.stroke();
  text(g, num, cx, cy - size * 0.06, { size, color: '#ffd76a', font: FONTS.ui, weight: 900, glow: 22, glowColor: 'rgba(255,215,106,0.55)' });
  text(g, label, cx, cy + size * 0.52, { size: labSize, color: '#cfe2ff', font: FONTS.ui, weight: 800, spacing: 2 });
  g.restore();
  return { x: cx - w / 2, y: cy - h / 2, w, h, a };
}

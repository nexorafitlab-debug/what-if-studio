// scenes/_helpers.js — shared helpers for the see-10-seconds video.
import { E, V, text, measure, rr, circle, poly, seg, alpha, FONTS, clamp, prog, ease } from '/engine/core.js';
import { counterPill } from '/engine/counters.js';

// A chances pill: small dark pill, coloured outline by how many chances are left.
// green 5+, orange 3-4, red 1-2 (pulses at 1). Gap ~1/6 head diameter, tiny
// downward pointer — the Ifinite counter, via engine/counters.js.
export function chancePill(g, hx, hy, hr, value, t = 0, o = {}) {
  // A missing value must draw NOTHING — never the literal word "null"
  // (jumpValue returns null before its first step, e.g. during a gap).
  if (value === null || value === undefined || value === '') return;
  const v = Number(value);
  if (Number.isNaN(v)) return;
  const urgency = v >= 5 ? 'green' : v >= 3 ? 'orange' : 'red';
  return counterPill(g, hx, hy, hr, String(value), { urgency, t, pulse: v === 1, ...o });
}

// Hard-cut value steps: [[tStart, '6'], [tStart, '5'], ...] — the number JUMPS,
// never eases. Returns the current label (or null before the first step).
export function jumpValue(t, steps) {
  let cur = null;
  for (const [t0, label] of steps) if (t >= t0) cur = label;
  return cur;
}


// Simple gold on-screen line (big ALL-CAPS text), used for rules/titles.
export function goldLine(g, str, y, size) {
  text(g, str, E.W / 2, y, { size: size || V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2 });
}

// BIG gold countdown number. nums = [[tStart, '10'], [tStart, '9'], ...] (shot-local times).
// Shows each number from its start until the next one starts (last one holds 0.9s), with a
// pop-in scale and a fade-out at the end of its window.
export function bigCount(g, t, nums, o = {}) {
  const cx = o.x || E.W / 2, cy = o.y || E.H * 0.42, size = o.size || V(300, 320);
  const gold = o.color || '#ffd76a';
  for (let i = 0; i < nums.length; i++) {
    const [t0, label] = nums[i];
    const t1 = i + 1 < nums.length ? nums[i + 1][0] : t0 + (o.hold || 0.9);
    if (t < t0 || t > t1) continue;
    const k = clamp((t - t0) / 0.12); // pop in
    const fade = clamp((t1 - t) / 0.15); // fade out at the end of the window
    const a = ease.out(k) * fade;
    const s = size * (1.25 - 0.25 * ease.out(k));
    text(g, label, cx, cy, { size: s, color: gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(gold, 0.7), alpha: a });
    return label;
  }
  return null;
}

// Gold "FREEZE" label for the frozen moment.
export function freezeLabel(g, t, o = {}) {
  const a = clamp(t / 0.2) * clamp((o.dur ? o.dur - t : 1) / 0.3);
  if (a <= 0) return;
  text(g, 'FREEZE', E.W / 2, o.y || E.H * 0.2, { size: V(72, 80), color: '#9fd8ff', font: FONTS.ui, weight: 900, glow: 26, glowColor: 'rgba(159,216,255,0.6)', alpha: a, spacing: 6 });
}

// World position of a figure's front hand, for drawing custom props (tray, pencil, phone).
// o = the drawFigure options object (x, y, s, facing, pose).
export function handPos(o) {
  const p = o.pose, s = (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1), f = o.facing ?? 1;
  return [o.x + p.hF[0] * f * s, o.y + p.hF[1] * s];
}

// A lunch tray (rounded rect + food blobs), drawn at (x, y) with tilt (radians).
export function drawTray(g, x, y, rot = 0, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -70, -10, 140, 20, 8); g.fillStyle = '#c8b898'; g.fill();
  g.strokeStyle = '#8a7a5a'; g.lineWidth = 3; g.stroke();
  circle(g, -38, -16, 12, '#e8a04a'); circle(g, 0, -18, 10, '#7ac74a'); circle(g, 38, -16, 9, '#e8e4f4');
  g.restore();
}

// A pencil (yellow body, wood tip, graphite point), drawn at (x, y) with tilt.
export function drawPencil(g, x, y, rot = 0, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -46, -5, 72, 10, 3); g.fillStyle = '#f2c21a'; g.fill();
  poly(g, [[26, -5], [46, 0], [26, 5]], '#e8c898');
  poly(g, [[38, -2.5], [46, 0], [38, 2.5]], '#2a2a33');
  rr(g, -52, -5, 8, 10, 2); g.fillStyle = '#e07856'; g.fill();
  g.restore();
}

// A phone (dark slab, glowing screen), drawn at (x, y) with tilt.
export function drawPhone(g, x, y, rot = 0, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -14, -26, 28, 52, 6); g.fillStyle = '#101018'; g.fill();
  g.strokeStyle = '#3a3a48'; g.lineWidth = 2; g.stroke();
  rr(g, -10, -22, 20, 44, 3); g.fillStyle = '#9fd8ff'; g.fill();
  g.restore();
}

// A ceiling-fan blade (long tapered blade) drawn from hub (x, y) at angle a.
export function fanBlade(g, x, y, a, len, w, color) {
  g.save(); g.translate(x, y); g.rotate(a);
  rr(g, 14, -w / 2, len, w, w / 2); g.fillStyle = color; g.fill();
  g.restore();
}

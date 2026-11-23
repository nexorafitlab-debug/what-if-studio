// scenes/_helpers.js — shared helpers for the change-size 1-min sample.
import { E, V, text, measure, rr, circle, poly, seg, alpha, FONTS, clamp, prog, ease } from '/engine/core.js';
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

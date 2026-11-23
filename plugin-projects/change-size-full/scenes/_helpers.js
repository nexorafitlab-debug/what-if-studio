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

// A sitting cat (dark grey silhouette with tail + ears), drawn at (x, y),
// facing f (1 = right). size s scales it.
export function drawCat(g, x, y, s = 1, f = 1, o = {}) {
  const col = o.color || '#3a3a48';
  g.save(); g.translate(x, y); g.scale(f * s, s);
  poly(g, [[-8, -78], [-22, -118], [-2, -96]], col); // ear L
  poly(g, [[8, -78], [22, -118], [2, -96]], col);   // ear R
  circle(g, 0, -62, 34, col);                        // head
  circle(g, -14, -66, 5, o.eye || '#ffd76a');        // eye L
  circle(g, 14, -66, 5, o.eye || '#ffd76a');         // eye R
  rr(g, -34, -40, 68, 44, 22); g.fillStyle = col; g.fill(); // body
  g.strokeStyle = col; g.lineWidth = 12; g.lineCap = 'round';
  g.beginPath(); g.moveTo(30, -6); g.quadraticCurveTo(72, -6, 66, -52); g.stroke(); // tail
  g.restore();
}

// A steel I-beam, drawn horizontally at (x, y) with length len and tilt rot.
export function drawBeam(g, x, y, len, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = '#6a6a78';
  g.fillRect(-len / 2, -14, len, 28);
  g.fillStyle = '#8a8a9a';
  g.fillRect(-len / 2, -22, len, 8);
  g.fillRect(-len / 2, 14, len, 8);
  g.fillStyle = 'rgba(0,0,0,0.35)';
  for (let i = -3; i <= 3; i++) g.fillRect(i * len / 8 - 3, -14, 6, 28);
  g.restore();
}

// A contract paper (white, lines of text, red seal), at (x, y), tilt rot.
export function drawContract(g, x, y, rot = 0, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -60, -80, 120, 160, 4); g.fillStyle = '#f2ead8'; g.fill();
  g.strokeStyle = '#8a7a5a'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = '#3a3a48'; g.lineWidth = 4;
  for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-44, -56 + i * 22); g.lineTo(44, -56 + i * 22); g.stroke(); }
  circle(g, 30, 56, 16, '#c94a3a');
  if (o.torn) { // torn in half: jagged split
    g.strokeStyle = '#f2ead8'; g.lineWidth = 10;
    g.beginPath(); g.moveTo(-60, 0); g.lineTo(-30, -14); g.lineTo(0, 6); g.lineTo(30, -10); g.lineTo(60, 2); g.stroke();
  }
  g.restore();
}

// An envelope letter at (x, y), tilt rot, scale s.
export function drawLetter(g, x, y, rot = 0, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -90, -56, 180, 112, 6); g.fillStyle = '#e8e0cc'; g.fill();
  g.strokeStyle = '#8a7a5a'; g.lineWidth = 3; g.stroke();
  seg(g, [[-90, -56], [0, 10], [90, -56]], 3, '#8a7a5a');
  g.restore();
}

// A simple delivery truck (side view) at (x, y), facing f, scale s.
export function drawTruck(g, x, y, s = 1, f = 1) {
  g.save(); g.translate(x, y); g.scale(f * s, s);
  rr(g, -260, -150, 320, 150, 8); g.fillStyle = '#c94a3a'; g.fill();
  rr(g, 70, -110, 130, 110, 8); g.fillStyle = '#3a4a6a'; g.fill();
  rr(g, 90, -96, 90, 60, 4); g.fillStyle = '#9fd8ff'; g.fill();
  text(g, 'MOVE-IT', -100, -70, { size: 44, color: '#f2ead8', font: FONTS.ui, weight: 900 });
  circle(g, -180, 10, 34, '#1a1622'); circle(g, -180, 10, 14, '#5a5a6a');
  circle(g, 140, 10, 34, '#1a1622'); circle(g, 140, 10, 14, '#5a5a6a');
  g.restore();
}

// A giant wall map (continents + mountain range) drawn on the wall.
export function drawWallMap(g, x, y, w, h) {
  rr(g, x, y, w, h, 10); g.fillStyle = '#d8c49a'; g.fill();
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 6; g.stroke();
  // continents (blobs)
  g.fillStyle = '#7ac74a';
  g.beginPath(); g.ellipse(x + w * 0.24, y + h * 0.34, w * 0.13, h * 0.18, 0.3, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(x + w * 0.62, y + h * 0.30, w * 0.16, h * 0.14, -0.2, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(x + w * 0.72, y + h * 0.62, w * 0.11, h * 0.16, 0.2, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#5a9ac9';
  g.beginPath(); g.ellipse(x + w * 0.45, y + h * 0.72, w * 0.3, h * 0.12, 0, 0, Math.PI * 2); g.fill();
  // mountain range (triangles) across the middle
  g.fillStyle = '#8a6a8a';
  for (let i = 0; i < 5; i++) {
    const mx = x + w * (0.18 + i * 0.14);
    poly(g, [[mx - 46, y + h * 0.52], [mx, y + h * 0.34], [mx + 46, y + h * 0.52]], '#8a6a8a');
    poly(g, [[mx - 14, y + h * 0.42], [mx, y + h * 0.34], [mx + 14, y + h * 0.42]], '#f2ead8');
  }
  text(g, 'THE WORLD', x + w / 2, y + 44, { size: 34, color: '#3a2a1e', font: FONTS.ui, weight: 900 });
}

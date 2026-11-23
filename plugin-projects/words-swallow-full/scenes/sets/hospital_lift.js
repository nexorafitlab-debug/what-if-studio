// scenes/sets/hospital_lift.js — the hospital lift (fresh).
// Steel lift doors, floor indicator showing 3, handrail, soft ceiling
// light. Dad and Eli ride up to Room 312.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function hospitalLift(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#22303a', '#10161c'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#1a262c');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#141a20');
  // lift doors (centre): brushed steel with a centre seam
  rr(g, E.W * 0.30, E.H * 0.10, E.W * 0.40, GY - E.H * 0.10, 8);
  g.fillStyle = linGrad(g, E.W * 0.30, 0, E.W * 0.70, 0, ['#5a6a7a', '#8a9aaa', '#5a6a7a']);
  g.fill();
  g.strokeStyle = '#2a3642'; g.lineWidth = 4; g.stroke();
  seg(g, [[E.W * 0.50, E.H * 0.10], [E.W * 0.50, GY]], 4, '#2a3642');
  seg(g, [[E.W * 0.32, E.H * 0.12], [E.W * 0.32, GY - 10]], 3, 'rgba(255,255,255,0.15)');
  seg(g, [[E.W * 0.68, E.H * 0.12], [E.W * 0.68, GY - 10]], 3, 'rgba(255,255,255,0.15)');
  // floor indicator above the doors
  rr(g, E.W * 0.44, E.H * 0.02, 220, 60, 8); g.fillStyle = '#1a1622'; g.fill();
  text(g, '▲  3', E.W * 0.50, E.H * 0.02 + 42, { size: 34, color: '#7ee787', font: FONTS.ui, weight: 900 });
  // call buttons (right of the doors)
  rr(g, E.W * 0.72, E.H * 0.36, 70, 110, 8); g.fillStyle = '#2a3642'; g.fill();
  circle(g, E.W * 0.72 + 35, E.H * 0.36 + 32, 14, '#ffd76a');
  glow(g, E.W * 0.72 + 35, E.H * 0.36 + 32, 50, '#ffd76a', 0.5);
  circle(g, E.W * 0.72 + 35, E.H * 0.36 + 76, 14, '#3a4a5a');
  // handrail + floor strip
  seg(g, [[E.W * 0.06, GY - 140], [E.W * 0.26, GY - 140]], 8, '#8a8a9a');
  seg(g, [[E.W * 0.74, GY - 140], [E.W * 0.94, GY - 140]], 8, '#8a8a9a');
  seg(g, [[E.W * 0.30, GY - 20], [E.W * 0.70, GY - 20]], 4, '#ffd76a');
  // ceiling light
  rr(g, E.W * 0.40, 0, 380, 16, 8); g.fillStyle = '#fff3d0'; g.fill();
  glow(g, E.W * 0.50, 10, 200, '#fff3d0', 0.25);
  dust(g, t, { count: 6, seed: 271 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

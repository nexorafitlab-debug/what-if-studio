// scenes/sets/hospital_stairs.js — the hospital stairwell (fresh).
// Concrete steps going down, a metal handrail, a green EXIT sign, a small
// window with daylight, painted wall numbers. Eli sprints down here.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, windowFrame } from '/engine/fx2d.js';

export function hospitalStairs(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#22303a', '#10161c'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#1d2830');
  // steps descending left to right
  for (let i = 0; i < 7; i++) {
    const y = GY - 40 - i * 90, x0 = E.W * 0.10 + i * 110;
    fillRect(g, x0, y, E.W, 40, i % 2 ? '#2a3642' : '#24303a');
    g.strokeStyle = '#ffd76a'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + 110, y); g.stroke();
  }
  // handrail following the steps
  seg(g, [[E.W * 0.08, GY - 160], [E.W * 0.86, GY - 160 - 6 * 90]], 8, '#8a8a9a');
  for (let i = 0; i < 7; i++) seg(g, [[E.W * (0.12 + i * 0.11), GY - 160 - i * 90], [E.W * (0.12 + i * 0.11), GY - 60 - i * 90]], 5, '#8a8a9a');
  // small window with daylight (top right)
  windowFrame(g, { x: E.W * 0.72, y: E.H * 0.08, w: 240, h: 200, mullions: [0.5, 0] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 200, ['#d8ecff', '#a8c8ef']);
    gg2.fillRect(0, 0, 240, 200);
  });
  // EXIT sign + floor numbers
  rr(g, E.W * 0.06, E.H * 0.08, 130, 44, 6); g.fillStyle = '#1a4a2a'; g.fill();
  text(g, 'EXIT', E.W * 0.06 + 65, E.H * 0.08 + 30, { size: 26, color: '#7ee787', font: FONTS.ui, weight: 900 });
  glow(g, E.W * 0.125, E.H * 0.10, 90, '#7ee787', 0.25);
  text(g, '3', E.W * 0.90, E.H * 0.30, { size: 60, color: 'rgba(255,255,255,0.25)', font: FONTS.ui, weight: 900 });
  text(g, '2', E.W * 0.55, E.H * 0.55, { size: 60, color: 'rgba(255,255,255,0.25)', font: FONTS.ui, weight: 900 });
  text(g, '1', E.W * 0.20, E.H * 0.72, { size: 60, color: 'rgba(255,255,255,0.25)', font: FONTS.ui, weight: 900 });
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#141a20');
  dust(g, t, { count: 6, seed: 281 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

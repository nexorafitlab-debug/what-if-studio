// scenes/sets/examhall.js — exam hall: rows of desks, blackboard, wall clock.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, clock } from '/engine/fx2d.js';

export function examhall(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  // blackboard (front, centre)
  rr(g, E.W * 0.3, 110, E.W * 0.4, 240, 6); g.fillStyle = '#1c2a22'; g.fill();
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 8; g.strokeRect(E.W * 0.3, 110, E.W * 0.4, 240);
  text(g, 'EXAM — NO TALKING', E.W * 0.5, 190, { size: 44, color: '#f2efe8', font: FONTS.ui, weight: 900 });
  text(g, 'Q1. What do you see?', E.W * 0.5, 270, { size: 34, color: '#c8d8c8', font: FONTS.ui, weight: 800 });
  // wall clock
  clock(g, E.W * 0.86, E.H * 0.22, 52, 10.2 * 3600 + t * 60, {});
  // windows (left)
  for (const x of [E.W * 0.05, E.W * 0.17]) {
    rr(g, x, 130, 170, 240, 8); g.fillStyle = '#c9d4ff'; g.fill();
    g.strokeStyle = '#2a2238'; g.lineWidth = 6; g.strokeRect(x, 130, 170, 240);
  }
  // rows of desks (back rows, smaller; front row drawn by shots)
  const desk = (x, y, w, s) => {
    rr(g, x, y, w, 20 * s, 6); g.fillStyle = '#6a4a3a'; g.fill();
    seg(g, [[x + 14, y + 20 * s], [x + 14, y + 64 * s]], 7 * s, '#3a2a2a');
    seg(g, [[x + w - 14, y + 20 * s], [x + w - 14, y + 64 * s]], 7 * s, '#3a2a2a');
    rr(g, x + w * 0.3, y - 8 * s, w * 0.4, 10 * s, 3); g.fillStyle = '#f2e6c8'; g.fill();
  };
  desk(E.W * 0.14, GY - 260, 260, 0.8); desk(E.W * 0.44, GY - 260, 260, 0.8); desk(E.W * 0.74, GY - 260, 260, 0.8);
  desk(E.W * 0.10, GY - 120, 300, 1.0); desk(E.W * 0.72, GY - 120, 300, 1.0);
  // front-row desk (centre) — Kian sits here in the shots
  desk(E.W * 0.38, GY - 40, 340, 1.15);
  dust(g, t, { count: 12, seed: 44 });
  veil(g, '#000', 0.08);
  return { GY, CX, M: m, frontDesk: { x: E.W * 0.38, y: GY - 40, w: 340 } };
}

// scenes/sets/cafeteria.js — the school cafeteria, lunch.
// Fresh drawing for the feathers video. Long tables with trays down the
// middle, lunch counter at the back, big windows on the right, hanging lights.
// (Drawn for the full video's lunch count; unused in the 1-min sample.)
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, windowFrame, floorLines } from '/engine/fx2d.js';

export function cafeteria(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#2c3040');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#1a1d29');
  floorLines(g, GY + 6, E.H);
  // lunch counter (back) with trays and a menu board
  rr(g, E.W * 0.06, GY - 300, E.W * 0.88, 120, 8); g.fillStyle = '#4a3626'; g.fill();
  rr(g, E.W * 0.10, GY - 330, 120, 30, 4); g.fillStyle = '#c94a3a'; g.fill();
  rr(g, E.W * 0.24, GY - 330, 120, 30, 4); g.fillStyle = '#e8b23a'; g.fill();
  rr(g, E.W * 0.38, GY - 330, 120, 30, 4); g.fillStyle = '#4a9a6a'; g.fill();
  rr(g, E.W * 0.62, GY - 470, 420, 150, 8); g.fillStyle = '#1c2436'; g.fill();
  text(g, 'LUNCH TODAY', E.W * 0.62 + 210, GY - 420, { size: 30, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  text(g, 'pasta  ·  salad  ·  juice', E.W * 0.62 + 210, GY - 372, { size: 26, color: '#cfe2ff', font: FONTS.ui, weight: 700 });
  // big windows (right wall)
  windowFrame(g, { x: E.W * 0.80, y: E.H * 0.10, w: 330, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 300, ['#d8ecff', '#a8c8ef', '#7ab0e0']);
    gg2.fillRect(0, 0, 330, 300);
  });
  // long tables with trays down the middle
  for (let i = 0; i < 2; i++) {
    const y = GY - 40 - i * 170;
    rr(g, E.W * 0.14, y, E.W * 0.60, 34, 8); g.fillStyle = '#6a4a2a'; g.fill();
    for (let k = 0; k < 3; k++) {
      rr(g, E.W * (0.20 + k * 0.18), y - 22, 90, 22, 4); g.fillStyle = '#e8e4f4'; g.fill();
      circle(g, E.W * (0.20 + k * 0.18) + 45, y - 11, 9, '#e07856');
    }
  }
  // hanging lights
  for (const lx of [E.W * 0.30, E.W * 0.55, E.W * 0.80]) {
    seg(g, [[lx, 0], [lx, E.H * 0.08]], 4, '#3a3a48');
    circle(g, lx, E.H * 0.10, 18, '#ffe9b0');
    glow(g, lx, E.H * 0.10, 120, '#ffe9b0', 0.22);
  }
  dust(g, t, { count: 10, seed: 61 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

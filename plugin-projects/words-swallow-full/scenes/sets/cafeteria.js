// scenes/sets/cafeteria.js — the school cafeteria at lunch (fresh for the full video).
// Long tables with trays, food counter at the back, big windows, hanging
// lamps. Eli counts the 43 swallowed words here.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, windowFrame, floorLines, counter } from '/engine/fx2d.js';

export function cafeteria(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // big windows (back wall)
  for (let i = 0; i < 3; i++) {
    windowFrame(g, { x: E.W * (0.08 + i * 0.32), y: E.H * 0.08, w: 300, h: 240, mullions: [0.5, 0.5] }, (gg2) => {
      gg2.fillStyle = linGrad(gg2, 0, 0, 0, 240, ['#d8ecff', '#a8c8ef']);
      gg2.fillRect(0, 0, 300, 240);
    });
  }
  // food counter (back right) with trays
  counter(g, { x: E.W * 0.68, y: GY - 120, w: 480, h: 120, color: '#2a1e2a', top: '#4a3a48', doors: 6 });
  rr(g, E.W * 0.70, GY - 200, 120, 40, 6); g.fillStyle = '#e8b23a'; g.fill();
  rr(g, E.W * 0.84, GY - 200, 120, 40, 6); g.fillStyle = '#4a9a6a'; g.fill();
  text(g, 'LUNCH', E.W * 0.76, GY - 172, { size: 22, color: '#241b2e', font: FONTS.ui, weight: 900 });
  // hanging lamps
  for (let i = 0; i < 3; i++) {
    const x = E.W * (0.25 + i * 0.25);
    seg(g, [[x, 0], [x, E.H * 0.14]], 4, '#1a1622');
    circle(g, x, E.H * 0.16, 22, '#ffd76a');
    glow(g, x, E.H * 0.16, 90, '#ffd76a', 0.25);
  }
  // long lunch tables (front)
  for (let i = 0; i < 2; i++) {
    const y = GY - 60 + i * 10;
    rr(g, E.W * (0.06 + i * 0.02), y - 40, E.W * 0.88, 40, 8); g.fillStyle = '#6a4a2a'; g.fill();
    // trays on the tables
    for (let j = 0; j < 4; j++) {
      const tx = E.W * (0.14 + j * 0.20 + i * 0.03);
      rr(g, tx, y - 66, 90, 26, 4); g.fillStyle = '#c94a3a'; g.fill();
      circle(g, tx + 20, y - 56, 9, '#e8b23a'); circle(g, tx + 45, y - 56, 9, '#4a9a6a');
    }
  }
  dust(g, t, { count: 12, seed: 71 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

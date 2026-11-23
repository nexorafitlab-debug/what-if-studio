// scenes/sets/library.js — the school library (fresh).
// Tall shelves packed with coloured books, reading lamps, a big oak table.
// Eli sits alone here; he has stopped talking to people.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, floorLines } from '/engine/fx2d.js';

export function librarySet(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#2a2438', '#14101e'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#241d31');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#171019');
  floorLines(g, GY + 8, E.H);
  // tall shelves with coloured books (both sides)
  const shelf = (x0) => {
    rr(g, x0, E.H * 0.08, 300, GY - E.H * 0.08, 6); g.fillStyle = '#3a2a1e'; g.fill();
    const cols = ['#c94a3a', '#e8b23a', '#4a9a6a', '#4a7ac9', '#7a5ac9', '#e07856'];
    for (let r = 0; r < 4; r++) {
      const y = E.H * 0.10 + r * 150;
      for (let i = 0; i < 8; i++) {
        const bw = 26 + ((i * 7 + r * 3) % 12);
        rr(g, x0 + 14 + i * 34, y, bw, 110, 3); g.fillStyle = cols[(i + r) % 6]; g.fill();
      }
      rr(g, x0, y + 110, 300, 12, 4); g.fillStyle = '#5a3a26'; g.fill();
    }
  };
  shelf(E.W * 0.02); shelf(E.W * 0.82);
  // reading lamps on the big table
  for (let i = 0; i < 2; i++) {
    const x = E.W * (0.32 + i * 0.36);
    seg(g, [[x, GY - 60], [x, GY - 180]], 6, '#1a1622');
    circle(g, x, GY - 190, 24, '#ffd76a');
    glow(g, x, GY - 190, 130, '#ffd76a', 0.3);
  }
  // big oak reading table
  rr(g, E.W * 0.24, GY - 120, E.W * 0.52, 44, 8); g.fillStyle = '#6a4a2a'; g.fill();
  fillRect(g, E.W * 0.24, GY - 76, E.W * 0.52, 130, '#4a2e1e');
  // open books on the table
  for (let i = 0; i < 3; i++) {
    const x = E.W * (0.30 + i * 0.16);
    rr(g, x, GY - 150, 110, 30, 4); g.fillStyle = '#f2ead8'; g.fill();
    seg(g, [[x + 55, GY - 150], [x + 55, GY - 120]], 2, '#8a7a9a');
  }
  // a globe on a stand (right of the table)
  circle(g, E.W * 0.74, GY - 220, 40, '#4a7ac9');
  seg(g, [[E.W * 0.74, GY - 180], [E.W * 0.74, GY - 120]], 6, '#8a6a3a');
  dust(g, t, { count: 10, seed: 181 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

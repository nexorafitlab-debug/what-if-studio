// scenes/sets/science_lab.js — the Wegner white-bear lab (fresh).
// Dark chalkboard (blank), shelves with beakers, a desk with papers,
// a poster that says "DON'T THINK OF A WHITE BEAR". Freeze-bracketed.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, windowFrame, floorLines } from '/engine/fx2d.js';

export function scienceLab(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // dark chalkboard (centre) — BLANK on purpose: the shots draw their own
  // white/gold text on it, so no sketch or board text lives here (they collided).
  rr(g, E.W * 0.30, E.H * 0.10, 720, 300, 8); g.fillStyle = '#232833'; g.fill();
  g.strokeStyle = '#c9a86a'; g.lineWidth = 8; g.stroke();
  // poster (left): DON'T THINK OF A WHITE BEAR
  rr(g, E.W * 0.05, E.H * 0.12, 300, 200, 8); g.fillStyle = '#c94a3a'; g.fill();
  text(g, "DON'T THINK",  E.W * 0.05 + 150, E.H * 0.12 + 70, { size: 30, color: '#fff6e0', font: FONTS.ui, weight: 900 });
  text(g, 'OF A WHITE BEAR', E.W * 0.05 + 150, E.H * 0.12 + 110, { size: 30, color: '#fff6e0', font: FONTS.ui, weight: 900 });
  text(g, '(try it)', E.W * 0.05 + 150, E.H * 0.12 + 160, { size: 24, color: '#ffd76a', font: FONTS.ui, weight: 800 });
  // shelves with beakers (right)
  for (let i = 0; i < 2; i++) {
    const y = E.H * (0.16 + i * 0.20);
    rr(g, E.W * 0.78, y, 340, 16, 4); g.fillStyle = '#5a3a26'; g.fill();
    for (let j = 0; j < 4; j++) {
      const x = E.W * (0.80 + j * 0.085);
      rr(g, x, y - 70, 34, 70, 6); g.fillStyle = ['#4a7ac9', '#4a9a6a', '#e8b23a', '#c94a3a'][j]; g.fill();
    }
  }
  // desk with papers (front)
  rr(g, E.W * 0.36, GY - 140, 480, 140, 8); g.fillStyle = '#5a3a2a'; g.fill();
  rr(g, E.W * 0.40, GY - 168, 130, 28, 4); g.fillStyle = '#f2ead8'; g.fill();
  rr(g, E.W * 0.56, GY - 168, 130, 28, 4); g.fillStyle = '#f2ead8'; g.fill();
  dust(g, t, { count: 10, seed: 171 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

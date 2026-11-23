// scenes/sets/office.js — Mr. Hale's office (fresh).
// A desk buried in papers, red pens in a cup, a bookshelf, a window, a
// "DETENTION" slip pinned to the board. Eli already knows what Hale won't say.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, windowFrame, floorLines } from '/engine/fx2d.js';

export function officeSet(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // window (right)
  windowFrame(g, { x: E.W * 0.72, y: E.H * 0.08, w: 340, h: 280, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 280, ['#d8ecff', '#a8c8ef']);
    gg2.fillRect(0, 0, 340, 280);
  });
  // bookshelf (left)
  rr(g, E.W * 0.04, E.H * 0.10, 260, 480, 6); g.fillStyle = '#3a2a1e'; g.fill();
  const cols = ['#c94a3a', '#e8b23a', '#4a9a6a', '#4a7ac9'];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) {
    rr(g, E.W * 0.04 + 14 + i * 40, E.H * 0.12 + r * 150, 30, 110, 3); g.fillStyle = cols[(i + r) % 4]; g.fill();
  }
  // desk buried in papers (centre)
  rr(g, E.W * 0.34, GY - 140, 460, 140, 8); g.fillStyle = '#5a3a2a'; g.fill();
  for (let i = 0; i < 5; i++) {
    rr(g, E.W * 0.36 + i * 80, GY - 190 - (i % 2) * 12, 110, 50, 4); g.fillStyle = '#f2ead8'; g.fill();
    seg(g, [[E.W * 0.36 + i * 80 + 12, GY - 168 - (i % 2) * 12], [E.W * 0.36 + i * 80 + 96, GY - 168 - (i % 2) * 12]], 2, '#8a7a9a');
  }
  // red pens in a cup
  rr(g, E.W * 0.70, GY - 200, 60, 60, 6); g.fillStyle = '#4a7ac9'; g.fill();
  seg(g, [[E.W * 0.715, GY - 200], [E.W * 0.705, GY - 240]], 5, '#c94a3a');
  seg(g, [[E.W * 0.73, GY - 200], [E.W * 0.74, GY - 244]], 5, '#c94a3a');
  // DETENTION slip pinned to the board
  rr(g, E.W * 0.44, E.H * 0.10, 200, 120, 6); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'DETENTION', E.W * 0.44 + 100, E.H * 0.10 + 50, { size: 26, color: '#c94a3a', font: FONTS.ui, weight: 900 });
  text(g, '3:30 PM', E.W * 0.44 + 100, E.H * 0.10 + 88, { size: 22, color: '#241b2e', font: FONTS.ui, weight: 800 });
  // desk lamp
  seg(g, [[E.W * 0.38, GY - 140], [E.W * 0.38, GY - 240]], 6, '#1a1622');
  circle(g, E.W * 0.38, GY - 250, 22, '#ffd76a');
  glow(g, E.W * 0.38, GY - 250, 120, '#ffd76a', 0.3);
  dust(g, t, { count: 8, seed: 241 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

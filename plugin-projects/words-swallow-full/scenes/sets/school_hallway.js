// scenes/sets/school_hallway.js — school hallway with lockers (fresh for the full video).
// Lockers down both sides, a bulletin board, a SPEAK UP poster, an EXIT sign,
// floor shine. Cole shoves a kid here; Eli walks here thinking.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, floorLines } from '/engine/fx2d.js';

export function schoolHallway(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#2a2438', '#171222'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#241e30');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#171019');
  floorLines(g, GY + 8, E.H);
  // lockers (left wall)
  for (let i = 0; i < 5; i++) {
    const x = E.W * 0.03 + i * 150;
    rr(g, x, E.H * 0.16, 140, 420, 6); g.fillStyle = i % 2 ? '#3a5a7a' : '#4a6a8a'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 3; g.stroke();
    seg(g, [[x + 20, E.H * 0.16 + 60], [x + 120, E.H * 0.16 + 60]], 3, 'rgba(0,0,0,0.3)');
    circle(g, x + 112, E.H * 0.16 + 200, 8, '#d8d8d8');
  }
  // lockers (right wall, shorter row)
  for (let i = 0; i < 3; i++) {
    const x = E.W * 0.78 + i * 150;
    rr(g, x, E.H * 0.16, 140, 420, 6); g.fillStyle = i % 2 ? '#7a4a5a' : '#5a4a6a'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 3; g.stroke();
  }
  // bulletin board (centre) with pinned notices
  rr(g, E.W * 0.42, E.H * 0.18, 340, 220, 8); g.fillStyle = '#8a6a3a'; g.fill();
  rr(g, E.W * 0.44, E.H * 0.20, 120, 80, 4); g.fillStyle = '#f2ead8'; g.fill();
  rr(g, E.W * 0.56, E.H * 0.22, 110, 70, 4); g.fillStyle = '#e8b23a'; g.fill();
  rr(g, E.W * 0.46, E.H * 0.32, 100, 60, 4); g.fillStyle = '#cfe2ff'; g.fill();
  // SPEAK UP poster (right of the board)
  rr(g, E.W * 0.63, E.H * 0.20, 150, 110, 6); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'SPEAK UP!', E.W * 0.63 + 75, E.H * 0.20 + 58, { size: 24, color: '#c94a3a', font: FONTS.ui, weight: 900 });
  // EXIT sign glowing at the far end
  rr(g, E.W * 0.46, E.H * 0.06, 130, 44, 6); g.fillStyle = '#1a4a2a'; g.fill();
  text(g, 'EXIT', E.W * 0.46 + 65, E.H * 0.06 + 30, { size: 26, color: '#7ee787', font: FONTS.ui, weight: 900 });
  glow(g, E.W * 0.525, E.H * 0.08, 90, '#7ee787', 0.25);
  // floor shine
  seg(g, [[E.W * 0.30, GY + 30], [E.W * 0.70, GY + 30]], 3, 'rgba(255,255,255,0.08)');
  dust(g, t, { count: 8, seed: 12 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

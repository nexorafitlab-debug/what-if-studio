// scenes/sets/living_room.js — the living room in the evening (fresh).
// Sofa, TV glowing, coffee table with mugs, a bookshelf, curtains, a rug.
// Eli has stopped talking to people; the house is quiet around him.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, floorLines, screen } from '/engine/fx2d.js';

export function livingRoom(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#2a2438', '#14101e'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#271d31');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#191019');
  floorLines(g, GY + 8, E.H);
  // TV glowing (back wall, centre)
  screen(g, { x: E.W * 0.36, y: E.H * 0.14, w: 480, h: 270, glowC: '#7fd0d6', a: 0.25 }, (gg, sx, sy, w, h) => {
    gg.fillStyle = '#14202c'; gg.fillRect(sx, sy, w, h);
    gg.fillStyle = '#4a7ac9'; gg.fillRect(sx + 40, sy + 40, w - 80, h - 100);
    gg.fillStyle = '#ffd76a'; gg.beginPath(); gg.arc(sx + w / 2, sy + h / 2 - 20, 40, 0, Math.PI * 2); gg.fill();
  });
  // sofa (front left)
  rr(g, E.W * 0.06, GY - 160, 420, 160, 16); g.fillStyle = '#5a3a6a'; g.fill();
  rr(g, E.W * 0.06, GY - 220, 420, 70, 16); g.fillStyle = '#6a4a7a'; g.fill();
  rr(g, E.W * 0.10, GY - 190, 90, 60, 10); g.fillStyle = '#e8b23a'; g.fill();
  rr(g, E.W * 0.34, GY - 190, 90, 60, 10); g.fillStyle = '#4a9a6a'; g.fill();
  // coffee table with mugs
  rr(g, E.W * 0.52, GY - 90, 300, 24, 8); g.fillStyle = '#5a3a26'; g.fill();
  seg(g, [[E.W * 0.54, GY - 90], [E.W * 0.54, GY]], 6, '#3a2a1a');
  seg(g, [[E.W * 0.78, GY - 90], [E.W * 0.78, GY]], 6, '#3a2a1a');
  rr(g, E.W * 0.56, GY - 130, 40, 40, 5); g.fillStyle = '#e8e4f4'; g.fill();
  rr(g, E.W * 0.70, GY - 130, 40, 40, 5); g.fillStyle = '#e8e4f4'; g.fill();
  // bookshelf (right) + curtains (left of TV)
  rr(g, E.W * 0.84, E.H * 0.10, 220, 420, 6); g.fillStyle = '#3a2a1e'; g.fill();
  const cols = ['#c94a3a', '#e8b23a', '#4a9a6a', '#4a7ac9'];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) {
    rr(g, E.W * 0.84 + 12 + i * 40, E.H * 0.12 + r * 130, 30, 100, 3); g.fillStyle = cols[(i + r) % 4]; g.fill();
  }
  fillRect(g, E.W * 0.28, E.H * 0.10, 60, E.H * 0.40, '#7a3a4a');
  fillRect(g, E.W * 0.68, E.H * 0.10, 60, E.H * 0.40, '#7a3a4a');
  // rug
  rr(g, E.W * 0.30, GY + 30, E.W * 0.44, 90, 40); g.fillStyle = '#3a2a4a'; g.fill();
  dust(g, t, { count: 8, seed: 251 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

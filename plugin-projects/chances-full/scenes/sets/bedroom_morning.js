// scenes/sets/bedroom_morning.js — Kian's bedroom in the morning. Fresh set for this video:
// window on the RIGHT with pale morning sky, bed on the LEFT, desk with books,
// rug, wall clock. (The 57s sample's bedroom had the window left and a fan.)
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { sun, dust, windowFrame, bed, clock, floorLines, skyline } from '/engine/fx2d.js';

export function bedroomMorning(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.8, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // pale morning sun through the window glow
  sun(g, E.W * 0.82, E.H * 0.18, 36, '#fff6e0', '#ffd59a', 5);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // window with morning sky + rooftops (right)
  windowFrame(g, { x: E.W * 0.66, y: E.H * 0.13, w: 420, h: 340, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 340, ['#bfe0ff', '#8fc4ef', '#6a9fd8']);
    gg2.fillRect(0, 0, 420, 340);
    skyline(gg2, { seed: 41, y: 340, h: 100, color: '#5a6a8a', lit: 0.4 });
  });
  // wall clock (morning)
  clock(g, E.W * 0.52, E.H * 0.26, 48, 7.1 * 3600 + t * 60, {});
  // rug
  rr(g, CX - 380, GY + 56, 760, 110, 52); g.fillStyle = alpha(m.key, 0.13); g.fill();
  // bed (left)
  bed(g, { x: E.W * 0.08, y: GY + 40, w: 560, color: '#3a6a8a', frame: '#241a30', pillow: '#f2ead8' });
  // desk with books (centre-right, under the window)
  rr(g, E.W * 0.58, GY - 130, 300, 22, 6); g.fillStyle = '#5a3a2a'; g.fill();
  seg(g, [[E.W * 0.6, GY - 108], [E.W * 0.6, GY + 40]], 10, '#3a2418');
  seg(g, [[E.W * 0.84, GY - 108], [E.W * 0.84, GY + 40]], 10, '#3a2418');
  for (let i = 0; i < 4; i++) {
    rr(g, E.W * 0.6 + i * 34, GY - 190 + (i % 2) * 8, 28, 58, 3);
    g.fillStyle = ['#e07856', '#ffd76a', '#7ac74a', '#9fd8ff'][i]; g.fill();
  }
  // bookshelf (far left wall)
  rr(g, 30, 150, 190, GY - 150, 6); g.fillStyle = '#2a2238'; g.fill();
  for (let r = 0; r < 3; r++) {
    for (let i = 0; i < 4; i++) {
      rr(g, 48 + i * 42, 180 + r * 130, 32, 84, 3);
      g.fillStyle = ['#c96a5a', '#5a8ac9', '#7ac74a', '#e8c85a'][(r + i) % 4]; g.fill();
    }
  }
  // plant on the floor (right of the bed)
  rr(g, E.W * 0.42, GY - 10, 70, 50, 8); g.fillStyle = '#8a4a3a'; g.fill();
  circle(g, E.W * 0.42 + 35, GY - 60, 26, '#3a7a4a');
  circle(g, E.W * 0.42 + 14, GY - 40, 20, '#4a9a5a');
  circle(g, E.W * 0.42 + 56, GY - 42, 20, '#2a6a3a');
  dust(g, t, { count: 20, seed: 17 });
  veil(g, '#000', 0.07);
  return { GY, CX, M: m };
}

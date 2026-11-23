// scenes/sets/bedroom_eli.js — Eli's bedroom at night (fresh).
// Bed, desk with a growing stack of notebooks, bird posters on the wall,
// window with the night sky, a warm desk lamp. Dad sits on the bed here;
// Eli says "Dad. I forgive you." here — and the words turn gold.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, windowFrame, floorLines, bed, moon } from '/engine/fx2d.js';

export function bedroomEli(g, t, info, params = {}) {
  const m = mood('midnight');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#1e2438', '#0d101c'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#1a2032');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#12141f');
  floorLines(g, GY + 8, E.H);
  // window (right) with night sky + moon
  windowFrame(g, { x: E.W * 0.72, y: E.H * 0.08, w: 360, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = '#0e1526'; gg2.fillRect(0, 0, 360, 300);
    for (let i = 0; i < 12; i++) circle(gg2, (i * 61) % 360, (i * 43) % 280, 2, 'rgba(255,255,255,0.8)');
    moon(gg2, 260, 90, 34, '#e8ecff');
  });
  // bird posters (June's birds pinned up)
  for (let i = 0; i < 3; i++) {
    const x = E.W * (0.06 + i * 0.13), y = E.H * (0.10 + (i % 2) * 0.16);
    rr(g, x, y, 120, 150, 6); g.fillStyle = '#f2ead8'; g.fill();
    circle(g, x + 60, y + 60, 22, '#4a7ac9');
    seg(g, [[x + 60, y + 60], [x + 96, y + 42]], 5, '#4a7ac9');
    seg(g, [[x + 38, y + 96], [x + 84, y + 96]], 4, '#4a7ac9');
  }
  // bed (left)
  bed(g, { x: E.W * 0.06, y: GY, w: 480, color: '#3a5a3a', frame: '#2a2238', pillow: '#f2ead8' });
  // desk (centre-right) with the notebook stack
  rr(g, E.W * 0.42, GY - 140, 420, 140, 8); g.fillStyle = '#5a3a2a'; g.fill();
  for (let i = 0; i < 5; i++) {
    rr(g, E.W * 0.46 + i * 6, GY - 190 - i * 14, 150, 16, 3); g.fillStyle = i % 2 ? '#e8e4f4' : '#c9b8e8'; g.fill();
  }
  rr(g, E.W * 0.46, GY - 270, 150, 60, 4); g.fillStyle = '#f2ead8'; g.fill();
  seg(g, [[E.W * 0.47, GY - 248], [E.W * 0.59, GY - 248]], 3, '#8a7a9a');
  seg(g, [[E.W * 0.47, GY - 232], [E.W * 0.57, GY - 232]], 3, '#8a7a9a');
  // warm desk lamp
  seg(g, [[E.W * 0.78, GY - 140], [E.W * 0.78, GY - 260]], 6, '#1a1622');
  circle(g, E.W * 0.78, GY - 270, 26, '#ffd76a');
  glow(g, E.W * 0.78, GY - 260, 150, '#ffd76a', 0.3);
  // rug
  rr(g, E.W * 0.30, GY + 30, E.W * 0.40, 90, 40); g.fillStyle = '#3a2a4a'; g.fill();
  dust(g, t, { count: 8, seed: 131 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

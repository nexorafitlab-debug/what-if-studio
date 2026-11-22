// scenes/sets/street_morning.js — a morning street: shopfronts, trees, sidewalk,
// morning sun. Fresh set for this video (the 57s sample's street had a bus).
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { sun, skyline, dust, clouds } from '/engine/fx2d.js';

export function streetMorning(g, t, info, params = {}) {
  const m = mood('golden');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.16, E.H * 0.16, 44, '#fff3dc', '#ffcf8a', 5);
  clouds(g, { seed: 21, count: 4, y: E.H * 0.1, h: 70, color: '#ffe9c0', a: 0.2 });
  skyline(g, { seed: 55, y: GY - 30, h: 260, color: '#4a3a52', lit: 0.5 });
  // shopfronts along the back
  const shop = (x, w, col, sign, signCol) => {
    rr(g, x, GY - 330, w, 330, 6); g.fillStyle = col; g.fill();
    rr(g, x + 16, GY - 220, w - 32, 130, 4); g.fillStyle = '#2a3648'; g.fill();
    g.fillStyle = 'rgba(255,240,200,0.25)'; g.fillRect(x + 24, GY - 212, (w - 48) / 2, 114);
    rr(g, x + 20, GY - 310, w - 40, 56, 6); g.fillStyle = signCol; g.fill();
    text(g, sign, x + w / 2, GY - 272, { size: 34, color: '#fff6e0', font: FONTS.ui, weight: 900 });
  };
  shop(E.W * 0.03, 300, '#5a4a6a', 'BAKERY', '#c96a3a');
  shop(E.W * 0.62, 320, '#3a5a6a', 'BOOKS', '#3a7a5a');
  shop(E.W * 0.83, 280, '#6a4a3a', 'CAFE', '#8a5a2a');
  // sidewalk + road
  fillRect(g, -E.W, GY, E.W * 3, 90, '#6a6a72');
  fillRect(g, -E.W, GY + 90, E.W * 3, E.H - GY - 90, '#3a3a42');
  g.strokeStyle = 'rgba(255,220,120,0.7)'; g.lineWidth = 6;
  g.setLineDash([60, 50]); g.beginPath(); g.moveTo(-E.W, GY + 150); g.lineTo(E.W * 2, GY + 150); g.stroke(); g.setLineDash([]);
  // trees
  const tree = (x) => {
    seg(g, [[x, GY], [x, GY - 150]], 14, '#4a2a1a');
    circle(g, x, GY - 190, 62, '#3a7a3a');
    circle(g, x - 44, GY - 150, 44, '#4a8a4a');
    circle(g, x + 44, GY - 150, 44, '#2a6a2a');
  };
  tree(E.W * 0.24); tree(E.W * 0.52); tree(E.W * 0.76);
  // bench
  rr(g, E.W * 0.42, GY - 60, 190, 18, 6); g.fillStyle = '#5a3a2a'; g.fill();
  seg(g, [[E.W * 0.44, GY - 42], [E.W * 0.44, GY]], 8, '#3a2418');
  seg(g, [[E.W * 0.56, GY - 42], [E.W * 0.56, GY]], 8, '#3a2418');
  dust(g, t, { count: 16, seed: 23 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

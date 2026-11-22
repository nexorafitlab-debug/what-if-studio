// scenes/sets/schoolyard.js — school yard at midday: brick school facade, double
// doors, flag pole, fence, trees, benches. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, poly, text, FONTS } from '/engine/core.js';
import { sun, dust, clouds } from '/engine/fx2d.js';

export function schoolyard(g, t, info, params = {}) {
  const m = mood('golden');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.85, E.H * 0.14, 40, '#fff6e0', '#ffcf8a', 5);
  clouds(g, { seed: 33, count: 4, y: E.H * 0.1, h: 70, color: '#ffffff', a: 0.18 });
  // brick school facade
  fillRect(g, -E.W, 60, E.W * 3, GY - 60, '#7a4a3a');
  g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 2;
  for (let y = 90; y < GY; y += 34) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
  for (let x = -E.W; x < E.W * 2; x += 90) { g.beginPath(); g.moveTo(x, 60); g.lineTo(x, GY); g.stroke(); }
  // windows along the facade
  for (let i = 0; i < 6; i++) {
    const x = E.W * 0.06 + i * E.W * 0.16;
    rr(g, x, 150, 150, 190, 6); g.fillStyle = '#2a3648'; g.fill();
    g.fillStyle = 'rgba(180,220,255,0.35)'; g.fillRect(x + 10, 160, 60, 170);
    seg(g, [[x + 75, 150], [x + 75, 340]], 4, '#7a4a3a');
  }
  // double doors (centre)
  rr(g, CX - 110, GY - 300, 220, 300, 8); g.fillStyle = '#3a2a1e'; g.fill();
  seg(g, [[CX, GY - 300], [CX, GY]], 6, '#241a12');
  circle(g, CX - 30, GY - 140, 9, '#ffd59a');
  circle(g, CX + 30, GY - 140, 9, '#ffd59a');
  // sign above the doors
  rr(g, CX - 190, GY - 380, 380, 56, 8); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'MAPLEWOOD HIGH', CX, GY - 342, { size: 32, color: '#3a2a1e', font: FONTS.ui, weight: 900 });
  // flag pole (right)
  seg(g, [[E.W * 0.9, GY], [E.W * 0.9, 90]], 8, '#8a8a92');
  poly(g, [[E.W * 0.9, 90], [E.W * 0.9 + 130, 112], [E.W * 0.9, 134]], '#c94a3a');
  // yard floor
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#8a8a7a');
  // hopscotch chalk grid (left)
  g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 4;
  for (let i = 0; i < 4; i++) { g.strokeRect(E.W * 0.08, GY + 20 + i * 34, 70, 32); }
  // benches
  const bench = (x) => {
    rr(g, x, GY - 56, 180, 16, 6); g.fillStyle = '#5a3a2a'; g.fill();
    seg(g, [[x + 14, GY - 40], [x + 14, GY]], 8, '#3a2418');
    seg(g, [[x + 156, GY - 40], [x + 156, GY]], 8, '#3a2418');
  };
  bench(E.W * 0.3); bench(E.W * 0.68);
  // tree (left)
  seg(g, [[E.W * 0.2, GY], [E.W * 0.2, GY - 170]], 14, '#4a2a1a');
  circle(g, E.W * 0.2, GY - 210, 66, '#3a7a3a');
  circle(g, E.W * 0.2 - 48, GY - 168, 46, '#4a8a4a');
  circle(g, E.W * 0.2 + 48, GY - 168, 46, '#2a6a2a');
  dust(g, t, { count: 16, seed: 29 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

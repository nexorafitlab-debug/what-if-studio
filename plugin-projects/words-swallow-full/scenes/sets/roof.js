// scenes/sets/roof.js — the school roof at sunset (fresh).
// Rooftop with a railing, a water tower, the skyline, a huge sunset sun.
// Eli stands here alone with his notebook, carrying the words.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, poly, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, skyline, clouds } from '/engine/fx2d.js';

export function roofSet(g, t, info, params = {}) {
  const m = mood('golden');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#f7a86a', '#d85a6a', '#3a2a4a'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.50, E.H * 0.34, 70, '#fff3d0', '#ff9a5a', 5);
  clouds(g, { seed: 61, count: 5, y: E.H * 0.12, h: 90, color: '#ffd9a0', a: 0.3 });
  skyline(g, { seed: 12, y: E.H * 0.62 });
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#2a2233');
  // rooftop railing
  seg(g, [[-E.W, GY - 120], [E.W * 2, GY - 120]], 6, '#1a1622');
  for (let x = 0; x < E.W; x += 110) seg(g, [[x, GY - 120], [x, GY - 10]], 5, '#1a1622');
  // water tower (left)
  rr(g, E.W * 0.08, E.H * 0.30, 140, 160, 10); g.fillStyle = '#3a2a44'; g.fill();
  seg(g, [[E.W * 0.10, E.H * 0.46], [E.W * 0.10, GY - 10]], 8, '#241b2e');
  seg(g, [[E.W * 0.20, E.H * 0.46], [E.W * 0.20, GY - 10]], 8, '#241b2e');
  poly(g, [[E.W * 0.06, E.H * 0.30], [E.W * 0.15, E.H * 0.20], [E.W * 0.24, E.H * 0.30]], '#2a1e36');
  // vents + a pigeon
  rr(g, E.W * 0.78, GY - 80, 120, 80, 6); g.fillStyle = '#3a2a44'; g.fill();
  circle(g, E.W * 0.88, GY - 130, 14, '#5a5a6a');
  seg(g, [[E.W * 0.88, GY - 130], [E.W * 0.92, GY - 136]], 4, '#5a5a6a');
  dust(g, t, { count: 8, seed: 221 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m };
}

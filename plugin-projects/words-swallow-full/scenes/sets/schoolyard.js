// scenes/sets/schoolyard.js — schoolyard at golden hour (fresh for the full video).
// School facade behind, fence, trees, a bench, sun low. The gold-seed beat
// (the girl says sorry, her word turns gold) happens here.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, facade, tree, clouds } from '/engine/fx2d.js';

export function schoolYard(g, t, info, params = {}) {
  const m = mood('golden');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#f7b06a', '#e07a5a', '#5a3a5a'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.82, E.H * 0.18, 44, '#fff3d0', '#ffcf8a', 4);
  clouds(g, { seed: 7, count: 4, y: E.H * 0.10, h: 80, color: '#ffffff', a: 0.25 });
  // school facade (back)
  facade(g, { x: E.W * 0.08, y: E.H * 0.55, w: E.W * 0.84, h: E.H * 0.42, color: '#4a3550', win: '#ffcf8a', lit: 0.5, cols: 8, rows: 2, door: true });
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#3a2a3a');
  // yard fence
  seg(g, [[-E.W, GY - 60], [E.W * 2, GY - 60]], 5, '#241b2e');
  for (let x = 0; x < E.W; x += 90) seg(g, [[x, GY - 120], [x, GY - 20]], 5, '#241b2e');
  tree(g, E.W * 0.10, GY, 1.2, '#241b26');
  tree(g, E.W * 0.92, GY, 1.0, '#241b26');
  // bench
  rr(g, E.W * 0.68, GY - 90, 220, 16, 6); g.fillStyle = '#5a3a26'; g.fill();
  seg(g, [[E.W * 0.70, GY - 90], [E.W * 0.70, GY]], 6, '#3a2a1a');
  seg(g, [[E.W * 0.88, GY - 90], [E.W * 0.88, GY]], 6, '#3a2a1a');
  // path stones
  for (let i = 0; i < 6; i++) { circle(g, E.W * (0.30 + i * 0.08), GY + 40 + (i % 2) * 14, 18, 'rgba(255,255,255,0.10)'); }
  dust(g, t, { count: 10, seed: 33 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m };
}

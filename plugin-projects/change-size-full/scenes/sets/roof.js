// scenes/sets/roof.js — the school roof at sunset. Fresh set:
// parapet wall, a water tower, skyline, the treehouse in a distant tree,
// orange sunset sky. Milo teaches the secret knock here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, sun, skyline, tree } from '/engine/fx2d.js';

export function roof(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, ['#e8a06a', '#c96a5a', '#7a4a6a'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.72, E.H * 0.30, 54, '#fff6e0', '#ffd59a', 5);
  skyline(g, { seed: 117, y: GY, h: 200, color: '#5a3a52', lit: 0.5 });
  // the treehouse tree (far left, small)
  tree(g, E.W * 0.10, GY, 1.1, '#3a2a44');
  rr(g, E.W * 0.06, GY - 210, 110, 80, 6); g.fillStyle = '#6a4a2a'; g.fill();
  // roof floor + parapet
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#3a2a38');
  fillRect(g, -E.W, GY - 46, E.W * 3, 46, '#4a3644');
  // water tower (right)
  seg(g, [[E.W * 0.88, GY], [E.W * 0.88, GY - 260]], 10, '#2a2230');
  seg(g, [[E.W * 0.96, GY], [E.W * 0.96, GY - 260]], 10, '#2a2230');
  circle(g, E.W * 0.92, GY - 300, 70, '#5a4a5a');
  rr(g, E.W * 0.85, GY - 380, 140, 30, 8); g.fillStyle = '#4a3a4a'; g.fill();
  // a vent + a pigeon
  rr(g, E.W * 0.60, GY - 90, 120, 90, 8); g.fillStyle = '#2a2230'; g.fill();
  circle(g, E.W * 0.20, GY - 60, 16, '#8a8a9a');
  dust(g, t, { count: 10, seed: 119 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

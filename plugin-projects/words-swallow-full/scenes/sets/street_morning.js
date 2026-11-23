// scenes/sets/street_morning.js — the morning walk to school (fresh).
// Houses with lit windows, trees, a sidewalk, the school gate ahead in the
// distance, morning sun and clouds. Eli walks here wondering what Mom is sorry for.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, facade, tree, clouds, lampPost } from '/engine/fx2d.js';

export function streetMorning(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#f7c98a', '#e08a5a', '#6a4a6a'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.78, E.H * 0.16, 42, '#fff3d0', '#ffcf8a', 4);
  clouds(g, { seed: 41, count: 5, y: E.H * 0.08, h: 80, color: '#ffffff', a: 0.25 });
  facade(g, { x: E.W * 0.04, y: E.H * 0.52, w: 420, h: E.H * 0.36, color: '#4a3550', win: '#ffcf8a', lit: 0.4, cols: 3, rows: 2 });
  facade(g, { x: E.W * 0.30, y: E.H * 0.55, w: 360, h: E.H * 0.33, color: '#3a2a44', win: '#ffcf8a', lit: 0.3, cols: 3, rows: 2 });
  // school gate ahead (far right)
  rr(g, E.W * 0.86, E.H * 0.42, 180, 220, 6); g.fillStyle = '#2a2238'; g.fill();
  text(g, 'SCHOOL', E.W * 0.86 + 90, E.H * 0.42 + 40, { size: 26, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  seg(g, [[E.W * 0.86, E.H * 0.42 + 60], [E.W * 0.86 + 180, E.H * 0.42 + 60]], 4, '#ffd76a');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#3a2a3a');
  fillRect(g, -E.W, GY - 40, E.W * 3, 40, '#5a4a3a');
  tree(g, E.W * 0.62, GY - 40, 1.1, '#241b26');
  tree(g, E.W * 0.12, GY - 40, 0.9, '#241b26');
  lampPost(g, E.W * 0.48, GY - 40, 280, { on: false });
  dust(g, t, { count: 10, seed: 141 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m };
}

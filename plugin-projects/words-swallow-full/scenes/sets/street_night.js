// scenes/sets/street_night.js — the walk home at night (fresh).
// Dark street, lamp posts with pools of warm light, moon, dark house
// windows, a cat on a wall. Eli carries his notebook home.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, facade, tree, lampPost, moon } from '/engine/fx2d.js';

export function streetNight(g, t, info, params = {}) {
  const m = mood('midnight');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#161c30', '#080a14'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  moon(g, E.W * 0.80, E.H * 0.12, 38, '#e8ecff');
  for (let i = 0; i < 20; i++) circle(g, (i * 97) % E.W, (i * 41) % (E.H * 0.4), 2, 'rgba(255,255,255,0.7)');
  facade(g, { x: E.W * 0.04, y: E.H * 0.52, w: 420, h: E.H * 0.36, color: '#1e1a2a', win: '#ffcf8a', lit: 0.25, cols: 3, rows: 2 });
  facade(g, { x: E.W * 0.56, y: E.H * 0.55, w: 380, h: E.H * 0.33, color: '#181424', win: '#ffcf8a', lit: 0.2, cols: 3, rows: 2 });
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#141118');
  fillRect(g, -E.W, GY - 40, E.W * 3, 40, '#241d28');
  lampPost(g, E.W * 0.30, GY - 40, 300, { on: true });
  lampPost(g, E.W * 0.70, GY - 40, 300, { on: true });
  tree(g, E.W * 0.90, GY - 40, 1.0, '#0e0c14');
  // a cat sitting on the low wall
  rr(g, E.W * 0.44, GY - 110, 120, 70, 10); g.fillStyle = '#1c1626'; g.fill();
  circle(g, E.W * 0.47, GY - 150, 20, '#1c1626');
  circle(g, E.W * 0.465, GY - 152, 3, '#ffd76a'); circle(g, E.W * 0.48, GY - 152, 3, '#ffd76a');
  dust(g, t, { count: 6, seed: 151 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

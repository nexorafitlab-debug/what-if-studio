// scenes/sets/crowd.js — outside the school, the whole school waiting. Fresh set:
// school steps, the front doors, a crowd of students on the steps, trees,
// morning sky. The contract tear happens here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, facade, crowd, clouds, tree } from '/engine/fx2d.js';

export function crowdSet(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#bfe0ff', '#8fc4ef'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  clouds(g, { seed: 123, count: 4, y: E.H * 0.08, h: 80, color: '#ffffff', a: 0.35 });
  // the school front (behind the steps)
  facade(g, { x: E.W * 0.10, y: GY - 120, w: E.W * 0.80, h: 560, color: '#5a3a44', win: '#ffcf8a', lit: 0.5, cols: 6, rows: 3, seed: 124, door: true });
  text(g, 'SCHOOL', E.W * 0.5, GY - 560, { size: 54, color: '#f2ead8', font: FONTS.ui, weight: 900 });
  // steps
  for (let i = 0; i < 4; i++) fillRect(g, E.W * (0.18 + i * 0.02), GY - 120 + i * 30, E.W * (0.64 - i * 0.04), 30, '#6a5a6a');
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#8a8a92');
  // trees at the sides
  tree(g, E.W * 0.06, GY, 1.3, '#2a4a3a');
  tree(g, E.W * 0.94, GY, 1.2, '#2a4a3a');
  // the crowd on the steps
  crowd(g, t, { x: E.W * 0.16, y: GY - 110, w: E.W * 0.68, rows: 3, rowH: 60, size: 1.4, colors: ['#e07856', '#4a9a6a', '#5a7ac9', '#c9a44a', '#7a5ac9', '#3a8a7a', '#c95a6a'], cheer: params.cheer || 0 });
  dust(g, t, { count: 10, seed: 125 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m };
}

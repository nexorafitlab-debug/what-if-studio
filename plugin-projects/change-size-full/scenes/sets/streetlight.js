// scenes/sets/streetlight.js — a quiet street at dusk with ONE tall streetlight.
// Fresh set: houses, a builder's van, the tall lamp post (the light Noah
// changes with no ladder), evening sky.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, lampPost, facade, floorLines, stars } from '/engine/fx2d.js';

export function streetlight(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { count: 60, seed: 99, area: [0, 0, E.W, E.H * 0.4] });
  facade(g, { x: -E.W * 0.08, y: GY, w: 620, h: 420, color: '#3a2a44', win: '#ffcf8a', lit: 0.7, cols: 3, rows: 2, seed: 101 });
  facade(g, { x: E.W * 0.62, y: GY, w: 700, h: 460, color: '#2a3444', win: '#ffcf8a', lit: 0.5, cols: 3, rows: 2, seed: 102 });
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#2a2530');
  floorLines(g, GY + 6, E.H);
  // the TALL streetlight (centre-left) — its lamp glows
  lampPost(g, E.W * 0.30, GY, 480, {});
  // builder's van (right)
  rr(g, E.W * 0.66, GY - 150, 380, 150, 10); g.fillStyle = '#c9a44a'; g.fill();
  rr(g, E.W * 0.98, GY - 120, 120, 120, 10); g.fillStyle = '#8a6a3a'; g.fill();
  rr(g, E.W * 1.00, GY - 106, 70, 50, 4); g.fillStyle = '#9fd8ff'; g.fill();
  circle(g, E.W * 0.72, GY, 30, '#1a1622'); circle(g, E.W * 1.02, GY, 30, '#1a1622');
  text(g, 'FIX-IT', E.W * 0.85, GY - 70, { size: 40, color: '#3a2a1e', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 10, seed: 103 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m, lamp: { x: E.W * 0.30, y: GY - 480 } };
}

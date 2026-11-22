// scenes/sets/bedroom_dawn.js — Kian's bedroom at dawn. Ceiling fan overhead (spins; wobbles on demand).
import { E, V, mood, layer, backdrop, linGrad, alpha, veil, circle, rr, fillRect, poly, seg, text, FONTS, shake } from '/engine/core.js';
import { sun, stars, dust, windowFrame, bed, clock, floorLines, skyline } from '/engine/fx2d.js';
import { fanBlade } from '../_helpers.js';

export function bedroomDawn(g, t, info, params = {}) {
  const m = mood('golden');
  const GY = E.H * 0.8, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // dawn sun low through the window glow
  sun(g, E.W * 0.78, E.H * 0.2, 40, '#ffe9c0', '#ffb36a', 5);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // window with dawn sky + sleepy skyline
  layer(g, { z: 1.0, x: 0, y: 0 }, 0.9, (gg) => {
    windowFrame(gg, { x: E.W * 0.1, y: E.H * 0.14, w: 400, h: 330, mullions: [0.5, 0.5] }, (gg2) => {
      gg2.fillStyle = linGrad(gg2, 0, 0, 0, 330, ['#ffd9a0', '#ff9e6e', '#e8956b']);
      gg2.fillRect(0, 0, 400, 330);
      skyline(gg2, { seed: 31, y: 330, h: 110, color: '#7a4a5e', lit: 0.5 });
    });
  });
  // wall clock (early morning)
  clock(g, E.W * 0.87, E.H * 0.28, 50, 6.4 * 3600 + t * 60, {});
  // rug
  rr(g, CX - 400, GY + 60, 800, 120, 56); g.fillStyle = alpha(m.key, 0.13); g.fill();
  // bed (left-center)
  bed(g, { x: E.W * 0.26, y: GY + 40, w: 620, color: '#5a5aa0', frame: '#241a30', pillow: '#f2ead8' });
  // poster on the wall
  rr(g, E.W * 0.6, E.H * 0.16, 150, 190, 8); g.fillStyle = '#2e6ff0'; g.fill();
  text(g, '★', E.W * 0.6 + 75, E.H * 0.16 + 105, { size: 90, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  // bedside lamp (right)
  seg(g, [[E.W * 0.84, GY + 40], [E.W * 0.84, GY - 130]], 6, '#241a30');
  circle(g, E.W * 0.84, GY - 160, 32, '#ffcf8a');
  // ---- ceiling fan (the star of this set) ----
  const hubX = E.W * 0.44, hubY = 120;
  const wob = params.wobble ? shake(t, params.wobble, 6, 7) : [0, 0];
  const speed = params.fanSpeed ?? 2.2;
  const ang = t * speed + (params.wobble ? Math.sin(t * 9) * 0.12 * Math.sin(t * 2.2) : 0);
  seg(g, [[hubX + wob[0], 0], [hubX + wob[0], hubY + wob[1]]], 8, '#241a30');
  for (let k = 0; k < 3; k++) fanBlade(g, hubX + wob[0], hubY + wob[1], ang + (k * Math.PI * 2) / 3, 200, 26, '#3a2a36');
  circle(g, hubX + wob[0], hubY + wob[1], 22, '#241a30');
  circle(g, hubX + wob[0], hubY + wob[1], 10, '#ffd59a');
  dust(g, t, { count: 22, seed: 14 });
  veil(g, '#000', 0.08);
  return { GY, CX, M: m, fan: { x: hubX, y: hubY } };
}

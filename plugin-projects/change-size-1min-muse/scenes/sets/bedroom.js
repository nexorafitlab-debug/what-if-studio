// scenes/sets/bedroom.js — Noah's bedroom at dawn. Fresh set for this video:
// bed on the LEFT, HIGH SHELF on the right wall (the top shelf Noah grows to
// reach), alarm clock on the bedside table, window with pale dawn sky.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { sun, dust, windowFrame, bed, clock, floorLines, skyline } from '/engine/fx2d.js';

export function bedroom(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.8, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.82, E.H * 0.16, 34, '#fff6e0', '#ffd59a', 5);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  windowFrame(g, { x: E.W * 0.68, y: E.H * 0.13, w: 400, h: 320, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 320, ['#ffe9c0', '#f2b88a', '#c98a6a']);
    gg2.fillRect(0, 0, 400, 320);
    skyline(gg2, { seed: 53, y: 320, h: 90, color: '#6a4a5a', lit: 0.35 });
  });
  // HIGH SHELF on the right wall — a book + a small trophy sit on it
  rr(g, E.W * 0.52, 150, 420, 18, 5); g.fillStyle = '#5a3a2a'; g.fill();
  seg(g, [[E.W * 0.56, 168], [E.W * 0.56, 220]], 8, '#3a2418');
  seg(g, [[E.W * 0.88, 168], [E.W * 0.88, 220]], 8, '#3a2418');
  rr(g, E.W * 0.60, 96, 34, 54, 3); g.fillStyle = '#e07856'; g.fill();
  rr(g, E.W * 0.66, 100, 30, 50, 3); g.fillStyle = '#ffd76a'; g.fill();
  circle(g, E.W * 0.82, 118, 16, '#ffd76a'); rr(g, E.W * 0.80, 132, 34, 10, 3); g.fillStyle = '#ffd76a'; g.fill();
  // wall clock (dawn, 6:59)
  clock(g, E.W * 0.46, E.H * 0.3, 46, 6.98 * 3600 + t * 60, {});
  // rug
  rr(g, CX - 380, GY + 56, 760, 110, 52); g.fillStyle = alpha(m.key, 0.13); g.fill();
  // bed (left)
  bed(g, { x: E.W * 0.06, y: GY + 40, w: 560, color: '#0E7490', frame: '#241a30', pillow: '#f2ead8' });
  // bedside table + alarm clock
  rr(g, E.W * 0.44, GY - 40, 130, 80, 6); g.fillStyle = '#3a2a1e'; g.fill();
  circle(g, E.W * 0.44 + 65, GY - 62, 22, '#e04a3a'); circle(g, E.W * 0.44 + 65, GY - 62, 16, '#f2ead8');
  seg(g, [[E.W * 0.44 + 65, GY - 62], [E.W * 0.44 + 65, GY - 74]], 3, '#1a1622');
  seg(g, [[E.W * 0.44 + 65, GY - 62], [E.W * 0.44 + 74, GY - 58]], 3, '#1a1622');
  // poster on the wall
  rr(g, E.W * 0.30, 150, 190, 260, 8); g.fillStyle = '#1a2a4a'; g.fill();
  text(g, 'SPACE', E.W * 0.30 + 95, 300, { size: 44, color: '#9fd8ff', font: FONTS.ui, weight: 900 });
  circle(g, E.W * 0.30 + 95, 230, 26, '#ffd76a');
  dust(g, t, { count: 18, seed: 23 });
  veil(g, '#000', 0.07);
  return { GY, CX, M: m };
}

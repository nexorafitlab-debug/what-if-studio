// scenes/sets/bus_stop.js — bus stop at dusk: shelter, bench, road, streetlamp,
// houses across the street, orange sky. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, poly, text, FONTS } from '/engine/core.js';
import { sun, dust, stars } from '/engine/fx2d.js';

export function busStop(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, ['#2a1a3a', '#e07856', '#f2a65a'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.2, E.H * 0.22, 46, '#fff2d8', '#ffb347', 6);
  stars(g, t, { count: 40, seed: 7, area: [0, 0, E.W, E.H * 0.3] });
  // houses across the street
  for (let i = 0; i < 3; i++) {
    const x = E.W * 0.55 + i * E.W * 0.15;
    fillRect(g, x, GY - 240, 150, 240, '#3a2a3e');
    poly(g, [[x - 12, GY - 240], [x + 75, GY - 320], [x + 162, GY - 240]], '#241a2a');
    rr(g, x + 30, GY - 180, 40, 60, 4); g.fillStyle = '#ffd76a'; g.fill();
    rr(g, x + 90, GY - 180, 40, 60, 4); g.fillStyle = '#2a3648'; g.fill();
  }
  // road
  fillRect(g, -E.W, GY - 60, E.W * 3, 130, '#2a2a32');
  g.strokeStyle = '#ffd76a'; g.lineWidth = 6;
  for (let x = 0; x < E.W * 2; x += 160) { seg(g, [[x, GY + 5], [x + 80, GY + 5]], 6, '#ffd76a'); }
  // sidewalk + shelter (left)
  fillRect(g, -E.W, GY + 70, E.W * 3, E.H - GY - 70, '#7a7a82');
  seg(g, [[E.W * 0.06, GY + 70], [E.W * 0.06, GY - 190]], 8, '#4a4a52');
  seg(g, [[E.W * 0.3, GY + 70], [E.W * 0.3, GY - 190]], 8, '#4a4a52');
  rr(g, E.W * 0.02, GY - 220, E.W * 0.32, 34, 8); g.fillStyle = '#3a6a8a'; g.fill();
  text(g, 'BUS STOP', E.W * 0.18, GY - 236, { size: 26, color: '#fff', font: FONTS.ui, weight: 900 });
  // bench under the shelter
  rr(g, E.W * 0.08, GY - 40, 220, 16, 6); g.fillStyle = '#5a3a2a'; g.fill();
  seg(g, [[E.W * 0.1, GY - 24], [E.W * 0.1, GY + 70]], 8, '#3a2418');
  seg(g, [[E.W * 0.28, GY - 24], [E.W * 0.28, GY + 70]], 8, '#3a2418');
  // streetlamp (right)
  seg(g, [[E.W * 0.88, GY + 70], [E.W * 0.88, GY - 260]], 8, '#2a2a32');
  circle(g, E.W * 0.88, GY - 272, 20, '#ffe9a8');
  circle(g, E.W * 0.88, GY - 272, 46, 'rgba(255,233,168,0.18)');
  dust(g, t, { count: 12, seed: 55 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

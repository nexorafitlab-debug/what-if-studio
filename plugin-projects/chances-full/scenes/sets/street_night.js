// scenes/sets/street_night.js — quiet street at night: houses with lit windows,
// lamps, moon, stars, Kian walking home alone. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg } from '/engine/core.js';
import { stars, dust } from '/engine/fx2d.js';

export function streetNight(g, t, info, params = {}) {
  const m = mood('midnight');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, ['#060a18', '#0d1526'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { count: 90, seed: 19, area: [0, 0, E.W, E.H * 0.5] });
  circle(g, E.W * 0.82, E.H * 0.13, 36, '#f2ead8');
  circle(g, E.W * 0.82, E.H * 0.13, 60, 'rgba(242,234,216,0.12)');
  // houses, some windows lit
  for (let i = 0; i < 4; i++) {
    const x = E.W * 0.04 + i * E.W * 0.24;
    fillRect(g, x, GY - 260, 190, 260, '#1a2233');
    rr(g, x + 26, GY - 200, 54, 70, 4); g.fillStyle = i % 2 ? '#ffd76a' : '#2a3648'; g.fill();
    rr(g, x + 110, GY - 200, 54, 70, 4); g.fillStyle = i % 3 ? '#2a3648' : '#ffd76a'; g.fill();
  }
  // sidewalk + road
  fillRect(g, -E.W, GY, E.W * 3, 46, '#3a3a44');
  fillRect(g, -E.W, GY + 46, E.W * 3, E.H - GY - 46, '#1e1e26');
  g.strokeStyle = 'rgba(255,215,106,0.5)'; g.lineWidth = 4;
  for (let x = 0; x < E.W * 2; x += 180) { seg(g, [[x, GY + 110], [x + 90, GY + 110]], 4, 'rgba(255,215,106,0.5)'); }
  // lamps
  for (const lx of [E.W * 0.2, E.W * 0.62]) {
    seg(g, [[lx, GY], [lx, GY - 230]], 7, '#2a2a32');
    circle(g, lx, GY - 240, 16, '#ffe9a8');
    circle(g, lx, GY - 240, 40, 'rgba(255,233,168,0.15)');
  }
  dust(g, t, { count: 8, seed: 79 });
  veil(g, '#000', 0.08);
  return { GY, CX, M: m };
}

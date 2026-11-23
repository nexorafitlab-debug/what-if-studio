// scenes/sets/school_hallway.js — school hallway with lockers.
// Fresh drawing for the words-swallow video (NOT copied from Change Size).
// Blue-grey lockers down the LEFT wall, classroom doors on the RIGHT,
// ceiling lights, floor shine. Eli walks here thinking about the six days.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, floorLines } from '/engine/fx2d.js';

export function schoolHallway(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#2a2f42');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#191d2a');
  floorLines(g, GY + 6, E.H);
  // floor shine — a long light streak down the middle
  g.fillStyle = linGrad(g, 0, GY, 0, E.H, ['rgba(207,224,255,0.14)', 'rgba(207,224,255,0.02)']);
  g.fillRect(E.W * 0.42, GY, E.W * 0.16, E.H - GY);
  // lockers (left wall): two rows of blue-grey doors with vents + handles
  for (let i = 0; i < 6; i++) {
    const x = E.W * 0.03 + i * 150;
    rr(g, x, E.H * 0.16, 132, 560, 6); g.fillStyle = i % 2 ? '#3a4a6a' : '#42527a'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 3; g.stroke();
    for (let v = 0; v < 3; v++) seg(g, [[x + 20, E.H * 0.22 + v * 14], [x + 60, E.H * 0.22 + v * 14]], 3, 'rgba(0,0,0,0.3)');
    seg(g, [[x + 100, E.H * 0.42], [x + 100, E.H * 0.47]], 5, '#c9a44a');
    circle(g, x + 66, E.H * 0.62, 9, i === 2 ? '#c94a3a' : '#8a93a8');
  }
  // classroom doors (right wall) with small windows + room numbers
  for (let i = 0; i < 2; i++) {
    const x = E.W * (0.76 + i * 0.13);
    rr(g, x, E.H * 0.20, 150, 520, 6); g.fillStyle = '#4a3626'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.4)'; g.lineWidth = 3; g.stroke();
    rr(g, x + 30, E.H * 0.26, 90, 130, 4); g.fillStyle = '#9fc8ef'; g.fill();
    text(g, i === 0 ? '2B' : '2C', x + 75, E.H * 0.52, { size: 34, color: '#f2ead8', font: FONTS.ui, weight: 900 });
    circle(g, x + 122, E.H * 0.55, 8, '#c9a44a');
  }
  // poster on the back wall: "SPEAK UP" (ironic — nobody does)
  rr(g, E.W * 0.44, E.H * 0.14, 300, 190, 8); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'SPEAK UP', E.W * 0.44 + 150, E.H * 0.14 + 78, { size: 40, color: '#2a2f42', font: FONTS.ui, weight: 900 });
  text(g, 'kind words matter', E.W * 0.44 + 150, E.H * 0.14 + 132, { size: 26, color: '#c94a3a', font: FONTS.ui, weight: 700 });
  // ceiling lights
  for (const lx of [E.W * 0.30, E.W * 0.55, E.W * 0.80]) {
    rr(g, lx - 90, E.H * 0.03, 180, 26, 12); g.fillStyle = '#e8ecff'; g.fill();
    glow(g, lx, E.H * 0.06, 130, '#cfe0ff', 0.25);
  }
  dust(g, t, { count: 8, seed: 77 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m };
}

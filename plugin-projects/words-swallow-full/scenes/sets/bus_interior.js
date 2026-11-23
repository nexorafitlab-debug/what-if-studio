// scenes/sets/bus_interior.js — inside the bus (fresh for the full video).
// Windows down the left with the road sliding past, seat rows, poles,
// driver area at the front. The bus couple sits here; the "GOODBYE." sting
// happens here on the way home.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function busInterior(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#1e2430', '#0e1118'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#232a36');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#141019');
  // windows (left wall) — the road slides past outside
  for (let i = 0; i < 4; i++) {
    const x = E.W * 0.06 + i * 230;
    rr(g, x, E.H * 0.12, 190, 220, 8); g.fillStyle = '#2a3442'; g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.2)'; g.lineWidth = 4; g.stroke();
    const off = (t * 260 + i * 190) % 420;
    g.fillStyle = '#7a8a9a';
    g.fillRect(x + 10, E.H * 0.12 + 150, 40, 12);
    g.fillStyle = '#4a9a6a';
    g.fillRect(x + 10 + ((off + 200) % 380), E.H * 0.12 + 60, 60, 40);
    g.fillStyle = '#8a7a5a';
    g.fillRect(x + 10 + ((off + 90) % 380), E.H * 0.12 + 120, 50, 60);
  }
  // seat rows (backs) across the bottom
  for (let i = 0; i < 5; i++) {
    const x = E.W * 0.05 + i * 360;
    rr(g, x, GY - 130, 300, 130, 10); g.fillStyle = '#3a4a6a'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    rr(g, x + 20, GY - 160, 260, 34, 8); g.fillStyle = '#4a5a7a'; g.fill();
  }
  // poles
  seg(g, [[E.W * 0.52, E.H * 0.10], [E.W * 0.52, GY]], 8, '#8a8a9a');
  seg(g, [[E.W * 0.52, E.H * 0.10], [E.W * 0.62, E.H * 0.10]], 8, '#8a8a9a');
  // driver area (front right): wheel + mirror
  circle(g, E.W * 0.90, GY - 200, 34, '#1a1622');
  g.strokeStyle = '#8a8a9a'; g.lineWidth = 6; g.beginPath(); g.arc(E.W * 0.90, GY - 200, 34, 0, Math.PI * 2); g.stroke();
  rr(g, E.W * 0.86, E.H * 0.12, 110, 60, 6); g.fillStyle = '#2a3442'; g.fill();
  // hanging strap handles
  for (let i = 0; i < 4; i++) {
    const x = E.W * (0.55 + i * 0.08);
    seg(g, [[x, E.H * 0.10], [x, E.H * 0.10 + 46]], 4, '#8a8a9a');
    circle(g, x, E.H * 0.10 + 58, 12, '#c94a3a');
  }
  // stop button + sign
  rr(g, E.W * 0.66, E.H * 0.42, 150, 44, 8); g.fillStyle = '#c94a3a'; g.fill();
  text(g, 'STOP', E.W * 0.66 + 75, E.H * 0.42 + 31, { size: 26, color: '#fff6e0', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 8, seed: 55 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

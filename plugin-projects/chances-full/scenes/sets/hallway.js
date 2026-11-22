// scenes/sets/hallway.js — school hallway: lockers both sides, tiled floor,
// EXIT sign, classroom doors, strip lights. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function hallway(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // walls + lockers
  fillRect(g, -E.W, 0, E.W * 3, GY, '#5a6a7a');
  for (let i = 0; i < 8; i++) {
    const x = E.W * 0.03 + i * E.W * 0.12;
    rr(g, x, 170, 120, 300, 4); g.fillStyle = i % 2 ? '#4a7a5a' : '#3a6a8a'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    seg(g, [[x + 100, 300], [x + 100, 330]], 5, '#d8d8e0');
  }
  // classroom doors (far end, centre)
  rr(g, CX - 130, GY - 320, 120, 320, 6); g.fillStyle = '#3a2a1e'; g.fill();
  rr(g, CX + 10, GY - 320, 120, 320, 6); g.fillStyle = '#3a2a1e'; g.fill();
  circle(g, CX - 24, GY - 160, 8, '#ffd59a'); circle(g, CX + 24, GY - 160, 8, '#ffd59a');
  // EXIT sign above the doors
  rr(g, CX - 70, GY - 390, 140, 44, 6); g.fillStyle = '#c94a3a'; g.fill();
  text(g, 'EXIT', CX, GY - 360, { size: 28, color: '#fff', font: FONTS.ui, weight: 900 });
  // ceiling strip lights
  for (let i = 0; i < 3; i++) {
    rr(g, E.W * 0.2 + i * E.W * 0.3, 40, 180, 22, 10); g.fillStyle = '#f2f2e8'; g.fill();
  }
  // tiled floor
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#8a8a92');
  g.strokeStyle = 'rgba(0,0,0,0.2)'; g.lineWidth = 2;
  for (let x = -E.W; x < E.W * 2; x += 120) { g.beginPath(); g.moveTo(x, GY); g.lineTo(x - 50, E.H); g.stroke(); }
  seg(g, [[CX - 90, GY], [CX - 40, E.H]], 8, '#ffd76a');
  seg(g, [[CX + 90, GY], [CX + 40, E.H]], 8, '#ffd76a');
  dust(g, t, { count: 10, seed: 23 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

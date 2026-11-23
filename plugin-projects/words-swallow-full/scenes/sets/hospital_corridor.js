// scenes/sets/hospital_corridor.js — the hospital corridor (fresh).
// Long corridor in perspective, doors down both sides, a "312 ->" sign,
// ceiling lights, a nurses' station desk. Eli walks here to Room 312.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, poly, text, FONTS, glow } from '/engine/core.js';
import { dust, floorLines, door } from '/engine/fx2d.js';

export function hospitalCorridor(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#22303a', '#10161c'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  // perspective walls
  poly(g, [[0, 0], [E.W * 0.42, E.H * 0.30], [E.W * 0.42, E.H * 0.72], [0, E.H]], '#1a262c');
  poly(g, [[E.W, 0], [E.W * 0.58, E.H * 0.30], [E.W * 0.58, E.H * 0.72], [E.W, E.H]], '#1a262c');
  fillRect(g, E.W * 0.42, E.H * 0.30, E.W * 0.16, E.H * 0.42, '#2a3a44');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#141a20');
  floorLines(g, GY + 8, E.H);
  // ceiling lights
  for (let i = 0; i < 4; i++) {
    const y = E.H * (0.06 + i * 0.09), w = 200 - i * 30;
    rr(g, E.W / 2 - w / 2, y, w, 18, 8); g.fillStyle = '#fff3d0'; g.fill();
    glow(g, E.W / 2, y + 9, 120 - i * 18, '#fff3d0', 0.25);
  }
  // doors down the corridor
  door(g, { x: E.W * 0.08, y: GY - 40, w: 150, h: 300, color: '#3a4a5a' });
  door(g, { x: E.W * 0.30, y: GY - 60, w: 130, h: 260, color: '#3a4a5a' });
  door(g, { x: E.W * 0.78, y: GY - 40, w: 150, h: 300, color: '#3a4a5a' });
  door(g, { x: E.W * 0.60, y: GY - 60, w: 130, h: 260, color: '#3a4a5a' });
  // room-number signs
  text(g, '308', E.W * 0.155, GY - 360, { size: 26, color: '#cfe2ff', font: FONTS.ui, weight: 900 });
  text(g, '310', E.W * 0.845, GY - 360, { size: 26, color: '#cfe2ff', font: FONTS.ui, weight: 900 });
  // big 312 arrow sign (the destination)
  rr(g, E.W * 0.40, E.H * 0.10, 380, 90, 10); g.fillStyle = '#ffd76a'; g.fill();
  text(g, '312  →', E.W * 0.50, E.H * 0.10 + 62, { size: 52, color: '#1a1622', font: FONTS.ui, weight: 900 });
  // nurses' station desk (right)
  rr(g, E.W * 0.82, GY - 160, 260, 160, 8); g.fillStyle = '#2a3a44'; g.fill();
  rr(g, E.W * 0.84, GY - 200, 100, 40, 4); g.fillStyle = '#f2ead8'; g.fill();
  dust(g, t, { count: 6, seed: 121 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

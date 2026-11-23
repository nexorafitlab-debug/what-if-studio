// scenes/sets/hospital_parking.js — the hospital parking lot at night (fresh).
// Parked cars, painted bay lines, lamp posts with pools of light, the
// hospital facade with lit windows behind. Dad leans on his car here;
// Eli sprints across the lot; Dad runs back inside.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, facade, lampPost, moon } from '/engine/fx2d.js';

export function hospitalParking(g, t, info, params = {}) {
  const m = mood('midnight');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#1a2030', '#0a0d16'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  moon(g, E.W * 0.85, E.H * 0.12, 36, '#e8ecff');
  facade(g, { x: E.W * 0.05, y: E.H * 0.42, w: E.W * 0.90, h: E.H * 0.30, color: '#232a3a', win: '#ffe9b0', lit: 0.55, cols: 10, rows: 2 });
  text(g, 'GENERAL HOSPITAL', E.W * 0.50, E.H * 0.30, { size: 40, color: '#ffe9b0', font: FONTS.ui, weight: 900, spacing: 4 });
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#181a20');
  // bay lines
  g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 4;
  for (let i = 0; i < 8; i++) { const x = E.W * 0.06 + i * 220; g.beginPath(); g.moveTo(x, GY + 10); g.lineTo(x, GY + 130); g.stroke(); }
  seg(g, [[E.W * 0.04, GY + 130], [E.W * 0.96, GY + 130]], 4, 'rgba(255,255,255,0.25)');
  // parked cars (simple side profiles)
  const car = (x, col) => {
    rr(g, x, GY - 70, 200, 60, 14); g.fillStyle = col; g.fill();
    rr(g, x + 40, GY - 110, 110, 46, 12); g.fillStyle = col; g.fill();
    rr(g, x + 52, GY - 102, 86, 30, 6); g.fillStyle = '#9fd8ff'; g.fill();
    circle(g, x + 40, GY - 8, 18, '#1a1622'); circle(g, x + 160, GY - 8, 18, '#1a1622');
    circle(g, x + 40, GY - 8, 8, '#5a5a6a'); circle(g, x + 160, GY - 8, 8, '#5a5a6a');
  };
  car(E.W * 0.10, '#5a4a6a'); car(E.W * 0.36, '#3a5a7a'); car(E.W * 0.72, '#6a3a3a');
  lampPost(g, E.W * 0.30, GY, 320, { on: true });
  lampPost(g, E.W * 0.66, GY, 320, { on: true });
  dust(g, t, { count: 8, seed: 111 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

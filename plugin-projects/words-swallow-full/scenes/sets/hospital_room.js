// scenes/sets/hospital_room.js — Grandma Rose's hospital room, Room 312 (fresh).
// Bed with white sheets, monitors with a green glow, IV stand, a window with
// the night sky, a curtain, flowers on the sill. The gold payoff happens here.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, windowFrame, floorLines, bed, screen } from '/engine/fx2d.js';

export function hospitalRoom(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#1c2a30', '#0e1518'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#1a262c');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#10161a');
  floorLines(g, GY + 8, E.H);
  // window (right) with night sky
  windowFrame(g, { x: E.W * 0.74, y: E.H * 0.08, w: 380, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = '#0e1526'; gg2.fillRect(0, 0, 380, 300);
    for (let i = 0; i < 14; i++) circle(gg2, (i * 71) % 380, (i * 47) % 280, 2, 'rgba(255,255,255,0.8)');
    circle(gg2, 280, 80, 30, '#e8ecff');
  });
  // curtain (left of the window)
  fillRect(g, E.W * 0.68, 0, 60, E.H * 0.55, '#3a5a7a');
  // the bed (left-centre) — Grandma lies propped up here
  bed(g, { x: E.W * 0.08, y: GY, w: 560, color: '#5a7aa0', frame: '#2a2238', pillow: '#f2ead8' });
  rr(g, E.W * 0.08, GY - 96, 560, 40, 14); g.fillStyle = '#f2ead8'; g.fill();
  // monitor (above the bed) with a soft green glow
  screen(g, { x: E.W * 0.10, y: E.H * 0.30, w: 220, h: 130, glowC: '#7ee787', a: 0.2 }, (gg, sx, sy, w, h) => {
    gg.strokeStyle = '#7ee787'; gg.lineWidth = 4; gg.beginPath();
    gg.moveTo(sx, sy + h * 0.6);
    for (let x = 0; x <= w; x += 6) { const p = (x / w + t * 0.4) % 1; const y = p < 0.1 ? 0 : p < 0.14 ? -30 : p < 0.18 ? 26 : 0; gg.lineTo(sx + x, sy + h * 0.6 + y); }
    gg.stroke();
  });
  // IV stand beside the bed
  seg(g, [[E.W * 0.66, GY - 420], [E.W * 0.66, GY]], 6, '#8a8a9a');
  seg(g, [[E.W * 0.66, GY - 420], [E.W * 0.60, GY - 420]], 5, '#8a8a9a');
  rr(g, E.W * 0.585, GY - 420, 34, 70, 8); g.fillStyle = 'rgba(207,226,255,0.85)'; g.fill();
  seg(g, [[E.W * 0.60, GY - 350], [E.W * 0.60, GY - 120]], 3, 'rgba(207,226,255,0.5)');
  // flowers on the sill + get-well card
  circle(g, E.W * 0.80, E.H * 0.44, 16, '#d06a8a'); circle(g, E.W * 0.84, E.H * 0.46, 14, '#e8b23a'); circle(g, E.W * 0.76, E.H * 0.46, 14, '#c94a3a');
  rr(g, E.W * 0.76, E.H * 0.48, 70, 30, 4); g.fillStyle = '#4a5a3a'; g.fill();
  rr(g, E.W * 0.86, E.H * 0.40, 90, 60, 4); g.fillStyle = '#f2ead8'; g.fill();
  text(g, '312', E.W * 0.06, E.H * 0.10, { size: 40, color: '#9fb4d8', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 6, seed: 101 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

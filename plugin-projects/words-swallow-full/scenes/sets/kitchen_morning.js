// scenes/sets/kitchen_morning.js — morning kitchen, dawn light (fresh for the full video).
// Window on the RIGHT with dawn sky, fridge on the LEFT, big wooden table
// across the bottom. Mom stands behind the table (right), Eli sits (left).
// The toast plate is drawn by the SHOTS (it slides), not here.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, windowFrame, floorLines, clock } from '/engine/fx2d.js';

export function kitchenMorning(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#2e2438', '#15101f'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#271d31');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#191019');
  floorLines(g, GY + 8, E.H);
  // dawn window (right) — warm morning light pours in
  windowFrame(g, { x: E.W * 0.70, y: E.H * 0.10, w: 430, h: 330, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 330, ['#ffe0a8', '#f7a86a', '#c96a5a']);
    gg2.fillRect(0, 0, 430, 330);
    sun(gg2, 300, 240, 34, '#fff3d0', '#ffcf8a', 3);
  });
  glow(g, E.W * 0.80, E.H * 0.30, 320, '#ffcf8a', 0.20);
  // fridge (left) with magnets + a note
  rr(g, E.W * 0.04, GY - 560, 260, 560, 10); g.fillStyle = '#4a4450'; g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.14)'; g.lineWidth = 3; g.stroke();
  seg(g, [[E.W * 0.04, GY - 300], [E.W * 0.04 + 260, GY - 300]], 3, 'rgba(255,255,255,0.14)');
  circle(g, E.W * 0.08, GY - 430, 10, '#e8b23a'); circle(g, E.W * 0.12, GY - 400, 10, '#4a9a6a'); circle(g, E.W * 0.10, GY - 350, 10, '#c94a3a');
  rr(g, E.W * 0.065, GY - 250, 120, 90, 4); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'GAME', E.W * 0.065 + 60, GY - 218, { size: 22, color: '#241b2e', font: FONTS.ui, weight: 900 });
  text(g, 'TUE 6PM', E.W * 0.065 + 60, GY - 188, { size: 20, color: '#c94a3a', font: FONTS.ui, weight: 900 });
  // wall clock above the table
  clock(g, E.W * 0.48, E.H * 0.10, 34, 7.2 * 3600, { face: '#f2ead8', ink: '#241b2e' });
  // cereal boxes + fruit bowl on the back counter (centre)
  rr(g, E.W * 0.36, GY - 260, 90, 130, 6); g.fillStyle = '#c94a3a'; g.fill();
  rr(g, E.W * 0.42, GY - 240, 80, 110, 6); g.fillStyle = '#e8b23a'; g.fill();
  text(g, 'OATS', E.W * 0.405, GY - 190, { size: 26, color: '#fff6e0', font: FONTS.ui, weight: 900 });
  circle(g, E.W * 0.56, GY - 150, 46, '#3a2a3a');
  circle(g, E.W * 0.545, GY - 168, 16, '#e07856'); circle(g, E.W * 0.575, GY - 172, 15, '#e8b23a'); circle(g, E.W * 0.56, GY - 158, 14, '#4a9a6a');
  // big wooden table across the bottom (figures sit/stand behind it)
  rr(g, E.W * 0.14, GY - 150, E.W * 0.66, 46, 8); g.fillStyle = '#5a3a26'; g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 3; g.stroke();
  fillRect(g, E.W * 0.14, GY - 104, E.W * 0.66, 150, '#4a2e1e');
  seg(g, [[E.W * 0.14, GY - 104], [E.W * 0.80, GY - 104]], 4, 'rgba(0,0,0,0.4)');
  // mug with steam on the table
  rr(g, E.W * 0.46, GY - 196, 52, 46, 6); g.fillStyle = '#e8e4f4'; g.fill();
  const st = Math.sin(t * 2.2) * 3;
  seg(g, [[E.W * 0.475, GY - 200 + st * 0.3], [E.W * 0.472, GY - 232]], 3, 'rgba(255,255,255,0.35)');
  seg(g, [[E.W * 0.495, GY - 200 - st * 0.3], [E.W * 0.498, GY - 228]], 3, 'rgba(255,255,255,0.3)');
  dust(g, t, { count: 10, seed: 21 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m, tableY: GY - 150 };
}

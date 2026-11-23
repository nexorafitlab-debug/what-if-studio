// scenes/sets/kitchen_morning.js — morning kitchen, warm dawn light.
// Fresh drawing for the words-swallow video (NOT copied from Change Size).
// Window with dawn sky on the LEFT, fridge on the RIGHT, big wooden table
// across the bottom. Mom stands behind the table (right), Eli sits at the
// table (left). The toast plate is drawn by the SHOTS (it slides), not here.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, windowFrame, floorLines, clock } from '/engine/fx2d.js';

export function kitchenMorning(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#2b2138', '#14101e'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#241b2e');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#171019');
  floorLines(g, GY + 8, E.H);
  // dawn window (left) — warm morning light pours in
  windowFrame(g, { x: E.W * 0.05, y: E.H * 0.10, w: 420, h: 330, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 330, ['#ffd9a0', '#f7a86a', '#c96a5a']);
    gg2.fillRect(0, 0, 420, 330);
    sun(gg2, 300, 240, 34, '#fff3d0', '#ffcf8a', 3);
  });
  glow(g, E.W * 0.24, E.H * 0.30, 320, '#ffcf8a', 0.20);
  // wall clock above the window
  clock(g, E.W * 0.30, E.H * 0.10, 34, 7.2 * 3600, { face: '#f2ead8', ink: '#241b2e' });
  // cereal boxes + fruit bowl on the back counter (centre)
  rr(g, E.W * 0.42, GY - 260, 90, 130, 6); g.fillStyle = '#c94a3a'; g.fill();
  rr(g, E.W * 0.48, GY - 240, 80, 110, 6); g.fillStyle = '#e8b23a'; g.fill();
  text(g, 'OATS', E.W * 0.465, GY - 190, { size: 26, color: '#fff6e0', font: FONTS.ui, weight: 900 });
  circle(g, E.W * 0.60, GY - 150, 46, '#3a2a3a');
  circle(g, E.W * 0.585, GY - 168, 16, '#e07856'); circle(g, E.W * 0.615, GY - 172, 15, '#e8b23a'); circle(g, E.W * 0.60, GY - 158, 14, '#4a9a6a');
  // fridge (right) with magnets + a note
  rr(g, E.W * 0.82, GY - 560, 260, 560, 10); g.fillStyle = '#4a4450'; g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.14)'; g.lineWidth = 3; g.stroke();
  seg(g, [[E.W * 0.82, GY - 300], [E.W * 0.82 + 260, GY - 300]], 3, 'rgba(255,255,255,0.14)');
  circle(g, E.W * 0.86, GY - 430, 10, '#e8b23a'); circle(g, E.W * 0.90, GY - 400, 10, '#4a9a6a'); circle(g, E.W * 0.88, GY - 350, 10, '#c94a3a');
  rr(g, E.W * 0.845, GY - 250, 120, 90, 4); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'GAME', E.W * 0.845 + 60, GY - 218, { size: 22, color: '#241b2e', font: FONTS.ui, weight: 900 });
  text(g, 'TUE 6PM', E.W * 0.845 + 60, GY - 188, { size: 20, color: '#c94a3a', font: FONTS.ui, weight: 900 });
  // big wooden table across the bottom (figures sit/stand behind it)
  rr(g, E.W * 0.16, GY - 150, E.W * 0.62, 46, 8); g.fillStyle = '#5a3a26'; g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 3; g.stroke();
  fillRect(g, E.W * 0.16, GY - 104, E.W * 0.62, 150, '#4a2e1e');
  seg(g, [[E.W * 0.16, GY - 104], [E.W * 0.78, GY - 104]], 4, 'rgba(0,0,0,0.4)');
  // mug with steam on the table (left of centre)
  rr(g, E.W * 0.30, GY - 196, 52, 46, 6); g.fillStyle = '#e8e4f4'; g.fill();
  seg(g, [[E.W * 0.30 + 52, GY - 188], [E.W * 0.30 + 64, GY - 180], [E.W * 0.30 + 52, GY - 172]], 4, '#e8e4f4');
  const st = Math.sin(t * 2.2) * 3;
  seg(g, [[E.W * 0.315, GY - 200 + st * 0.3], [E.W * 0.312, GY - 232]], 3, 'rgba(255,255,255,0.35)');
  seg(g, [[E.W * 0.335, GY - 200 - st * 0.3], [E.W * 0.338, GY - 228]], 3, 'rgba(255,255,255,0.3)');
  dust(g, t, { count: 10, seed: 21 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m, tableY: GY - 150, tableX0: E.W * 0.16, tableX1: E.W * 0.78 };
}

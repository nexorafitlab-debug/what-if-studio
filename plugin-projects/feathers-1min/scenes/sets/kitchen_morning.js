// scenes/sets/kitchen_morning.js — Kai's kitchen, Monday morning.
// Fresh drawing for the feathers video (NOT copied from Words Swallow).
// Dawn window on the RIGHT, stove on the LEFT, big wooden table across the
// bottom, fridge with a "HOMEWORK DUE" note, Kai's backpack by the door.
// Mom stands behind the table (right), Kai sits/walks at the table (left).
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, windowFrame, floorLines, clock } from '/engine/fx2d.js';

export function kitchenMorning(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#2e2233', '#17101f'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#271c2c');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#191019');
  floorLines(g, GY + 8, E.H);
  // stove (left) with two pots
  rr(g, E.W * 0.02, GY - 300, 300, 300, 8); g.fillStyle = '#3a3a44'; g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.14)'; g.lineWidth = 3; g.stroke();
  circle(g, E.W * 0.06, GY - 300, 52, '#22222a'); circle(g, E.W * 0.13, GY - 300, 52, '#22222a');
  circle(g, E.W * 0.06, GY - 330, 40, '#4a4a56'); circle(g, E.W * 0.13, GY - 330, 40, '#4a4a56');
  // dawn window (right) — warm morning light pours in
  windowFrame(g, { x: E.W * 0.74, y: E.H * 0.10, w: 420, h: 330, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 330, ['#ffd9a0', '#f7a86a', '#c96a5a']);
    gg2.fillRect(0, 0, 420, 330);
    sun(gg2, 120, 240, 34, '#fff3d0', '#ffcf8a', 3);
  });
  glow(g, E.W * 0.78, E.H * 0.30, 320, '#ffcf8a', 0.20);
  // wall clock above the table — 7:15, Monday morning
  clock(g, E.W * 0.52, E.H * 0.09, 34, 7.25 * 3600, { face: '#f2ead8', ink: '#271c2c' });
  // fridge (centre-right) with magnets + the homework note
  rr(g, E.W * 0.58, GY - 560, 250, 560, 10); g.fillStyle = '#4a4450'; g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.14)'; g.lineWidth = 3; g.stroke();
  seg(g, [[E.W * 0.58, GY - 300], [E.W * 0.58 + 250, GY - 300]], 3, 'rgba(255,255,255,0.14)');
  circle(g, E.W * 0.62, GY - 430, 10, '#e8b23a'); circle(g, E.W * 0.66, GY - 400, 10, '#4a9a6a');
  rr(g, E.W * 0.60, GY - 250, 210, 110, 4); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'HOMEWORK', E.W * 0.60 + 105, GY - 212, { size: 24, color: '#271c2c', font: FONTS.ui, weight: 900 });
  text(g, 'DUE TODAY', E.W * 0.60 + 105, GY - 178, { size: 24, color: '#c94a3a', font: FONTS.ui, weight: 900 });
  // cereal boxes + fruit bowl on the back counter (left-centre)
  rr(g, E.W * 0.30, GY - 260, 90, 130, 6); g.fillStyle = '#800020'; g.fill();
  rr(g, E.W * 0.36, GY - 240, 80, 110, 6); g.fillStyle = '#e8b23a'; g.fill();
  text(g, 'OATS', E.W * 0.345, GY - 190, { size: 26, color: '#fff6e0', font: FONTS.ui, weight: 900 });
  circle(g, E.W * 0.47, GY - 150, 46, '#3a2a3a');
  circle(g, E.W * 0.455, GY - 168, 16, '#e07856'); circle(g, E.W * 0.485, GY - 172, 15, '#e8b23a'); circle(g, E.W * 0.47, GY - 158, 14, '#4a9a6a');
  // Kai's backpack by the door (far left, on the floor)
  rr(g, E.W * 0.03, GY - 120, 110, 120, 16); g.fillStyle = '#800020'; g.fill();
  rr(g, E.W * 0.055, GY - 90, 60, 50, 8); g.fillStyle = '#5c0016'; g.fill();
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
  dust(g, t, { count: 10, seed: 33 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m, tableY: GY - 150, tableX0: E.W * 0.16, tableX1: E.W * 0.78 };
}

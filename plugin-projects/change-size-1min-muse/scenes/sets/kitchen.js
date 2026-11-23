// scenes/sets/kitchen.js — the family kitchen, morning. Fresh set for this video:
// big FRIDGE on the LEFT with a dark gap underneath (Noah walks under it when
// tiny), stove + kettle on the right, table centre with a steaming mug, window.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { sun, dust, windowFrame, floorLines, skyline } from '/engine/fx2d.js';

export function kitchen(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // window (centre-right) with morning sky
  windowFrame(g, { x: E.W * 0.55, y: E.H * 0.12, w: 380, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 300, ['#bfe0ff', '#8fc4ef', '#6a9fd8']);
    gg2.fillRect(0, 0, 380, 300);
    skyline(gg2, { seed: 61, y: 300, h: 80, color: '#5a6a8a', lit: 0.4 });
  });
  sun(g, E.W * 0.68, E.H * 0.2, 30, '#fff6e0', '#ffd59a', 5);
  // FRIDGE (left) — tall, with a dark gap underneath and a magnet note
  const fx = E.W * 0.05, fw = 300, fh = GY - 60;
  rr(g, fx, GY - fh, fw, fh, 10); g.fillStyle = '#b8c4cc'; g.fill();
  g.strokeStyle = '#7a8a92'; g.lineWidth = 4; g.stroke();
  seg(g, [[fx, GY - fh + 190], [fx + fw, GY - fh + 190]], 4, '#7a8a92');
  rr(g, fx + fw - 40, GY - fh + 60, 16, 90, 6); g.fillStyle = '#5a6a7a'; g.fill();
  rr(g, fx + fw - 40, GY - fh + 250, 16, 90, 6); g.fillStyle = '#5a6a7a'; g.fill();
  rr(g, fx + 30, GY - fh + 60, 90, 70, 4); g.fillStyle = '#ffd76a'; g.fill();
  text(g, 'MILK!', fx + 75, GY - fh + 100, { size: 26, color: '#3a2a1e', font: FONTS.ui, weight: 900 });
  // dark gap under the fridge
  fillRect(g, fx, GY - 26, fw, 26, '#05060a');
  // stove + kettle (right)
  rr(g, E.W * 0.86, GY - 190, 220, 190, 8); g.fillStyle = '#2a2a33'; g.fill();
  circle(g, E.W * 0.88 + 40, GY - 140, 26, '#c94a3a'); circle(g, E.W * 0.88 + 130, GY - 140, 26, '#3a3a48');
  circle(g, E.W * 0.88 + 40, GY - 60, 26, '#3a3a48'); circle(g, E.W * 0.88 + 130, GY - 60, 26, '#3a3a48');
  circle(g, E.W * 0.93, GY - 240, 34, '#4a4a55'); // kettle
  seg(g, [[E.W * 0.93 + 30, GY - 250], [E.W * 0.93 + 52, GY - 262]], 6, '#4a4a55');
  // table (centre) with a steaming mug
  rr(g, E.W * 0.38, GY - 60, 420, 26, 8); g.fillStyle = '#6a4a2a'; g.fill();
  seg(g, [[E.W * 0.40, GY - 34], [E.W * 0.40, GY + 60]], 12, '#4a2a1a');
  seg(g, [[E.W * 0.72, GY - 34], [E.W * 0.72, GY + 60]], 12, '#4a2a1a');
  rr(g, E.W * 0.52, GY - 116, 64, 56, 8); g.fillStyle = '#e07856'; g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 5;
  const sway = Math.sin(t * 2) * 6;
  g.beginPath(); g.moveTo(E.W * 0.55 + sway, GY - 120); g.quadraticCurveTo(E.W * 0.55 + sway + 10, GY - 160, E.W * 0.55 + sway, GY - 190); g.stroke();
  // fruit bowl on the table
  circle(g, E.W * 0.66, GY - 76, 18, '#e04a3a'); circle(g, E.W * 0.70, GY - 72, 16, '#ffd76a'); circle(g, E.W * 0.62, GY - 72, 15, '#7ac74a');
  // wall clock
  text(g, '7:05', E.W * 0.5, 130, { size: 40, color: '#f2ead8', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 14, seed: 41 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m, fridge: { x: fx, w: fw, gapY: GY - 26 } };
}

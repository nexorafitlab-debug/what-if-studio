// scenes/sets/kitchen_evening.js — kitchen in the evening: table with two chairs,
// window with dusk sky, hanging lamp, fridge, kettle. Fresh set for this video.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg } from '/engine/core.js';
import { sun, dust, windowFrame, skyline } from '/engine/fx2d.js';

export function kitchenEvening(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  // dusk window (right) with low sun
  windowFrame(g, { x: E.W * 0.68, y: E.H * 0.12, w: 400, h: 330, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 330, ['#ff9e6e', '#e87a5a', '#7a4a6a']);
    gg2.fillRect(0, 0, 400, 330);
    skyline(gg2, { seed: 47, y: 330, h: 100, color: '#4a2a4a', lit: 0.7 });
  });
  sun(g, E.W * 0.86, E.H * 0.34, 26, '#ffe9c0', '#ffb36a', 4);
  // fridge (left)
  rr(g, 40, 180, 260, GY - 180, 10); g.fillStyle = '#8a9aa8'; g.fill();
  seg(g, [[40, 430], [300, 430]], 4, '#5a6a7a');
  rr(g, 60, 210, 90, 110, 6); g.fillStyle = '#ffd76a'; g.fill();
  rr(g, 170, 230, 70, 90, 6); g.fillStyle = '#f2e6c8'; g.fill();
  rr(g, 80, 470, 120, 80, 6); g.fillStyle = '#9fd8ff'; g.fill();
  // counter with kettle (centre-right, under the window)
  rr(g, E.W * 0.6, GY - 130, 480, 130, 8); g.fillStyle = '#5a4a3a'; g.fill();
  rr(g, E.W * 0.66, GY - 220, 90, 90, 10); g.fillStyle = '#2a2a33'; g.fill();
  seg(g, [[E.W * 0.66 + 90, GY - 200], [E.W * 0.66 + 130, GY - 180]], 8, '#2a2a33');
  // hanging lamp over the table
  seg(g, [[CX, 0], [CX, 150]], 6, '#241a30');
  circle(g, CX, 180, 40, '#ffcf8a');
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,207,138,0.12)';
  g.beginPath(); g.moveTo(CX - 40, 220); g.lineTo(CX + 40, 220); g.lineTo(CX + 260, GY); g.lineTo(CX - 260, GY); g.closePath(); g.fill(); g.restore();
  // table (centre) + two chairs
  rr(g, CX - 330, GY - 60, 660, 40, 10); g.fillStyle = '#6a4a2a'; g.fill();
  seg(g, [[CX - 280, GY - 20], [CX - 280, GY + 40]], 12, '#4a2a1a');
  seg(g, [[CX + 280, GY - 20], [CX + 280, GY + 40]], 12, '#4a2a1a');
  const chair = (x, dir) => {
    rr(g, x - 90, GY - 190, 180, 26, 8); g.fillStyle = '#3a2a1e'; g.fill();
    seg(g, [[x - 80, GY - 164], [x - 80, GY]], 10, '#3a2a1e');
    seg(g, [[x + 80, GY - 164], [x + 80, GY]], 10, '#3a2a1e');
  };
  chair(CX - 420, -1); chair(CX + 420, 1);
  // two mugs on the table
  rr(g, CX - 120, GY - 110, 56, 50, 8); g.fillStyle = '#e07856'; g.fill();
  rr(g, CX + 60, GY - 110, 56, 50, 8); g.fillStyle = '#4a9a6a'; g.fill();
  dust(g, t, { count: 14, seed: 43 });
  veil(g, '#000', 0.07);
  return { GY, CX, M: m };
}

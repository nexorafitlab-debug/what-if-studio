// scenes/sets/science.js — Galileo's study / science lab. Fresh set:
// a chalkboard with the square-cube diagram, a telescope, old books, a
// candle, a globe. The square-cube law is taught here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function science(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  // chalkboard (left-centre) with the square-cube diagram: 1 cube vs 10x cube
  rr(g, E.W * 0.05, 110, 700, 400, 8); g.fillStyle = '#2a4a3a'; g.fill();
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 8; g.stroke();
  text(g, '1638', E.W * 0.05 + 350, 170, { size: 52, color: '#f2ead8', font: FONTS.ui, weight: 900 });
  // small cube (1x) and big cube (10x) drawn as squares
  g.strokeStyle = '#9fd8ff'; g.lineWidth = 4;
  g.strokeRect(E.W * 0.12, 330, 70, 70);
  g.strokeRect(E.W * 0.42, 250, 150, 150);
  text(g, '1x', E.W * 0.12 + 35, 440, { size: 34, color: '#9fd8ff', font: FONTS.ui, weight: 900 });
  text(g, '10x', E.W * 0.42 + 75, 440, { size: 34, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  text(g, 'x1000 WEIGHT', E.W * 0.42 + 75, 480, { size: 26, color: '#e07856', font: FONTS.ui, weight: 900 });
  // telescope (right)
  seg(g, [[E.W * 0.82, GY], [E.W * 0.82, GY - 200]], 12, '#3a2a1a');
  seg(g, [[E.W * 0.76, GY - 200], [E.W * 0.88, GY - 200]], 10, '#3a2a1a');
  g.save(); g.translate(E.W * 0.82, GY - 230); g.rotate(-0.5);
  rr(g, -90, -22, 180, 44, 20); g.fillStyle = '#8a6a3a'; g.fill(); g.restore();
  // books stack (centre) + candle
  for (let i = 0; i < 4; i++) { rr(g, E.W * 0.60 + i * 8, GY - 40 - i * 34, 150 - i * 16, 30, 4); g.fillStyle = ['#c94a3a', '#3a7ae0', '#4a9a6a', '#e8b23a'][i]; g.fill(); }
  rr(g, E.W * 0.68, GY - 210, 16, 70, 4); g.fillStyle = '#f2ead8'; g.fill();
  circle(g, E.W * 0.68 + 8, GY - 226, 12, '#ffd76a');
  dust(g, t, { count: 14, seed: 127 });
  veil(g, '#000', 0.07);
  return { GY, CX, M: m, board: { x: E.W * 0.05, y: 110, w: 700, h: 400 } };
}

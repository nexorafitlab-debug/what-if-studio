// scenes/sets/cafeteria.js — school cafeteria at lunch: serving counter, long
// tables with trays, big windows, lunch-line queue rails. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function cafeteria(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // back wall + serving counter (left)
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  rr(g, -E.W, GY - 210, E.W * 0.52, 210, 8); g.fillStyle = '#6a5a48'; g.fill();
  rr(g, -E.W, GY - 230, E.W * 0.52, 26, 8); g.fillStyle = '#c8b898'; g.fill();
  text(g, 'LUNCH', E.W * 0.2, GY - 262, { size: 30, color: '#f2ead8', font: FONTS.ui, weight: 900 });
  // menu board
  rr(g, E.W * 0.56, 96, 420, 150, 8); g.fillStyle = '#23232e'; g.fill();
  g.strokeStyle = '#ffd76a'; g.lineWidth = 3; g.stroke();
  text(g, 'TODAY: PASTA', E.W * 0.56 + 210, 150, { size: 28, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  text(g, 'MILK  •  FRUIT', E.W * 0.56 + 210, 200, { size: 24, color: '#f2ead8', font: FONTS.ui, weight: 700 });
  // big windows (right)
  for (let i = 0; i < 3; i++) {
    const x = E.W * 0.6 + i * E.W * 0.13;
    rr(g, x, 270, 130, 200, 6); g.fillStyle = '#2a3648'; g.fill();
    g.fillStyle = 'rgba(180,220,255,0.35)'; g.fillRect(x + 10, 280, 50, 180);
    seg(g, [[x + 65, 270], [x + 65, 470]], 4, '#6a5a48');
  }
  // queue rails near the counter
  g.strokeStyle = '#b8b8c0'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(E.W * 0.42, GY - 180); g.lineTo(E.W * 0.42, GY); g.stroke();
  g.beginPath(); g.moveTo(E.W * 0.52, GY - 180); g.lineTo(E.W * 0.52, GY); g.stroke();
  // floor
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#9a8a72');
  g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 2;
  for (let x = -E.W; x < E.W * 2; x += 110) { g.beginPath(); g.moveTo(x, GY); g.lineTo(x - 40, E.H); g.stroke(); }
  // long tables with trays
  const table = (x, y, w) => {
    rr(g, x, y, w, 26, 6); g.fillStyle = '#7a5a3a'; g.fill();
    seg(g, [[x + 20, y + 26], [x + 20, y + 80]], 8, '#4a3220');
    seg(g, [[x + w - 20, y + 26], [x + w - 20, y + 80]], 8, '#4a3220');
    rr(g, x + 40, y - 16, 70, 14, 4); g.fillStyle = '#d8d8e0'; g.fill();
    circle(g, x + w - 70, y - 8, 12, '#e07856');
  };
  table(E.W * 0.08, GY + 60, 380); table(E.W * 0.58, GY + 60, 380);
  dust(g, t, { count: 12, seed: 41 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

// scenes/sets/court.js — school basketball court, day. Fresh set for this video:
// wooden floor with court lines, hoop + backboard, bleachers with a CROWD of
// students, scoreboard. Noah's 10 m dunk happens here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, crowd } from '/engine/fx2d.js';

export function court(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  // bleachers (back wall) with a crowd of students
  fillRect(g, -E.W, E.H * 0.30, E.W * 3, GY - E.H * 0.30, '#3a2a44');
  for (let i = 0; i < 4; i++) fillRect(g, -E.W, E.H * (0.34 + i * 0.11), E.W * 3, 14, '#241a30');
  crowd(g, t, { x: 0, y: E.H * 0.36, w: E.W, rows: 4, rowH: 100, size: 1.6, colors: ['#e07856', '#4a9a6a', '#5a7ac9', '#c9a44a', '#7a5ac9', '#3a8a7a'], cheer: 0.3 });
  // wooden court floor + lines
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#a8763e');
  g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5;
  g.beginPath(); g.ellipse(CX, GY + 130, 420, 90, 0, 0, Math.PI * 2); g.stroke();
  seg(g, [[E.W * 0.08, GY + 10], [E.W * 0.08, E.H]], 5, 'rgba(255,255,255,0.7)');
  seg(g, [[E.W * 0.92, GY + 10], [E.W * 0.92, E.H]], 5, 'rgba(255,255,255,0.7)');
  // hoop + backboard (right side)
  rr(g, E.W * 0.80, 120, 190, 150, 6); g.fillStyle = '#f2ead8'; g.fill();
  g.strokeStyle = '#c94a3a'; g.lineWidth = 6; g.stroke();
  circle(g, E.W * 0.895, 300, 42, 'rgba(0,0,0,0)'); g.strokeStyle = '#e07856'; g.lineWidth = 7;
  g.beginPath(); g.arc(E.W * 0.895, 300, 42, 0, Math.PI * 2); g.stroke();
  seg(g, [[E.W * 0.895, 300], [E.W * 0.895, 300]], 4, '#e07856');
  // scoreboard (left)
  rr(g, E.W * 0.05, 90, 260, 110, 8); g.fillStyle = '#1a1622'; g.fill();
  text(g, 'HOME  42', E.W * 0.05 + 130, 140, { size: 34, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  text(g, 'GUEST 38', E.W * 0.05 + 130, 182, { size: 34, color: '#9fd8ff', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 12, seed: 91 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m, hoop: { x: E.W * 0.895, y: 300 } };
}

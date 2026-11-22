// scenes/sets/classroom.js — classroom, late afternoon: blackboard, rows of
// desks, wall clock, windows with low sun. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function classroom(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  // blackboard (centre-left)
  rr(g, E.W * 0.1, 90, 560, 220, 8); g.fillStyle = '#233324'; g.fill();
  g.strokeStyle = '#8a6a4a'; g.lineWidth = 6; g.stroke();
  text(g, 'HOMEWORK p.42', E.W * 0.1 + 280, 170, { size: 34, color: '#f2ead8', font: FONTS.ui, weight: 700 });
  text(g, 'QUIZ FRIDAY', E.W * 0.1 + 280, 240, { size: 30, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  // wall clock (right)
  circle(g, E.W * 0.86, 150, 46, '#f2ead8');
  g.strokeStyle = '#2a2a34'; g.lineWidth = 4;
  g.beginPath(); g.arc(E.W * 0.86, 150, 46, 0, Math.PI * 2); g.stroke();
  seg(g, [[E.W * 0.86, 150], [E.W * 0.86, 118]], 4, '#2a2a34');
  seg(g, [[E.W * 0.86, 150], [E.W * 0.86 + 26, 158]], 4, '#2a2a34');
  // windows with low sun (far right)
  rr(g, E.W * 0.68, 260, 120, 190, 6); g.fillStyle = '#2a3648'; g.fill();
  g.fillStyle = 'rgba(255,200,120,0.5)'; g.fillRect(E.W * 0.68 + 10, 270, 46, 170);
  // floor
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#8a7a62');
  // rows of desks
  const desk = (x, y) => {
    rr(g, x, y, 190, 24, 6); g.fillStyle = '#7a5a3a'; g.fill();
    seg(g, [[x + 16, y + 24], [x + 16, y + 76]], 8, '#4a3220');
    seg(g, [[x + 174, y + 24], [x + 174, y + 76]], 8, '#4a3220');
    rr(g, x + 30, y - 14, 60, 12, 4); g.fillStyle = '#e8e4f4'; g.fill();
  };
  desk(E.W * 0.08, GY + 40); desk(E.W * 0.4, GY + 40); desk(E.W * 0.72, GY + 40);
  desk(E.W * 0.24, GY + 130); desk(E.W * 0.56, GY + 130);
  dust(g, t, { count: 10, seed: 17 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

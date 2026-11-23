// scenes/sets/school_classroom.js — Eli's classroom, POPULATED (fresh for the full video).
// Chalkboard at the front (RIGHT), big windows (LEFT) with morning light,
// teacher's desk, rows of desks. Seated students are drawn by the SHOTS
// (figures first, desk fronts over their legs).
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, windowFrame, floorLines, clouds } from '/engine/fx2d.js';

export function schoolClassroom(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // windows (left wall) with morning sky + drifting clouds
  windowFrame(g, { x: E.W * 0.05, y: E.H * 0.10, w: 330, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 300, ['#d8ecff', '#a8c8ef', '#7ab0e0']);
    gg2.fillRect(0, 0, 330, 300);
  });
  clouds(g, { seed: 31, count: 3, y: E.H * 0.12, h: 50, color: '#ffffff', a: 0.22 });
  // chalkboard (front, right) — a half-erased lesson on it
  rr(g, E.W * 0.52, 110, 780, 330, 8); g.fillStyle = '#24402e'; g.fill();
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 8; g.stroke();
  text(g, 'ENGLISH', E.W * 0.52 + 130, 170, { size: 40, color: 'rgba(255,255,255,0.8)', font: FONTS.ui, weight: 900 });
  text(g, 'say what you mean', E.W * 0.52 + 390, 300, { size: 44, color: 'rgba(255,255,255,0.45)', font: FONTS.ui, weight: 700 });
  seg(g, [[E.W * 0.52 + 60, 380], [E.W * 0.52 + 420, 380]], 4, 'rgba(255,255,255,0.35)');
  // teacher's desk (front left) with red pens + papers
  rr(g, E.W * 0.10, GY - 140, 320, 140, 8); g.fillStyle = '#5a3a2a'; g.fill();
  rr(g, E.W * 0.13, GY - 168, 130, 28, 4); g.fillStyle = '#f2ead8'; g.fill();
  seg(g, [[E.W * 0.13 + 14, GY - 154], [E.W * 0.13 + 116, GY - 154]], 2, '#b8a888');
  seg(g, [[E.W * 0.29, GY - 168], [E.W * 0.32, GY - 150]], 5, '#c94a3a');
  // wall poster: SPEAK UP (the rule of the room)
  rr(g, E.W * 0.42, 130, 170, 120, 6); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'SPEAK', E.W * 0.42 + 85, 178, { size: 30, color: '#c94a3a', font: FONTS.ui, weight: 900 });
  text(g, 'UP!', E.W * 0.42 + 85, 214, { size: 30, color: '#241b2e', font: FONTS.ui, weight: 900 });
  // a pinned-up bird drawing (June's)
  rr(g, E.W * 0.44, 270, 130, 160, 6); g.fillStyle = '#f2ead8'; g.fill();
  circle(g, E.W * 0.44 + 65, 330, 26, '#4a7ac9');
  seg(g, [[E.W * 0.44 + 65, 330], [E.W * 0.44 + 108, 308]], 5, '#4a7ac9');
  seg(g, [[E.W * 0.44 + 40, 360], [E.W * 0.44 + 90, 360]], 4, '#4a7ac9');
  dust(g, t, { count: 12, seed: 44 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

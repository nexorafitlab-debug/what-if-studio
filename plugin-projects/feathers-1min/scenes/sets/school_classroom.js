// scenes/sets/school_classroom.js — Kai's classroom, maths test day.
// Fresh drawing for the feathers video (NOT copied from Words Swallow).
// Chalkboard at the front with a maths test ("40" circled in red), teacher's
// desk with a stack of test papers, big windows on the LEFT, rows of desks.
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
  windowFrame(g, { x: E.W * 0.03, y: E.H * 0.10, w: 330, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 300, ['#d8ecff', '#a8c8ef', '#7ab0e0']);
    gg2.fillRect(0, 0, 330, 300);
  });
  clouds(g, { seed: 17, count: 3, y: E.H * 0.12, h: 50, color: '#ffffff', a: 0.22 });
  // chalkboard (front, centre-right) — the maths test
  rr(g, E.W * 0.28, 110, 820, 330, 8); g.fillStyle = '#24402e'; g.fill();
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 8; g.stroke();
  text(g, 'MATHS TEST', E.W * 0.28 + 160, 170, { size: 40, color: 'rgba(255,255,255,0.8)', font: FONTS.ui, weight: 900 });
  text(g, '12 x 8 = ?', E.W * 0.28 + 130, 300, { size: 44, color: 'rgba(255,255,255,0.45)', font: FONTS.ui, weight: 700 });
  text(g, '40', E.W * 0.28 + 620, 300, { size: 56, color: '#ff5a4a', font: FONTS.ui, weight: 900 });
  circle(g, E.W * 0.28 + 620, 292, 52, 'rgba(0,0,0,0)');
  g.strokeStyle = '#ff5a4a'; g.lineWidth = 4;
  g.beginPath(); g.arc(E.W * 0.28 + 620, 292, 52, 0, Math.PI * 2); g.stroke();
  // teacher's desk (front right) with test papers + red pen
  rr(g, E.W * 0.76, GY - 140, 320, 140, 8); g.fillStyle = '#5a3a2a'; g.fill();
  rr(g, E.W * 0.79, GY - 168, 130, 28, 4); g.fillStyle = '#f2ead8'; g.fill();
  rr(g, E.W * 0.79, GY - 196, 110, 24, 4); g.fillStyle = '#e8e4f4'; g.fill();
  seg(g, [[E.W * 0.79 + 14, GY - 154], [E.W * 0.79 + 116, GY - 154]], 2, '#b8a888');
  seg(g, [[E.W * 0.95, GY - 168], [E.W * 0.98, GY - 150]], 5, '#c94a3a');
  // desk rows (background) — empty tops the shots fill with seated students
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const x = E.W * (0.30 + c * 0.22), y = GY - 60 - r * 130;
      rr(g, x, y, 190, 26, 6); g.fillStyle = '#6a4a2a'; g.fill();
    }
  }
  // wall poster: "STUDY" (right wall)
  rr(g, E.W * 0.68, 130, 130, 160, 6); g.fillStyle = '#f2ead8'; g.fill();
  text(g, 'STUDY', E.W * 0.68 + 65, 200, { size: 30, color: '#2a2f42', font: FONTS.ui, weight: 900 });
  text(g, 'hard', E.W * 0.68 + 65, 250, { size: 26, color: '#c94a3a', font: FONTS.ui, weight: 700 });
  dust(g, t, { count: 12, seed: 55 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

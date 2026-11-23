// scenes/sets/school_classroom.js — Eli's classroom, POPULATED.
// Fresh drawing for the words-swallow video (NOT copied from Change Size).
// Chalkboard at the front (left-centre), big windows (right) with morning
// light, rows of desks. Seated students are drawn by the SHOTS via
// seatedRow (figures first, desk fronts over their legs).
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { dust, windowFrame, floorLines, clouds } from '/engine/fx2d.js';

export function schoolClassroom(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // windows (right wall) with morning sky + drifting clouds
  windowFrame(g, { x: E.W * 0.80, y: E.H * 0.10, w: 330, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 300, ['#d8ecff', '#a8c8ef', '#7ab0e0']);
    gg2.fillRect(0, 0, 330, 300);
  });
  clouds(g, { seed: 31, count: 3, y: E.H * 0.12, h: 50, color: '#ffffff', a: 0.22 });
  // chalkboard (front, left-centre) — a half-erased lesson on it
  rr(g, E.W * 0.05, 110, 780, 330, 8); g.fillStyle = '#24402e'; g.fill();
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 8; g.stroke();
  text(g, 'ENGLISH', E.W * 0.05 + 130, 170, { size: 40, color: 'rgba(255,255,255,0.8)', font: FONTS.ui, weight: 900 });
  text(g, 'say what you mean', E.W * 0.05 + 390, 300, { size: 44, color: 'rgba(255,255,255,0.45)', font: FONTS.ui, weight: 700 });
  seg(g, [[E.W * 0.05 + 60, 380], [E.W * 0.05 + 420, 380]], 4, 'rgba(255,255,255,0.35)');
  // teacher's desk (front right) with red pens + papers
  rr(g, E.W * 0.60, GY - 140, 320, 140, 8); g.fillStyle = '#5a3a2a'; g.fill();
  rr(g, E.W * 0.63, GY - 168, 130, 28, 4); g.fillStyle = '#f2ead8'; g.fill();
  seg(g, [[E.W * 0.63 + 14, GY - 154], [E.W * 0.63 + 116, GY - 154]], 2, '#b8a888');
  seg(g, [[E.W * 0.79, GY - 168], [E.W * 0.82, GY - 150]], 5, '#c94a3a');
  // wall poster: a bird (June's drawing pinned up)
  rr(g, E.W * 0.68, 130, 130, 160, 6); g.fillStyle = '#f2ead8'; g.fill();
  circle(g, E.W * 0.68 + 65, 200, 26, '#4a7ac9');
  seg(g, [[E.W * 0.68 + 65, 200], [E.W * 0.68 + 108, 178]], 5, '#4a7ac9');
  seg(g, [[E.W * 0.68 + 40, 230], [E.W * 0.68 + 90, 230]], 4, '#4a7ac9');
  dust(g, t, { count: 12, seed: 44 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

// Draw a row of SEATED students at desks: figures first, then desk fronts over
// their legs so they read as sitting AT desks. students = [{x, cast, expr, look, facing}].
export function seatedRow(g, t, info, y, students, rim) {
  const s = 1.05;
  for (const st of students) {
    const pose = breathe(POSES.sit, t, 1, st.x);
    drawFigure(g, { x: st.x, y, s, facing: st.facing ?? 1, outfit: st.cast.outfit, pose, expr: st.expr || 'neutral', talk: st.talk || 0, blink: (t + st.x * 0.01) % 3.7 < 0.12, look: st.look, rim });
  }
  // desk fronts (cover the seated legs)
  for (const st of students) {
    rr(g, st.x - 95, y - 78, 190, 78, 6); g.fillStyle = '#6a4a2a'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    rr(g, st.x - 60, y - 96, 120, 18, 4); g.fillStyle = '#f2ead8'; g.fill();
  }
}

// scenes/sets/classroom.js — a school classroom, POPULATED. Fresh set for this video:
// green board at the front, a HEIGHT CHART on the wall (1 m / 1.7 m marks),
// rows of desks with SEATED STUDENTS (drawn by the shots via seatedRow),
// teacher's desk, windows with daylight.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { dust, windowFrame, floorLines, clouds } from '/engine/fx2d.js';

export function classroom(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // windows (right wall) with daylight + clouds
  windowFrame(g, { x: E.W * 0.78, y: E.H * 0.12, w: 340, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 300, ['#cfe8ff', '#9fc8ef', '#7ab0e0']);
    gg2.fillRect(0, 0, 340, 300);
  });
  clouds(g, { seed: 71, count: 3, y: E.H * 0.14, h: 60, color: '#ffffff', a: 0.25 });
  // green board (front, left-centre)
  rr(g, E.W * 0.06, 120, 760, 330, 8); g.fillStyle = '#2a5a3a'; g.fill();
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 8; g.stroke();
  text(g, 'SIZE', E.W * 0.06 + 380, 300, { size: 72, color: 'rgba(255,255,255,0.75)', font: FONTS.ui, weight: 900 });
  // height chart on the wall beside the board
  const hx = E.W * 0.52;
  seg(g, [[hx, 140], [hx, GY - 40]], 6, '#f2ead8');
  for (let i = 0; i <= 10; i++) {
    const y = 140 + i * ((GY - 180) / 10);
    seg(g, [[hx - (i % 5 === 0 ? 46 : 24), y], [hx, y]], 4, '#f2ead8');
    if (i % 5 === 0) text(g, `${(2 - i * 0.2).toFixed(1)} m`, hx + 70, y + 8, { size: 28, color: '#f2ead8', font: FONTS.ui, weight: 900 });
  }
  text(g, '1.7 m', hx + 70, 140 + 1.5 * ((GY - 180) / 10) + 8, { size: 28, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  // teacher's desk (front right)
  rr(g, E.W * 0.62, GY - 130, 300, 130, 8); g.fillStyle = '#5a3a2a'; g.fill();
  dust(g, t, { count: 12, seed: 55 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m, chartX: hx };
}

// Draw a row of SEATED students at desks: figures first, then desk fronts over
// their legs so they read as sitting AT desks. students = [{x, cast, expr, look}].
export function seatedRow(g, t, info, y, students, rim) {
  const s = 1.05;
  for (const st of students) {
    const pose = breathe(POSES.sit, t, 1, st.x);
    drawFigure(g, { x: st.x, y, s, facing: st.facing ?? 1, outfit: st.cast.outfit, pose, expr: st.expr || 'neutral', talk: 0, blink: (t + st.x * 0.01) % 3.7 < 0.12, look: st.look, rim });
  }
  // desk fronts (cover the seated legs)
  for (const st of students) {
    rr(g, st.x - 95, y - 78, 190, 78, 6); g.fillStyle = '#6a4a2a'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
  }
}

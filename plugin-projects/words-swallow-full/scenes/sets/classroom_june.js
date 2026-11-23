// scenes/sets/classroom_june.js — June's corner of the classroom (fresh).
// Close on June's desk: her notebook open with pencil birds, a window with
// birds outside, a bird poster, a bookshelf. "I LIKE YOU." floats above her.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, windowFrame, floorLines, clouds } from '/engine/fx2d.js';

export function classroomJune(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // window (right) with birds outside
  windowFrame(g, { x: E.W * 0.70, y: E.H * 0.08, w: 380, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = linGrad(gg2, 0, 0, 0, 300, ['#d8ecff', '#a8c8ef']);
    gg2.fillRect(0, 0, 380, 300);
    for (let i = 0; i < 3; i++) {
      const bx = 60 + i * 100, by = 60 + i * 40;
      gg2.strokeStyle = '#241b2e'; gg2.lineWidth = 4;
      gg2.beginPath(); gg2.moveTo(bx - 16, by); gg2.lineTo(bx, by - 10); gg2.lineTo(bx + 16, by); gg2.stroke();
    }
  });
  clouds(g, { seed: 51, count: 2, y: E.H * 0.10, h: 40, color: '#ffffff', a: 0.2 });
  // bird poster (left wall)
  rr(g, E.W * 0.06, E.H * 0.10, 220, 280, 8); g.fillStyle = '#f2ead8'; g.fill();
  circle(g, E.W * 0.06 + 110, E.H * 0.10 + 90, 44, '#4a7ac9');
  seg(g, [[E.W * 0.06 + 110, E.H * 0.10 + 90], [E.W * 0.06 + 180, E.H * 0.10 + 60]], 6, '#4a7ac9');
  seg(g, [[E.W * 0.06 + 70, E.H * 0.10 + 170], [E.W * 0.06 + 150, E.H * 0.10 + 170]], 5, '#4a7ac9');
  text(g, 'BIRDS', E.W * 0.06 + 110, E.H * 0.10 + 240, { size: 28, color: '#241b2e', font: FONTS.ui, weight: 900 });
  // bookshelf (centre-left)
  rr(g, E.W * 0.30, E.H * 0.14, 200, 380, 6); g.fillStyle = '#3a2a1e'; g.fill();
  const cols = ['#c94a3a', '#e8b23a', '#4a9a6a', '#4a7ac9'];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) {
    rr(g, E.W * 0.30 + 14 + i * 36, E.H * 0.16 + r * 120, 28, 90, 3); g.fillStyle = cols[(i + r) % 4]; g.fill();
  }
  // June's desk is drawn by the shots (desk fronts); the chalkboard edge
  rr(g, E.W * 0.52, 110, 200, 300, 8); g.fillStyle = '#24402e'; g.fill();
  text(g, 'ART', E.W * 0.52 + 100, 170, { size: 36, color: 'rgba(255,255,255,0.7)', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 10, seed: 201 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

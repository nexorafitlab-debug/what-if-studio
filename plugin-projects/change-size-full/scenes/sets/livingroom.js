// scenes/sets/livingroom.js — the family living room, evening. Fresh set:
// a sofa, a rug, a cat bed, a window with dusk sky, a bookshelf. The cat
// thinks tiny Noah is a mouse here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, windowFrame, floorLines } from '/engine/fx2d.js';

export function livingroom(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  windowFrame(g, { x: E.W * 0.70, y: E.H * 0.12, w: 360, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = '#7a6a9a'; gg2.fillRect(0, 0, 360, 300);
    gg2.fillStyle = '#e8ecff'; gg2.beginPath(); gg2.arc(280, 80, 30, 0, Math.PI * 2); gg2.fill();
  });
  // bookshelf (left)
  rr(g, E.W * 0.05, 140, 220, GY - 140, 8); g.fillStyle = '#5a3a2a'; g.fill();
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) {
    rr(g, E.W * 0.06 + i * 52, 170 + r * 130, 40, 90, 3);
    g.fillStyle = ['#e07856', '#4a9a6a', '#5a7ac9', '#c9a44a'][i]; g.fill();
  }
  // sofa (centre-right)
  rr(g, E.W * 0.42, GY - 120, 480, 120, 16); g.fillStyle = '#7a5a8a'; g.fill();
  rr(g, E.W * 0.42, GY - 190, 480, 80, 16); g.fillStyle = '#8a6a9a'; g.fill();
  rr(g, E.W * 0.46, GY - 180, 90, 70, 10); g.fillStyle = '#ffd76a'; g.fill();
  rr(g, E.W * 0.76, GY - 180, 90, 70, 10); g.fillStyle = '#9fd8ff'; g.fill();
  // rug (centre)
  rr(g, CX - 340, GY + 50, 680, 100, 50); g.fillStyle = alpha(m.key, 0.14); g.fill();
  // the CAT BED (right, empty — the cat is drawn by the shots)
  rr(g, E.W * 0.86, GY - 10, 160, 50, 25); g.fillStyle = '#c94a3a'; g.fill();
  circle(g, E.W * 0.94, GY - 10, 40, '#e07856');
  dust(g, t, { count: 12, seed: 113 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m, sofa: { x: E.W * 0.42, y: GY - 120 }, catBed: { x: E.W * 0.86, y: GY - 10 } };
}

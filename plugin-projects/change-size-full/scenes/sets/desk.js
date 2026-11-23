// scenes/sets/desk.js — Noah's desk at night, the letter arrives. Fresh set:
// a desk lamp, an open window with the moon, a stack of books, the letter
// on the desk. Milo reads over Noah's shoulder here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, windowFrame, stars, moon } from '/engine/fx2d.js';

export function desk(g, t, info, params = {}) {
  const m = mood('night');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, ['#0a0e1e', '#141a30'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { count: 80, seed: 133, area: [0, 0, E.W, E.H * 0.5] });
  fillRect(g, -E.W, 0, E.W * 3, GY, '#1a2038');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#141828');
  // window with the moon (right)
  windowFrame(g, { x: E.W * 0.72, y: E.H * 0.10, w: 360, h: 320, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = '#0a0e1e'; gg2.fillRect(0, 0, 360, 320);
  });
  moon(g, E.W * 0.86, E.H * 0.22, 40);
  // the desk (centre) with a lamp
  rr(g, E.W * 0.14, GY - 60, E.W * 0.72, 26, 8); g.fillStyle = '#4a3424'; g.fill();
  seg(g, [[E.W * 0.17, GY - 34], [E.W * 0.17, GY + 80]], 12, '#3a2418');
  seg(g, [[E.W * 0.83, GY - 34], [E.W * 0.83, GY + 80]], 12, '#3a2418');
  // desk lamp (left) with a warm cone of light
  seg(g, [[E.W * 0.20, GY - 60], [E.W * 0.20, GY - 200]], 10, '#2a2a33');
  seg(g, [[E.W * 0.20, GY - 200], [E.W * 0.28, GY - 230]], 10, '#2a2a33');
  circle(g, E.W * 0.29, GY - 226, 26, '#ffd76a');
  g.save(); g.globalCompositeOperation = 'lighter';
  g.fillStyle = 'rgba(255,215,106,0.10)';
  g.beginPath(); g.moveTo(E.W * 0.29, GY - 220); g.lineTo(E.W * 0.44, GY - 60); g.lineTo(E.W * 0.14, GY - 60); g.closePath(); g.fill();
  g.restore();
  // book stack (right end of the desk)
  for (let i = 0; i < 3; i++) { rr(g, E.W * 0.68 + i * 6, GY - 86 - i * 30, 130 - i * 12, 26, 4); g.fillStyle = ['#c94a3a', '#3a7ae0', '#4a9a6a'][i]; g.fill(); }
  // a mug
  rr(g, E.W * 0.58, GY - 110, 50, 50, 6); g.fillStyle = '#5a7ac9'; g.fill();
  dust(g, t, { count: 10, seed: 135 });
  veil(g, '#000', 0.08);
  return { GY, CX, M: m, deskTop: GY - 60 };
}

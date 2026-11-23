// scenes/sets/dining.js — the family dining room, evening. Fresh set:
// a long table piled with BURGERS, a window with evening sky, a wall clock,
// Mom's chair. The eighth-burger beat happens here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, windowFrame, floorLines } from '/engine/fx2d.js';

export function dining(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  windowFrame(g, { x: E.W * 0.72, y: E.H * 0.12, w: 360, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = '#e8a06a'; gg2.fillRect(0, 0, 360, 300);
    gg2.fillStyle = '#f2c21a'; gg2.beginPath(); gg2.arc(260, 220, 40, 0, Math.PI * 2); gg2.fill();
  });
  // wall clock (evening, 7:40)
  circle(g, E.W * 0.14, E.H * 0.22, 52, '#f2ead8');
  seg(g, [[E.W * 0.14, E.H * 0.22], [E.W * 0.14 + 26, E.H * 0.22 - 18]], 5, '#1a1622');
  seg(g, [[E.W * 0.14, E.H * 0.22], [E.W * 0.14 - 10, E.H * 0.22 + 30]], 5, '#1a1622');
  // the LONG dining table
  rr(g, E.W * 0.16, GY - 70, E.W * 0.68, 30, 8); g.fillStyle = '#6a4a2a'; g.fill();
  seg(g, [[E.W * 0.19, GY - 40], [E.W * 0.19, GY + 80]], 12, '#4a2a1a');
  seg(g, [[E.W * 0.81, GY - 40], [E.W * 0.81, GY + 80]], 12, '#4a2a1a');
  // a plate of burgers on the table (drawn by shots too — this is the base plate)
  rr(g, E.W * 0.44, GY - 96, 200, 26, 10); g.fillStyle = '#e8e4f4'; g.fill();
  // fruit bowl + jug
  circle(g, E.W * 0.74, GY - 86, 18, '#e04a3a'); circle(g, E.W * 0.78, GY - 82, 16, '#ffd76a');
  rr(g, E.W * 0.24, GY - 150, 54, 80, 8); g.fillStyle = '#5a9ac9'; g.fill();
  dust(g, t, { count: 12, seed: 111 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m, table: { x: E.W * 0.16, y: GY - 70, w: E.W * 0.68 }, plate: { x: E.W * 0.44, y: GY - 96 } };
}

// A burger (bun + patty + lettuce), drawn at (x, y), scale s.
export function drawBurger(g, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -40, -6, 80, 22, 10); g.fillStyle = '#8a5a2a'; g.fill();
  rr(g, -44, -16, 88, 12, 6); g.fillStyle = '#7ac74a'; g.fill();
  g.beginPath(); g.ellipse(0, -26, 42, 22, 0, Math.PI, 0); g.fillStyle = '#e8a06a'; g.fill();
  circle(g, -14, -34, 3, '#f2ead8'); circle(g, 8, -38, 3, '#f2ead8'); circle(g, 20, -30, 3, '#f2ead8');
  g.restore();
}

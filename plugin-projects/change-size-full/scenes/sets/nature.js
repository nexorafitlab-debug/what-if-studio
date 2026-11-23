// scenes/sets/nature.js — macro nature: giant grass, an anthill, flowers.
// Fresh set: the world from an ant's eye view — huge grass blades, a dirt
// anthill, a daisy, morning light. Ants and fleas cheat the law here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, sun, clouds } from '/engine/fx2d.js';

export function nature(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, ['#bfe0ff', '#9fd8a8'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.80, E.H * 0.16, 44, '#fff6e0', '#ffd59a', 5);
  clouds(g, { seed: 129, count: 3, y: E.H * 0.10, h: 60, color: '#ffffff', a: 0.3 });
  // giant grass blades (foreground, tall)
  g.strokeStyle = '#3a7a3a'; g.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const gx = E.W * (0.04 + i * 0.11), hgt = 300 + ((i * 53) % 220);
    const sway = Math.sin(t * 1.2 + i) * 14;
    g.lineWidth = 12;
    g.beginPath(); g.moveTo(gx, GY + 60); g.quadraticCurveTo(gx + sway, GY - hgt * 0.5, gx + sway * 2, GY - hgt); g.stroke();
  }
  // the anthill (centre-left)
  g.fillStyle = '#8a6a3a';
  g.beginPath(); g.ellipse(E.W * 0.30, GY + 20, 260, 110, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#6a4a2a';
  g.beginPath(); g.ellipse(E.W * 0.30, GY + 10, 200, 80, 0, 0, Math.PI * 2); g.fill();
  // a daisy (right)
  seg(g, [[E.W * 0.82, GY + 40], [E.W * 0.82, GY - 160]], 10, '#3a7a3a');
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    circle(g, E.W * 0.82 + Math.cos(a) * 34, GY - 180 + Math.sin(a) * 34, 16, '#f2ead8');
  }
  circle(g, E.W * 0.82, GY - 180, 20, '#ffd76a');
  // ground
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#5a7a3a');
  dust(g, t, { count: 14, seed: 131 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m, hill: { x: E.W * 0.30, y: GY + 20 } };
}

// An ant (three body segments + legs + antennae), at (x, y), facing f, scale s.
export function drawAnt(g, x, y, s = 1, f = 1, t = 0) {
  g.save(); g.translate(x, y); g.scale(f * s, s);
  const wig = Math.sin(t * 8) * 3;
  circle(g, -26, -14, 16, '#2a1a12');
  circle(g, 0, -12, 13, '#3a2418');
  circle(g, 24, -14, 18, '#2a1a12');
  g.strokeStyle = '#2a1a12'; g.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    seg(g, [[-14 + i * 14, -4], [-20 + i * 14, 14 + wig]], 3, '#2a1a12');
    seg(g, [[-14 + i * 14, -4], [-8 + i * 14, 14 - wig]], 3, '#2a1a12');
  }
  seg(g, [[36, -26], [52, -44]], 3, '#2a1a12');
  seg(g, [[40, -28], [58, -40]], 3, '#2a1a12');
  g.restore();
}

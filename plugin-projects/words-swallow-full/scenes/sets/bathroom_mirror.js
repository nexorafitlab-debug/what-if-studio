// scenes/sets/bathroom_mirror.js — the bathroom mirror (fresh for the full video).
// Tiled wall, a big mirror (x 0.58W-0.92W, y 0.14H-0.72H) — the reflection
// figure is drawn by the SHOTS at E.W*0.74, dim + flipped. Sink, faucet,
// toothbrush cup, towel, night light. Eli's OWN words live only here.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function bathroomMirror(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#1e2a33', '#10161c'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  // tiles
  g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = 2;
  for (let y = 0; y < GY; y += 70) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
  for (let x = 0; x < E.W; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, GY); g.stroke(); }
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#0e1216');
  // mirror (the heart of the set): frame + glass
  rr(g, E.W * 0.56, E.H * 0.12, E.W * 0.38, E.H * 0.62, 12); g.fillStyle = '#3a3a48'; g.fill();
  g.strokeStyle = '#ffd76a'; g.lineWidth = 4; g.stroke();
  rr(g, E.W * 0.58, E.H * 0.14, E.W * 0.34, E.H * 0.58, 8);
  g.fillStyle = linGrad(g, 0, E.H * 0.14, 0, E.H * 0.72, ['#5a6a7a', '#2a3642']);
  g.fill();
  // light streak on the glass
  g.save(); g.globalCompositeOperation = 'lighter';
  g.fillStyle = 'rgba(255,255,255,0.10)';
  g.beginPath(); g.moveTo(E.W * 0.62, E.H * 0.14); g.lineTo(E.W * 0.70, E.H * 0.14); g.lineTo(E.W * 0.64, E.H * 0.72); g.lineTo(E.W * 0.58, E.H * 0.72); g.closePath(); g.fill();
  g.restore();
  // vanity light above the mirror
  rr(g, E.W * 0.60, E.H * 0.06, E.W * 0.30, 26, 10); g.fillStyle = '#ffd76a'; g.fill();
  glow(g, E.W * 0.75, E.H * 0.08, 160, '#ffd76a', 0.3);
  // sink + faucet (below the mirror)
  rr(g, E.W * 0.60, GY - 60, E.W * 0.30, 60, 12); g.fillStyle = '#e8e4f4'; g.fill();
  seg(g, [[E.W * 0.75, GY - 60], [E.W * 0.75, GY - 130]], 8, '#8a8a9a');
  seg(g, [[E.W * 0.75, GY - 130], [E.W * 0.79, GY - 130]], 8, '#8a8a9a');
  // toothbrush cup + towel (left)
  rr(g, E.W * 0.10, GY - 130, 60, 80, 6); g.fillStyle = '#4a7ac9'; g.fill();
  seg(g, [[E.W * 0.12, GY - 130], [E.W * 0.11, GY - 170]], 5, '#e8b23a');
  seg(g, [[E.W * 0.15, GY - 130], [E.W * 0.16, GY - 168]], 5, '#c94a3a');
  rr(g, E.W * 0.06, E.H * 0.30, 90, 200, 6); g.fillStyle = '#7a5a8a'; g.fill();
  dust(g, t, { count: 6, seed: 81 });
  veil(g, '#000', 0.08);
  return { GY, CX, M: m, MX: E.W * 0.75, MY: E.H * 0.43 };
}

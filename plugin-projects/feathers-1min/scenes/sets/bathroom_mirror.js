// scenes/sets/bathroom_mirror.js — Kai's bathroom at night, mirror beat.
// Fresh drawing for the feathers video. Big mirror in the centre (the
// reflection is drawn by the SHOTS), sink below, toothbrush cup, towel on
// the left, a small night lamp glowing blue. Dim, quiet, late.
// (Drawn for the full video's mirror beats; unused in the 1-min sample.)
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function bathroomMirror(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, ['#101826', '#080c16'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#141c2c');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#0a0e18');
  // big mirror (centre) — dark glass with a soft blue sheen
  rr(g, E.W * 0.30, E.H * 0.08, E.W * 0.40, 560, 10);
  g.fillStyle = linGrad(g, E.W * 0.30, E.H * 0.08, E.W * 0.70, E.H * 0.08 + 560, ['#2a3a55', '#182233', '#232f47']);
  g.fill();
  g.strokeStyle = '#8a6a3a'; g.lineWidth = 10; g.stroke();
  seg(g, [[E.W * 0.34, E.H * 0.12], [E.W * 0.44, E.H * 0.55]], 10, 'rgba(255,255,255,0.10)');
  // sink + taps below the mirror
  rr(g, E.W * 0.36, GY - 120, E.W * 0.28, 120, 10); g.fillStyle = '#e8e4f4'; g.fill();
  circle(g, E.W * 0.50, GY - 60, 70, '#c9c4d4');
  seg(g, [[E.W * 0.50, GY - 150], [E.W * 0.50, GY - 120]], 8, '#9aa2b5');
  // toothbrush cup + towel
  rr(g, E.W * 0.30, GY - 170, 54, 60, 6); g.fillStyle = '#4a7ac9'; g.fill();
  seg(g, [[E.W * 0.315, GY - 190], [E.W * 0.31, GY - 168]], 5, '#e8b23a');
  seg(g, [[E.W * 0.335, GY - 190], [E.W * 0.34, GY - 168]], 5, '#c94a3a');
  rr(g, E.W * 0.06, E.H * 0.30, 130, 260, 8); g.fillStyle = '#800020'; g.fill();
  // night lamp (right) — soft blue glow
  circle(g, E.W * 0.86, E.H * 0.30, 22, '#9fd8ff');
  glow(g, E.W * 0.86, E.H * 0.30, 200, '#9fd8ff', 0.25);
  dust(g, t, { count: 6, seed: 71 });
  veil(g, '#000', 0.10);
  return { GY, CX, M: m, mirrorX: E.W * 0.30, mirrorY: E.H * 0.08, mirrorW: E.W * 0.40, mirrorH: 560 };
}

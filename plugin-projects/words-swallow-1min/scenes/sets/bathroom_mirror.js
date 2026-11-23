// scenes/sets/bathroom_mirror.js — bathroom at night, mirror over the sink.
// Fresh drawing for the words-swallow video (NOT copied from Change Size).
// Eli sees his OWN grey words stacked above his reflection here — the
// mirror twist. The reflection is drawn DIMMER/BLUER by the shots (o.dim).
// Not used in the 1-min sample; drawn now so the full video can use it.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function bathroomMirror(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, ['#1c2233', '#0e1220'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#20263a');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#141824');
  // tile lines on the wall
  g.strokeStyle = 'rgba(255,255,255,0.05)'; g.lineWidth = 2;
  for (let y = 120; y < GY; y += 110) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  for (let x = 120; x < E.W; x += 180) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, GY); g.stroke(); }
  // big mirror (centre) — cool glass, warm frame
  const mx = E.W * 0.30, my = E.H * 0.10, mw = E.W * 0.40, mh = 560;
  rr(g, mx - 14, my - 14, mw + 28, mh + 28, 10); g.fillStyle = '#3a2a1e'; g.fill();
  rr(g, mx, my, mw, mh, 6); g.fillStyle = linGrad(g, mx, my, mx + mw, my + mh, ['#2a3a4e', '#1a2436', '#232f45']); g.fill();
  g.strokeStyle = 'rgba(207,224,255,0.35)'; g.lineWidth = 3; g.stroke();
  // diagonal shine across the glass
  g.save(); g.beginPath(); g.rect(mx, my, mw, mh); g.clip();
  g.fillStyle = 'rgba(255,255,255,0.07)';
  g.beginPath(); g.moveTo(mx + 90, my); g.lineTo(mx + 220, my); g.lineTo(mx + 60, my + mh); g.lineTo(mx - 70, my + mh); g.closePath(); g.fill();
  g.restore();
  // warm lamp above the mirror
  rr(g, CX - 130, my - 62, 260, 30, 14); g.fillStyle = '#e8ecff'; g.fill();
  glow(g, CX, my - 40, 260, '#ffe2a8', 0.30);
  // sink + tap below the mirror
  rr(g, CX - 190, GY - 150, 380, 90, 20); g.fillStyle = '#e8e4f4'; g.fill();
  rr(g, CX - 150, GY - 138, 300, 56, 16); g.fillStyle = '#c9c4d8'; g.fill();
  seg(g, [[CX, GY - 150], [CX, GY - 210]], 8, '#8a93a8');
  seg(g, [[CX, GY - 210], [CX + 44, GY - 210]], 8, '#8a93a8');
  seg(g, [[CX + 44, GY - 210], [CX + 44, GY - 176]], 6, '#8a93a8');
  // toothbrush cup + towel (right)
  rr(g, CX + 260, GY - 210, 64, 60, 6); g.fillStyle = '#4a7ac9'; g.fill();
  seg(g, [[CX + 278, GY - 210], [CX + 272, GY - 250]], 5, '#e07856');
  seg(g, [[CX + 292, GY - 210], [CX + 298, GY - 248]], 5, '#4a9a6a');
  rr(g, E.W * 0.86, E.H * 0.22, 110, 260, 8); g.fillStyle = '#7a5a8a'; g.fill();
  seg(g, [[E.W * 0.86 + 55, E.H * 0.22], [E.W * 0.86 + 55, E.H * 0.22 + 260]], 4, 'rgba(0,0,0,0.25)');
  dust(g, t, { count: 6, seed: 63 });
  veil(g, '#000', 0.10);
  return { GY, CX, M: m, mirror: { x: mx, y: my, w: mw, h: mh } };
}

// scenes/sets/street_morning.js — street in the morning, Eli walks to school.
// Fresh drawing for the words-swallow video (NOT copied from Change Size).
// Dawn sky, low sun, houses with lit windows on the LEFT, trees, pavement,
// lamp posts, and the SCHOOL GATE (iron fence + sign) on the RIGHT — where
// the gold-seed beat happens: a girl tells her friend she is sorry.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, clouds, tree, lampPost, facade, floorLines } from '/engine/fx2d.js';

export function streetMorning(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, ['#3a2c4e', '#1c1428', '#120e1a'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  // low dawn sun + clouds
  sun(g, E.W * 0.72, E.H * 0.16, 46, '#fff3d0', '#ffcf8a', 3.5);
  clouds(g, { seed: 12, count: 4, y: E.H * 0.08, h: 70, color: '#ffd9a0', a: 0.16 });
  // houses (left) with warm lit windows
  facade(g, { x: -40, y: GY - 60, w: 420, h: 420, color: '#2a2238', win: '#ffcf8a', dark: '#1a1424', cols: 3, rows: 3, lit: 0.7, seed: 14, door: true });
  facade(g, { x: 400, y: GY - 60, w: 360, h: 330, color: '#241c30', win: '#ffcf8a', dark: '#171222', cols: 3, rows: 2, lit: 0.5, seed: 15 });
  // trees between the houses and the gate
  tree(g, E.W * 0.46, GY - 40, 1.1, '#1c2a1e');
  tree(g, E.W * 0.52, GY - 30, 0.85, '#16241a');
  // school gate (right): iron fence + brick pillars + sign
  for (let i = 0; i < 9; i++) seg(g, [[E.W * 0.86 + i * 14, GY - 330], [E.W * 0.86 + i * 14, GY - 60]], 5, '#15121c');
  seg(g, [[E.W * 0.85, GY - 330], [E.W * 0.85 + 130, GY - 330]], 6, '#15121c');
  seg(g, [[E.W * 0.85, GY - 200], [E.W * 0.85 + 130, GY - 200]], 5, '#15121c');
  rr(g, E.W * 0.83, GY - 360, 44, 300, 6); g.fillStyle = '#3a2a2a'; g.fill();
  rr(g, E.W * 0.965, GY - 360, 44, 300, 6); g.fillStyle = '#3a2a2a'; g.fill();
  rr(g, E.W * 0.86, GY - 430, 130, 56, 8); g.fillStyle = '#24402e'; g.fill();
  g.strokeStyle = '#c9a44a'; g.lineWidth = 3; g.stroke();
  text(g, 'SCHOOL', E.W * 0.86 + 65, GY - 394, { size: 26, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  // pavement + road line
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#1a1420');
  fillRect(g, -E.W, GY, E.W * 3, 26, '#241c30');
  floorLines(g, GY + 30, E.H);
  seg(g, [[0, GY + 90], [E.W, GY + 90]], 4, 'rgba(255,215,106,0.35)');
  // lamp posts (one lit, one dark)
  lampPost(g, E.W * 0.60, GY, 300, { on: true });
  lampPost(g, E.W * 0.08, GY, 300, { on: false });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m, gateX: E.W * 0.86 };
}

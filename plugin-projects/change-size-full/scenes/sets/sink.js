// scenes/sets/sink.js — under the plumber's sink: a dark cabinet interior.
// Fresh set: big pipes, a dripping joint, a wrench, the plumber's boots at the
// cabinet door. Tiny Noah fixes the pipe here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, drops } from '/engine/fx2d.js';

export function sink(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#4a3a2a');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#2a2018');
  // cabinet frame (dark wood) around the under-sink space
  fillRect(g, E.W * 0.10, 90, 90, GY - 90, '#3a2a1a');
  fillRect(g, E.W * 0.81, 90, 90, GY - 90, '#3a2a1a');
  fillRect(g, E.W * 0.10, 90, E.W * 0.81, 70, '#3a2a1a');
  // the sink basin above (white, from below)
  rr(g, E.W * 0.16, 160, E.W * 0.68, 60, 12); g.fillStyle = '#e8e4f4'; g.fill();
  // big pipes: two verticals + a U-bend
  seg(g, [[E.W * 0.34, 220], [E.W * 0.34, GY - 120]], 26, '#8a8a9a');
  seg(g, [[E.W * 0.60, 220], [E.W * 0.60, GY - 120]], 26, '#8a8a9a');
  g.strokeStyle = '#8a8a9a'; g.lineWidth = 26; g.lineCap = 'round';
  g.beginPath(); g.arc(E.W * 0.47, GY - 120, 130, Math.PI, 0); g.stroke();
  // the LEAKING joint (left pipe) with a drip
  circle(g, E.W * 0.34, GY - 320, 40, '#c94a3a');
  const dripY = GY - 280 + ((t * 120) % 220);
  circle(g, E.W * 0.34, dripY, 10, '#9fd8ff');
  // a puddle under the leak
  circle(g, E.W * 0.34, GY + 30, 90, 'rgba(159,216,255,0.16)');
  circle(g, E.W * 0.34, GY + 30, 50, 'rgba(159,216,255,0.12)');
  // a wrench leaning on the right pipe
  seg(g, [[E.W * 0.68, GY - 200], [E.W * 0.76, GY - 60]], 14, '#b8b8c8');
  circle(g, E.W * 0.68, GY - 210, 22, '#b8b8c8');
  // warm light from the open cabinet door (right edge)
  g.fillStyle = 'rgba(255,215,106,0.12)';
  g.fillRect(E.W * 0.90, 160, E.W * 0.10, GY - 160);
  dust(g, t, { count: 16, seed: 97 });
  veil(g, '#000', 0.10);
  return { GY, CX, M: m, leak: { x: E.W * 0.34, y: GY - 320 }, pipeY: GY - 120 };
}

// scenes/sets/gym.js — a school WEIGHTS room (not a court — fresh for this video):
// squat rack + barbell, dumbbell rack, bench, mirror wall, a couple of gym
// buddies in the background. Noah's weak-giant beats happen here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function gym(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  // mirror wall (centre) — light grey panels with a shine line
  rr(g, E.W * 0.30, 110, 760, 380, 8); g.fillStyle = '#9fb4c8'; g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 4;
  g.beginPath(); g.moveTo(E.W * 0.34, 470); g.lineTo(E.W * 0.60, 130); g.stroke();
  seg(g, [[E.W * 0.55, 110], [E.W * 0.55, 490]], 4, '#5a6a7a');
  // squat rack (left) with a barbell
  seg(g, [[E.W * 0.08, GY], [E.W * 0.08, GY - 380]], 12, '#3a3a48');
  seg(g, [[E.W * 0.26, GY], [E.W * 0.26, GY - 380]], 12, '#3a3a48');
  seg(g, [[E.W * 0.04, GY - 300], [E.W * 0.30, GY - 300]], 10, '#3a3a48');
  circle(g, E.W * 0.04, GY - 300, 34, '#2a2a33'); circle(g, E.W * 0.30, GY - 300, 34, '#2a2a33');
  // bench (centre-left)
  rr(g, E.W * 0.34, GY - 60, 260, 22, 8); g.fillStyle = '#c94a3a'; g.fill();
  seg(g, [[E.W * 0.37, GY - 38], [E.W * 0.37, GY]], 8, '#2a2a33');
  seg(g, [[E.W * 0.55, GY - 38], [E.W * 0.55, GY]], 8, '#2a2a33');
  // dumbbell rack (right)
  rr(g, E.W * 0.78, GY - 120, 300, 120, 8); g.fillStyle = '#2a2a33'; g.fill();
  for (let i = 0; i < 4; i++) { circle(g, E.W * 0.80 + i * 68, GY - 140, 20, '#5a5a6a'); circle(g, E.W * 0.80 + i * 68, GY - 140, 10, '#3a3a48'); }
  // rubber floor mats
  fillRect(g, -E.W, GY, E.W * 3, 40, 'rgba(0,0,0,0.25)');
  // motivational poster
  rr(g, E.W * 0.68, 130, 200, 130, 8); g.fillStyle = '#1a2a4a'; g.fill();
  text(g, 'LIFT', E.W * 0.78, 200, { size: 44, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 14, seed: 77 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m, barY: GY - 300 };
}

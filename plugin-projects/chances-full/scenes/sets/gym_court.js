// scenes/sets/gym_court.js — school gym: wooden court, painted lines, hoops both
// ends, scoreboard, bleachers. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function gymCourt(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // back wall + bleachers
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  for (let r = 0; r < 4; r++) {
    fillRect(g, -E.W, 150 + r * 92, E.W * 3, 60, r % 2 ? '#3a4a6a' : '#4a5a7a');
  }
  // scoreboard (centre, clear of the letterbox; teams stacked — the board is
  // too narrow for HOME and GUEST side by side)
  rr(g, CX - 170, 92, 340, 140, 10); g.fillStyle = '#14141e'; g.fill();
  g.strokeStyle = '#ffd76a'; g.lineWidth = 4; g.stroke();
  text(g, 'HOME  24', CX, 142, { size: 32, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  text(g, 'GUEST  19', CX, 176, { size: 32, color: '#9fd8ff', font: FONTS.ui, weight: 900 });
  text(g, 'Q3  04:12', CX, 212, { size: 28, color: '#f2ead8', font: FONTS.ui, weight: 900 });
  // wooden court floor
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#a8763e');
  g.strokeStyle = 'rgba(0,0,0,0.22)'; g.lineWidth = 2;
  for (let x = -E.W; x < E.W * 2; x += 130) { g.beginPath(); g.moveTo(x, GY); g.lineTo(x - 60, E.H); g.stroke(); }
  // court lines
  g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(CX, GY); g.lineTo(CX, E.H); g.stroke();
  circle(g, CX, GY + 90, 66, 'rgba(0,0,0,0)'); // centre circle outline below
  g.strokeStyle = 'rgba(255,255,255,0.85)';
  g.beginPath(); g.arc(CX, GY + 90, 66, 0, Math.PI * 2); g.stroke();
  // hoops both ends (backboards on the wall line)
  const hoop = (x, dir) => {
    rr(g, x - 60, GY - 260, 120, 90, 6); g.fillStyle = '#f2ead8'; g.fill();
    g.strokeStyle = '#c94a3a'; g.lineWidth = 5; g.stroke();
    rr(g, x - 30, GY - 210, 60, 14, 4); g.fillStyle = '#e8e4f4'; g.fill();
    g.strokeStyle = '#c94a3a'; g.lineWidth = 4;
    g.beginPath(); g.arc(x, GY - 176, 26, 0, Math.PI); g.stroke();
  };
  hoop(E.W * 0.1, 1); hoop(E.W * 0.9, -1);
  // basketball resting on the floor (left)
  circle(g, E.W * 0.16, GY + 130, 26, '#e07856');
  seg(g, [[E.W * 0.16 - 26, GY + 130], [E.W * 0.16 + 26, GY + 130]], 3, '#5a2a1a');
  seg(g, [[E.W * 0.16, GY + 104], [E.W * 0.16, GY + 156]], 3, '#5a2a1a');
  dust(g, t, { count: 14, seed: 31 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

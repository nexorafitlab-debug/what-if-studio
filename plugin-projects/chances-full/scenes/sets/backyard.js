// scenes/sets/backyard.js — Jay's backyard at dusk: wooden fence, garage wall
// with a basketball hoop, lawn, string lights. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { stars, dust } from '/engine/fx2d.js';

export function backyard(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, ['#1e1430', '#5a3a6a', '#e07856'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { count: 50, seed: 13, area: [0, 0, E.W, E.H * 0.3] });
  // wooden fence across the back
  fillRect(g, -E.W, GY - 260, E.W * 3, 260, '#6a4a2a');
  g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3;
  for (let x = -E.W; x < E.W * 2; x += 90) { g.beginPath(); g.moveTo(x, GY - 260); g.lineTo(x, GY); g.stroke(); }
  seg(g, [[-E.W, GY - 200], [E.W * 2, GY - 200]], 6, '#5a3a22');
  seg(g, [[-E.W, GY - 100], [E.W * 2, GY - 100]], 6, '#5a3a22');
  // garage wall + hoop (right)
  fillRect(g, E.W * 0.68, GY - 330, E.W * 0.32, 330, '#4a4a52');
  rr(g, E.W * 0.78, GY - 300, 110, 80, 6); g.fillStyle = '#f2ead8'; g.fill();
  g.strokeStyle = '#c94a3a'; g.lineWidth = 5; g.stroke();
  g.beginPath(); g.arc(E.W * 0.78 + 55, GY - 190, 24, 0, Math.PI); g.stroke();
  // string lights along the fence
  for (let i = 0; i < 7; i++) {
    const x = E.W * 0.06 + i * E.W * 0.09;
    const y = GY - 262 + Math.sin(i * 0.9) * 10;
    circle(g, x, y, 7, '#ffe9a8');
    circle(g, x, y, 14, 'rgba(255,233,168,0.16)');
  }
  // lawn
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#2a4a2a');
  // basketball on the grass (left) — hidden when the shot animates the ball
  // itself (s200/s201 pass { ball: false } so there is never a second ball)
  if (params.ball !== false) {
    circle(g, E.W * 0.16, GY + 100, 26, '#e07856');
    seg(g, [[E.W * 0.16 - 26, GY + 100], [E.W * 0.16 + 26, GY + 100]], 3, '#5a2a1a');
    seg(g, [[E.W * 0.16, GY + 74], [E.W * 0.16, GY + 126]], 3, '#5a2a1a');
  }
  dust(g, t, { count: 10, seed: 67 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

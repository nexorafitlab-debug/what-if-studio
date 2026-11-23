// scenes/sets/park.js — the park, golden afternoon (fresh).
// Big trees, a bench, a winding path, a pond glinting, birds in the sky.
// The next day, Eli tells June here: "I like you."
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, tree, clouds, hills } from '/engine/fx2d.js';

export function parkSet(g, t, info, params = {}) {
  const m = mood('golden');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#f7c98a', '#e08a5a', '#4a5a3a'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.80, E.H * 0.16, 42, '#fff3d0', '#ffcf8a', 4);
  clouds(g, { seed: 23, count: 4, y: E.H * 0.08, h: 70, color: '#ffffff', a: 0.25 });
  hills(g, { seed: 8, y: E.H * 0.62, amp: 60, color: '#3a4a2e' });
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#2e3a24');
  // pond glinting (left)
  g.fillStyle = '#5a8ac9';
  g.beginPath(); g.ellipse(E.W * 0.16, GY + 60, 200, 50, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.25)';
  g.beginPath(); g.ellipse(E.W * 0.14, GY + 48, 120, 16, 0, 0, Math.PI * 2); g.fill();
  // winding path
  g.strokeStyle = '#c9a86a'; g.lineWidth = 60; g.lineCap = 'round';
  g.beginPath(); g.moveTo(E.W * 0.42, E.H); g.quadraticCurveTo(E.W * 0.55, GY + 40, E.W * 0.62, GY - 200); g.stroke();
  tree(g, E.W * 0.08, GY, 1.4, '#1e2a18');
  tree(g, E.W * 0.90, GY, 1.2, '#1e2a18');
  tree(g, E.W * 0.68, GY - 60, 1.0, '#24301c');
  // bench
  rr(g, E.W * 0.52, GY - 90, 220, 16, 6); g.fillStyle = '#5a3a26'; g.fill();
  seg(g, [[E.W * 0.54, GY - 90], [E.W * 0.54, GY]], 6, '#3a2a1a');
  seg(g, [[E.W * 0.70, GY - 90], [E.W * 0.70, GY]], 6, '#3a2a1a');
  // birds in the sky
  for (let i = 0; i < 3; i++) {
    const bx = E.W * (0.30 + i * 0.08) + Math.sin(t + i) * 8, by = E.H * (0.14 + i * 0.03);
    seg(g, [[bx - 14, by], [bx, by - 8], [bx + 14, by]], 3, '#241b2e');
  }
  dust(g, t, { count: 10, seed: 191 });
  veil(g, '#000', 0.03);
  return { GY, CX, M: m };
}

// scenes/sets/rooftop.js — rooftop at sunset: orange sky, skyline, railing, AC unit, water tower.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, poly } from '/engine/core.js';
import { sun, skyline, dust, clouds } from '/engine/fx2d.js';

export function rooftop(g, t, info, params = {}) {
  const m = mood('golden');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // low sun, big and warm
  sun(g, E.W * 0.68, E.H * 0.42, 64, '#fff3dc', '#ff9e5e', 5);
  clouds(g, { seed: 77, count: 5, y: E.H * 0.12, h: 90, color: '#ffd9b0', a: 0.16 });
  skyline(g, { seed: 71, y: GY - 40, h: 300, color: '#4a2a3a', lit: 0.65 });
  // roof floor
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#3d2c38');
  // roof seams
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2;
  for (let x = -E.W; x < E.W * 2; x += 220) { g.beginPath(); g.moveTo(x, GY); g.lineTo(x - 120, E.H); g.stroke(); }
  // railing across the back
  seg(g, [[-E.W, GY - 150], [E.W * 2, GY - 150]], 10, '#241a30');
  seg(g, [[-E.W, GY - 80], [E.W * 2, GY - 80]], 6, '#241a30');
  for (let x = -E.W; x < E.W * 2; x += 180) seg(g, [[x, GY - 150], [x, GY]], 8, '#241a30');
  // AC unit (left)
  rr(g, E.W * 0.06, GY - 110, 220, 110, 8); g.fillStyle = '#2a2238'; g.fill();
  circle(g, E.W * 0.06 + 110, GY - 55, 34, '#1a1424');
  seg(g, [[E.W * 0.06 + 110 - 30, GY - 55], [E.W * 0.06 + 110 + 30, GY - 55]], 6, '#4a4a5a');
  seg(g, [[E.W * 0.06 + 110, GY - 85], [E.W * 0.06 + 110, GY - 25]], 6, '#4a4a5a');
  // water tower silhouette (right, behind railing)
  seg(g, [[E.W * 0.88, GY - 150], [E.W * 0.88, GY - 330]], 10, '#2a1a26');
  seg(g, [[E.W * 0.8, GY - 150], [E.W * 0.8, GY - 330]], 10, '#2a1a26');
  rr(g, E.W * 0.74, GY - 420, 280, 100, 20); g.fillStyle = '#2a1a26'; g.fill();
  poly(g, [[E.W * 0.74, GY - 420], [E.W * 0.88, GY - 470], [E.W * 1.02, GY - 420]], '#2a1a26');
  // warm sunset wash on the floor
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,158,94,0.10)';
  g.fillRect(-E.W, GY, E.W * 3, E.H - GY); g.restore();
  dust(g, t, { count: 20, seed: 78 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

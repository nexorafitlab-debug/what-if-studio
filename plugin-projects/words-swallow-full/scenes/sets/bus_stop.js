// scenes/sets/bus_stop.js — the bus stop in the morning (fresh for the full video).
// Bench, BUS STOP sign, lamp post, road with a centre line, houses behind.
// Eli waits here; the bus pulls in; the next morning the stranger boards.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, facade, lampPost, clouds } from '/engine/fx2d.js';

export function busStop(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#3a4a6a', '#1e2438'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.20, E.H * 0.16, 40, '#fff3d0', '#ffcf8a', 4);
  clouds(g, { seed: 19, count: 4, y: E.H * 0.08, h: 70, color: '#ffffff', a: 0.2 });
  facade(g, { x: E.W * 0.55, y: E.H * 0.52, w: E.W * 0.42, h: E.H * 0.36, color: '#2a2238', win: '#ffcf8a', lit: 0.4, cols: 4, rows: 2 });
  fillRect(g, -E.W, GY - 60, E.W * 3, 60, '#2a2a33');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#1c1c22');
  // road with centre line
  fillRect(g, -E.W, GY + 60, E.W * 3, 90, '#22222a');
  for (let x = 0; x < E.W; x += 120) fillRect(g, x + ((t * 40) % 120) - 60, GY + 100, 60, 8, '#e8b23a');
  // shelter: roof + posts + bench
  rr(g, E.W * 0.08, E.H * 0.30, 420, 30, 8); g.fillStyle = '#3a4a6a'; g.fill();
  seg(g, [[E.W * 0.10, E.H * 0.32], [E.W * 0.10, GY - 60]], 8, '#2a3442');
  seg(g, [[E.W * 0.46, E.H * 0.32], [E.W * 0.46, GY - 60]], 8, '#2a3442');
  rr(g, E.W * 0.12, GY - 150, 340, 18, 6); g.fillStyle = '#5a3a26'; g.fill();
  seg(g, [[E.W * 0.14, GY - 150], [E.W * 0.14, GY - 60]], 6, '#3a2a1a');
  seg(g, [[E.W * 0.42, GY - 150], [E.W * 0.42, GY - 60]], 6, '#3a2a1a');
  // BUS STOP sign
  seg(g, [[E.W * 0.60, E.H * 0.34], [E.W * 0.60, GY - 60]], 7, '#3a3a48');
  rr(g, E.W * 0.60 - 70, E.H * 0.20, 140, 110, 8); g.fillStyle = '#f2ead8'; g.fill();
  g.strokeStyle = '#c94a3a'; g.lineWidth = 4; g.stroke();
  text(g, 'BUS', E.W * 0.60, E.H * 0.20 + 44, { size: 32, color: '#c94a3a', font: FONTS.ui, weight: 900 });
  text(g, 'STOP', E.W * 0.60, E.H * 0.20 + 82, { size: 32, color: '#241b2e', font: FONTS.ui, weight: 900 });
  lampPost(g, E.W * 0.88, GY - 60, 300, { on: false });
  dust(g, t, { count: 8, seed: 61 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m };
}

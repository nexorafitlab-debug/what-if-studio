// scenes/sets/park.js — neighbourhood park, golden hour: path, big trees,
// bench, pond glint, low sun. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg } from '/engine/core.js';
import { sun, clouds, dust } from '/engine/fx2d.js';

export function park(g, t, info, params = {}) {
  const m = mood('golden');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.16, E.H * 0.16, 44, '#fff6e0', '#ffcf8a', 5);
  clouds(g, { seed: 71, count: 4, y: E.H * 0.1, h: 70, color: '#ffffff', a: 0.18 });
  // pond (right)
  rr(g, E.W * 0.62, GY - 60, 420, 90, 40); g.fillStyle = '#3a6a8a'; g.fill();
  g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(E.W * 0.68, GY - 44, 180, 10);
  // big trees
  const tree = (x, s) => {
    seg(g, [[x, GY], [x, GY - 200 * s]], 16, '#4a2a1a');
    circle(g, x, GY - 240 * s, 78 * s, '#2a6a2a');
    circle(g, x - 56 * s, GY - 196 * s, 52 * s, '#3a7a3a');
    circle(g, x + 56 * s, GY - 196 * s, 52 * s, '#1e5a1e');
  };
  tree(E.W * 0.14, 1.0); tree(E.W * 0.5, 0.8);
  // lawn + path
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#3a6a2a');
  fillRect(g, CX - 70, GY, 140, E.H - GY, '#b8a888');
  // bench (left of path)
  rr(g, E.W * 0.3, GY - 30, 200, 16, 6); g.fillStyle = '#5a3a2a'; g.fill();
  seg(g, [[E.W * 0.32, GY - 14], [E.W * 0.32, GY + 60]], 8, '#3a2418');
  seg(g, [[E.W * 0.46, GY - 14], [E.W * 0.46, GY + 60]], 8, '#3a2418');
  dust(g, t, { count: 14, seed: 73 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

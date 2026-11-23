// scenes/sets/train_station.js — the train station in the morning (fresh).
// Platform, benches, a big clock, an arch window, tracks, a departure
// board. Eli walks past here thinking: what is she sorry for?
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, clock, clouds } from '/engine/fx2d.js';

export function trainStation(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#3a4a6a', '#1e2438'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.16, E.H * 0.14, 38, '#fff3d0', '#ffcf8a', 4);
  clouds(g, { seed: 71, count: 3, y: E.H * 0.08, h: 60, color: '#ffffff', a: 0.2 });
  // station building (back)
  fillRect(g, -E.W, E.H * 0.34, E.W * 3, E.H * 0.30, '#2a2238');
  // arch windows
  for (let i = 0; i < 4; i++) {
    const x = E.W * (0.10 + i * 0.22);
    rr(g, x, E.H * 0.38, 140, 180, 60); g.fillStyle = '#ffcf8a'; g.fill();
    g.strokeStyle = '#1a1622'; g.lineWidth = 4; g.stroke();
  }
  // big clock
  clock(g, E.W * 0.50, E.H * 0.24, 46, 7.5 * 3600, { face: '#f2ead8', ink: '#241b2e' });
  // departure board
  rr(g, E.W * 0.66, E.H * 0.14, 420, 130, 8); g.fillStyle = '#1a1622'; g.fill();
  text(g, '7:42  CITY  ON TIME', E.W * 0.66 + 210, E.H * 0.14 + 48, { size: 26, color: '#7ee787', font: FONTS.ui, weight: 900 });
  text(g, '8:05  NORTH  5 MIN', E.W * 0.66 + 210, E.H * 0.14 + 92, { size: 26, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  // platform + tracks
  fillRect(g, -E.W, GY - 40, E.W * 3, 40, '#3a3a44');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#1c1c22');
  seg(g, [[-E.W, GY + 60], [E.W * 2, GY + 60]], 6, '#4a4a55');
  seg(g, [[-E.W, GY + 110], [E.W * 2, GY + 110]], 6, '#4a4a55');
  // benches
  for (let i = 0; i < 2; i++) {
    const x = E.W * (0.20 + i * 0.45);
    rr(g, x, GY - 110, 220, 16, 6); g.fillStyle = '#5a3a26'; g.fill();
    seg(g, [[x + 10, GY - 110], [x + 10, GY - 40]], 6, '#3a2a1a');
    seg(g, [[x + 200, GY - 110], [x + 200, GY - 40]], 6, '#3a2a1a');
  }
  dust(g, t, { count: 8, seed: 231 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m };
}

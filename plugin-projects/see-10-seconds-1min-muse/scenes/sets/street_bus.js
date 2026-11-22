// scenes/sets/street_bus.js — busy street at dusk: buildings, bus stop, road, a city bus.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, poly, text, FONTS } from '/engine/core.js';
import { facade, lampPost, skyline, dust } from '/engine/fx2d.js';

export function streetBus(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  skyline(g, { seed: 55, y: GY - 60, h: 260, color: '#241a30', lit: 0.5 });
  // buildings left + right
  facade(g, { x: -40, y: GY, w: 420, h: 560, color: '#2a2238', win: '#ffcf8a', cols: 4, rows: 4, lit: 0.55, seed: 51 });
  facade(g, { x: E.W - 380, y: GY, w: 420, h: 620, color: '#241e30', win: '#ffcf8a', cols: 4, rows: 5, lit: 0.5, seed: 52 });
  // sidewalk + road
  fillRect(g, -E.W, GY, E.W * 3, 90, '#4a4250');
  fillRect(g, -E.W, GY + 90, E.W * 3, E.H - GY - 90, m.road);
  // road dashes
  g.fillStyle = '#d8d0c0';
  for (let x = -((t * 0) % 160); x < E.W * 2; x += 160) g.fillRect(x, GY + 150, 80, 8);
  // bus stop sign
  seg(g, [[E.W * 0.72, GY], [E.W * 0.72, GY - 190]], 8, '#2a2238');
  rr(g, E.W * 0.72 - 34, GY - 260, 68, 68, 10); g.fillStyle = '#2e6ff0'; g.fill();
  text(g, 'BUS', E.W * 0.72, GY - 222, { size: 26, color: '#fff', font: FONTS.ui, weight: 900 });
  // lamp post
  lampPost(g, E.W * 0.12, GY, 320, { on: true });
  // ---- the bus (parked at the stop, doors open) ----
  const bx = params.busX ?? E.W * 0.42, by = GY + 6;
  rr(g, bx - 330, by - 210, 660, 210, 26); g.fillStyle = '#3a6ab0'; g.fill();
  rr(g, bx - 330, by - 210, 660, 60, 26); g.fillStyle = '#2e6ff0'; g.fill();
  // windows
  for (let i = 0; i < 5; i++) {
    rr(g, bx - 300 + i * 118, by - 190, 92, 84, 8); g.fillStyle = '#bcd0ff'; g.fill();
  }
  // open door (glowing)
  rr(g, bx + 210, by - 210, 92, 210, 8); g.fillStyle = '#ffe2a8'; g.fill();
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,226,168,0.14)';
  g.beginPath(); g.moveTo(bx + 210, by); g.lineTo(bx + 302, by); g.lineTo(bx + 380, GY + 60); g.lineTo(bx + 130, GY + 60); g.closePath(); g.fill(); g.restore();
  // wheels
  circle(g, bx - 210, by, 34, '#101018'); circle(g, bx - 210, by, 16, '#8a8a92');
  circle(g, bx + 210, by, 34, '#101018'); circle(g, bx + 210, by, 16, '#8a8a92');
  // headlight glow
  circle(g, bx + 330, by - 40, 14, '#fff3dc');
  dust(g, t, { count: 14, seed: 66 });
  veil(g, '#000', 0.07);
  return { GY, CX, M: m, bus: { x: bx, y: by } };
}

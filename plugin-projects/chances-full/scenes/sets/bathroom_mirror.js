// scenes/sets/bathroom_mirror.js — bathroom at night: big mirror on the wall, sink,
// tiles, towel, warm lamp. Fresh set for this video. The mirror itself is drawn
// by the shots (reflection = second figure); the set only draws the room.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, poly } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function bathroomMirror(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // tiled wall
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 2;
  for (let x = -E.W; x < E.W * 2; x += 110) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, GY); g.stroke(); }
  for (let y = 0; y < GY; y += 110) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
  // floor
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, m.floor);
  // big mirror (centre-left): frame + glass; shots draw the reflection inside it.
  const mx = E.W * 0.2, my = 130, mw = 620, mh = 460;
  rr(g, mx - 14, my - 14, mw + 28, mh + 28, 12); g.fillStyle = '#2a2238'; g.fill();
  rr(g, mx, my, mw, mh, 8); g.fillStyle = '#1a2a3a'; g.fill();
  g.save();
  g.globalCompositeOperation = 'lighter';
  g.fillStyle = 'rgba(159,216,255,0.10)';
  poly(g, [[mx, my + mh], [mx + 180, my], [mx + 340, my], [mx + 120, my + mh]], 'rgba(159,216,255,0.10)');
  g.restore();
  // lamp above the mirror
  rr(g, mx + 140, my - 62, 340, 26, 12); g.fillStyle = '#e8ecff'; g.fill();
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(220,230,255,0.10)';
  g.beginPath(); g.moveTo(mx + 140, my - 36); g.lineTo(mx + 480, my - 36); g.lineTo(mx + 620, GY); g.lineTo(mx, GY); g.closePath(); g.fill(); g.restore();
  // sink + tap under the mirror
  rr(g, mx + 60, GY - 150, 500, 60, 20); g.fillStyle = '#e8e4f4'; g.fill();
  seg(g, [[mx + 310, GY - 150], [mx + 310, GY - 230]], 10, '#8a8a92');
  seg(g, [[mx + 310, GY - 230], [mx + 360, GY - 230]], 10, '#8a8a92');
  circle(g, mx + 360, GY - 214, 8, '#9fd8ff');
  // towel on a rail (right)
  seg(g, [[E.W * 0.78, 240], [E.W * 0.92, 240]], 8, '#8a8a92');
  rr(g, E.W * 0.79, 240, 210, 260, 8); g.fillStyle = '#4a9a6a'; g.fill();
  rr(g, E.W * 0.79, 460, 210, 40, 6); g.fillStyle = '#3a7a52'; g.fill();
  // toothbrush cup on the sink
  rr(g, mx + 480, GY - 210, 44, 60, 6); g.fillStyle = '#e07856'; g.fill();
  seg(g, [[mx + 492, GY - 210], [mx + 488, GY - 250]], 5, '#ffd76a');
  seg(g, [[mx + 510, GY - 210], [mx + 514, GY - 250]], 5, '#9fd8ff');
  dust(g, t, { count: 12, seed: 37 });
  veil(g, '#000', 0.08);
  return { GY, CX, M: m, mirror: { x: mx, y: my, w: mw, h: mh } };
}

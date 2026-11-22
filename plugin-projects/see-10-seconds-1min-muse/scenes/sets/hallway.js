// scenes/sets/hallway.js — school hallway: lockers both sides, doors, ceiling lights.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function hallway(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // back wall + floor
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  // floor perspective lines
  g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 2;
  for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(CX + i * 60, GY); g.lineTo(CX + i * 260, E.H); g.stroke(); }
  for (let y = GY + 26; y < E.H; y += 34) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
  // lockers: left row (blue-grey) + right row (teal-grey)
  const locker = (x, y, w, h, col) => {
    rr(g, x, y, w, h, 6); g.fillStyle = col; g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2;
    for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(x + (w * i) / 4, y + 8); g.lineTo(x + (w * i) / 4, y + h - 8); g.stroke(); }
    for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x + (w * i) / 4 + 12, y + 26, w / 4 - 24, 8); }
  };
  locker(30, 130, 330, GY - 130, '#3a4a6a');
  locker(E.W - 360, 130, 330, GY - 130, '#3a5a5a');
  // classroom doors (centre-left and centre-right)
  rr(g, E.W * 0.24, 210, 150, GY - 210, 6); g.fillStyle = '#5a3a2a'; g.fill();
  circle(g, E.W * 0.24 + 122, 560, 9, '#ffd59a');
  rr(g, E.W * 0.68, 210, 150, GY - 210, 6); g.fillStyle = '#5a3a2a'; g.fill();
  circle(g, E.W * 0.68 + 28, 560, 9, '#ffd59a');
  // bulletin board with pinned notes
  rr(g, E.W * 0.44, 170, 260, 150, 6); g.fillStyle = '#2a3a2a'; g.fill();
  for (const [dx, dy, c] of [[30, 30, '#ffd76a'], [110, 24, '#f2e6c8'], [180, 40, '#9fd8ff'], [70, 90, '#e07856'], [150, 95, '#ffd76a']]) {
    rr(g, E.W * 0.44 + dx, 170 + dy, 56, 44, 3); g.fillStyle = c; g.fill();
  }
  // ceiling lights
  for (const x of [E.W * 0.3, E.W * 0.5, E.W * 0.7]) {
    rr(g, x - 90, 26, 180, 26, 12); g.fillStyle = '#e8ecff'; g.fill();
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(220,230,255,0.10)';
    g.beginPath(); g.moveTo(x - 90, 52); g.lineTo(x + 90, 52); g.lineTo(x + 220, GY); g.lineTo(x - 220, GY); g.closePath(); g.fill(); g.restore();
  }
  // exit sign at the far end
  rr(g, CX - 60, 96, 120, 44, 6); g.fillStyle = '#1a2a1a'; g.fill();
  text(g, 'EXIT', CX, 130, { size: 30, color: '#7ac74a', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 16, seed: 22 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

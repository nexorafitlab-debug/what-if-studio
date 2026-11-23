// scenes/sets/gym.js — the school gym (fresh).
// Basketball court lines, a hoop, bleachers, high windows. Theo cracks his
// joke here; later Eli tells him "I miss your mom too" here.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { dust, windowFrame, floorLines } from '/engine/fx2d.js';

export function gymSet(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#2a3040', '#141824'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#2e3444');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#1a1c24');
  // court floor: wooden boards + painted lines
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#8a5a30');
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 4;
  g.beginPath(); g.moveTo(E.W / 2, GY); g.lineTo(E.W / 2, E.H); g.stroke();
  g.beginPath(); g.arc(E.W / 2, GY + 120, 120, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(E.W * 0.10, GY + 60, 150, -Math.PI / 2, Math.PI / 2); g.stroke();
  // hoop (right)
  seg(g, [[E.W * 0.88, E.H * 0.10], [E.W * 0.88, GY - 120]], 8, '#1a1622');
  rr(g, E.W * 0.82, E.H * 0.10, 120, 90, 6); g.fillStyle = '#f2ead8'; g.fill();
  g.strokeStyle = '#c94a3a'; g.lineWidth = 5;
  g.beginPath(); g.arc(E.W * 0.82, GY - 140, 26, 0, Math.PI * 2); g.stroke();
  // bleachers (left)
  for (let i = 0; i < 3; i++) {
    rr(g, E.W * 0.02, E.H * (0.30 + i * 0.12), 300, 60, 6); g.fillStyle = i % 2 ? '#3a4a6a' : '#2a3a5a'; g.fill();
  }
  // high windows
  for (let i = 0; i < 3; i++) {
    windowFrame(g, { x: E.W * (0.30 + i * 0.22), y: E.H * 0.06, w: 220, h: 150, mullions: [0.5, 0] }, (gg2) => {
      gg2.fillStyle = linGrad(gg2, 0, 0, 0, 150, ['#d8ecff', '#a8c8ef']);
      gg2.fillRect(0, 0, 220, 150);
    });
  }
  // scoreboard
  rr(g, E.W * 0.44, E.H * 0.06, 260, 80, 8); g.fillStyle = '#1a1622'; g.fill();
  text(g, 'HOME  12 : 10  AWAY', E.W * 0.44 + 130, E.H * 0.06 + 52, { size: 26, color: '#ffd76a', font: FONTS.ui, weight: 900 });
  dust(g, t, { count: 8, seed: 211 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}

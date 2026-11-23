// scenes/sets/school_gate.js — the school gate in the morning (fresh).
// Iron gates, brick pillars, a banner, students streaming in, morning sun.
// Eli walks through saying everything now — every word, before it fades.
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { sun, dust, facade, clouds } from '/engine/fx2d.js';

export function schoolGate(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#f7c98a', '#e08a5a', '#6a4a6a'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  sun(g, E.W * 0.78, E.H * 0.14, 40, '#fff3d0', '#ffcf8a', 4);
  clouds(g, { seed: 81, count: 4, y: E.H * 0.08, h: 70, color: '#ffffff', a: 0.25 });
  facade(g, { x: E.W * 0.05, y: E.H * 0.50, w: E.W * 0.90, h: E.H * 0.34, color: '#4a3550', win: '#ffcf8a', lit: 0.4, cols: 9, rows: 2, door: true });
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#3a2a3a');
  // brick pillars
  for (const x of [E.W * 0.28, E.W * 0.68]) {
    rr(g, x, E.H * 0.30, 80, GY - E.H * 0.30, 6); g.fillStyle = '#8a4a3a'; g.fill();
    rr(g, x - 10, E.H * 0.28, 100, 30, 6); g.fillStyle = '#6a3a2a'; g.fill();
    circle(g, x + 40, E.H * 0.26, 16, '#ffd76a');
    glow(g, x + 40, E.H * 0.26, 60, '#ffd76a', 0.4);
  }
  // iron gates (open)
  for (let i = 0; i < 6; i++) {
    seg(g, [[E.W * 0.32 + i * 14, E.H * 0.34], [E.W * 0.32 + i * 14, GY]], 4, '#1a1622');
    seg(g, [[E.W * 0.62 + i * 14, E.H * 0.34], [E.W * 0.62 + i * 14, GY]], 4, '#1a1622');
  }
  seg(g, [[E.W * 0.32, E.H * 0.34], [E.W * 0.40, E.H * 0.34]], 6, '#1a1622');
  seg(g, [[E.W * 0.60, E.H * 0.34], [E.W * 0.68, E.H * 0.34]], 6, '#1a1622');
  // banner across the gate
  rr(g, E.W * 0.30, E.H * 0.18, E.W * 0.40, 70, 8); g.fillStyle = '#ffd76a'; g.fill();
  text(g, 'SAY WHAT YOU MEAN', E.W * 0.50, E.H * 0.18 + 46, { size: 34, color: '#241b2e', font: FONTS.ui, weight: 900, spacing: 2 });
  dust(g, t, { count: 10, seed: 261 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m };
}

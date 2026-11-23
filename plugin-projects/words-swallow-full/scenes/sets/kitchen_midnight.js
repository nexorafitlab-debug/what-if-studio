// scenes/sets/kitchen_midnight.js — the kitchen at midnight (fresh for the full video).
// Dark and blue, moon in the window, the fridge door cracked open with its
// light spilling out, a clock showing midnight. Dad comes home from
// warehouse nights; above his head: "I'M PROUD OF YOU, SON."
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, rr, fillRect, seg, text, FONTS, glow } from '/engine/core.js';
import { moon, dust, windowFrame, floorLines, clock, lightCone } from '/engine/fx2d.js';

export function kitchenMidnight(g, t, info, params = {}) {
  const m = mood('midnight');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#141a2e', '#080a14'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#12162a');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#0a0d18');
  floorLines(g, GY + 8, E.H);
  // moon window (right)
  windowFrame(g, { x: E.W * 0.68, y: E.H * 0.10, w: 400, h: 320, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = '#0e1526'; gg2.fillRect(0, 0, 400, 320);
    moon(gg2, 280, 110, 40, '#e8ecff');
    for (let i = 0; i < 12; i++) circle(gg2, (i * 67) % 400, (i * 53) % 300, 2, 'rgba(255,255,255,0.8)');
  });
  glow(g, E.W * 0.82, E.H * 0.26, 200, '#9fb4d8', 0.18);
  // fridge (left) — door cracked open, light spilling out
  rr(g, E.W * 0.05, GY - 560, 260, 560, 10); g.fillStyle = '#3a3444'; g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 3; g.stroke();
  lightCone(g, E.W * 0.18, GY - 300, { angle: Math.PI / 2, spread: 0.9, len: 500, color: '#ffe9b0', a: 0.20 });
  rr(g, E.W * 0.05 + 200, GY - 540, 60, 520, 8); g.fillStyle = '#fff3d0'; g.fill();
  // wall clock showing midnight
  clock(g, E.W * 0.48, E.H * 0.10, 34, 0, { face: '#f2ead8', ink: '#241b2e' });
  // table with two mugs, cold and untouched
  rr(g, E.W * 0.30, GY - 150, E.W * 0.44, 46, 8); g.fillStyle = '#3a2a1e'; g.fill();
  fillRect(g, E.W * 0.30, GY - 104, E.W * 0.44, 150, '#2a1e16');
  rr(g, E.W * 0.36, GY - 196, 52, 46, 6); g.fillStyle = '#5a5a6a'; g.fill();
  rr(g, E.W * 0.60, GY - 196, 52, 46, 6); g.fillStyle = '#5a5a6a'; g.fill();
  // lunchbox on the counter (Dad's warehouse lunchbox)
  rr(g, E.W * 0.44, GY - 260, 130, 90, 8); g.fillStyle = '#5a4a3a'; g.fill();
  seg(g, [[E.W * 0.44, GY - 215], [E.W * 0.44 + 130, GY - 215]], 4, 'rgba(0,0,0,0.4)');
  dust(g, t, { count: 6, seed: 91 });
  veil(g, '#000', 0.10);
  return { GY, CX, M: m };
}

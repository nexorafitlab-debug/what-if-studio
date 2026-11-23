// scenes/sets/street_rain.js — a wet street in the rain, dusk. Fresh set for this
// video: houses, a lamp post, puddles, falling rain. Tiny Noah meets a giant
// raindrop here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { rain, lampPost, facade, floorLines } from '/engine/fx2d.js';

export function streetRain(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  // houses along the street
  facade(g, { x: -E.W * 0.1, y: GY, w: 700, h: 480, color: '#3a2a44', win: '#ffcf8a', lit: 0.7, cols: 3, rows: 2, seed: 81 });
  facade(g, { x: E.W * 0.55, y: GY, w: 760, h: 520, color: '#2a3444', win: '#ffcf8a', lit: 0.6, cols: 3, rows: 2, seed: 82 });
  // wet road + puddles
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#2a2530');
  floorLines(g, GY + 6, E.H);
  circle(g, E.W * 0.25, GY + 90, 120, 'rgba(159,216,255,0.14)');
  circle(g, E.W * 0.70, GY + 120, 90, 'rgba(159,216,255,0.12)');
  lampPost(g, E.W * 0.88, GY, 340, {});
  // falling rain (foreground + background)
  rain(g, t, { count: 90, seed: 83, speed: 700, color: '#bcd8ff' });
  veil(g, '#000', 0.08);
  return { GY, CX, M: m };
}

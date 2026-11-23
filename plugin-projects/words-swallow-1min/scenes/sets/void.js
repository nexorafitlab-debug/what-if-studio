// scenes/sets/void.js — dark starry void for text cards and the rule.
// Fresh drawing for the words-swallow video (NOT copied from Change Size).
// Deep navy gradient, slow-twinkle stars, a faint gold horizon glow at the
// bottom (the light the gold words rise toward).
import { E, V, mood, backdrop, linGrad, alpha, veil, circle, glow } from '/engine/core.js';
import { stars } from '/engine/fx2d.js';

export function voidSet(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.86, CX = E.W / 2;
  backdrop(g, ['#070a18', '#0b1024', '#05070f'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { seed: 9, count: 170, area: [0, 0, E.W, E.H * 0.75], color: '#dfe8ff' });
  stars(g, t * 0.6, { seed: 21, count: 60, area: [0, E.H * 0.4, E.W, E.H * 0.6], color: '#ffd76a' });
  // faint gold horizon glow at the bottom
  glow(g, CX, E.H * 1.02, 700, '#ffd76a', 0.10);
  glow(g, CX, E.H * 1.02, 420, '#ffedb0', 0.10);
  veil(g, '#000', 0.06);
  return { GY, CX, M: m };
}

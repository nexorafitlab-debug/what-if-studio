// scenes/sets/void.js — dark starry void for name cards, rule cards and the title.
import { E, V, mood, backdrop, veil } from '/engine/core.js';
import { stars } from '/engine/fx2d.js';

export function voidSet(g, t, info, params = {}) {
  const m = mood('void');
  backdrop(g, ['#05070d', '#070a12'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { count: 110, seed: 99, area: [0, 0, E.W, E.H] });
  veil(g, '#000', 0.25);
  return { GY: E.H * 0.8, CX: E.W / 2, M: m };
}

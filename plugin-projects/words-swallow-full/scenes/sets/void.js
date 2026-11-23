// scenes/sets/void.js — the dark starry void (fresh for the full video).
// Deep navy gradient, twinkling stars, a faint gold nebula glow. Science
// cards, text cards, name cards and the title card all live here.
import { E, V, mood, backdrop, veil, glow } from '/engine/core.js';
import { stars, dust } from '/engine/fx2d.js';

export function voidSet(g, t, info, params = {}) {
  const m = mood('dusk');
  backdrop(g, ['#0d1226', '#05070f'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { seed: 5, count: 160, area: [0, 0, E.W, E.H * 0.75], color: '#ffffff' });
  stars(g, t * 0.6, { seed: 9, count: 60, area: [0, E.H * 0.5, E.W, E.H * 0.5], color: '#9fb4d8' });
  glow(g, E.W * 0.5, E.H * 0.30, 420, '#ffd76a', 0.05);
  glow(g, E.W * 0.15, E.H * 0.70, 300, '#4a7ac9', 0.06);
  dust(g, t, { count: 8, seed: 161 });
  veil(g, '#000', 0.05);
  return { GY: E.H * 0.84, CX: E.W / 2, M: m };
}

// s064 — "One bad moment takes one second. That is the math." Void: 1 SECOND vs 66 DAYS.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s075', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.3, 0.6));
  text(g, '1 SECOND', E.W / 2, E.H * 0.38, { size: V(96, 104), color: '#ff8a7a', glow: 30, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a1 });
} });

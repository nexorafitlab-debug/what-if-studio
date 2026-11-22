// s143 P2 — "Because one day, it is." Void: BECAUSE ONE DAY, IT IS, red.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s216', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.05, 0.2));
  text(g, 'BECAUSE ONE DAY, IT IS.', E.W / 2, E.H * 0.50, { size: V(56, 64), color: '#ff6a5a', glow: 26, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a1 });
} });

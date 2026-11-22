// s086 P2 — "Zero means done." Void: ZERO MEANS DONE, red.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s112', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.3, 0.6));
  text(g, 'ZERO MEANS DONE.', E.W / 2, E.H * 0.50, { size: V(64, 72), color: '#ff8a7a', glow: 30, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a1 });
} });

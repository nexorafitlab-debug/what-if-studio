// s086 — "Zero does not mean angry. Zero means done." Void: gold text, two lines.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s111', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.05, 0.2));
  text(g, 'ZERO DOES NOT MEAN ANGRY.', E.W / 2, E.H * 0.40, { size: V(52, 60), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
} });

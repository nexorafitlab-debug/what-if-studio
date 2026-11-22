// s064 P2 — "That is the math. One second to break it." Void: 1 SECOND TO BREAK IT.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s076', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.3, 0.6)), a2 = clamp(prog(t, 1.0, 1.3));
  text(g, '1 SECOND', E.W / 2, E.H * 0.42, { size: V(96, 104), color: '#ff8a7a', glow: 30, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a1 });
  text(g, 'TO BREAK IT', E.W / 2, E.H * 0.58, { size: V(52, 60), color: '#ff8a7a', glow: 26, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a2 });
} });

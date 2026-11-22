// s142 P2 — "You can only earn the next one." Void: EARN THE NEXT ONE, blue.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s214', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.4, 0.7));
  text(g, 'EARN THE NEXT ONE.', E.W / 2, E.H * 0.50, { size: V(56, 64), color: '#9fd8ff', glow: 26, glowColor: 'rgba(159,216,255,0.5)', spacing: 2, alpha: a1 });
} });

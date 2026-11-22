// s143 — "So spend every chance like it is your last. Because one day, it is." Void: gold closing card.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s215', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.3, 0.6));
  text(g, 'SPEND EVERY CHANCE', E.W / 2, E.H * 0.38, { size: V(60, 68), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'LIKE IT IS YOUR LAST.', E.W / 2, E.H * 0.50, { size: V(60, 68), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
} });

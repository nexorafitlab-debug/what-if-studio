// s142 — "The point is: you cannot earn a chance back. You can only earn the next one." Void: gold moral card.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s213', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.05, 0.2));
  text(g, 'YOU CANNOT EARN', E.W / 2, E.H * 0.36, { size: V(60, 68), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'A CHANCE BACK.', E.W / 2, E.H * 0.48, { size: V(60, 68), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
} });

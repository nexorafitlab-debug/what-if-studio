// s021 — black screen: the hook. "...and start choosing?"
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s021', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.1, 0.5)), a2 = clamp(prog(t, 0.9, 1.3));
  text(g, 'STOP PREVENTING...', E.W / 2, E.H * 0.38, { size: V(72, 80), color: '#ffd76a', glow: 28, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'START CHOOSING?', E.W / 2, E.H * 0.55, { size: V(72, 80), color: '#ffd76a', glow: 28, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a2 });
} });

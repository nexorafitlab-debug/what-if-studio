// s064 P3 — "Sixty-six days to rebuild it." Void: 66 DAYS TO REBUILD IT.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
registerShot('s077', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.3, 0.6)), a2 = clamp(prog(t, 1.0, 1.3));
  text(g, '66 DAYS', E.W / 2, E.H * 0.42, { size: V(110, 120), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'TO REBUILD IT', E.W / 2, E.H * 0.58, { size: V(52, 60), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a2 });
} });

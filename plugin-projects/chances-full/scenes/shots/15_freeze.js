// s015 — FREEZE. "Science says it takes five good moments to undo one bad one."
// Science insert on the starry void: 5 GOOD MOMENTS = 1 BAD ONE, Gottman Institute.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { freezeLabel } from '../_helpers.js';
registerShot('s016', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  freezeLabel(g, t, { dur: info.dur, y: E.H * 0.16 });
  const a1 = clamp(prog(t, 0.3, 0.7)), a2 = clamp(prog(t, 1.2, 1.6)), a3 = clamp(prog(t, 2.0, 2.4));
  text(g, '5 GOOD MOMENTS', E.W / 2, E.H * 0.42, { size: V(84, 92), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, '= 1 BAD ONE', E.W / 2, E.H * 0.57, { size: V(84, 92), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a2 });
  text(g, 'GOTTMAN INSTITUTE', E.W / 2, E.H * 0.72, { size: V(36, 40), color: '#9fd8ff', glow: 16, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a3 });
} });

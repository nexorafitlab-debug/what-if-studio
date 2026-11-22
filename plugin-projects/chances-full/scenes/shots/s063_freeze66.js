// s063 — FREEZE. "Science says a new habit takes sixty-six days." Void: FREEZE label + 66 DAYS.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { freezeLabel } from '../_helpers.js';
registerShot('s073', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  freezeLabel(g, t, { dur: info.dur, y: E.H * 0.16 });
  const a1 = clamp(prog(t, 0.3, 0.7)), a2 = clamp(prog(t, 1.2, 1.6)), a3 = clamp(prog(t, 2.0, 2.4));
  text(g, '66 DAYS', E.W / 2, E.H * 0.42, { size: V(110, 120), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'TO BUILD ONE GOOD HABIT', E.W / 2, E.H * 0.58, { size: V(52, 60), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a2 });
  text(g, 'LALLY ET AL., 2010', E.W / 2, E.H * 0.72, { size: V(36, 40), color: '#9fd8ff', glow: 16, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a3 });
} });

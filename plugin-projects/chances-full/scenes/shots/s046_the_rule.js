// s046 — "That is the rule." Void: gold rule card, Kian small beneath it.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { voidSet } from '../sets/void.js';
import { CAST } from '../cast.js';
registerShot('s052', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'THAT IS THE RULE.', E.W / 2, E.H * 0.42, { size: V(72, 80), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
  layer(g, { z: 1 }, 1, (g) => {
    const GY = E.H * 0.8;
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.1, 1.2), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: '#ffd76a', dir: [-1, -1], w: 3 } });
  });
} });

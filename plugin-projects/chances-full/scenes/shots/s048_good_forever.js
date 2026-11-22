// s048 — "Good takes forever to matter." Void: gold text, Kian waiting, pill 6 that never moves.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { voidSet } from '../sets/void.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s054', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'GOOD TAKES FOREVER TO MATTER.', E.W / 2, E.H * 0.30, { size: V(48, 56), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
  layer(g, { z: 1 }, 1, (g) => {
    const GY = E.H * 0.8;
    const p = { x: E.W * 0.5, y: GY, s: V(1.25, 1.35), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'thinking', rim: { color: '#ffd76a', dir: [-1, -1], w: 3 } };
    drawFigure(g, p);
    const [hx, hy, hr] = headPos(p);
    chancePill(g, hx, hy, hr, '6', t);
  });
} });

// s047 — "Bad drops it in a second." Void: gold text, a pill 7 jumping to 6 beside it.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { voidSet } from '../sets/void.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s053', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'BAD DROPS IT IN A SECOND.', E.W / 2, E.H * 0.30, { size: V(56, 64), color: '#ff8a7a', glow: 30, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a });
  layer(g, { z: 1 }, 1, (g) => {
    const GY = E.H * 0.8;
    const p = { x: E.W * 0.5, y: GY, s: V(1.25, 1.35), facing: 1, outfit: CAST.PASSER1.outfit, pose: breathe(t > 1.0 ? POSES.sad : POSES.stand, t, 1, 2), expr: t > 1.0 ? 'sad' : 'neutral', rim: { color: '#ffd76a', dir: [-1, -1], w: 3 } };
    drawFigure(g, p);
    const [hx, hy, hr] = headPos(p);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '7'], [1.0, '6']]), t);
  });
} });

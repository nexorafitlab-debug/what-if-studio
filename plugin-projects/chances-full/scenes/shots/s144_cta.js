// s144 — "Tell me in the comments. Who would you call first?" Void end card: the question, gold, with Kian below.
import { E, V, registerShot, layer, prog, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { voidSet } from '../sets/void.js';
import { CAST } from '../cast.js';
registerShot('s217', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.3, 0.6)), a2 = clamp(prog(t, 1.2, 1.5));
  text(g, 'TELL ME IN THE COMMENTS.', E.W / 2, E.H * 0.34, { size: V(60, 68), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'WHO WOULD YOU CALL FIRST?', E.W / 2, E.H * 0.48, { size: V(56, 64), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a2 });
  layer(g, { z: 1 }, 1, (g) => {
    const GY = E.H * 0.8;
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.2, 1.3), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.wave, t, 1, 2), expr: 'smile', rim: { color: '#ffd76a', dir: [-1, -1], w: 3 } });
  });
} });

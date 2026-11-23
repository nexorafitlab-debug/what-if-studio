import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetMorning } from '../sets/street_morning.js';
registerShot('s008', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = streetMorning(g, t, info, {});
    // "What is she sorry for?" — Eli walks to school, thinking, hand on chin
    const w = walkLocked(t, { x0: E.W * 0.10, stride: 52, stepDur: 0.5, facing: 1 });
    const pose = t < 1.8 ? w.pose : breathe(posesAt(t, [[1.8, POSES.think]]), t);
    const x = t < 1.8 ? w.x : E.W * 0.10 + (52 / 0.5) * 1.8;
    drawFigure(g, { x, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose, expr: exprAt(t, [[0, 'thinking'], [1.8, 'thinking']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.3, -0.3], rim });
  });
} });

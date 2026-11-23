import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetMorning } from '../sets/street_morning.js';
registerShot('s010', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, gateX } = streetMorning(g, t, info, {});
    // "She was working late." — Eli slows, stops, looks up at the school gate
    const k = prog(t, 0, 0.7);
    const x = lerp(E.W * 0.38, E.W * 0.44, k);
    const pose = t < 0.7 ? walkPose(t * 6) : breathe(posesAt(t, [[0.7, POSES.stand], [0.9, POSES.sad]]), t);
    drawFigure(g, { x, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose, expr: exprAt(t, [[0, 'sad'], [0.9, 'worried']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.3, -0.5], rim });
  });
} });

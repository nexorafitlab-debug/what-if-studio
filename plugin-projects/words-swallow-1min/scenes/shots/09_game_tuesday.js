import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetMorning } from '../sets/street_morning.js';
registerShot('s009', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = streetMorning(g, t, info, {});
    // "She missed your game last Tuesday." — Eli keeps walking, head down
    const w = walkLocked(t, { x0: E.W * 0.28, stride: 52, stepDur: 0.55, facing: 1 });
    drawFigure(g, { x: w.x, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: w.pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, 0.5], rim });
    // a passer-by walks the other way, oblivious
    const p = walkLocked(t, { x0: E.W * 0.92, stride: 48, stepDur: 0.55, facing: -1 });
    drawFigure(g, { x: p.x, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.PASSER1.outfit, pose: p.pose, expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12 });
  });
} });

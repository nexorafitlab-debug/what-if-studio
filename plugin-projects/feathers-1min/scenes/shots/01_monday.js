import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
registerShot('s001', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // Monday morning — Kai walks into the kitchen, Mom at the table
    const w = walkLocked(t, { x0: E.W * 0.06, stride: 52, stepDur: 0.5, facing: 1 });
    const stopX = E.W * 0.06 + (52 / 0.5) * 1.0;
    const walking = t < 1.0;
    const x = walking ? w.x : stopX;
    const pose = walking ? w.pose : breathe(posesAt(t, [[1.0, POSES.stand]]), t);
    drawFigure(g, { x, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.KAI.outfit, pose, expr: exprAt(t, [[0, 'neutral'], [1.0, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.3, -0.2], rim });
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.talk]]), t), expr: 'smile', talk: 0, blink: (t % 3.7) < 0.12 });
  });
} });

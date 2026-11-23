import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { classroom } from '../sets/classroom.js';
import { seatedRow } from '../sets/classroom.js';
import { sizePill } from '../_helpers.js';
registerShot('s020', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = classroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Or ten meters." — GIANT Noah, head near the ceiling, desk tiny below
    const fig = { x: E.W * 0.48, y: GY, s: 3.1, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.pointUp]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.6, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '10 m', 'red', t, { at: 0.1, hold: 1.0 });
    seatedRow(g, t, info, GY + 20, [
      { x: E.W * 0.16, cast: CAST.STU1, expr: 'scared', look: [0.3, -0.6] },
      { x: E.W * 0.78, cast: CAST.STU3, expr: 'scared', look: [-0.3, -0.6] },
      { x: E.W * 0.90, cast: CAST.STU4, expr: 'scared', look: [-0.4, -0.6] },
    ], rim);
  });
} });

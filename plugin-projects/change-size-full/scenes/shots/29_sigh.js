import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { classroom } from '../sets/classroom.js';
import { seatedRow } from '../sets/classroom.js';
registerShot('s029', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = classroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // Your teacher sighs — head drops, hand to forehead
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.TEACHER.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.facepalm]]), t), expr: exprAt(t, [[0, 'neutral'], [0.5, 'sad']]), talk: 0, blink: (t % 3.5) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: 2.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.reach], [0.8, POSES.stand]]), t), expr: 'nervous', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    seatedRow(g, t, info, GY + 20, [
      { x: E.W * 0.52, cast: CAST.STU1, expr: 'smile', look: [-0.4, -0.2] },
      { x: E.W * 0.72, cast: CAST.STU5, expr: 'smile', look: [-0.4, -0.2] },
      { x: E.W * 0.88, cast: CAST.STU6, expr: 'smile', look: [-0.5, -0.2] },
    ], rim);
  });
} });

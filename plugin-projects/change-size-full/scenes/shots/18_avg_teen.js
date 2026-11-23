import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { classroom } from '../sets/classroom.js';
import { seatedRow } from '../sets/classroom.js';
registerShot('s018', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, chartX } = classroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // Noah stands by the height chart, pointing up at the 1.7 m mark
    drawFigure(g, { x: chartX + 130, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.pointUp]]), t), expr: exprAt(t, [[0, 'neutral'], [0.8, 'thinking']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // teacher at the board, students seated at desks, all facing front
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.TEACHER.outfit, pose: breathe(POSES.stand, t), expr: 'neutral', talk: 0, blink: (t % 3.5) < 0.12, rim });
    seatedRow(g, t, info, GY + 20, [
      { x: E.W * 0.30, cast: CAST.STU1, expr: 'neutral', look: [0.4, 0] },
      { x: E.W * 0.48, cast: CAST.STU2, expr: 'neutral', look: [0.3, 0] },
      { x: E.W * 0.72, cast: CAST.STU3, expr: 'neutral', look: [-0.3, 0] },
      { x: E.W * 0.88, cast: CAST.STU4, expr: 'neutral', look: [-0.4, 0] },
    ], rim);
  });
} });

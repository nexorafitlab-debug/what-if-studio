import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { classroom } from '../sets/classroom.js';
import { seatedRow } from '../sets/classroom.js';
registerShot('s028', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = classroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // At school you GROW to reach the top of the board
    const k = ease.inOut(prog(t, 0.1, 1.0));
    const s = lerp(1.5, 2.3, k);
    drawFigure(g, { x: E.W * 0.24, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.reach]]), t), expr: exprAt(t, [[0, 'neutral'], [0.6, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.TEACHER.outfit, pose: breathe(POSES.stand, t), expr: 'confused', talk: 0, blink: (t % 3.5) < 0.12, rim });
    seatedRow(g, t, info, GY + 20, [
      { x: E.W * 0.48, cast: CAST.STU2, expr: 'surprised', look: [-0.4, -0.3] },
      { x: E.W * 0.68, cast: CAST.STU3, expr: 'surprised', look: [-0.4, -0.3] },
      { x: E.W * 0.86, cast: CAST.STU4, expr: 'surprised', look: [-0.5, -0.3] },
    ], rim);
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { classroom } from '../sets/classroom.js';
import { seatedRow } from '../sets/classroom.js';
import { sizePill } from '../_helpers.js';
registerShot('s019', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = classroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You? Ten centimeters." — TINY Noah stands ON a desk; everyone stares
    const fig = { x: E.W * 0.48, y: GY - 58, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.wave]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.6, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '0.1 m', 'green', t, { at: 0.1, hold: 1.0 });
    seatedRow(g, t, info, GY + 20, [
      { x: E.W * 0.30, cast: CAST.STU1, expr: 'surprised', look: [0.4, -0.4] },
      { x: E.W * 0.72, cast: CAST.STU3, expr: 'shocked', look: [-0.4, -0.4] },
      { x: E.W * 0.88, cast: CAST.STU4, expr: 'surprised', look: [-0.5, -0.4] },
    ], rim);
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.TEACHER.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'shocked', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
} });

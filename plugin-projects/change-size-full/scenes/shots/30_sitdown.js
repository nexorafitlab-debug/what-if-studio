import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { classroom } from '../sets/classroom.js';
import { seatedRow } from '../sets/classroom.js';
registerShot('s030', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = classroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Noah. Sit down. All of you." — teacher points, Noah shrinks and sits
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.TEACHER.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.point]]), t), expr: 'angry', talk: 0, blink: (t % 3.5) < 0.12, rim });
    const k = ease.inOut(prog(t, 0.6, 1.4));
    const s = lerp(2.3, 1.5, k);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.sit]]), t);
    drawFigure(g, { x: E.W * 0.44, y: GY + 10, s, facing: 1, outfit: CAST.NOAH.outfit, pose, expr: exprAt(t, [[0, 'nervous'], [0.9, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    seatedRow(g, t, info, GY + 20, [
      { x: E.W * 0.62, cast: CAST.STU2, expr: 'neutral', look: [-0.3, 0] },
      { x: E.W * 0.78, cast: CAST.STU3, expr: 'neutral', look: [-0.3, 0] },
      { x: E.W * 0.90, cast: CAST.STU4, expr: 'neutral', look: [-0.4, 0] },
    ], rim);
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { classroom } from '../sets/classroom.js';
import { seatedRow } from '../sets/classroom.js';
registerShot('s031', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = classroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // MINUS: everyone stares — every head turns to Noah
    drawFigure(g, { x: E.W * 0.44, y: GY + 10, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sit, t), expr: 'nervous', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    seatedRow(g, t, info, GY + 20, [
      { x: E.W * 0.16, cast: CAST.STU1, expr: 'surprised', look: [0.5, 0] },
      { x: E.W * 0.62, cast: CAST.STU2, expr: 'surprised', look: [-0.5, 0] },
      { x: E.W * 0.78, cast: CAST.STU3, expr: 'shocked', look: [-0.5, 0] },
      { x: E.W * 0.90, cast: CAST.STU4, expr: 'surprised', look: [-0.5, 0] },
    ], rim);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.TEACHER.outfit, pose: breathe(POSES.crossArms, t), expr: 'angry', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'MINUS', E.W / 2, E.H * 0.16, { size: V(56, 60), color: '#e07856', glow: 20, glowColor: 'rgba(224,120,86,0.5)', spacing: 6, alpha: a });
} });

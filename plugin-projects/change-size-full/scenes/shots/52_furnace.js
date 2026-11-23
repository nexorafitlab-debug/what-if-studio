import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { dining } from '../sets/dining.js';
import { drawBurger } from '../sets/dining.js';
registerShot('s052', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = dining(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Grow big, and you eat like a furnace." — burgers vanish one by one
    drawFigure(g, { x: E.W * 0.44, y: GY + 10, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [0.4, POSES.holdFront], [1.0, POSES.sit]]), t), expr: 'happy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const n = 3 - Math.floor(prog(t, 0, 1.6) * 3);
    for (let i = 0; i < n; i++) drawBurger(g, E.W * (0.46 + i * 0.08), GY - 100, 1);
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.crossArms, t), expr: 'confused', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

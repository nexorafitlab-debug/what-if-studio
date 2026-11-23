import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { dining } from '../sets/dining.js';
import { drawBurger } from '../sets/dining.js';
registerShot('s050', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, table } = dining(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The catch? You come home starving." — Noah bursts in, starving
    const nx = lerp(E.W * 0.08, E.W * 0.36, ease.out(prog(t, 0, 0.8)));
    drawFigure(g, { x: nx, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 1.1), expr: exprAt(t, [[0, 'neutral'], [0.8, 'worried']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t), expr: 'surprised', talk: 0, blink: (t % 3.3) < 0.12, rim });
    drawBurger(g, E.W * 0.50, GY - 100, 1);
    drawBurger(g, E.W * 0.58, GY - 100, 1);
  });
} });

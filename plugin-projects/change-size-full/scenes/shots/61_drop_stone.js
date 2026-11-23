import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetRain } from '../sets/street_rain.js';
import { drawDrop, sizePill } from '../_helpers.js';
import { rings } from '/engine/fx2d.js';
registerShot('s061', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = streetRain(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "A drop hits your shoulder. It feels like a stone." — giant drop falls
    const fig = { x: E.W * 0.5, y: GY + 10, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.handsOnHead], [2.2, POSES.crouch]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.8, 'worried'], [2.2, 'scared']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const dy = lerp(-120, GY - 30, ease.in(prog(t, 0.4, 2.0)));
    if (t < 2.0) drawDrop(g, E.W * 0.5, dy, 64, 0.1);
    if (t >= 2.0) rings(g, E.W * 0.5, GY - 10, t - 2.0, { count: 2, r0: 30, r1: 220, color: '#9fd8ff', a: 0.5 });
  });
} });

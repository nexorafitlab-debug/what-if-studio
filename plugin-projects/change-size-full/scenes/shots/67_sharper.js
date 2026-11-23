import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetRain } from '../sets/street_rain.js';
import { drawDrop } from '../_helpers.js';
registerShot('s067', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = streetRain(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The smaller you get... the sharper it gets." — tiny Noah, drops like stones
    drawFigure(g, { x: E.W * 0.5, y: GY + 10, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.handsOnHead]]), t), expr: exprAt(t, [[0, 'worried'], [0.7, 'scared']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // two drops fall past him like boulders
    const d1 = lerp(-80, GY - 20, ease.in(prog(t, 0.2, 1.6)));
    const d2 = lerp(-160, GY - 20, ease.in(prog(t, 0.7, 2.2)));
    drawDrop(g, E.W * 0.38, d1, 40, 0.1);
    drawDrop(g, E.W * 0.62, d2, 34, -0.1);
    text(g, 'SHARPER', E.W / 2, E.H * 0.90, { size: V(48, 52), color: '#9fd8ff', glow: 18, glowColor: 'rgba(159,216,255,0.5)', spacing: 3, alpha: clamp(prog(t, 0.5, 0.9)) });
  });
} });

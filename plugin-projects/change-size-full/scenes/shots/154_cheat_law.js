import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { nature } from '../sets/nature.js';
import { drawAnt } from '../sets/nature.js';
registerShot('s154', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, hill } = nature(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Small animals cheat the law." — ants march over the anthill
    drawAnt(g, E.W * 0.22 + t * 40, GY - 10, 1.4, 1, t);
    drawAnt(g, E.W * 0.34 + t * 30, GY + 6, 1.2, 1, t + 1);
    drawAnt(g, E.W * 0.44 + t * 50, GY - 20, 1.5, 1, t + 2);
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.crouch, t), expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

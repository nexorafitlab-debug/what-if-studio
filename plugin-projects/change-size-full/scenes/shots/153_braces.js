import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { science } from '../sets/science.js';
registerShot('s153', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = science(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "His legs needed braces. He died at twenty-two." — Wadlow, braced, frail
    drawFigure(g, { x: E.W * 0.30, y: GY, s: 2.6, facing: 1, outfit: CAST.WADLOW.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.sad]]), t), expr: 'sad', talk: 0, blink: (t % 3.5) < 0.12, rim });
    // leg braces (grey bars along his legs)
    seg(g, [[E.W * 0.30 - 20, GY - 100], [E.W * 0.30 - 20, GY]], 8, '#8a8a9a');
    seg(g, [[E.W * 0.30 + 20, GY - 100], [E.W * 0.30 + 20, GY]], 8, '#8a8a9a');
    drawFigure(g, { x: E.W * 0.62, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

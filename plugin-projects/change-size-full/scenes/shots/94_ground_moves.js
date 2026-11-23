import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s094', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, { shake: true });
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Then the ground moves." — Noah and Milo stumble as the floor shakes
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.ready]]), t), expr: 'scared', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.handsOnHead]]), t), expr: 'scared', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.82, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.GYM1.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'scared', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

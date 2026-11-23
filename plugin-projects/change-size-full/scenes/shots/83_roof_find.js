import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { roof } from '../sets/roof.js';
registerShot('s083', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = roof(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "He finds you on the roof after school." — Milo walks over to Noah
    const mx = lerp(E.W * 0.78, E.W * 0.56, ease.out(prog(t, 0, 1.4)));
    drawFigure(g, { x: mx, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'worried', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sit, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

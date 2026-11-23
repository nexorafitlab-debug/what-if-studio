import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
registerShot('s137', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, { cheer: 1 });
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The crowd cheers." — the whole school erupts
    drawFigure(g, { x: E.W * 0.44, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.MOM.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

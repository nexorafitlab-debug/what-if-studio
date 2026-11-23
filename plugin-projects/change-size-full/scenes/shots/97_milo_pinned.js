import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s097', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, beam } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Milo is under it. Pinned." — Milo lies under the fallen beam
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.lie, t), expr: 'scared', talk: 0, blink: (t % 3.1) < 0.12, rim, rot: 0 });
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.handsOnHead], [0.6, POSES.ready]]), t), expr: exprAt(t, [[0, 'shocked'], [0.6, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { court } from '../sets/court.js';
registerShot('s035', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = court(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Noah. That's cheating." — the ref blows the whistle, crowd gasps
    drawFigure(g, { x: E.W * 0.52, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.holdFront], [0.7, POSES.shrug]]), t), expr: exprAt(t, [[0, 'smile'], [0.7, 'smirk']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.REF.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.point]]), t), expr: 'angry', talk: 0, blink: (t % 3.3) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.80, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.STU3.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'shocked', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

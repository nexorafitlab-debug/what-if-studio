import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
registerShot('s012', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You did it again... didn't you?" — Lily points at tiny Noah, accusing
    drawFigure(g, { x: E.W * 0.62, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.LILY.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [0.6, POSES.point]]), t), expr: exprAt(t, [[0, 'shocked'], [0.6, 'confused']]), talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.44, y: GY, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: exprAt(t, [[0, 'smile'], [1.0, 'nervous']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

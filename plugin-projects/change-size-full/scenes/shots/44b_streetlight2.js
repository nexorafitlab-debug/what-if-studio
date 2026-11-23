import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetlight } from '../sets/streetlight.js';
registerShot('s044b', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, lamp } = streetlight(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "...to change a streetlight." — GIANT Noah reaches up to the bulb
    drawFigure(g, { x: E.W * 0.30, y: GY, s: 2.9, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.reach], [0.7, POSES.holdFront]]), t), expr: exprAt(t, [[0, 'determined'], [0.7, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.BUILDER.outfit, pose: breathe(POSES.pointUp, t), expr: 'awe', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

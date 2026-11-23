import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { truckstreet } from '../sets/truckstreet.js';
registerShot('s048', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = truckstreet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Mia calls out. Show off." — Mia points and laughs at giant Noah
    drawFigure(g, { x: E.W * 0.86, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MIA.outfit, pose: breathe(posesAt(t, [[0, POSES.point], [0.6, POSES.cheer]]), t), expr: exprAt(t, [[0, 'shocked'], [0.6, 'smile']]), talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [0.6, POSES.stand]]), t), expr: 'smirk', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

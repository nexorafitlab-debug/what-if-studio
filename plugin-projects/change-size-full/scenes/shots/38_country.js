import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { maproom } from '../sets/maproom.js';
registerShot('s038', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, wallMap } = maproom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You see the whole country in one glance." — tiny Noah on the map peak
    const mx = wallMap.x + wallMap.w * 0.32, my = wallMap.y + wallMap.h * 0.34;
    drawFigure(g, { x: mx + 30, y: my - 30, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.point]]), t), expr: exprAt(t, [[0, 'awe'], [0.7, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.86, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MIA.outfit, pose: breathe(POSES.stand, t), expr: 'awe', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.14, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.STU5.outfit, pose: breathe(POSES.stand, t), expr: 'surprised', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

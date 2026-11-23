import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { maproom } from '../sets/maproom.js';
registerShot('s037', { draw(g, t, info) {
  const cam = { z: 1.3, x: -160 };
  layer(g, cam, 1, (g) => {
    const { GY, M, wallMap } = maproom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You stand on a mountain range..." — TINY Noah climbs a paper mountain
    const mx = wallMap.x + wallMap.w * 0.32, my = wallMap.y + wallMap.h * 0.42;
    const nx = lerp(mx - 60, mx + 30, prog(t, 0, 1.6));
    const ny = lerp(my + 40, my - 30, prog(t, 0, 1.6));
    drawFigure(g, { x: nx, y: ny, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 1.4), expr: exprAt(t, [[0, 'determined'], [1.4, 'awe']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Mia watches from the floor, tiny by comparison
    drawFigure(g, { x: E.W * 0.86, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MIA.outfit, pose: breathe(POSES.pointUp, t), expr: 'awe', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

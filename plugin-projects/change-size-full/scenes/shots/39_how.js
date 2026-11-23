import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { maproom } from '../sets/maproom.js';
registerShot('s039', { draw(g, t, info) {
  const cam = { z: 1.25, x: 200 };
  layer(g, cam, 1, (g) => {
    const { GY, M, mapTable } = maproom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "How did you do that?" — Mia leans right over tiny Noah on the table map
    drawFigure(g, { x: E.W * 0.62, y: mapTable.y + 30, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.point], [0.6, POSES.shrug]]), t), expr: 'smirk', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.86, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.MIA.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.crouch]]), t), expr: exprAt(t, [[0, 'awe'], [0.5, 'confused']]), talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

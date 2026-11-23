import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s107', { draw(g, t, info) {
  const cam = { z: 1.3, x: 160 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You hear Milo's voice." — Noah freezes, listening into the dark
    drawFigure(g, { x: E.W * 0.40, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.sad], [0.5, POSES.think]]), t), expr: exprAt(t, [[0, 'sad'], [0.5, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.lie, t), expr: 'worried', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

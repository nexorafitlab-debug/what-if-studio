import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { office } from '../sets/office.js';
registerShot('s073', { draw(g, t, info) {
  const cam = { z: 1.3, x: -140 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = office(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "What do you say?" — Noah alone in frame, thinking hard
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.think], [0.8, POSES.sad]]), t), expr: exprAt(t, [[0, 'thinking'], [0.8, 'worried']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(POSES.stand, t), expr: 'smirk', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
} });

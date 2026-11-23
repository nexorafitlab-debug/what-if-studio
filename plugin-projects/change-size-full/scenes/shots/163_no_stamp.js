import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { desk } from '../sets/desk.js';
import { drawLetter } from '../_helpers.js';
registerShot('s163', { draw(g, t, info) {
  const cam = { z: 1.35, x: 160 };
  layer(g, cam, 1, (g) => {
    const { GY, M, deskTop } = desk(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "No stamp. No return address." — close on the blank envelope
    drawLetter(g, E.W * 0.58, deskTop - 20, -0.1, 1.3);
    drawFigure(g, { x: E.W * 0.34, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.think], [0.5, POSES.holdFront]]), t), expr: 'confused', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

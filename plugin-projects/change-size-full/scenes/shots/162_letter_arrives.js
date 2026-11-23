import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { desk } from '../sets/desk.js';
import { drawLetter } from '../_helpers.js';
registerShot('s162', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, deskTop } = desk(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "That night, a letter arrives." — the envelope sits on the desk
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.think]]), t), expr: exprAt(t, [[0, 'neutral'], [0.6, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const pop = ease.out(prog(t, 0.3, 0.8));
    drawLetter(g, E.W * 0.62, deskTop - 20 - pop * 30, -0.1, 1 + pop * 0.1);
  });
} });

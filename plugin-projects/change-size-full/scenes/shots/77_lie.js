import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetlight } from '../sets/streetlight.js';
registerShot('s077', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = streetlight(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You can't tell anyone how it works. You lie to everyone." — Noah lies to friends
    drawFigure(g, { x: E.W * 0.40, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.shrug]]), t), expr: exprAt(t, [[0, 'nervous'], [0.6, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.stand, t), expr: 'confused', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.84, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MIA.outfit, pose: breathe(POSES.stand, t), expr: 'confused', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

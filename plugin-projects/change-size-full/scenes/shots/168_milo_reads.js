import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { desk } from '../sets/desk.js';
registerShot('s168', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, deskTop } = desk(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Milo reads it over your shoulder." — Milo leans in behind Noah
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.holdFront, t), expr: 'worried', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const mx = lerp(E.W * 0.80, E.W * 0.58, ease.out(prog(t, 0, 0.9)));
    drawFigure(g, { x: mx, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.crouch]]), t), expr: exprAt(t, [[0, 'confused'], [0.7, 'surprised']]), talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

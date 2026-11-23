import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
registerShot('s140', { draw(g, t, info) {
  const cam = { z: 1.25, x: -160 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "And your mom? She hugs you." — Mom wraps Noah in a hug
    const mx = lerp(E.W * 0.28, E.W * 0.38, ease.out(prog(t, 0, 0.9)));
    drawFigure(g, { x: mx, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.holdFront]]), t), expr: 'happy', talk: 0, blink: (t % 3.3) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.46, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.holdFront]]), t), expr: exprAt(t, [[0, 'surprised'], [0.7, 'happy']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.60, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

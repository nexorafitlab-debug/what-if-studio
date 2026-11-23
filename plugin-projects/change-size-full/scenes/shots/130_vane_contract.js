import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
import { drawContract } from '../_helpers.js';
registerShot('s130', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Mr. Vane pushes through. He holds a contract." — Vane shoves forward
    const vx = lerp(E.W * 0.88, E.W * 0.66, ease.out(prog(t, 0, 1.0)));
    drawFigure(g, { x: vx, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.holdFront]]), t), expr: 'smirk', talk: 0, blink: (t % 3.5) < 0.12, rim });
    drawContract(g, vx - 60, GY - 160, -0.2, 0.9);
    drawFigure(g, { x: E.W * 0.44, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.stand, t), expr: 'worried', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

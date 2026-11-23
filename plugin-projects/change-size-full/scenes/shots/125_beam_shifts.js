import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s125', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const shift = ease.inOut(prog(t, 0.3, 1.4)) * 0.10;
    const { GY, M, beam } = gymquake(g, t, info, { beamRot: shift });
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The beam shifts. Just enough." — the beam tilts a few degrees
    drawFigure(g, { x: E.W * 0.78, y: GY - 90, s: 0.3, facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(posesAt(t, [[0, POSES.lie], [0.8, POSES.crouch]]), t), expr: exprAt(t, [[0, 'worried'], [0.8, 'surprised']]), talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

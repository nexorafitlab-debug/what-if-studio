import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s126', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Milo pulls his leg free." — Milo scrambles out from under the beam
    const mx = lerp(E.W * 0.62, E.W * 0.48, ease.out(prog(t, 0.2, 1.2)));
    drawFigure(g, { x: mx, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [0.8, POSES.stand]]), t), expr: exprAt(t, [[0, 'scared'], [0.8, 'happy']]), talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.78, y: GY - 90, s: 0.3, facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

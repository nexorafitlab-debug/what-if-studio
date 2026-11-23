import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
import { sizePill } from '../_helpers.js';
registerShot('s111', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You shrink. Ten centimeters." — Noah SHRINKS beside the beam
    const k = ease.inOut(prog(t, 0.1, 1.0));
    const s = lerp(3.0, 0.3, k);
    const fig = { x: E.W * 0.40, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.think], [0.6, POSES.stand]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'thinking'], [0.6, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '0.1 m', 'green', t, { at: 0.2, hold: 1.0 });
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.lie, t), expr: 'worried', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

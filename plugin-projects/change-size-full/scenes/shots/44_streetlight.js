import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetlight } from '../sets/streetlight.js';
import { sizePill } from '../_helpers.js';
registerShot('s044', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, lamp } = streetlight(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // A builder pays you to change a streetlight — GIANT Noah reaches the bulb
    const k = ease.inOut(prog(t, 0.1, 1.0));
    const s = lerp(1.5, 2.9, k);
    const fig = { x: E.W * 0.30, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.reach]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.7, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '10 m', 'red', t, { at: 0.2, hold: 1.0 });
    // the builder watches from beside his van, arms crossed
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.BUILDER.outfit, pose: breathe(POSES.crossArms, t), expr: 'awe', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

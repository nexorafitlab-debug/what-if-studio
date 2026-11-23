import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { sink } from '../sets/sink.js';
import { sizePill } from '../_helpers.js';
registerShot('s042', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, leak } = sink(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // A plumber pays you to shrink UNDER his sink — tiny Noah walks in
    const k = ease.inOut(prog(t, 0.1, 0.9));
    const s = lerp(1.5, 0.3, k);
    const fig = { x: E.W * 0.52, y: GY, s, facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.pointUp]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.7, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '0.1 m', 'green', t, { at: 0.2, hold: 1.0 });
    // the plumber crouches at the cabinet door, watching
    drawFigure(g, { x: E.W * 0.88, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.PLUMBER.outfit, pose: breathe(POSES.crouch, t), expr: 'awe', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

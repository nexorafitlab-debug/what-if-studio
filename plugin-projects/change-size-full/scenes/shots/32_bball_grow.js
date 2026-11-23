import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { court } from '../sets/court.js';
import { sizePill } from '../_helpers.js';
registerShot('s032', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, hoop } = court(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // At basketball you GROW to ten meters — the court shrinks around you
    const k = ease.inOut(prog(t, 0.1, 1.2));
    const s = lerp(1.5, 3.0, k);
    const fig = { x: E.W * 0.52, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.ready]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.7, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '10 m', 'red', t, { at: 0.2, hold: 1.0 });
    // the ref backs away, hands up
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.REF.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.handsOnHead]]), t), expr: 'shocked', talk: 0, blink: (t % 3.3) < 0.12, rim });
    // a teammate points up at giant Noah
    drawFigure(g, { x: E.W * 0.78, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.STU1.outfit, pose: breathe(POSES.pointUp, t), expr: 'shocked', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

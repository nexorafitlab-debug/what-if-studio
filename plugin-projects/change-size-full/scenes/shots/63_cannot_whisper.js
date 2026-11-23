import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetRain } from '../sets/street_rain.js';
import { sizePill } from '../_helpers.js';
registerShot('s063', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = streetRain(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "At ten meters, you cannot whisper." — GIANT Noah tries to whisper
    const k = ease.inOut(prog(t, 0.1, 0.8));
    const s = lerp(1.5, 3.0, k);
    const fig = { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.crouch]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.6, 'nervous']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '10 m', 'red', t, { at: 0.2, hold: 1.0 });
    // two passers-by turn around, startled by the "whisper"
    drawFigure(g, { x: E.W * 0.14, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.PASSER.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.handsOnHead]]), t), expr: 'shocked', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.84, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.STU7.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.handsOnHead]]), t), expr: 'shocked', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

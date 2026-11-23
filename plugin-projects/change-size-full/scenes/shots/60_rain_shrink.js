import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetRain } from '../sets/street_rain.js';
import { sizePill } from '../_helpers.js';
registerShot('s060', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = streetRain(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "It rains. You shrink." — Noah shrinks in the rain
    const k = ease.inOut(prog(t, 0.2, 1.0));
    const s = lerp(1.5, 0.3, k);
    const fig = { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.crouch]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.7, 'worried']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '0.1 m', 'green', t, { at: 0.3, hold: 1.0 });
    const px = E.W * 0.85 - t * 90;
    drawFigure(g, { x: px, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.PASSER.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

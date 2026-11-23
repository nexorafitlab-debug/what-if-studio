import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, seg, circle } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gym } from '../sets/gym.js';
import { sizePill } from '../_helpers.js';
registerShot('s025', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, barY } = gym(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // GROW TEN TIMES TALLER... and ten times weaker: giant Noah wobbles under the bar
    const k = ease.inOut(prog(t, 0.1, 1.2));
    const s = lerp(1.5, 2.8, k);
    const wob = Math.sin(t * 7) * 8 * prog(t, 1.0, 2.0);
    const fig = { x: E.W * 0.17 + wob, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.ready], [2.2, POSES.sad]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'neutral'], [0.8, 'determined'], [2.2, 'scared']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '10 m', 'red', t, { at: 0.2, hold: 1.0 });
    const lift = 40 * Math.sin(Math.PI * clamp(prog(t, 1.0, 2.6)));
    seg(g, [[E.W * 0.04, barY - lift], [E.W * 0.30, barY - lift]], 10, '#3a3a48');
    circle(g, E.W * 0.04, barY - lift, 30, '#2a2a33'); circle(g, E.W * 0.30, barY - lift, 30, '#2a2a33');
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.GYM1.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'worried', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

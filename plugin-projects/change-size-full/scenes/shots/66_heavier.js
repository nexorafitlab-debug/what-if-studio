import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gym } from '../sets/gym.js';
registerShot('s066', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, barY } = gym(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The bigger you get... the heavier the world gets." — giant Noah sags
    const fig = { x: E.W * 0.30, y: GY, s: 2.8, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.sad]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'determined'], [0.8, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.GYM1.outfit, pose: breathe(POSES.stand, t), expr: 'worried', talk: 0, blink: (t % 3.3) < 0.12, rim });
    text(g, 'HEAVIER', E.W / 2, E.H * 0.90, { size: V(48, 52), color: '#ffd76a', glow: 18, glowColor: 'rgba(255,215,106,0.5)', spacing: 3, alpha: clamp(prog(t, 0.5, 0.9)) });
  });
} });

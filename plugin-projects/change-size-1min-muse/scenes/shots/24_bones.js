import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gym } from '../sets/gym.js';
registerShot('s024', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gym(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Your bones do not get tougher." — Noah taps his own arm, worried
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.think], [0.9, POSES.sad]]), t), expr: exprAt(t, [[0, 'thinking'], [0.9, 'worried']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.GYM1.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.crossArms]]), t), expr: 'neutral', talk: 0, blink: (t % 3.3) < 0.12, rim });
    text(g, 'SAME BONES', E.W / 2, E.H * 0.90, { size: V(44, 48), color: '#ffd76a', glow: 18, glowColor: 'rgba(255,215,106,0.5)', spacing: 3 });
  });
} });

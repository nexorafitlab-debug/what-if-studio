import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { dining } from '../sets/dining.js';
import { drawBurger } from '../sets/dining.js';
registerShot('s053', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, plate } = dining(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You eat four burgers." — four burgers in a row on the plate
    drawFigure(g, { x: E.W * 0.44, y: GY + 10, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sit, t), expr: 'happy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    for (let i = 0; i < 4; i++) drawBurger(g, E.W * (0.38 + i * 0.09), GY - 100, 0.9);
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.point, t), expr: 'surprised', talk: 0, blink: (t % 3.3) < 0.12, rim });
    text(g, '4', E.W * 0.62, E.H * 0.30, { size: V(120, 130), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', alpha: clamp(prog(t, 0.3, 0.6)) });
  });
} });

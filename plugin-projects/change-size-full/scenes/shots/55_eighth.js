import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { dining } from '../sets/dining.js';
import { drawBurger } from '../sets/dining.js';
registerShot('s055', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = dining(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You nod. That's your eighth burger." — a tall stack of eight burgers
    drawFigure(g, { x: E.W * 0.44, y: GY + 10, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [0.5, POSES.sit]]), t), expr: 'nervous', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    for (let i = 0; i < 8; i++) drawBurger(g, E.W * 0.60, GY - 100 - i * 34, 0.55);
    drawFigure(g, { x: E.W * 0.76, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'shocked', talk: 0, blink: (t % 3.3) < 0.12, rim });
    text(g, '8', E.W * 0.60, E.H * 0.26, { size: V(110, 120), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', alpha: clamp(prog(t, 0.4, 0.7)) });
  });
} });

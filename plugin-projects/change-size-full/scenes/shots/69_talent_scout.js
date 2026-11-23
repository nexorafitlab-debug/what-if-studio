import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { office } from '../sets/office.js';
registerShot('s069', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, stage } = office(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Talent scout. Kid. You're a show." — Vane spreads his arms on the stage
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.explain]]), t), expr: 'smirk', talk: 0, blink: (t % 3.5) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'confused', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

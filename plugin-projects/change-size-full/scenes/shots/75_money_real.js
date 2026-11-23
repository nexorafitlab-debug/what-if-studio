import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { office } from '../sets/office.js';
registerShot('s075', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, desk } = office(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The money is real." — Noah holds a stack of cash, stunned
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.holdFront], [0.8, POSES.cheer]]), t), expr: exprAt(t, [[0, 'smile'], [0.8, 'happy']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    for (let i = 0; i < 3; i++) { rr(g, E.W * (0.44 + i * 0.02), GY - 190 - i * 6, 70, 36, 4); g.fillStyle = '#7ac74a'; g.fill(); }
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(POSES.crossArms, t), expr: 'smirk', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
} });

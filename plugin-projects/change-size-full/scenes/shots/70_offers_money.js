import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { office } from '../sets/office.js';
registerShot('s070', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, desk } = office(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "He offers money. A stage." — Vane fans out cash on the desk
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(posesAt(t, [[0, POSES.explain], [0.8, POSES.holdFront]]), t), expr: 'smirk', talk: 0, blink: (t % 3.5) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.think]]), t), expr: exprAt(t, [[0, 'confused'], [0.8, 'thinking']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // cash notes fan out on the desk
    for (let i = 0; i < 4; i++) {
      const a = clamp(prog(t, 0.6 + i * 0.15, 1.0 + i * 0.15));
      if (a > 0) { rr(g, E.W * (0.40 + i * 0.05), GY - 150, 70, 36, 4); g.fillStyle = '#7ac74a'; g.globalAlpha = a; g.fill(); g.globalAlpha = 1; }
    }
  });
} });

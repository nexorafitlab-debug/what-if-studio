import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { desk } from '../sets/desk.js';
registerShot('s170', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = desk(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You say. Small steps." — Noah smiles, Mom's line in his voice now
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.relaxed]]), t), expr: exprAt(t, [[0, 'nervous'], [0.5, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.58, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.stand, t), expr: 'confused', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.8));
  text(g, 'SMALL STEPS.', E.W / 2, E.H * 0.18, { size: V(56, 60), color: '#ffd76a', glow: 20, glowColor: 'rgba(255,215,106,0.5)', spacing: 4, alpha: a });
} });

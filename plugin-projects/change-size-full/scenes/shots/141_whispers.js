import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
registerShot('s141', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "She whispers it. Small steps, Noah. Small steps." — Mom whispers in his ear
    drawFigure(g, { x: E.W * 0.38, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.holdFront], [0.5, POSES.stand]]), t), expr: 'smile', talk: 0, blink: (t % 3.3) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.46, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: exprAt(t, [[0, 'happy'], [0.8, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.60, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.8));
  text(g, 'SMALL STEPS, NOAH.', E.W / 2, E.H * 0.18, { size: V(60, 64), color: '#ffd76a', glow: 24, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a });
} });

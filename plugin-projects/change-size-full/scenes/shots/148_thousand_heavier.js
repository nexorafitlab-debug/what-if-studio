import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { science } from '../sets/science.js';
registerShot('s148', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = science(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Grow ten times taller, and you weigh a thousand times more." — the big cube
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.pointUp]]), t), expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.GALILEO.outfit, pose: breathe(POSES.explain, t), expr: 'thinking', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'x1000 WEIGHT', E.W / 2, E.H * 0.90, { size: V(52, 56), color: '#e07856', glow: 20, glowColor: 'rgba(224,120,86,0.5)', spacing: 3, alpha: a });
} });

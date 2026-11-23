import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { science } from '../sets/science.js';
registerShot('s149', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = science(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "But your bones are only a hundred times stronger." — Noah taps his arm
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.think], [0.7, POSES.sad]]), t), expr: exprAt(t, [[0, 'thinking'], [0.7, 'worried']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.GALILEO.outfit, pose: breathe(POSES.explain, t), expr: 'thinking', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'ONLY x100 STRONGER', E.W / 2, E.H * 0.90, { size: V(52, 56), color: '#ffd76a', glow: 20, glowColor: 'rgba(255,215,106,0.5)', spacing: 3, alpha: a });
} });

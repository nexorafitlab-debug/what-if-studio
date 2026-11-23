import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { science } from '../sets/science.js';
registerShot('s152', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = science(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "was two meters seventy-two." — the height number, huge
    drawFigure(g, { x: E.W * 0.30, y: GY, s: 2.6, facing: 1, outfit: CAST.WADLOW.outfit, pose: breathe(POSES.stand, t), expr: 'sad', talk: 0, blink: (t % 3.5) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, '2.72 m', E.W / 2, E.H * 0.16, { size: V(120, 130), color: '#ffd76a', glow: 32, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

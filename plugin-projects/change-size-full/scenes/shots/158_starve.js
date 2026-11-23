import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { nature } from '../sets/nature.js';
registerShot('s158', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = nature(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "...or starve." — the shrew's food pile, empty
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    circle(g, E.W * 0.36, GY - 20, 26, '#6a4a2a');
    circle(g, E.W * 0.36 + 24, GY - 30, 14, '#6a4a2a');
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'EAT OR STARVE', E.W / 2, E.H * 0.16, { size: V(60, 64), color: '#e07856', glow: 22, glowColor: 'rgba(224,120,86,0.5)', spacing: 4, alpha: a });
} });

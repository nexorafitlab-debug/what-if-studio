import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { nature } from '../sets/nature.js';
import { drawAnt } from '../sets/nature.js';
registerShot('s155', { draw(g, t, info) {
  const cam = { z: 1.3, x: -200 };
  layer(g, cam, 1, (g) => {
    const { GY, M, hill } = nature(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Ants lift fifty times their own weight." — one ant lifts a huge crumb
    drawAnt(g, E.W * 0.36, GY - 20, 2.0, 1, t);
    circle(g, E.W * 0.36 + 60, GY - 90, 26, '#c9a44a');
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.point, t), expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, '50x', E.W / 2, E.H * 0.16, { size: V(96, 104), color: '#7ac74a', glow: 28, glowColor: 'rgba(122,199,74,0.5)', spacing: 2, alpha: a });
} });

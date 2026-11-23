import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s123', { draw(g, t, info) {
  const cam = { z: 1.35, x: 300, y: -60 };
  layer(g, cam, 1, (g) => {
    const { GY, M, pin } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "At ten centimeters, you are ten times stronger for your weight."
    drawFigure(g, { x: E.W * 0.78, y: GY - 90, s: 0.3, facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.ready, t), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    circle(g, pin.x, pin.y, 12, '#ffd76a');
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, '10x STRONGER', E.W / 2, E.H * 0.16, { size: V(60, 64), color: '#7ac74a', glow: 20, glowColor: 'rgba(122,199,74,0.5)', spacing: 4, alpha: a });
} });

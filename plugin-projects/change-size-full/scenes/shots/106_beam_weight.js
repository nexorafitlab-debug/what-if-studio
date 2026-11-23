import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s106', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, beam } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The beam weighs a thousand times more now." — the beam, huge, unmoving
    drawFigure(g, { x: E.W * 0.34, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.lie, t), expr: 'worried', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'x1000 HEAVIER', E.W / 2, E.H * 0.16, { size: V(60, 64), color: '#ffd76a', glow: 20, glowColor: 'rgba(255,215,106,0.5)', spacing: 4, alpha: a });
} });

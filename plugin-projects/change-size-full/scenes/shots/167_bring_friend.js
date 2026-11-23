import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { desk } from '../sets/desk.js';
registerShot('s167', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { desk(g, t, info, {}); });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'BRING YOUR FRIEND.', E.W / 2, E.H * 0.40, { size: V(76, 82), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a });
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = desk(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.think, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.stand, t), expr: 'confused', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

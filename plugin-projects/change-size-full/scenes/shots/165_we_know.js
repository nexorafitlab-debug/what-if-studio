import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { desk } from '../sets/desk.js';
registerShot('s165', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { desk(g, t, info, {}); });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'WE KNOW WHAT YOU DID', E.W / 2, E.H * 0.32, { size: V(72, 78), color: '#e07856', glow: 26, glowColor: 'rgba(224,120,86,0.5)', spacing: 4, alpha: a });
  text(g, 'AT THE SCHOOL.', E.W / 2, E.H * 0.46, { size: V(72, 78), color: '#e07856', glow: 26, glowColor: 'rgba(224,120,86,0.5)', spacing: 4, alpha: a });
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = desk(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'scared', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

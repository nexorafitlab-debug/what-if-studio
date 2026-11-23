import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { desk } from '../sets/desk.js';
registerShot('s166', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { desk(g, t, info, {}); });
  const a = clamp(prog(t, 0.2, 0.5));
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = desk(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.handsOnHead], [0.6, POSES.think]]), t), expr: exprAt(t, [[0, 'scared'], [0.6, 'thinking']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  text(g, 'COME TO THE OLD', E.W / 2, E.H * 0.32, { size: V(72, 78), color: '#9fd8ff', glow: 26, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a });
  text(g, 'OBSERVATORY AT MIDNIGHT.', E.W / 2, E.H * 0.46, { size: V(72, 78), color: '#9fd8ff', glow: 26, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a });
} });

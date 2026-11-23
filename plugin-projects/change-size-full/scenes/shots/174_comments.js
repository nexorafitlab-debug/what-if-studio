import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { observatory } from '../sets/observatory.js';
registerShot('s174', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { observatory(g, t, info, {}); });
  const a = clamp(prog(t, 0.3, 0.7));
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = observatory(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.point]]), t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.60, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.point, t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
  text(g, 'TELL US IN THE COMMENTS', E.W / 2, E.H * 0.32, { size: V(80, 88), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a });
} });

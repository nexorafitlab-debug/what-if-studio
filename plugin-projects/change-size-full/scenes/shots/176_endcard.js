import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { observatory } from '../sets/observatory.js';
registerShot('s176', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { observatory(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.2, 0.6)), a2 = clamp(prog(t, 0.9, 1.3));
  text(g, 'HIT LIKE, AND SUBSCRIBE', E.W / 2, E.H * 0.30, { size: V(76, 82), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a1 });
  text(g, 'FOR MORE WHAT IFS.', E.W / 2, E.H * 0.44, { size: V(76, 82), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a2 });
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = observatory(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.wave]]), t), expr: exprAt(t, [[0, 'smile'], [1.0, 'happy']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.60, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.wave]]), t), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
registerShot('s017', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.2, 0.6)), a2 = clamp(prog(t, 0.7, 1.1));
  text(g, 'NOAH', E.W / 2, E.H * 0.30, { size: V(150, 160), color: '#ffd76a', glow: 40, glowColor: 'rgba(255,215,106,0.6)', spacing: 8, alpha: a1 });
  text(g, '16 YEARS OLD', E.W / 2, E.H * 0.44, { size: V(56, 60), color: '#9fd8ff', glow: 20, glowColor: 'rgba(159,216,255,0.5)', spacing: 6, alpha: a2 });
  layer(g, { z: 1 }, 1, (g) => {
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: E.H * 0.86, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.wave]]), t), expr: exprAt(t, [[0, 'neutral'], [1.0, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

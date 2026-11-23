import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
registerShot('s041', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.2, 0.6)), a2 = clamp(prog(t, 0.9, 1.3));
  text(g, 'WHERE IT GETS', E.W / 2, E.H * 0.30, { size: V(64, 70), color: '#9fd8ff', glow: 22, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a1 });
  text(g, 'REALLY CRAZY...', E.W / 2, E.H * 0.44, { size: V(84, 92), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a2 });
  layer(g, { z: 1 }, 1, (g) => {
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: E.H * 0.88, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.think], [1.0, POSES.relaxed]]), t), expr: exprAt(t, [[0, 'thinking'], [1.0, 'smirk']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

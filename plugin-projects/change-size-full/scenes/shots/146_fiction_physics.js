import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s146', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.2, 0.5)), a2 = clamp(prog(t, 0.9, 1.2));
  text(g, 'THE SHRINKING IS FICTION.', E.W / 2, E.H * 0.34, { size: V(64, 70), color: '#9fd8ff', glow: 22, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a1 });
  text(g, 'THE PHYSICS IS NOT.', E.W / 2, E.H * 0.48, { size: V(80, 88), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a2 });
  layer(g, { z: 1 }, 1, (g) => {
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: E.H * 0.90, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.think], [1.0, POSES.explain]]), t), expr: exprAt(t, [[0, 'thinking'], [1.0, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

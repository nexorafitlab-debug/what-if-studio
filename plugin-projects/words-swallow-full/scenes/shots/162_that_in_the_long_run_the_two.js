import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s162', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.82, y: 0, s: 1.2, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "awe"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
  });
  // Gilovich & Medvec: in the long run people regret INACTIONS far more than actions — two bars
  text(g, 'REGRET IN THE LONG RUN', E.W / 2, E.H * 0.16, { size: 44, color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: 'rgba(255,215,106,0.45)' });
  seg(g, [[E.W * 0.20, E.H * 0.72], [E.W * 0.80, E.H * 0.72]], 4, 'rgba(255,255,255,0.5)');
  text(g, 'THINGS THEY DID', E.W * 0.35, E.H * 0.78, { size: 30, color: '#cfe2ff', font: FONTS.ui, weight: 800 });
  text(g, 'THINGS THEY DID NOT DO', E.W * 0.65, E.H * 0.78, { size: 30, color: '#cfe2ff', font: FONTS.ui, weight: 800 });
} });

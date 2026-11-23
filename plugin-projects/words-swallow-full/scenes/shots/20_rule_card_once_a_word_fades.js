import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
registerShot('s020', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.50, y: 0, s: 1.2, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, look: [0, -0.6], rim });
  });
  text(g, "THE RULE", E.W / 2, E.H * 0.2, { size: 40, color: '#9fb4d8', font: FONTS.ui, weight: 900, spacing: 2, glow: 10, glowColor: 'rgba(159,180,216,0.4)' });
  text(g, "ONCE A WORD FADES,", E.W / 2, E.H * 0.36, { size: 66, color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 2, glow: 26, glowColor: 'rgba(255,215,106,0.55)' });
} });

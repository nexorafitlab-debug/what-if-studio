import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { hospitalCorridor } from '../sets/hospital_corridor.js';
import { goldLine } from '../_helpers.js';
registerShot('s123', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const w0 = walkLocked(t, { x0: E.W * 0.10, stride: 52, stepDur: 0.4, facing: 1, run: false });
  const pose0 = t < 1.0 ? w0.pose : breathe(posesAt(t, [[1.0, POSES.stand]]), t);
  const x0 = t < 1.0 ? w0.x : E.W * 0.10 + 130.0 * 1.0;
  const f0 = { x: x0, y: 0, s: 1.55, facing: 1, outfit: CAST.DAD.outfit, pose: pose0 };
  const w1 = walkLocked(t, { x0: E.W * 0.02, stride: 52, stepDur: 0.4, facing: 1, run: false });
  const pose1 = t < 1.0 ? w1.pose : breathe(posesAt(t, [[1.0, POSES.stand]]), t);
  const x1 = t < 1.0 ? w1.x : E.W * 0.02 + 130.0 * 1.0;
  const f1 = { x: x1, y: 0, s: 1.45, facing: 1, outfit: CAST.ELI.outfit, pose: pose1 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = hospitalCorridor(g, t, info, {});
    f0.y = GY; f0.x = x0;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "determined"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY; f1.x = x1;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "worried"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12, rim });
  });
  text(g, "ROOM 312", E.W / 2, E.H * 0.24, { size: 56, color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 2, glow: 26, glowColor: 'rgba(255,215,106,0.55)' });
} });

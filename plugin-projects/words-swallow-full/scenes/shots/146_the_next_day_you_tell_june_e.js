import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { parkSet } from '../sets/park.js';
registerShot('s146', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const w0 = walkLocked(t, { x0: E.W * 0.12, stride: 52, stepDur: 0.5, facing: 1, run: false });
  const pose0 = w0.pose;
  const x0 = w0.x;
  const f0 = { x: x0, y: 0, s: 1.5, facing: 1, outfit: CAST.ELI.outfit, pose: pose0 };
  const w1 = walkLocked(t, { x0: E.W * 0.30, stride: 52, stepDur: 0.5, facing: 1, run: false });
  const pose1 = w1.pose;
  const x1 = w1.x;
  const f1 = { x: x1, y: 0, s: 1.5, facing: 1, outfit: CAST.JUNE.outfit, pose: pose1 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = parkSet(g, t, info, {});
    f0.y = GY; f0.x = x0;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "smile"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
    f1.y = GY; f1.x = x1;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "smile"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
  });
} });

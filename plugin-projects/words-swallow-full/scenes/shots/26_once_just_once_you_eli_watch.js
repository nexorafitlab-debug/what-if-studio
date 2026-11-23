import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolYard } from '../sets/schoolyard.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s026', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const w0 = walkLocked(t, { x0: E.W * 0.30, stride: 52, stepDur: 0.5, facing: 1, run: false });
  const pose0 = w0.pose;
  const x0 = w0.x;
  const f0 = { x: x0, y: 0, s: 1.5, facing: 1, outfit: CAST.GIRL.outfit, pose: pose0 };
  const w1 = walkLocked(t, { x0: E.W * 0.46, stride: 52, stepDur: 0.5, facing: 1, run: false });
  const pose1 = w1.pose;
  const x1 = w1.x;
  const f1 = { x: x1, y: 0, s: 1.5, facing: 1, outfit: CAST.FRIEND.outfit, pose: pose1 };
  const f2 = { x: E.W * 0.12, y: 0, s: 1.45, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolYard(g, t, info, {});
    f0.y = GY; f0.x = x0;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "smile"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY; f1.x = x1;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "smile"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
    f2.y = GY;
    drawFigure(g, { ...f2, expr: exprAt(t, [[0, "neutral"]]), talk: 0, blink: (t + f2.x * 0.01) % 3.7 < 0.12, look: [0.4, -0.2], rim });
  });
  swallowedWord(g, f0, "I'M SORRY.", t, { at: 0.3, dur: 2.4 });
} });

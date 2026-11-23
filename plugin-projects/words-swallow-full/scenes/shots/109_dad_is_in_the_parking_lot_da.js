import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { hospitalParking } from '../sets/hospital_parking.js';
registerShot('s109', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.62, y: 0, s: 1.55, facing: -1, outfit: CAST.DAD.outfit, pose: breathe(posesAt(t, [[0, POSES.sad]]), t) };
  const w1 = walkLocked(t, { x0: E.W * 0.05, stride: 52, stepDur: 0.5, facing: 1, run: false });
  const pose1 = t < 0.8 ? w1.pose : breathe(posesAt(t, [[0.8, POSES.stand]]), t);
  const x1 = t < 0.8 ? w1.x : E.W * 0.05 + 104.0 * 0.8;
  const f1 = { x: x1, y: 0, s: 1.4, facing: 1, outfit: CAST.ELI.outfit, pose: pose1 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = hospitalParking(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY; f1.x = x1;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "worried"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12, rim });
  });
} });

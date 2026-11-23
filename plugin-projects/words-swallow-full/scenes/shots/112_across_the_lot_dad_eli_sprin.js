import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { hospitalParking } from '../sets/hospital_parking.js';
registerShot('s112', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const w0 = walkLocked(t, { x0: E.W * 0.08, stride: 52, stepDur: 0.32, facing: 1, run: true });
  const pose0 = t < 1.0 ? w0.pose : breathe(posesAt(t, [[1.0, POSES.stand]]), t);
  const x0 = t < 1.0 ? w0.x : E.W * 0.08 + 227.5 * 1.0;
  const f0 = { x: x0, y: 0, s: 1.5, facing: 1, outfit: CAST.ELI.outfit, pose: pose0 };
  const f1 = { x: E.W * 0.78, y: 0, s: 1.5, facing: -1, outfit: CAST.DAD.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = hospitalParking(g, t, info, {});
    f0.y = GY; f0.x = x0;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "determined"], [1.0, "shocked"]]), talk: talkAmount(info.globalT, 249.78, 249.98), blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "sad"], [1.0, "surprised"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
  });
} });

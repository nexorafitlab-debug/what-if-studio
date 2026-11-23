import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { hospitalRoom } from '../sets/hospital_room.js';
registerShot('s100', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const w0 = walkLocked(t, { x0: E.W * 0.88, stride: 52, stepDur: 0.5, facing: -1, run: false });
  const pose0 = t < 0.9 ? w0.pose : breathe(posesAt(t, [[0.9, POSES.stand]]), t);
  const x0 = t < 0.9 ? w0.x : E.W * 0.88 + 104.0 * 0.9;
  const f0 = { x: x0, y: 0, s: 1.45, facing: -1, outfit: CAST.ELI.outfit, pose: pose0 };
  const f1 = { x: E.W * 0.38, y: 0, s: 1.6, facing: 1, outfit: CAST.ROSE.outfit, pose: breathe(posesAt(t, [[0, POSES.sitBack]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = hospitalRoom(g, t, info, {});
    f0.y = GY; f0.x = x0;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "sleepy"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
  });
} });

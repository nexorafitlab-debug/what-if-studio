import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
registerShot('s072', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const w0 = walkLocked(t, { x0: E.W * 0.10, stride: 52, stepDur: 0.5, facing: 1, run: false });
  const pose0 = t < 0.9 ? w0.pose : breathe(posesAt(t, [[0.9, POSES.stand]]), t);
  const x0 = t < 0.9 ? w0.x : E.W * 0.10 + 104.0 * 0.9;
  const f0 = { x: x0, y: 0, s: 1.5, facing: 1, outfit: CAST.ELI.outfit, pose: pose0 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = bathroomMirror(g, t, info, {});
    f0.y = GY; f0.x = x0;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "neutral"], [0.9, "surprised"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
  });
} });

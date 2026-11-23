import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolYard } from '../sets/schoolyard.js';
registerShot('s030', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.58, y: 0, s: 1.55, facing: -1, outfit: CAST.GIRL.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  const f1 = { x: E.W * 0.74, y: 0, s: 1.55, facing: 1, outfit: CAST.FRIEND.outfit, pose: breathe(posesAt(t, [[0, POSES.cheer]]), t) };
  const f2 = { x: E.W * 0.20, y: 0, s: 1.5, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.cheer]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolYard(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "happy"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "joy"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
    f2.y = GY;
    drawFigure(g, { ...f2, expr: exprAt(t, [[0, "awe"], [0.8, "joy"]]), talk: 0, blink: (t + f2.x * 0.01) % 3.7 < 0.12, look: [0.5, -0.5], rim });
  });
} });

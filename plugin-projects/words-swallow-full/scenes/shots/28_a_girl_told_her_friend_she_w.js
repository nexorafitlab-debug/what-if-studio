import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolYard } from '../sets/schoolyard.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s028', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.55, y: 0, s: 1.55, facing: -1, outfit: CAST.GIRL.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.talk]]), t) };
  const f1 = { x: E.W * 0.74, y: 0, s: 1.55, facing: 1, outfit: CAST.FRIEND.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  const f2 = { x: E.W * 0.16, y: 0, s: 1.45, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolYard(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "nervous"], [0.5, "smile"]]), talk: talkAmount(info.globalT, 54.30, 56.10), blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "surprised"], [1.2, "smile"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
    f2.y = GY;
    drawFigure(g, { ...f2, expr: exprAt(t, [[0, "awe"]]), talk: 0, blink: (t + f2.x * 0.01) % 3.7 < 0.12, look: [0.4, -0.3], rim });
  });
  swallowedWord(g, f0, "I'M SORRY.", t, { at: 0, dur: 2.36 });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolHallway } from '../sets/school_hallway.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s039', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.50, y: 0, s: 1.6, facing: 1, outfit: CAST.COLE.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  const f1 = { x: E.W * 0.18, y: 0, s: 1.45, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  const f2 = { x: E.W * 0.82, y: 0, s: 1.4, facing: -1, outfit: CAST.STU2.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolHallway(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12, look: [0.5, -0.2], rim });
    f2.y = GY;
    drawFigure(g, { ...f2, expr: exprAt(t, [[0, "worried"]]), talk: 0, blink: (t + f2.x * 0.01) % 3.7 < 0.12 });
  });
  swallowedWord(g, f0, "MY DAD HITS ME.", t, { at: 0.3, dur: 2.9 });
} });

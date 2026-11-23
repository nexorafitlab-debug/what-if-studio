import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMidnight } from '../sets/kitchen_midnight.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s087', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.55, y: 0, s: 1.6, facing: 1, outfit: CAST.DAD.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  const f1 = { x: E.W * 0.22, y: 0, s: 1.45, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.sit]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMidnight(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "neutral"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12, rim });
  });
  swallowedWord(g, f0, "I'M PROUD OF YOU, SON.", t, { at: 0.9, dur: 2.24 });
} });

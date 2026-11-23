import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { parkSet } from '../sets/park.js';
registerShot('s147', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.38, y: 0, s: 1.6, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.talk]]), t) };
  const f1 = { x: E.W * 0.66, y: 0, s: 1.6, facing: -1, outfit: CAST.JUNE.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = parkSet(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "nervous"], [0.7, "smile"]]), talk: talkAmount(info.globalT, 324.42, 325.16), blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "surprised"], [0.7, "happy"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
  });
} });

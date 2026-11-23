import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bedroomEli } from '../sets/bedroom_eli.js';
registerShot('s135', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.48, y: 0, s: 1.7, facing: -1, outfit: CAST.DAD.outfit, pose: breathe(posesAt(t, [[0, POSES.talk]]), t) };
  const f1 = { x: E.W * 0.82, y: 0, s: 1.35, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = bedroomEli(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"], [0.8, "smile"]]), talk: talkAmount(info.globalT, 296.58, 298.02), blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "surprised"], [0.8, "happy"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12, rim });
  });
} });

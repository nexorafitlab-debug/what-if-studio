import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolHallway } from '../sets/school_hallway.js';
registerShot('s037', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.55, y: 0, s: 1.55, facing: -1, outfit: CAST.COLE.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.kick]]), t) };
  const f1 = { x: E.W * 0.72, y: 0, s: 1.3, facing: 1, outfit: CAST.KID.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.fall]]), t) };
  const f2 = { x: E.W * 0.18, y: 0, s: 1.45, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolHallway(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "angry"]]), talk: talkAmount(info.globalT, 77.57, 78.57), blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "scared"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
    f2.y = GY;
    drawFigure(g, { ...f2, expr: exprAt(t, [[0, "shocked"]]), talk: 0, blink: (t + f2.x * 0.01) % 3.7 < 0.12, look: [0.5, 0], rim });
  });
} });

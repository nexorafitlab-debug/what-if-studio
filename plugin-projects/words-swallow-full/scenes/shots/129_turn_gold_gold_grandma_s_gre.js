import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { hospitalRoom } from '../sets/hospital_room.js';
import { goldWord } from '../_helpers.js';
import { sparkle } from '/engine/fx2d.js';
registerShot('s129', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.45, y: 0, s: 1.65, facing: 1, outfit: CAST.ROSE.outfit, pose: breathe(posesAt(t, [[0, POSES.sitBack]]), t) };
  const f1 = { x: E.W * 0.78, y: 0, s: 1.4, facing: -1, outfit: CAST.DAD.outfit, pose: breathe(posesAt(t, [[0, POSES.kneel]]), t) };
  const f2 = { x: E.W * 0.88, y: 0, s: 1.25, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = hospitalRoom(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "smile"], [0.5, "happy"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "awe"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
    f2.y = GY;
    drawFigure(g, { ...f2, expr: exprAt(t, [[0, "awe"]]), talk: 0, blink: (t + f2.x * 0.01) % 3.7 < 0.12, rim });
  });
  goldWord(g, f0, "TELL YOUR FATHER I LOVE HIM.", t, { at: 0.35, greyAt: 0 });
  if (t > 0.35 + 1) { const [hx, hy] = headPos(f0); const k2 = prog(t, 0.35 + 1, 1.55); glow(g, hx, hy - 120 - 70 * k2, 130, '#ffd76a', 0.5 * (1 - k2)); sparkle(g, hx - 30, hy - 150 - 80 * k2, 16, '#ffd76a', 0.5 * (1 - k2)); sparkle(g, hx + 40, hy - 130 - 60 * k2, 12, '#fff3d0', 0.4 * (1 - k2)); }
} });

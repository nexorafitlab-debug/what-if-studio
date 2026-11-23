import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { hospitalRoom } from '../sets/hospital_room.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s104', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.48, y: 0, s: 1.65, facing: 1, outfit: CAST.ROSE.outfit, pose: breathe(posesAt(t, [[0, POSES.sitBack]]), t) };
  const f1 = { x: E.W * 0.84, y: 0, s: 1.35, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.sit]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = hospitalRoom(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sleepy"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    f1.y = GY;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "worried"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12, rim });
  });
  swallowedWord(g, f0, "TELL YOUR FATHER I LOVE HIM.", t, { at: 0, fadeAt: 1.4 });
} });

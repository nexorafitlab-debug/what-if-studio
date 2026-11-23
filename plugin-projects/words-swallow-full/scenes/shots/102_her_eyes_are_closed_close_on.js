import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { hospitalRoom } from '../sets/hospital_room.js';
registerShot('s102', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.50, y: 0, s: 2.0, facing: 1, outfit: CAST.ROSE.outfit, pose: breathe(posesAt(t, [[0, POSES.sitBack]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = hospitalRoom(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sleepy"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
  });
} });

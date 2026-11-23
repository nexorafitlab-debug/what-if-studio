import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s080', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  layer(g, { z: 1 }, 1, (g) => {
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Nobody knows the real you." — Noah alone in the void, small
    drawFigure(g, { x: E.W * 0.5, y: E.H * 0.88, s: V(1.3, 1.4), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

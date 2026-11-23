import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { rings } from '/engine/fx2d.js';
registerShot('s021', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  layer(g, { z: 1 }, 1, (g) => {
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You can change your size. Any time." — Noah breathes bigger and smaller
    const s = 1.5 + 0.55 * Math.sin(t * 2.4);
    drawFigure(g, { x: E.W * 0.5, y: E.H * 0.86, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.cheer]]), t), expr: exprAt(t, [[0, 'neutral'], [0.8, 'awe'], [1.4, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    rings(g, E.W * 0.5, E.H * 0.55, t, { count: 2, r0: 60, r1: 260, color: '#ffd76a', a: 0.35 });
  });
} });

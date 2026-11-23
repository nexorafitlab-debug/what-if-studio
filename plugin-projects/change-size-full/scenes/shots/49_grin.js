import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { truckstreet } from '../sets/truckstreet.js';
registerShot('s049', { draw(g, t, info) {
  const cam = { z: 1.5, x: -140, y: 160 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = truckstreet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You grin." — close on giant Noah's grin, Mia laughing behind
    drawFigure(g, { x: E.W * 0.42, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: exprAt(t, [[0, 'smirk'], [0.6, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.82, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MIA.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

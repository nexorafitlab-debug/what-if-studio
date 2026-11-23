import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bedroom } from '../sets/bedroom.js';
registerShot('s004', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = bedroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // tall Noah reaches up to the high shelf, takes the book
    const pose = breathe(posesAt(t, [[0, POSES.reach], [1.2, POSES.holdFront]]), t);
    drawFigure(g, { x: E.W * 0.62, y: GY, s: 2.4, facing: 1, outfit: CAST.NOAH.outfit, pose, expr: exprAt(t, [[0, 'determined'], [1.2, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

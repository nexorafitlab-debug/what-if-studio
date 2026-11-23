import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { livingroom } from '../sets/livingroom.js';
import { drawCat } from '../_helpers.js';
registerShot('s057', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, catBed } = livingroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Your cat thinks you're a mouse." — the cat's eyes lock on tiny Noah
    drawFigure(g, { x: E.W * 0.40, y: GY, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'nervous', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const crouch = prog(t, 0.4, 1.2);
    drawCat(g, E.W * 0.72, GY + 10 - crouch * 20, 1.6, -1, { eye: '#ffd76a' });
    drawFigure(g, { x: E.W * 0.20, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.LILY.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

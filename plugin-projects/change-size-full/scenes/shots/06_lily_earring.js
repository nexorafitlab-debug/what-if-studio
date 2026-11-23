import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
import { drawEarring } from '../_helpers.js';
registerShot('s006', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // Noah walks in from the left; Lily touches her ear — the earring is gone
    const lx = E.W * 0.08 + t * 120;
    drawFigure(g, { x: lx, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.think]]), t);
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.LILY.outfit, pose, expr: exprAt(t, [[0, 'neutral'], [0.7, 'worried']]), talk: 0, blink: (t % 3.1) < 0.12, rim });
    // the earring drops and bounces once near Lily's feet
    const ey = GY + 40 + Math.abs(Math.sin(t * 5)) * -30 * (1 - prog(t, 0, 1));
    drawEarring(g, E.W * 0.60, GY + 60, 1);
  });
} });

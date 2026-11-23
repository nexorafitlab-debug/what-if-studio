import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { livingroom } from '../sets/livingroom.js';
import { drawCat } from '../_helpers.js';
registerShot('s058', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = livingroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You shrink. She pounces." — the cat LEAPS at tiny Noah
    const k = ease.in(prog(t, 0.2, 0.9));
    const cx = lerp(E.W * 0.72, E.W * 0.44, k);
    const cy = GY + 10 - Math.sin(Math.PI * clamp(prog(t, 0.2, 0.9))) * 160;
    drawCat(g, cx, cy, 1.6, -1);
    drawFigure(g, { x: E.W * 0.40, y: GY, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.crouch]]), t), expr: exprAt(t, [[0, 'nervous'], [0.4, 'scared']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.20, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.LILY.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'shocked', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

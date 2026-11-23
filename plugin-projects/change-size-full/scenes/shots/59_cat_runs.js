import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { livingroom } from '../sets/livingroom.js';
import { drawCat } from '../_helpers.js';
registerShot('s059', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = livingroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You grow in half a second. She runs." — Noah GROWS, the cat flees
    const k = ease.inOut(prog(t, 0.1, 0.6));
    const s = lerp(0.3, 1.5, k);
    drawFigure(g, { x: E.W * 0.40, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [0.4, POSES.stand]]), t), expr: exprAt(t, [[0, 'scared'], [0.5, 'smirk']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const cx = E.W * 0.44 + prog(t, 0.5, 1.6) * 600;
    drawCat(g, cx, GY + 10, 1.6, 1);
    drawFigure(g, { x: E.W * 0.20, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.LILY.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

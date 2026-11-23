import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s102', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Your knees buckle." — giant Noah's knees give way under his own weight
    const buckle = Math.sin(Math.PI * clamp(prog(t, 0.3, 1.2))) * 60;
    const fig = { x: E.W * 0.34, y: GY + buckle, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [0.5, POSES.crouch]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'determined'], [0.5, 'scared']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.lie, t), expr: 'scared', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

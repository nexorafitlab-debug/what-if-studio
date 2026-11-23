import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
registerShot('s013', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // You shrug... then GROW BACK to normal size
    const k = ease.inOut(prog(t, 0.5, 1.2));
    const s = lerp(0.3, 1.5, k);
    const pose = breathe(posesAt(t, [[0, POSES.shrug], [0.5, POSES.stand]]), t);
    drawFigure(g, { x: E.W * 0.44, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose, expr: exprAt(t, [[0, 'smirk'], [0.7, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.LILY.outfit, pose: breathe(posesAt(t, [[0, POSES.point], [0.7, POSES.stand]]), t), expr: 'surprised', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

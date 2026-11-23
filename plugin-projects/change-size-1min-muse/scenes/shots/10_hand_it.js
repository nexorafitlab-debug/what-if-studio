import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
import { drawEarring, handPos } from '../_helpers.js';
registerShot('s010', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // tiny Noah holds the earring up high; Lily kneels down to take it
    const fig = { x: E.W * 0.44, y: GY, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.3, POSES.holdFront]]), t) };
    drawFigure(g, { ...fig, expr: 'happy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const [hx, hy] = handPos(fig);
    drawEarring(g, hx, hy - 14, 0.9);
    drawFigure(g, { x: E.W * 0.60, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.LILY.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.crouch]]), t), expr: exprAt(t, [[0, 'surprised'], [0.5, 'smile']]), talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

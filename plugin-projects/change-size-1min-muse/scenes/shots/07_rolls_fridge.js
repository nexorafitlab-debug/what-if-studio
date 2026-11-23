import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
import { drawEarring } from '../_helpers.js';
registerShot('s007', { draw(g, t, info) {
  const cam = { z: 1.1, x: -260 };
  layer(g, cam, 1, (g) => {
    const { GY, M, fridge } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // the earring ROLLS across the floor toward the dark gap under the fridge
    const ex = lerp(E.W * 0.58, fridge.x + fridge.w * 0.5, ease.inOut(prog(t, 0, 1.4)));
    const ey = GY + 62 + Math.sin(t * 14) * 3 * (1 - prog(t, 0, 1.4));
    drawEarring(g, ex, ey, 1);
    // Noah crouches, watching it roll away
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.crouch]]), t);
    drawFigure(g, { x: E.W * 0.48, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.NOAH.outfit, pose, expr: exprAt(t, [[0, 'neutral'], [0.5, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Lily points at the fridge, worried
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.LILY.outfit, pose: breathe(POSES.point, t), expr: 'worried', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

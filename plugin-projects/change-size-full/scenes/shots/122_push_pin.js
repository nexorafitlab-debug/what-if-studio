import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s122', { draw(g, t, info) {
  const cam = { z: 1.35, x: 550, y: 250 };
  layer(g, cam, 1, (g) => {
    const { GY, M, pin } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You push." — tiny Noah pushes the pin with both hands
    const push = Math.sin(t * 5) * 4 * prog(t, 0.3, 1.0);
    drawFigure(g, { x: E.W * 0.78 + push, y: GY - 90, s: 0.3, facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.ready]]), t), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    circle(g, pin.x, pin.y, 12, '#ffd76a');
  });
} });

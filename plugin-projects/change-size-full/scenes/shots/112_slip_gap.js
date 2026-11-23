import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s112', { draw(g, t, info) {
  const cam = { z: 1.3, x: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M, beam } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You slip through the gap under the beam." — tiny Noah walks under it
    const nx = lerp(E.W * 0.40, E.W * 0.58, prog(t, 0, 1.8));
    drawFigure(g, { x: nx, y: GY + 6, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 2.0), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.lie, t), expr: 'worried', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

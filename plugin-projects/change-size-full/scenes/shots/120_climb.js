import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s120', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, beam, pin } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You climb." — tiny Noah climbs the rubble toward the bent strut
    const nx = lerp(E.W * 0.52, E.W * 0.78, prog(t, 0, 1.8));
    const ny = lerp(GY + 6, GY - 90, prog(t, 0, 1.8));
    drawFigure(g, { x: nx, y: ny, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 1.6), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.lie, t), expr: 'worried', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

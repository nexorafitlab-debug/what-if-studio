import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
registerShot('s129', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Outside, the crowd is waiting. The whole school." — Noah + Milo emerge
    const nx = lerp(E.W * 0.50, E.W * 0.44, prog(t, 0, 1.6));
    drawFigure(g, { x: nx, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 0.8), expr: exprAt(t, [[0, 'worried'], [1.0, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: nx + 110, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: walkPose(t * Math.PI * 2 * 0.8 + 1), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

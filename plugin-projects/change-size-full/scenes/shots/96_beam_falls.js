import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
import { drawBeam } from '../_helpers.js';
registerShot('s096', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, { shake: true, hideBeam: true });
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The gym roof groans. A steel beam falls." — the beam DROPS
    const fall = ease.in(prog(t, 0.4, 1.4)) * 320;
    const tilt = prog(t, 0.4, 1.4) * 0.06;
    drawBeam(g, E.W * 0.50, GY - 380 + fall, 760, tilt);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [0.5, POSES.handsOnHead]]), t), expr: 'shocked', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const mx = E.W * 0.62 + t * 40;
    drawFigure(g, { x: mx, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: walkPose(t * Math.PI * 2 * 1.0), expr: 'scared', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

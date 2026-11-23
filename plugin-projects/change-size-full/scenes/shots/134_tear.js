import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
import { drawContract } from '../_helpers.js';
registerShot('s134', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You tear the contract..." — Noah grabs it and RIPS
    const tear = prog(t, 0.5, 1.1);
    drawFigure(g, { x: E.W * 0.44, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.holdFront]]), t), expr: exprAt(t, [[0, 'thinking'], [0.5, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawContract(g, E.W * 0.50, GY - 160, -0.2 + tear * 0.3, 0.9, { torn: tear > 0.3 });
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(posesAt(t, [[0, POSES.holdFront], [0.6, POSES.handsOnHead]]), t), expr: exprAt(t, [[0, 'smirk'], [0.6, 'shocked']]), talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
} });

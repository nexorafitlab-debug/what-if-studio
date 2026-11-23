import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
import { drawContract } from '../_helpers.js';
registerShot('s135', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "...in half." — the two torn halves drift apart
    const sep = ease.out(prog(t, 0, 1.0)) * 90;
    drawFigure(g, { x: E.W * 0.44, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.holdFront, t), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    g.save(); g.translate(-sep, -sep * 0.4); drawContract(g, E.W * 0.50, GY - 160, -0.5, 0.9, { torn: true }); g.restore();
    g.save(); g.translate(sep, sep * 0.3); drawContract(g, E.W * 0.50, GY - 160, 0.4, 0.9, { torn: true }); g.restore();
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'shocked', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
} });

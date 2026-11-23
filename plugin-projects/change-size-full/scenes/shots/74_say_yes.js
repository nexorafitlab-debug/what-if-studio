import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { office } from '../sets/office.js';
registerShot('s074', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, desk } = office(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You say yes. Of course you say yes." — the handshake
    const nx = lerp(E.W * 0.30, E.W * 0.52, ease.out(prog(t, 0, 0.7)));
    drawFigure(g, { x: nx, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.holdFront]]), t), expr: exprAt(t, [[0, 'worried'], [0.7, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.holdFront]]), t), expr: 'smile', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
} });

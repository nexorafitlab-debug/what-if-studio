import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { science } from '../sets/science.js';
registerShot('s150', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = science(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "They would snap under you." — the big cube CRACKS
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.handsOnHead]]), t), expr: exprAt(t, [[0, 'worried'], [0.6, 'scared']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.GALILEO.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: 0, blink: (t % 3.5) < 0.12, rim });
    // a crack zigzags across the big cube on the board
    const cl = prog(t, 0.4, 1.2);
    if (cl > 0) {
      g.strokeStyle = 'rgba(224,120,86,0.9)'; g.lineWidth = 5;
      g.beginPath(); g.moveTo(E.W * 0.42, 250); g.lineTo(E.W * 0.42 + 60 * cl, 300); g.lineTo(E.W * 0.42 + 40 * cl, 350); g.lineTo(E.W * 0.42 + 120 * cl, 400); g.stroke();
    }
  });
} });

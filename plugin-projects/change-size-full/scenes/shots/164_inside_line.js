import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { desk } from '../sets/desk.js';
import { drawLetter } from '../_helpers.js';
registerShot('s164', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, deskTop } = desk(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Inside, one line." — Noah opens the letter, one line of text
    const open = prog(t, 0.2, 0.9);
    drawLetter(g, E.W * 0.62, deskTop - 20, -0.1, 1);
    if (open > 0.3) {
      rr(g, E.W * 0.54, deskTop - 90, 180, 60, 4); g.fillStyle = '#f2ead8'; g.fill();
      text(g, '...', E.W * 0.63, deskTop - 52, { size: 34, color: '#3a2a1e', font: FONTS.ui, weight: 900, alpha: open });
    }
    drawFigure(g, { x: E.W * 0.38, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.holdFront], [0.6, POSES.stand]]), t), expr: exprAt(t, [[0, 'confused'], [0.6, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

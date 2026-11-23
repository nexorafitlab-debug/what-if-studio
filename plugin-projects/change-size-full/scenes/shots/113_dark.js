import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s113', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Dark." — under the beam, nearly black; tiny Noah's rim light glows
    drawFigure(g, { x: E.W * 0.52, y: GY + 6, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'scared', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  // heavy dark veil over the whole frame — only the rim light shows
  g.save(); g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore();
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s117', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Silence." — tiny Noah holds still, listening
    drawFigure(g, { x: E.W * 0.52, y: GY + 6, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'worried', talk: 0, blink: (t % 3.7) < 0.12, rim });
  });
  g.save(); g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore();
} });

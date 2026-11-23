import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
registerShot('s014', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // Mom at the stove calls out; Noah walks in from the left, Lily behind him
    drawFigure(g, { x: E.W * 0.88, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.talk]]), t), expr: 'neutral', talk: 0, blink: (t % 3.3) < 0.12, rim });
    const nx = E.W * 0.30 + t * 110;
    drawFigure(g, { x: nx, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: nx - 150, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.LILY.outfit, pose: walkPose(t * Math.PI * 2 * 0.9 + 1), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

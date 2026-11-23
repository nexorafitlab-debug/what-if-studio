import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
import { drawEarring } from '../_helpers.js';
registerShot('s009', { draw(g, t, info) {
  const cam = { z: 1.25, x: -460 };
  layer(g, cam, 1, (g) => {
    const { GY, M, fridge } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // TINY Noah walks UNDER the fridge (real travel, fast little steps)
    const nx = lerp(E.W * 0.42, fridge.x + fridge.w * 0.55, prog(t, 0, 1.9));
    drawFigure(g, { x: nx, y: GY + 6, s: 0.3, facing: -1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 2.2), expr: exprAt(t, [[0, 'determined'], [1.6, 'happy']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the earring glints in the dark under the fridge
    const glint = 0.5 + 0.5 * Math.sin(t * 6);
    drawEarring(g, fridge.x + fridge.w * 0.55, GY - 12, 0.8 + glint * 0.3);
  });
} });

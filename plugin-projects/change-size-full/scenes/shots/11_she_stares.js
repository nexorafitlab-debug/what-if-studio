import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
registerShot('s011', { draw(g, t, info) {
  const cam = { z: 1.3, x: 160 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // Lily stares — wide eyes, frozen mid-crouch; tiny Noah waves at her feet
    drawFigure(g, { x: E.W * 0.60, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.LILY.outfit, pose: breathe(POSES.crouch, t), expr: 'shocked', talk: 0, blink: false, rim });
    drawFigure(g, { x: E.W * 0.44, y: GY, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.wave, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

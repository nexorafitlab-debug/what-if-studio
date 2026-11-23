import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { office } from '../sets/office.js';
registerShot('s071', { draw(g, t, info) {
  const cam = { z: 1.2, x: -200 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = office(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Your face on posters." — Noah's face appears on the centre poster
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.pointUp]]), t), expr: exprAt(t, [[0, 'thinking'], [0.7, 'awe']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(POSES.point, t), expr: 'smirk', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
} });

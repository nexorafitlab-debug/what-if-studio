import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s121', { draw(g, t, info) {
  const cam = { z: 1.35, x: 300, y: -60 };
  layer(g, cam, 1, (g) => {
    const { GY, M, beam, pin } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The beam rests on one bent strut. One pin holds it all." — the pin glints
    drawFigure(g, { x: E.W * 0.78, y: GY - 90, s: 0.3, facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.pointUp, t), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const glint = 0.5 + 0.5 * Math.sin(t * 6);
    circle(g, pin.x, pin.y, 14 + glint * 4, 'rgba(255,215,106,' + (0.5 + glint * 0.5).toFixed(2) + ')');
  });
} });

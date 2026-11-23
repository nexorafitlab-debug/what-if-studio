import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { dining } from '../sets/dining.js';
registerShot('s056', { draw(g, t, info) {
  const cam = { z: 1.25, x: 180 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = dining(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Then she stops. Noah. Are you okay?" — Mom leans in, worried
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.crouch]]), t), expr: 'worried', talk: 0, blink: (t % 3.3) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.44, y: GY + 10, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [0.6, POSES.sad]]), t), expr: exprAt(t, [[0, 'nervous'], [0.6, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

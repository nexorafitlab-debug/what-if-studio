import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s124', { draw(g, t, info) {
  const cam = { z: 1.35, x: 300, y: -60 };
  layer(g, cam, 1, (g) => {
    const { GY, M, pin } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "The pin slides. It drops." — the pin pops out and falls
    const drop = ease.in(prog(t, 0.5, 1.2)) * 200;
    circle(g, pin.x + prog(t, 0.2, 0.5) * 30, pin.y + drop, 12, '#ffd76a');
    drawFigure(g, { x: E.W * 0.78, y: GY - 90, s: 0.3, facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [0.6, POSES.stand]]), t), expr: exprAt(t, [[0, 'determined'], [0.6, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { sink } from '../sets/sink.js';
registerShot('s043', { draw(g, t, info) {
  const cam = { z: 1.3, x: -220 };
  layer(g, cam, 1, (g) => {
    const { GY, M, leak } = sink(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You fix the pipe in five minutes." — tiny Noah tightens the joint
    const fig = { x: E.W * 0.30, y: GY - 40, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.ready]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'determined'], [1.2, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the drip SLOWS and stops as he works
    const dripA = 1 - prog(t, 0.8, 1.8);
    if (dripA > 0) { circle(g, leak.x, GY - 280 + ((t * 120) % 220), 10, 'rgba(159,216,255,' + dripA.toFixed(2) + ')'); }
    // the plumber gives a thumbs-up from the door
    drawFigure(g, { x: E.W * 0.88, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.PLUMBER.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [0.8, POSES.cheer]]), t), expr: 'happy', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { truckstreet } from '../sets/truckstreet.js';
registerShot('s047', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const push = ease.inOut(prog(t, 0.3, 1.8)) * 180;
    const { GY, M, truck } = truckstreet(g, t, info, { truckPush: push });
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "...and move a truck." — giant Noah pushes, the truck ROLLS forward
    const fig = { x: E.W * 0.30, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [0.5, POSES.ready]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'determined'], [1.4, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the truck rolls via the set's truckPush param; Noah's strain sells it
    drawFigure(g, { x: E.W * 0.86, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MIA.outfit, pose: breathe(POSES.point, t), expr: 'shocked', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

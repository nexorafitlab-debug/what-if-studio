import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { court } from '../sets/court.js';
registerShot('s033', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, hoop } = court(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // YOU DUNK THE BALL — giant Noah jumps and slams it through the hoop
    const jump = Math.sin(Math.PI * clamp(prog(t, 0.3, 1.3))) * 160;
    const fig = { x: E.W * 0.72, y: GY - jump, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [0.4, POSES.jump], [1.2, POSES.dive]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'determined'], [1.2, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the ball arcs into the hoop
    const bx = lerp(E.W * 0.62, hoop.x, ease.inOut(prog(t, 0.4, 1.4)));
    const by = lerp(GY - 320, hoop.y, ease.inOut(prog(t, 0.4, 1.4))) - Math.sin(Math.PI * clamp(prog(t, 0.4, 1.4))) * 120;
    circle(g, bx, by, 26, '#e07856');
    // the ref and teammate cheer from the floor
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.REF.outfit, pose: breathe(POSES.cheer, t), expr: 'smile', talk: 0, blink: (t % 3.3) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.34, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.STU2.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s103', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Your own weight cracks the floor under you." — cracks SPREAD from his feet
    const fig = { x: E.W * 0.34, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.crouch, t) };
    drawFigure(g, { ...fig, expr: 'scared', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // new cracks radiate from under giant Noah's feet
    const cl = prog(t, 0.2, 1.4);
    g.strokeStyle = 'rgba(0,0,0,0.7)'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(E.W * 0.34, GY + 10); g.lineTo(E.W * 0.34 - 120 * cl, GY + 60 + 60 * cl); g.stroke();
    g.beginPath(); g.moveTo(E.W * 0.34, GY + 10); g.lineTo(E.W * 0.34 + 140 * cl, GY + 50 + 80 * cl); g.stroke();
    drawFigure(g, { x: E.W * 0.62, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.lie, t), expr: 'scared', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

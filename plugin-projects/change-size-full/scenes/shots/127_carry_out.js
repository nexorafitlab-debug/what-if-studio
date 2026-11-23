import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s127', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You grow back. You carry him out." — Noah grows, lifts Milo, walks out
    const k = ease.inOut(prog(t, 0.1, 0.8));
    const s = lerp(0.3, 1.5, k);
    const nx = lerp(E.W * 0.78, E.W * 0.34, prog(t, 0.8, 1.9));
    drawFigure(g, { x: nx, y: GY, s, facing: -1, outfit: CAST.NOAH.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: exprAt(t, [[0, 'happy'], [0.8, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: nx + 60, y: GY - 10, s: V(1.1, 1.2), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.holdFront, t), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

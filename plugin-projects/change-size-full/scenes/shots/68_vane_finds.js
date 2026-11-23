import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetlight } from '../sets/streetlight.js';
registerShot('s068', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = streetlight(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Then a man in a grey suit finds you. Mr. Vane." — Vane steps out of the dark
    const vx = lerp(E.W * 0.95, E.W * 0.72, ease.out(prog(t, 0, 1.2)));
    drawFigure(g, { x: vx, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: walkPose(t * Math.PI * 2 * 0.7), expr: exprAt(t, [[0, 'neutral'], [1.2, 'smirk']]), talk: 0, blink: (t % 3.5) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.sad]]), t), expr: exprAt(t, [[0, 'neutral'], [0.8, 'nervous']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    text(g, 'MR. VANE', E.W * 0.72, E.H * 0.30, { size: V(52, 56), color: '#c9c9d8', glow: 18, glowColor: 'rgba(201,201,216,0.5)', spacing: 4, alpha: clamp(prog(t, 1.0, 1.4)) });
  });
} });

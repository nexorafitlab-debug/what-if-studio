import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { nature } from '../sets/nature.js';
registerShot('s157', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = nature(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "And a shrew must eat its own body weight every day..." — a shrew nibbles
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.crouch, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the shrew (small brown shape) nibbling a seed, fast little bites
    const nib = Math.sin(t * 10) * 3;
    circle(g, E.W * 0.36, GY - 20, 26, '#6a4a2a');
    circle(g, E.W * 0.36 + 24, GY - 30 + nib, 14, '#6a4a2a');
    circle(g, E.W * 0.36 + 30, GY - 38 + nib, 4, '#1a1622');
    circle(g, E.W * 0.36 + 52, GY - 8, 10, '#c9a44a');
  });
} });

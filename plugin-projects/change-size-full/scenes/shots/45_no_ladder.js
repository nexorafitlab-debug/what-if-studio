import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetlight } from '../sets/streetlight.js';
registerShot('s045', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, lamp } = streetlight(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "No ladder. Easy money." — the bulb LIGHTS UP in giant Noah's hand
    const fig = { x: E.W * 0.30, y: GY, s: 2.9, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.reach], [0.8, POSES.holdFront]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'determined'], [0.8, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const glowA = clamp(prog(t, 0.7, 1.1));
    circle(g, lamp.x + 37, lamp.y + 2, 46 + glowA * 20, 'rgba(255,215,106,' + (0.4 + glowA * 0.6).toFixed(2) + ')');
    // the builder hands over cash, grinning
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.BUILDER.outfit, pose: breathe(posesAt(t, [[0, POSES.crossArms], [0.7, POSES.holdFront]]), t), expr: 'happy', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });

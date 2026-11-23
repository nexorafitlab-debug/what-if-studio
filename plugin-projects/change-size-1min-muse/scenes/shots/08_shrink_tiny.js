import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
import { sizePill } from '../_helpers.js';
registerShot('s008', { draw(g, t, info) {
  const cam = { z: 1.1, x: -260 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // YOU SHRINK TO TEN CENTIMETERS: Noah collapses down to tiny size
    const k = ease.inOut(prog(t, 0.1, 1.1));
    const s = lerp(1.5, 0.3, k);
    const fig = { x: E.W * 0.48, y: GY, s, facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [0.8, POSES.stand]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'surprised'], [0.9, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '0.1 m', 'green', t, { at: 0.3, hold: 1.0 });
    // Lily leans in, shocked at tiny Noah
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.LILY.outfit, pose: breathe(POSES.crouch, t), expr: 'shocked', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bedroom } from '../sets/bedroom.js';
registerShot('s003', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = bedroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // YOU GROW: Noah visibly scales up 1.5x -> 2.4x across the shot
    const k = ease.inOut(prog(t, 0.1, 0.9));
    const s = lerp(1.5, 2.4, k);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.reach]]), t);
    drawFigure(g, { x: E.W * 0.42, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose, expr: exprAt(t, [[0, 'neutral'], [0.5, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

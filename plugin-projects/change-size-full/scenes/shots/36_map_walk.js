import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { maproom } from '../sets/maproom.js';
import { sizePill } from '../_helpers.js';
registerShot('s036', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, mapTable } = maproom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // PLUS: you SHRINK to ten centimeters and walk across a map
    const k = ease.inOut(prog(t, 0.1, 0.9));
    const s = lerp(1.5, 0.3, k);
    const fig = { x: E.W * 0.40, y: mapTable.y + 30, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.stand]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'surprised'], [0.9, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    sizePill(g, fig, '0.1 m', 'green', t, { at: 0.2, hold: 1.0 });
    // two classmates lean over the table, watching the tiny walk
    drawFigure(g, { x: E.W * 0.14, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.STU5.outfit, pose: breathe(POSES.crouch, t), expr: 'shocked', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.90, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MIA.outfit, pose: breathe(POSES.crouch, t), expr: 'awe', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'PLUS', E.W / 2, E.H * 0.16, { size: V(56, 60), color: '#7ac74a', glow: 20, glowColor: 'rgba(122,199,74,0.5)', spacing: 6, alpha: a });
} });

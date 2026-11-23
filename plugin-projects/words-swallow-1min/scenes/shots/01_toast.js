import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { swallowedWord } from '../_helpers.js';
import { rr, seg, circle } from '/engine/core.js';
registerShot('s001', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // Mom behind the table (right), sliding the toast toward Eli
    const momFig = { x: E.W * 0.70, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.talk], [0.9, POSES.reach]]), t) };
    drawFigure(g, { ...momFig, expr: exprAt(t, [[0, 'smile'], [1.2, 'smile']]), talk: talkAmount(info.globalT, 2.84, 5.04), blink: (t % 3.7) < 0.12 });
    // Eli seated at the table (left), watching the toast come
    drawFigure(g, { x: E.W * 0.30, y: GY + 30, s: V(1.4, 1.5), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [1.6, POSES.sit]]), t), expr: exprAt(t, [[0, 'neutral'], [1.6, 'smile']]), talk: 0, blink: (t % 3.7) < 0.12, rim });
    // the toast plate SLIDES across the table toward Eli
    const k = ease.inOut(prog(t, 0.2, 1.8));
    const px = lerp(E.W * 0.60, E.W * 0.42, k);
    const py = GY - 128;
    circle(g, px, py, 34, '#e8e4f4');
    rr(g, px - 22, py - 14, 44, 26, 5); g.fillStyle = '#e8a34a'; g.fill();
    g.strokeStyle = '#b87a2e'; g.lineWidth = 3; g.stroke();
  });
} });

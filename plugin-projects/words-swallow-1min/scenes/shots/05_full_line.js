import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s005', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // The full line, bright grey above Mom — "I'M SORRY I MISSED YOUR GAME."
  const momFig = { x: E.W * 0.66, y: 0, s: V(1.6, 1.7), facing: -1, outfit: CAST.MOM.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    momFig.y = GY;
    momFig.pose = breathe(posesAt(t, [[0, POSES.sad], [1.4, POSES.stand]]), t);
    drawFigure(g, { ...momFig, expr: exprAt(t, [[0, 'sad'], [1.4, 'smile']]), talk: 0, blink: (t % 3.7) < 0.12, look: [0, 0.5] });
    drawFigure(g, { x: E.W * 0.26, y: GY + 30, s: V(1.4, 1.5), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(POSES.sit, t), expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.7], rim });
  });
  // TEXT LAST, on top
  swallowedWord(g, momFig, "I'M SORRY I MISSED YOUR GAME.", t, { at: 0, dur: 2.68 });
} });

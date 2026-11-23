import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s004', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "But above her head, grey words float." — the words FADE IN above Mom
  const momFig = { x: E.W * 0.68, y: 0, s: 0, facing: -1, outfit: CAST.MOM.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    momFig.y = GY; momFig.s = V(1.5, 1.6);
    momFig.pose = breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.sad]]), t);
    drawFigure(g, { ...momFig, expr: exprAt(t, [[0, 'smile'], [1.2, 'worried']]), talk: 0, blink: (t % 3.7) < 0.12, look: [0, 0.4] });
    drawFigure(g, { x: E.W * 0.28, y: GY + 30, s: V(1.4, 1.5), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(POSES.sit, t), expr: exprAt(t, [[0, 'neutral'], [0.9, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.4, -0.6], rim });
  });
  // TEXT LAST, on top: grey words fade in above Mom's head, hang to shot end
  swallowedWord(g, momFig, "I'M SORRY I MISSED YOUR GAME.", t, { at: 0.6, fadeAt: 1e9 });
} });

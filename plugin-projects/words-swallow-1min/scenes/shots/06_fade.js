import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s006', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "You watch them fade." — the words dissolve; Eli's eyes follow them down
  const momFig = { x: E.W * 0.66, y: 0, s: V(1.6, 1.7), facing: -1, outfit: CAST.MOM.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    momFig.y = GY;
    momFig.pose = breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.talk]]), t);
    drawFigure(g, { ...momFig, expr: 'smile', talk: 0, blink: (t % 3.7) < 0.12, look: [0, 0.3] });
    drawFigure(g, { x: E.W * 0.26, y: GY + 30, s: V(1.4, 1.5), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(POSES.sit, t), expr: exprAt(t, [[0, 'surprised'], [0.8, 'thinking']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.4, -0.4 - 0.4 * prog(t, 0.2, 1.2)], rim });
  });
  // TEXT LAST, on top: words fade out fast at the start of the shot
  swallowedWord(g, momFig, "I'M SORRY I MISSED YOUR GAME.", t, { at: 0, fadeAt: 0.15 });
} });

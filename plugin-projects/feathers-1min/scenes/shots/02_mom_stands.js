import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
registerShot('s002', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // Mom stands in the kitchen, hands on the table, looking at Kai
    drawFigure(g, { x: E.W * 0.62, y: GY, s: V(1.7, 1.8), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.talk]]), t), expr: exprAt(t, [[0, 'neutral'], [1.0, 'smile']]), talk: talkAmount(info.globalT, 1.52, 2.58), blink: (t % 3.7) < 0.12 });
    drawFigure(g, { x: E.W * 0.28, y: GY + 30, s: V(1.4, 1.5), facing: 1, outfit: CAST.KAI.outfit, pose: breathe(POSES.sit, t), expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12, look: [0.4, -0.2], rim });
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
registerShot('s004', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // Close on Kai — "You did not." Guilty, head down
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.9, 2.0), facing: 1, outfit: CAST.KAI.outfit, pose: breathe(posesAt(t, [[0, POSES.sad]]), t), expr: exprAt(t, [[0, 'nervous'], [0.5, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, 0.6], rim });
  });
} });

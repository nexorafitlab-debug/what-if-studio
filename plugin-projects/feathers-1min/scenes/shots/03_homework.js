import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
registerShot('s003', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // Close on Mom — "Did you do your homework?"
    drawFigure(g, { x: E.W * 0.58, y: GY, s: V(1.9, 2.0), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.talk], [0.7, POSES.point]]), t), expr: exprAt(t, [[0, 'neutral'], [0.4, 'determined']]), talk: talkAmount(info.globalT, 3.36, 3.94), blink: (t % 3.7) < 0.12 });
    drawFigure(g, { x: E.W * 0.24, y: GY + 30, s: V(1.4, 1.5), facing: 1, outfit: CAST.KAI.outfit, pose: breathe(POSES.sit, t), expr: exprAt(t, [[0, 'neutral'], [0.5, 'nervous']]), talk: 0, blink: (t % 3.7) < 0.12, look: [0.4, -0.3], rim });
  });
} });

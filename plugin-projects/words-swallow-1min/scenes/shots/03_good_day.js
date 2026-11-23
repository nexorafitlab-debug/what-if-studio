import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
registerShot('s003', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // Eli looks UP from his toast — "it's a good day"
    drawFigure(g, { x: E.W * 0.34, y: GY + 30, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [0.5, POSES.sitBack]]), t), expr: exprAt(t, [[0, 'neutral'], [0.5, 'surprised'], [1.0, 'smile']]), talk: 0, blink: (t % 3.7) < 0.12, look: [0.2, -0.5], rim });
    // Mom waves a hand, bright and breezy
    drawFigure(g, { x: E.W * 0.70, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.talk], [0.8, POSES.wave]]), t), expr: 'happy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12 });
  });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
registerShot('s002', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // CLOSE on Mom — she smiles and says "Eat up..."
    const momFig = { x: E.W * 0.62, y: GY, s: V(1.9, 2.0), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.talk], [0.9, POSES.relaxed]]), t) };
    drawFigure(g, { ...momFig, expr: exprAt(t, [[0, 'smile'], [0.7, 'happy']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12 });
    // Eli at the left edge, half in frame, listening
    drawFigure(g, { x: E.W * 0.12, y: GY + 30, s: V(1.3, 1.4), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(POSES.sit, t), expr: 'smile', talk: 0, blink: (t % 3.7) < 0.12, rim });
  });
} });

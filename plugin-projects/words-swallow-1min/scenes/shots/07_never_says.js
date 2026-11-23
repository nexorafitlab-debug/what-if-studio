import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
registerShot('s007', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // "She never says them. She never will." — Mom turns away to the counter,
    // busy, bright again. Eli alone at the table, head down.
    const k = ease.inOut(prog(t, 0, 0.8));
    const mx = lerp(E.W * 0.66, E.W * 0.80, k);
    drawFigure(g, { x: mx, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.talk]]), t), expr: 'smile', talk: 0, blink: (t % 3.7) < 0.12 });
    drawFigure(g, { x: E.W * 0.26, y: GY + 30, s: V(1.4, 1.5), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [0.6, POSES.sad]]), t), expr: exprAt(t, [[0, 'thinking'], [0.6, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, 0.5], rim });
  });
} });

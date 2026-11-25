import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s011', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.46, y: 0, s: V(1.7, 1.8), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.holdFront], [1.6, POSES.stand]]), t);
    // "You pull your sleeve down. Fast." — the feather still peeks out
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'worried'], [1.2, 'nervous']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.3, 0.4], rim });
    drawFigure(g, { x: E.W * 0.74, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t), expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12, look: [-0.4, 0] });
  });
  const [wx, wy] = featherAnchor(kaiFig, 'wrist');
  drawFeather(g, wx, wy, 60, { color: 'white', rot: 0.15 });
} });

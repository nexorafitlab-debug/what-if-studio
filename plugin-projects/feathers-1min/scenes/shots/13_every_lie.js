import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s013', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.44, y: 0, s: V(1.6, 1.7), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.point]]), t);
    // "And every lie you tell grows a feather." — the wrist feather, plain to see
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'neutral'], [1.2, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.3, -0.2], rim });
    drawFigure(g, { x: E.W * 0.74, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t), expr: 'surprised', talk: 0, blink: (t % 3.7) < 0.12, look: [-0.4, 0.2] });
  });
  const [wx, wy] = featherAnchor(kaiFig, 'wrist');
  drawFeather(g, wx, wy, 75, { color: 'white', rot: Math.sin(t * 1.2) * 0.05 });
} });

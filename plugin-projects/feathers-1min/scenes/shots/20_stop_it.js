import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s020', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.5, y: 0, s: V(2.0, 2.1), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.stand]]), t);
    // "Can you stop it?" — close on Kai, the big feather on his collar
    drawFigure(g, { ...kaiFig, expr: 'confused', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, -0.2], rim });
  });
  const [cx, cy] = featherAnchor(kaiFig, 'collar');
  drawFeather(g, cx, cy, 80, { color: 'white', rot: -1.0 });
} });

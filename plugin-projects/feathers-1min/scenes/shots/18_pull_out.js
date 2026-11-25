import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s018', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.46, y: 0, s: V(1.7, 1.8), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.reach], [1.1, POSES.sad]]), t);
    // "You cannot pull it out." — Kai tugs at the collar feather; it will not move
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'determined'], [0.8, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.2, 0.3], rim });
  });
  const [cx, cy] = featherAnchor(kaiFig, 'collar');
  drawFeather(g, cx, cy, 72, { color: 'white', rot: -1.0 + Math.sin(t * 18) * 0.08 });
} });

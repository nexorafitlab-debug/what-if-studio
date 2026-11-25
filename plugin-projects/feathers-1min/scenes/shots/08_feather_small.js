import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { featherPop } from '../_feathers.js';
registerShot('s008', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.66, y: 0, s: V(2.1, 2.2), facing: -1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.reach]]), t);
    // "A feather. Small." — the small white feather sits on his wrist
    drawFigure(g, { ...kaiFig, expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [-0.5, 0.4], rim });
  });
  featherPop(g, kaiFig, 'wrist', t, { at: 0.1, len: 95, color: 'white' });
} });

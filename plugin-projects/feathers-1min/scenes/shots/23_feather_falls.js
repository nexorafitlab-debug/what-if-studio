import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { featherFall, featherAnchor } from '../_feathers.js';
registerShot('s023', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.46, y: 0, s: V(1.7, 1.8), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.sad]]), t);
    // "And the feather falls." — it leaves his collar and drifts down
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'sad'], [0.6, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.2, 0.3], rim });
  });
  const [cx, cy] = featherAnchor(kaiFig, 'collar');
  featherFall(g, cx, cy, t, { at: 0.3, dur: 1.2, fall: 300, sway: 40, rot: 0.7, len: 72, color: 'white' });
} });

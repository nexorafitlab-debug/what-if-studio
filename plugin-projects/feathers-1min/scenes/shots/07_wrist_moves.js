import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { featherAnchor } from '../_feathers.js';
import { circle } from '/engine/core.js';
registerShot('s007', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.66, y: 0, s: V(2.1, 2.2), facing: -1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.reach], [1.0, POSES.stand]]), t);
    // Wrist close-up — "something moves on your wrist..."
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'surprised'], [1.0, 'worried']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [-0.5, 0.4], rim });
  });
  // a tiny white nub pulses under the skin at his wrist — something is moving
  const [wx, wy] = featherAnchor(kaiFig, 'wrist');
  const pulse = 1 + 0.25 * Math.sin(t * 10);
  circle(g, wx, wy, 7 * pulse, '#f5f2e8');
  circle(g, wx, wy, 11 * pulse, 'rgba(245,242,232,0.25)');
} });

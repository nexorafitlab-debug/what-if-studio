import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s010', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.66, y: 0, s: V(2.1, 2.2), facing: -1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.reach]]), t);
    // "It pushes out of your skin like a sprout." — the feather GROWS taller
    drawFigure(g, { ...kaiFig, expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [-0.5, 0.4], rim });
  });
  const [wx, wy] = featherAnchor(kaiFig, 'wrist');
  const len = lerp(70, 140, prog(t, 0, 2.0));
  drawFeather(g, wx, wy, len, { color: 'white', rot: Math.sin(t * 1.5) * 0.08, glow: 0.15 });
} });

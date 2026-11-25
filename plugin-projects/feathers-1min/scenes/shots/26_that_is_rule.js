import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s026', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.5, y: 0, s: V(1.2, 1.3), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.stand]]), t);
    // "That is the rule." — Kai below the rule, wrist feather in view
    drawFigure(g, { ...kaiFig, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, -0.6], rim });
  });
  const [wx, wy] = featherAnchor(kaiFig, 'wrist');
  drawFeather(g, wx, wy, 70, { color: 'white', rot: 0.1 });
  goldLine(g, 'THAT IS THE RULE.', E.H * 0.36, V(72, 80));
} });

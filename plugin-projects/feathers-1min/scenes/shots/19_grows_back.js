import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s019', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.46, y: 0, s: V(1.7, 1.8), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.sad]]), t);
    // "It hurts... And it grows back. Bigger." — the feather grows BIGGER
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'sad'], [1.4, 'scared'], [2.6, 'shocked']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.2, 0.3], rim });
  });
  const [cx, cy] = featherAnchor(kaiFig, 'collar');
  const len = lerp(55, 105, prog(t, 0, 2.5));
  drawFeather(g, cx, cy, len, { color: 'white', rot: -1.0 + Math.sin(t * 1.2) * 0.06, glow: 0.15 });
} });

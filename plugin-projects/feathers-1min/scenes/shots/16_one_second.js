import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { featherPop } from '../_feathers.js';
registerShot('s016', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.5, y: 0, s: V(1.8, 1.9), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.stand]]), t);
    // "It grows in one second..." — a feather POPS out of his collar, fast
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'neutral'], [0.6, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, -0.2], rim });
  });
  featherPop(g, kaiFig, 'collar', t, { at: 0.2, len: 78, color: 'white', rot: -1.0 });
  text(g, 'IN ONE SECOND', E.W / 2, E.H * 0.16, { size: V(44, 48), color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 4, glow: 18, glowColor: 'rgba(255,215,106,0.55)', alpha: clamp(prog(t, 0.3, 0.6)) });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { featherPop } from '../_feathers.js';
registerShot('s009', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.62, y: 0, s: V(2.4, 2.5), facing: -1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.reach]]), t);
    // "White. Pop." — tight on the wrist, the feather POPS with a ring burst
    drawFigure(g, { ...kaiFig, expr: 'shocked', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [-0.5, 0.4], rim });
  });
  featherPop(g, kaiFig, 'wrist', t, { at: 0.15, len: 110, color: 'white', glow: 0.3 });
  text(g, 'POP.', E.W / 2, E.H * 0.16, { size: V(52, 56), color: '#f5f2e8', font: FONTS.ui, weight: 900, spacing: 4, glow: 20, glowColor: 'rgba(245,242,232,0.6)', alpha: clamp(prog(t, 0.15, 0.35)) * (1 - clamp(prog(t, 1.2, 1.66))) });
} });

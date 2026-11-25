import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { featherFall } from '../_feathers.js';
registerShot('s024', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    // "It floats away." — the feather drifts down like snow, out of frame
    drawFigure(g, { x: E.W * 0.40, y: GY, s: V(1.6, 1.7), facing: 1, outfit: CAST.KAI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.sad]]), t), expr: exprAt(t, [[0, 'surprised'], [0.7, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.4, -0.5], rim });
  });
  featherFall(g, E.W * 0.58, E.H * 0.30, t, { at: 0, dur: 1.68, fall: 210, sway: 60, rot: 1.2, len: 66, color: 'white', glow: 0.2 });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
import { drawFeather } from '../_feathers.js';
registerShot('s014', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    // RULE CARD 1 — a small white feather floats beside the rule
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.2, 1.3), facing: 1, outfit: CAST.KAI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t), expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, -0.6], rim });
  });
  drawFeather(g, E.W * 0.20, E.H * 0.46, 95, { color: 'white', rot: Math.sin(t * 1.2) * 0.12, glow: 0.25 });
  text(g, 'THE RULE', E.W / 2, E.H * 0.18, { size: V(36, 40), color: '#9fb4d8', font: FONTS.ui, weight: 800, spacing: 6, glow: 10, glowColor: 'rgba(159,180,216,0.4)' });
  goldLine(g, 'SMALL LIE = SMALL', E.H * 0.32, V(64, 72));
  goldLine(g, 'WHITE FEATHER', E.H * 0.46, V(64, 72));
} });

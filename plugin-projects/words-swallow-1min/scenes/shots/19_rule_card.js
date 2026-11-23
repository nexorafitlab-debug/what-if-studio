import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
registerShot('s019', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    // RULE CARD on the void: Eli small below, looking up at the gold rule
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.2, 1.3), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.sad]]), t), expr: exprAt(t, [[0, 'sad'], [1.6, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, -0.6], rim });
  });
  // TEXT LAST, on top
  text(g, 'THE RULE', E.W / 2, E.H * 0.20, { size: V(36, 40), color: '#9fb4d8', font: FONTS.ui, weight: 800, spacing: 6, glow: 10, glowColor: 'rgba(159,180,216,0.4)' });
  goldLine(g, 'ONCE A WORD FADES,', E.H * 0.34, V(64, 72));
  goldLine(g, 'IT IS GONE FOREVER.', E.H * 0.48, V(64, 72));
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
registerShot('s013', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    // NAME CARD on the void: Eli waves, gold name + age
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.6, 1.7), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.9, POSES.wave], [1.8, POSES.stand]]), t), expr: exprAt(t, [[0, 'neutral'], [0.9, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  // TEXT LAST, on top
  goldLine(g, 'ELI', E.H * 0.28, V(120, 132));
  text(g, '16 YEARS OLD', E.W / 2, E.H * 0.42, { size: V(44, 48), color: '#cfe2ff', font: FONTS.ui, weight: 800, spacing: 4, glow: 16, glowColor: 'rgba(207,226,255,0.4)' });
} });

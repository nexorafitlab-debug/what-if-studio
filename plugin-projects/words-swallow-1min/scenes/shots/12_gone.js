import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolHallway } from '../sets/school_hallway.js';
registerShot('s012', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolHallway(g, t, info, {});
    // "And now it is gone." — Eli stops; a faint grey wisp of the words
    // dissolves into smoke above him and is gone
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.sad]]), t), expr: exprAt(t, [[0, 'neutral'], [0.6, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.2, -0.7], rim });
  });
  // TEXT LAST, on top: the wisp — grey, fading fast, drifting up.
  // Kept LEFT of the "SPEAK UP" poster (poster sits at 0.44W) so it never overlaps it.
  const a = 0.85 * (1 - clamp(prog(t, 0.15, 1.5)));
  if (a > 0.01) {
    text(g, "I'M SORRY I MISSED YOUR GAME.", E.W * 0.22, E.H * 0.46 - 46 * t, { size: V(34, 38), color: '#b8b8c0', font: FONTS.ui, weight: 800, spacing: 1, alpha: a, glow: 14, glowColor: 'rgba(184,184,192,0.4)' });
  }
} });

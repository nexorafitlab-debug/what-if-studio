import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s023', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    // "...disappear in grey letters." — the row of words fades OUT one by
    // one; Eli reaches for the last one as it vanishes
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.reach]]), t), expr: exprAt(t, [[0, 'sad'], [1.0, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, -0.5], rim });
  });
  // TEXT LAST, on top: the row melts away left to right
  const row = ["I'M SORRY.", 'THANK YOU.', 'I LOVE YOU.', 'FORGIVE ME.', 'GOODBYE.'];
  for (let i = 0; i < row.length; i++) {
    const a = 0.8 * (1 - clamp(prog(t, i * 0.3, i * 0.3 + 0.4)));
    if (a <= 0.01) continue;
    text(g, row[i], E.W * (0.14 + i * 0.18), E.H * 0.26 - 12 * t, { size: V(34, 38), color: '#b8b8c0', font: FONTS.ui, weight: 800, spacing: 1, alpha: a, glow: 12, glowColor: 'rgba(184,184,192,0.4)' });
  }
} });

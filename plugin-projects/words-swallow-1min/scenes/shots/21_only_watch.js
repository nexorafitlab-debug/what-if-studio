import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s021', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    // "You can only watch..." — Eli alone in the void, grey words drifting past
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(POSES.stand, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.3], rim });
  });
  // TEXT LAST, on top: three grey words drifting slowly upward, soft alpha
  const words = [
    { str: "I'M SORRY.", x: E.W * 0.62, y0: E.H * 0.52, a: 0.75 },
    { str: 'THANK YOU.', x: E.W * 0.78, y0: E.H * 0.34, a: 0.55 },
    { str: 'I LOVE YOU.', x: E.W * 0.58, y0: E.H * 0.22, a: 0.45 },
  ];
  for (const w of words) {
    text(g, w.str, w.x, w.y0 - 14 * t, { size: V(40, 44), color: '#b8b8c0', font: FONTS.ui, weight: 800, spacing: 1, alpha: w.a * clamp(prog(t, 0, 0.4)), glow: 14, glowColor: 'rgba(184,184,192,0.4)' });
  }
} });

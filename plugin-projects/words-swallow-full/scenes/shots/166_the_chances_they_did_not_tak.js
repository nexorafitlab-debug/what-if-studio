import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s166', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.50, y: 0, s: 1.35, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
  });
  text(g, "THE CHANCES THEY", E.W / 2, E.H * 0.26, { size: 52, color: '#b8b8c0', font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: 'rgba(184,184,192,0.4)', alpha: 1 - prog(t, 0.60, 1.71) });
  text(g, "DID NOT TAKE.", E.W / 2, E.H * 0.38, { size: 52, color: '#b8b8c0', font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: 'rgba(184,184,192,0.4)', alpha: 1 - prog(t, 0.60, 1.71) });
} });

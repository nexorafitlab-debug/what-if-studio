import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s144', { draw(g, t, info) {
  // MUSIC-ONLY pause before the science beat (no voice line in this shot)
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  const a = clamp(prog(t, 0.4, 1.0)) * (1 - clamp(prog(t, info.dur - 0.6, info.dur)));
  text(g, 'THE SCIENCE', E.W / 2, E.H * 0.42, { size: V(96, 104), color: '#9fd8ff', glow: 32, glowColor: 'rgba(159,216,255,0.55)', spacing: 8, alpha: a });
  layer(g, { z: 1 }, 1, (g) => {
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: E.H * 0.88, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.think, t), expr: 'thinking', talk: 0, blink: (t % 3.7) < 0.12, rim });
  });
} });

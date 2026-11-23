import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s110', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { gymquake(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.2, 0.5)), a2 = clamp(prog(t, 0.9, 1.2));
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.think, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  text(g, 'BIGGER...', E.W / 2, E.H * 0.32, { size: V(96, 104), color: '#e07856', glow: 30, glowColor: 'rgba(224,120,86,0.55)', spacing: 6, alpha: a1 });
  text(g, 'OR SMALLER?', E.W / 2, E.H * 0.48, { size: V(96, 104), color: '#7ac74a', glow: 30, glowColor: 'rgba(122,199,74,0.55)', spacing: 6, alpha: a2 });
} });

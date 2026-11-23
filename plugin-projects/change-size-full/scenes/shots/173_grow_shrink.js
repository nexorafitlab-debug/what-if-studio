import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { observatory } from '../sets/observatory.js';
registerShot('s173', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { observatory(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.2, 0.5)), a2 = clamp(prog(t, 0.9, 1.2));
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = observatory(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // Noah breathes bigger and smaller, one last time
    const s = 1.5 + 0.55 * Math.sin(t * 2.4);
    drawFigure(g, { x: E.W * 0.42, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.62, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
  text(g, 'WOULD YOU GROW...', E.W / 2, E.H * 0.30, { size: V(84, 92), color: '#e07856', glow: 30, glowColor: 'rgba(224,120,86,0.55)', spacing: 4, alpha: a1 });
  text(g, 'OR SHRINK?', E.W / 2, E.H * 0.44, { size: V(84, 92), color: '#7ac74a', glow: 30, glowColor: 'rgba(122,199,74,0.55)', spacing: 4, alpha: a2 });
} });

import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { dining } from '../sets/dining.js';
registerShot('s091', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = dining(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Small steps, Noah. Small steps." — Mom's signature line, gold on screen
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [0.5, POSES.stand]]), t), expr: 'smile', talk: 0, blink: (t % 3.3) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.44, y: GY + 10, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sit, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.8));
  text(g, 'SMALL STEPS, NOAH.', E.W / 2, E.H * 0.18, { size: V(60, 64), color: '#ffd76a', glow: 24, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a });
} });

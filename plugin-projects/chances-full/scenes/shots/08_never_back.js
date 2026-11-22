// s008 — "It never goes back up." Rule card: NEVER GOES BACK UP.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
registerShot('s008', { draw(g, t, info) {
  const cam = { z: 1.25, x: 0, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const s = V(1.35, 1.45), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.crossArms, t), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'NEVER GOES BACK UP.', E.W / 2, E.H * 0.2, { size: V(56, 64), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

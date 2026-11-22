// s009 — "Not even if you say sorry." Kian shrugs, hands up — sorry changes nothing.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
registerShot('s009', { draw(g, t, info) {
  const cam = { z: 1.25, x: 0, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const s = V(1.35, 1.45), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.shrug, t), expr: t > 0.6 ? 'neutral' : 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'SORRY CHANGES NOTHING.', E.W / 2, E.H * 0.2, { size: V(48, 56), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

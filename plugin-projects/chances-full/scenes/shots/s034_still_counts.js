// s034 — "It still counts." Close on Kian, serious. Gold text, bottom band.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
registerShot('s038', { draw(g, t, info) {
  const cam = { z: 1.5, x: 0, y: 140 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.talk], [0.8, POSES.point]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.45, 1.55), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.5, 0.8));
  text(g, 'IT STILL COUNTS.', E.W / 2, E.H * 0.90, { size: V(52, 58), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

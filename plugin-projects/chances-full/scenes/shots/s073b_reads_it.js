// s073 P2 — "He does not reply. But he reads it." Kian lowers the phone; SEEN.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s090', { draw(g, t, info) {
  const cam = { z: 1.4, x: 0, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.sad], [1.2, POSES.stand]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.8, 1.1));
  text(g, 'SEEN.', E.W / 2, E.H * 0.90, { size: V(52, 58), color: '#9fd8ff', glow: 22, glowColor: 'rgba(159,216,255,0.5)', spacing: 2, alpha: a });
} });

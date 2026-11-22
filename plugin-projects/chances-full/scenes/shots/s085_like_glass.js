// s085 — "Like glass. Like you are not there." Hallway: Kian alone, Jay long gone.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
registerShot('s110', { draw(g, t, info) {
  const cam = { z: 1.3, x: 0, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.5, 0.8));
  text(g, 'LIKE GLASS.', E.W / 2, E.H * 0.16, { size: V(56, 64), color: '#9fd8ff', glow: 26, glowColor: 'rgba(159,216,255,0.5)', spacing: 2, alpha: a });
} });

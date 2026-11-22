// s005 — "Seventeen." Kian close, gold KIAN · 17.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { goldLine } from '../_helpers.js';
registerShot('s005', { draw(g, t, info) {
  const cam = { z: 1.5, x: 0, y: 140 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.talk], [0.9, POSES.pointUp]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  if (t > 0.3) goldLine(g, 'KIAN  ·  17', E.H * 0.18, V(72, 80));
} });

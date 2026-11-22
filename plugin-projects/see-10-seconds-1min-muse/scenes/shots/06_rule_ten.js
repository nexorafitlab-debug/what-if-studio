// s006 — "You see everything ten seconds before it happens. Exactly ten." Kian close-up, points up.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { goldLine } from '../_helpers.js';
registerShot('s006', { draw(g, t, info) {
  const cam = { z: 1.5, x: 0, y: 160 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.talk], [2.6, POSES.pointUp]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  if (t > 1.0) goldLine(g, '10 SECONDS', E.H * 0.18, V(84, 92));
} });

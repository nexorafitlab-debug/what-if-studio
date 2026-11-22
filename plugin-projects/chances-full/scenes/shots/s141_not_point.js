// s141 — "But that is not the point." Bathroom: Kian turns from the mirror, determined.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
registerShot('s212', { draw(g, t, info) {
  const cam = { z: 1.2, x: -40, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.ready]]), t);
    drawFigure(g, { x: E.W * 0.64, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

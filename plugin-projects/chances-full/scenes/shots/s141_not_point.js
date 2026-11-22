// s141 — "But that is not the point." Bathroom: Kian turns from the mirror, determined.
// The reflection STAYS in the mirror (with its 4 pill) for the full shot —
// it must never vanish while Kian is still in front of the mirror.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s212', { draw(g, t, info) {
  const cam = { z: 1.2, x: -60, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M, mirror } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // reflection: same place and pill as s210/s211, held for the whole shot
    const refl = { x: E.W * 0.42, y: mirror.y + mirror.h - 20, s: 1.2, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.ready]]), t, 1, 2), expr: 'neutral', alpha: 0.9, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, refl);
    const [hx, hy, hr] = headPos(refl);
    chancePill(g, hx, hy, hr, '4', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.ready]]), t);
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

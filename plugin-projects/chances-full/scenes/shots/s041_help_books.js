// s041 — "You help a stranger with his books." Park: Kian kneels, gathering books for a stranger.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { park } from '../sets/park.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s045', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = park(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const ps = { x: E.W * 0.64, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.crouch, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, ps);
    const [hx, hy, hr] = headPos(ps);
    chancePill(g, hx, hy, hr, '8', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.kneel]]), t);
    drawFigure(g, { x: E.W * 0.36, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

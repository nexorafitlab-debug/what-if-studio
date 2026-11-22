// s042 — "You smile at the lunch lady." Cafeteria: Kian waves at the lunch lady, pill 9.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s046', { draw(g, t, info) {
  const cam = { z: 1.1, x: 60, y: -10 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const ll = { x: E.W * 0.62, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.LUNCH.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, ll);
    const [hx, hy, hr] = headPos(ll);
    chancePill(g, hx, hy, hr, '9', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.wave]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

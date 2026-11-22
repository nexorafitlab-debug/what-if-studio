// s043 — "You wait. Nothing." Cafeteria: Kian waits, watching the lunch lady's pill. It stays 9.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s047', { draw(g, t, info) {
  const cam = { z: 1.2, x: 80, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const ll = { x: E.W * 0.64, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.LUNCH.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, ll);
    const [hx, hy, hr] = headPos(ll);
    chancePill(g, hx, hy, hr, '9', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.shrug]]), t);
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 1.0 ? 'confused' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

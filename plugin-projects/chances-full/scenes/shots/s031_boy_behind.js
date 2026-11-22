// s031 — "The boy behind you?" Cafeteria close: the boy, confused, pill 8 above him.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s035', { draw(g, t, info) {
  const cam = { z: 1.5, x: 120, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const boy = { x: E.W * 0.58, y: GY, s: V(1.45, 1.55), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.shrug]]), t), expr: 'confused', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, boy);
    const [hx, hy, hr] = headPos(boy);
    chancePill(g, hx, hy, hr, '8', t);
    const pose = breathe(POSES.talk, t);
    drawFigure(g, { x: E.W * 0.36, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

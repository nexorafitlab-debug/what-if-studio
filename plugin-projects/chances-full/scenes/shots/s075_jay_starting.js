// s075 — "Jay is starting. And you want to look cool." Gym: Jay ready at centre, red pulsing 1; Kian sidles to the team.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s093', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.6, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.ready, t, 1, 2), expr: 'determined', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '1', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.9, POSES.talk]]), t);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

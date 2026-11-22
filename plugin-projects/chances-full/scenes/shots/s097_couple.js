// s097 — "On your street, a couple argues on a porch. Her number is four." Night street: a couple on a porch, her pill 4.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s128', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const her = { x: E.W * 0.62, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.PASSER2.outfit, pose: breathe(POSES.crossArms, t, 1, 2), expr: 'angry', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, her);
    const [hx, hy, hr] = headPos(her);
    chancePill(g, hx, hy, hr, '4', t);
    const him = { x: E.W * 0.8, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.talk, t, 1, 2), expr: 'angry', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, him);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.25, 1.35), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

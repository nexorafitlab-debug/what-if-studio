// s040 — "You hold a door." Street morning: Kian holds the door for a passer-by, pill 7.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s044', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const ps = { x: E.W * 0.66, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.PASSER2.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, ps);
    const [hx, hy, hr] = headPos(ps);
    chancePill(g, hx, hy, hr, '7', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.holdFront]]), t);
    drawFigure(g, { x: E.W * 0.34, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

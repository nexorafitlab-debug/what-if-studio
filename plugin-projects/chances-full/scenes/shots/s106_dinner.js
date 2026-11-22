// s106 — "Then dinner. Your mom asks about your day." Kitchen: Mom at the table, pill 3, Kian sits down.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s146', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.68, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.talk, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '3', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.sit]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY + 20, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

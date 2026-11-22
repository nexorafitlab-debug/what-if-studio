// s126 P3 — "Then she says: he is in the backyard." She points toward the yard; Kian turns, hopeful.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s187', { draw(g, t, info) {
  const cam = { z: 1.3, x: 40, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jm = { x: E.W * 0.58, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.JAYMOM.outfit, pose: breathe(POSES.point, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jm);
    const [hx, hy, hr] = headPos(jm);
    chancePill(g, hx, hy, hr, '4', t);
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

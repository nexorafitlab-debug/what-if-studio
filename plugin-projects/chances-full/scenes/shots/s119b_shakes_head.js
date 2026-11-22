// s119 P2 — "He just shakes his head." The little brother, pill 5, shakes his head no.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s171', { draw(g, t, info) {
  const cam = { z: 1.3, x: 40, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 3 };
    const bro = { x: E.W * 0.56 + Math.sin(t * 8) * 6, y: GY, s: V(1.15, 1.25), facing: -1, outfit: CAST.BROTHER.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, bro);
    const [hx, hy, hr] = headPos(bro);
    chancePill(g, hx, hy, hr, '5', t);
    drawFigure(g, { x: E.W * 0.32, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

// s119 — "Day eight: his little brother opens the door. He just shakes his head." Jay's house: the brother, pill 5, shakes his head.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s170', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const bro = { x: E.W * 0.56, y: GY, s: V(1.15, 1.25), facing: -1, outfit: CAST.BROTHER.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, bro);
    const [hx, hy, hr] = headPos(bro);
    chancePill(g, hx, hy, hr, '5', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.32, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

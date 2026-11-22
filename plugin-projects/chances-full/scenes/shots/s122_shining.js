// s122 — "You leave it shining by the gate." Jay's house: Kian stands back, looking at the fixed bike.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s177', { draw(g, t, info) {
  const cam = { z: 1.1, x: 100, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.crouch], [0.9, POSES.stand]]), t);
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

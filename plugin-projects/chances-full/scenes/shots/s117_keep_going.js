// s117 — "You keep going. You bring his homework. You leave it at the door." Jay's house: Kian kneels, leaves papers.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s166', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const lx = E.W * 0.12 + Math.min(t, 1.4) * 160;
    const kpose = t < 1.4 ? walkPose(t * Math.PI * 2 * 0.9) : breathe(POSES.crouch, t);
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

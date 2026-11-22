// s072 — "Your sister saves you a seat." Cafeteria: Mia waves Kian over, pill 6, an empty chair beside her.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos, walkPose } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s088', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.64, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(POSES.wave, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, '6', t);
    const lx = E.W * 0.14 + Math.min(t, 1.4) * 140;
    const kpose = t < 1.4 ? walkPose(t * Math.PI * 2 * 0.9) : breathe(POSES.sit, t);
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

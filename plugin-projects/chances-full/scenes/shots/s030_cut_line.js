// s030 — "You cut in line at lunch." Cafeteria: Kian walks up the queue rail and steps in.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s034', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const boy = { x: E.W * 0.62, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, boy);
    const [hx, hy, hr] = headPos(boy);
    chancePill(g, hx, hy, hr, '8', t);
    const lx = E.W * 0.12 + Math.min(t, 1.3) * 170;
    const kpose = t < 1.3 ? walkPose(t * Math.PI * 2 * 0.9) : breathe(POSES.stand, t);
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: t > 1.3 ? 'smile' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

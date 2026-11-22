// s139 — "You do the dishes. You show up." Kitchen: Kian at the sink, then walking out the door, determined.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s209', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.72, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '2', t);
    const lx = E.W * 0.2 + Math.min(t, 1.4) * 110;
    const kpose = t < 1.4 ? breathe(POSES.holdFront, t) : walkPose(t * Math.PI * 2 * 0.9);
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

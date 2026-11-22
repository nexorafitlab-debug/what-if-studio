// s027 P3 — "The number does not listen to words." Close on Mom: still, unmoved, 3.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s031', { draw(g, t, info) {
  const cam = { z: 1.5, x: 60, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.56, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '3', t);
    drawFigure(g, { x: E.W * 0.32, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t, 1, 4), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

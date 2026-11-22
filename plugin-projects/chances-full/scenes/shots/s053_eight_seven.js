// s053 — "Eight. Seven." Kitchen close: Mia's pill holds at 7, her face says the rest.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s060', { draw(g, t, info) {
  const cam = { z: 1.5, x: 120, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.56, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '8'], [0.84, '7']]), t);
    drawFigure(g, { x: E.W * 0.34, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

// s107 — "You snap at her. You are tired. You are scared." Kitchen: Kian snaps, Mom's pill JUMPS 3 to 2.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s148', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(t > 0.7 ? POSES.sad : POSES.stand, t, 1, 2), expr: t > 0.7 ? 'sad' : 'surprised', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '3'], [0.7, '2']]), t);
    const pose = breathe(posesAt(t, [[0, POSES.sit], [0.6, POSES.point], [1.6, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY + 20, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 1.6 ? 'sad' : 'angry', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

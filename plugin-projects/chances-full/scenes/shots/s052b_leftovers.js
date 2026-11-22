// s052 P2 — "The ones with her name on them." Mia's pill JUMPS 8 to 7; she is hurt, not angry.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s059', { draw(g, t, info) {
  const cam = { z: 1.2, x: -30, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.68, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(t > 0.14 ? POSES.sad : POSES.point, t, 1, 2), expr: t > 0.14 ? 'sad' : 'angry', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, '8', t);
    const pose = breathe(POSES.shrug, t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

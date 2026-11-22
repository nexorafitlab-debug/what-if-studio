// s109 — "You watch it drop and you cannot stop it. You say sorry. Sorry. Sorry." Kitchen: Kian talks, Mom's 2 holds.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s152', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '2', t);
    const pose = breathe(posesAt(t, [[0, POSES.reach], [1.0, POSES.talk], [2.2, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

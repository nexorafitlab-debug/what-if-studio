// s037 — "You are late to class." Hallway: Kian rushes past the teacher at the door.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s041', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const tea = { x: E.W * 0.72, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.TEACHER.outfit, pose: breathe(POSES.crossArms, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, tea);
    const [hx, hy, hr] = headPos(tea);
    chancePill(g, hx, hy, hr, '6', t);
    const lx = E.W * 0.1 + t * 220;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 1.2), expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

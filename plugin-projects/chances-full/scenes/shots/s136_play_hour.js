// s136 — "You play for an hour. No one says sorry. No one has to." Backyard: Kian and Jay pass the ball back and forth.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { backyard } from '../sets/backyard.js';
import { CAST } from '../cast.js';
registerShot('s204', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = backyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jx = E.W * 0.58 + Math.sin(t * 1.2) * 40;
    drawFigure(g, { x: jx, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.ready]]), t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const lx = E.W * 0.24 + Math.sin(t * 1.2 + 1.5) * 40;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [1.2, POSES.stand]]), t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

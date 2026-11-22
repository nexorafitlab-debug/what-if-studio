// s134 P2 — "You shoot. You miss." Kian jumps, shoots, and the ball misses; he goes quiet.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { backyard } from '../sets/backyard.js';
import { CAST } from '../cast.js';
registerShot('s201', { draw(g, t, info) {
  const cam = { z: 1.2, x: 80, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = backyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.66, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const pose = breathe(posesAt(t, [[0, POSES.jump], [0.24, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 0.24 ? 'sad' : 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

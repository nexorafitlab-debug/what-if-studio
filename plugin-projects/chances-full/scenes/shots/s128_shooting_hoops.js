// s128 — "Jay is shooting hoops. Alone." Backyard: Jay shoots, no pill above his head.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { backyard } from '../sets/backyard.js';
import { CAST } from '../cast.js';
registerShot('s189', { draw(g, t, info) {
  const cam = { z: 1.1, x: 60, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = backyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.64, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [0.9, POSES.jump]]), t, 1, 2), expr: 'determined', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.think]]), t);
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

// s135 — "He laughs. Just once. Short. But it is real." Backyard: Jay laughs, Kian smiles back.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { backyard } from '../sets/backyard.js';
import { CAST } from '../cast.js';
registerShot('s202', { draw(g, t, info) {
  const cam = { z: 1.2, x: 40, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = backyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.62, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.cheer]]), t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const pose = breathe(posesAt(t, [[0, POSES.sad], [0.9, POSES.relaxed]]), t);
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

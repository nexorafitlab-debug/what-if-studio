// s094 — "You want to say something. You want to help him up." Bus stop: Kian reaches toward the old man.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
registerShot('s124', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.6, y: GY + 30, s: V(1.3, 1.4), facing: -1, outfit: CAST.OLD.outfit, pose: breathe(POSES.sit, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.9, POSES.reach]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

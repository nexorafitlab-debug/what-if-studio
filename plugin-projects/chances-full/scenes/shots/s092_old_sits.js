// s092 — "The old man does not shout. He just sits down. He looks out the window." Bus stop: the old man sits, quiet.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
registerShot('s120', { draw(g, t, info) {
  const cam = { z: 1.2, x: 60, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.9, POSES.sit]]), t);
    drawFigure(g, { x: E.W * 0.56, y: GY + 30, s: V(1.35, 1.45), facing: -1, outfit: CAST.OLD.outfit, pose, expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const kpose = breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

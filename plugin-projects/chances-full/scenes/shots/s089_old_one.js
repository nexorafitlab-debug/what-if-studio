// s089 — "An old man gets on. His number is one." Bus stop close: the old man, red pulsing 1.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s116', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const old = { x: E.W * 0.6, y: GY, s: V(1.45, 1.55), facing: -1, outfit: CAST.OLD.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, old);
    const [hx, hy, hr] = headPos(old);
    chancePill(g, hx, hy, hr, '1', t);
    const pose = breathe(posesAt(t, [[0, POSES.sit], [0.8, POSES.stand]]), t);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

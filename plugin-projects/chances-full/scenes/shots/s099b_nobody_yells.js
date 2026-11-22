// s099 P2 — "Nobody yells." Him alone on the porch, hands in pockets, quiet.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
registerShot('s133', { draw(g, t, info) {
  const cam = { z: 1.3, x: 80, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const him = { x: E.W * 0.58, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, him);
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

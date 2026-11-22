// s098 — "He says one more thing. Four. Three. She turns away." Night street: her pill JUMPS 4 to 3.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s130', { draw(g, t, info) {
  const cam = { z: 1.3, x: 80, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const her = { x: E.W * 0.6, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.PASSER2.outfit, pose: breathe(POSES.crossArms, t, 1, 2), expr: 'angry', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, her);
    const [hx, hy, hr] = headPos(her);
    chancePill(g, hx, hy, hr, '4', t);
    const him = { x: E.W * 0.82, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.talk, t, 1, 2), expr: 'angry', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, him);
    drawFigure(g, { x: E.W * 0.32, y: GY, s: V(1.25, 1.35), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

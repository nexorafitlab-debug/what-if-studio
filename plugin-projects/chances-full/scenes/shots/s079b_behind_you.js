// s079 P2 — "He is standing right behind you." Kian turns; Jay stands there, red 1, shocked.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s100', { draw(g, t, info) {
  const cam = { z: 1.3, x: 60, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.62, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'shocked', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '1', t);
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t), expr: 'shocked', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

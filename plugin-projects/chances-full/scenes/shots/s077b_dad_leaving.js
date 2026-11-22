// s077 P2 — "The one about his dad leaving." Kian explains on; Jay behind him goes still.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s096', { draw(g, t, info) {
  const cam = { z: 1.15, x: -40, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.82, y: GY, s: V(1.2, 1.3), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '1', t);
    const pose = breathe(POSES.explain, t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

// s013 — "Then you forget his birthday." Kian facepalms — he forgot.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { schoolyard } from '../sets/schoolyard.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s014', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = schoolyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian, centre, hand to his forehead
    drawFigure(g, { x: E.W * 0.46, y: GY, s: V(1.45, 1.55), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.facepalm, t), expr: t > 0.5 ? 'sad' : 'worried', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Jay at the edge, arms crossed, already turning away
    const jay = { x: E.W * 0.84, y: GY, s: V(1.15, 1.25), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.crossArms, t, 1, 6), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '5', t);
  });
} });

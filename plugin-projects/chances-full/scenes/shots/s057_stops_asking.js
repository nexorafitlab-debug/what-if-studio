// s057 — "She stops asking you for things. She stops telling you things." Hallway: Mia walks past Kian, arms crossed.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s064', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mx = E.W * 0.78 - t * 120;
    const mia = { x: mx, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.SISTER.outfit, pose: t < 1.4 ? walkPose(t * Math.PI * 2 * 0.9) : breathe(POSES.crossArms, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, '6', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.reach]]), t);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

// s074 P2 — "The whole school is there." Wide gym: crowd, teams, Jay's red 1.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s092', { draw(g, t, info) {
  const cam = { z: 0.9, x: 0, y: 20 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const t1 = { x: E.W * 0.16, y: GY, s: V(1.2, 1.3), facing: 1, outfit: CAST.TEAM1.outfit, pose: breathe(POSES.cheer, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, t1);
    const [hx1, hy1, hr1] = headPos(t1);
    chancePill(g, hx1, hy1, hr1, '8', t);
    const jay = { x: E.W * 0.62, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.ready, t, 1, 2), expr: 'determined', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '1', t);
    const lx = E.W * 0.3 + (t + 2.2) * 60;
    drawFigure(g, { x: lx, y: GY, s: V(1.25, 1.35), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose((t + 2.2) * Math.PI * 2 * 0.9), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

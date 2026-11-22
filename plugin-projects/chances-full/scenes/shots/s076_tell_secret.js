// s076 — "So you tell the team his secret." Gym: Kian leans in, whispering to two teammates.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s094', { draw(g, t, info) {
  const cam = { z: 1.1, x: -60, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const t1 = { x: E.W * 0.6, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.TEAM1.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'surprised', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, t1);
    const [hx1, hy1, hr1] = headPos(t1);
    chancePill(g, hx1, hy1, hr1, '6', t);
    const t2 = { x: E.W * 0.78, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.TEAM2.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'surprised', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, t2);
    const [hx2, hy2, hr2] = headPos(t2);
    chancePill(g, hx2, hy2, hr2, '7', t);
    const pose = breathe(posesAt(t, [[0, POSES.talk], [0.8, POSES.explain]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

// s083 — "He does not yell. He does not hit you. He just walks away." Gym: Jay walks off, Kian left behind.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
registerShot('s106', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jx = E.W * 0.55 + t * 150;
    drawFigure(g, { x: jx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.JAY.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const pose = breathe(posesAt(t, [[0, POSES.reach], [1.2, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

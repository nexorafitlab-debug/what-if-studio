// s061 — "But what would you say? I can see your patience running out?" Hallway close: Kian talks to camera.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
registerShot('s070', { draw(g, t, info) {
  const cam = { z: 1.5, x: 0, y: 140 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.talk], [1.2, POSES.shrug]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.45, 1.55), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'confused', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

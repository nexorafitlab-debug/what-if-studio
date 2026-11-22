// s033 — "You do not even know his name." Kian shrugs, walks off with his tray.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s037', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const boy = { x: E.W * 0.78, y: GY, s: V(1.2, 1.3), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, boy);
    const [hx, hy, hr] = headPos(boy);
    chancePill(g, hx, hy, hr, '7', t);
    const lx = E.W * 0.2 + t * 140;
    const kpose = t < 0.9 ? breathe(POSES.shrug, t) : walkPose(t * Math.PI * 2 * 0.9);
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

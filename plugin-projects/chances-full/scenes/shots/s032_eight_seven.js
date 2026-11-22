// s032 — "Eight. Seven." The boy's pill JUMPS 8 to 7. Kian watches it happen.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s036', { draw(g, t, info) {
  const cam = { z: 1.4, x: 100, y: 110 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const boy = { x: E.W * 0.6, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(t > 1.0 ? POSES.sad : POSES.stand, t, 1, 2), expr: t > 1.0 ? 'sad' : 'confused', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, boy);
    const [hx, hy, hr] = headPos(boy);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '8'], [0.85, '7']]), t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.9, POSES.pointUp]]), t);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

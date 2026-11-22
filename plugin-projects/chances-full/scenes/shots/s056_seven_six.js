// s056 — "Seven. Six." Schoolyard, dusk edge: Mia waits alone by the gate, pill JUMPS 7 to 6.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { schoolyard } from '../sets/schoolyard.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s063', { draw(g, t, info) {
  const cam = { z: 1.3, x: 80, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = schoolyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.56, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(t > 1.0 ? POSES.sad : POSES.stand, t, 1, 2), expr: t > 1.0 ? 'sad' : 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '7'], [0.98, '6']]), t);
    drawFigure(g, { x: E.W * 0.2, y: GY, s: V(1.2, 1.3), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

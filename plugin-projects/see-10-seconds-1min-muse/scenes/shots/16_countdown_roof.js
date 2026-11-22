// s016 — countdown "Ten. Nine. Eight." The phone tumbles down past the rooftop edge.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';
import { bigCount, drawPhone } from '../_helpers.js';
registerShot('s016', { draw(g, t, info) {
  const cam = { z: 1.15, x: 120, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = rooftop(g, t, info, {});
    const s = V(1.4, 1.5), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.GIRL.outfit, pose: breathe(POSES.stand, t, 1, 3), expr: 'neutral', look: [0.6, 0], rim: { color: M.rim, dir: [1, -1], w: 3 } });
    drawFigure(g, { x: E.W * 0.68, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.reach, t), expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // phone tumbling down the right third of the frame
    const fall = ease.in(prog(t, 0, 2.9));
    drawPhone(g, E.W * 0.72, GY - 560 + fall * 720, 0.4 + fall * 4.5, 1.5);
  });
  bigCount(g, t, [[0.0, '10'], [0.6, '9'], [1.52, '8']]);
} });

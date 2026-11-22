// s014 — "Five. Four." Jay turns away, pill 5 to 4 — now orange.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { schoolyard } from '../sets/schoolyard.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s015', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = schoolyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian at the edge, small, realising what he did
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.15, 1.25), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t, 1, 4), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Jay, right — clear of the school sign, so his pill never covers it
    const pose = breathe(posesAt(t, [[0, POSES.crossArms], [0.91, POSES.stand]]), t);
    const jay = { x: E.W * 0.62, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.JAY.outfit, pose, expr: 'sad', look: t > 0.91 ? [-0.8, 0] : [0, 0], rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '5'], [1.33, '4']]), t, { size: V(52, 60) });
  });
} });

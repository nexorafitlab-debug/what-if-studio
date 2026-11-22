// s011 — "Six. Five." Jay's pill JUMPS 6 to 5 as the numbers are spoken.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { schoolyard } from '../sets/schoolyard.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s012', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = schoolyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian at the edge, arms crossed, watching the number fall
    drawFigure(g, { x: E.W * 0.16, y: GY, s: V(1.15, 1.25), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.crossArms, t, 1, 4), expr: 'smirk', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Jay, right — clear of the school sign, so his pill never covers it
    const jay = { x: E.W * 0.62, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.stand, t), expr: t > 2.36 ? 'worried' : 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '6'], [1.11, '5']]), t, { size: V(52, 60) });
  });
} });

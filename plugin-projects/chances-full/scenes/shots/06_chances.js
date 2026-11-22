// s006 — "The number is your chances." Kian points up at a passer-by, green pill 7.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s006', { draw(g, t, info) {
  const cam = { z: 1.15, x: -100, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian, explaining, hand raised toward the number
    const s = V(1.35, 1.45);
    drawFigure(g, { x: E.W * 0.36, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.explain, t), expr: t > 0.8 ? 'smile' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the passer-by, standing still under his number
    const ps = { x: E.W * 0.72, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.PASSER2.outfit, pose: breathe(POSES.stand, t, 1, 5), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, ps);
    const [hx, hy, hr] = headPos(ps);
    chancePill(g, hx, hy, hr, '7', t);
  });
} });

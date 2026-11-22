// s003 — "A number. Above every head." Sister in the doorway, pill 9 above her head.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s003', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian, left, staring at her
    const s = V(1.4, 1.5);
    drawFigure(g, { x: E.W * 0.3, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sit, t), expr: 'surprised', look: [0.6, 0], talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Sister, just walked in — the first number Kian ever sees
    const sis = { x: E.W * 0.86, y: GY, s: V(1.15, 1.25), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(POSES.stand, t, 1, 3), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, sis);
    const [hx, hy, hr] = headPos(sis);
    if (t > 0.3) chancePill(g, hx, hy, hr, '9', t);
  });
} });

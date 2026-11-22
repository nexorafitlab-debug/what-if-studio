// s110 P2 — "You stare at the ceiling." Kian lies flat, staring up, sad.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s156', { draw(g, t, info) {
  const cam = { z: 1.2, x: 40, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const s = V(1.4, 1.5), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.42, y: GY + 93, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.lie, t), rot: Math.PI / 2, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

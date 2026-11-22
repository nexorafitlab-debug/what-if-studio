// s002 — "And you see it." Close on Kian, eyes wide — something is wrong.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s002', { draw(g, t, info) {
  const cam = { z: 1.6, x: 0, y: 160 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const s = V(1.5, 1.6), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(POSES.sit, t);
    drawFigure(g, { x: E.W * 0.5, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 0.6 ? 'shocked' : 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

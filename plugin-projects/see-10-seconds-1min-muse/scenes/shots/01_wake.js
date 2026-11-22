// s001 — "You wake up. The ceiling fan spins." Bedroom dawn, Kian sits up in bed.
import { E, V, registerShot, mood, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
registerShot('s001', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 2.2 });
    const s = V(1.5, 1.6), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.lie], [0.5, POSES.sit], [1.2, POSES.sitBack]]), t);
    drawFigure(g, { x: E.W * 0.42, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 1.4 ? 'surprised' : 'sleepy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

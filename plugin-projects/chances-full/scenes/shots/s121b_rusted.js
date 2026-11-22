// s121 P2 — "It was rusted." Kian crouches by the bike, working the chain.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s176', { draw(g, t, info) {
  const cam = { z: 1.2, x: 80, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.76, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.crouch, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

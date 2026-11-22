// s093 P2 — "He is used to being done with." Close on Kian, hands on his head.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
registerShot('s123', { draw(g, t, info) {
  const cam = { z: 1.6, x: 20, y: 160 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.45, 1.55), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

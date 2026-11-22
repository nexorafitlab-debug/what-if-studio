// s092 P2 — "He just sits down. He looks out the window." The old man sits, gazing out, quiet.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
registerShot('s121', { draw(g, t, info) {
  const cam = { z: 1.3, x: -40, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.56, y: GY + 30, s: V(1.35, 1.45), facing: -1, outfit: CAST.OLD.outfit, pose: breathe(POSES.sit, t), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    drawFigure(g, { x: E.W * 0.22, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

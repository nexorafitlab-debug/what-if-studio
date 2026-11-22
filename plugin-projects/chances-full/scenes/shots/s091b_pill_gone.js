// s091 P2 — "The pill is gone." The old man sits with no pill; Kian, hands on his head.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
registerShot('s119', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const old = { x: E.W * 0.6, y: GY, s: V(1.45, 1.55), facing: -1, outfit: CAST.OLD.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, old);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'shocked', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

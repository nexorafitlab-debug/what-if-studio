// s005 — "Silence. Your heart slows." [BEDROOM - DAWN] · act — FIXED: was the
// stock stand→talk→point→stand at 0.70W. Now: hands to chest, head bows, body
// settles (holdFront→sad→relaxed) at 0.55W, fan slowing, one quiet heartbeat.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s005', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 1.0 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'holdFront'], [0.9, 'sad'], [1.9, 'relaxed']]), t);
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });

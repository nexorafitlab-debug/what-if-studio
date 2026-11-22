// s008 — "You knew it would fall. You knew before it moved." [BEDROOM - DAWN] · act — FIXED:
// was the stock act template at 0.70W. Now: points up at the fan, points
// forward, folds his arms — knowing, not telling (pointUp→point→crossArms),
// moved to the left of the room (0.30W, by the window).
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s008', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 2.2 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'pointUp'], [1.2, 'point'], [2.4, 'crossArms']]), t);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smirk', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });

// s016 — "future. Never off." [SCHOOL HALLWAY] · act — FIXED: was the stock act
// template at 0.42W. Now: a shrug that settles into crossed arms
// (shrug→ready→stand), closer in (scale 1.6) at 0.30W.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s016', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'shrug'], [0.7, 'ready'], [1.4, 'stand']]), t);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.6, 1.7), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
} });

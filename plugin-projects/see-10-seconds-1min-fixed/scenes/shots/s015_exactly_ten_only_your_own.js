// s015 — "Exactly ten. Only your own" [SCHOOL HALLWAY] · act — FIXED: was the
// stock act template at 0.42W. Now: counts it off on his fingers
// (pointUp→explain→holdFront) at 0.68W, with the number tile '10' holding on
// the left of the frame (0.30W, hold 2.0s) — the number the line is about.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { tileCount } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s015', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'pointUp'], [0.8, 'explain'], [1.6, 'holdFront']]), t);
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', rim });
  });
  tileCount(g, t, [[0.2, '10']], { x: E.W * 0.30, y: E.H * 0.42, size: V(220, 240), hold: 2.0 });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
} });

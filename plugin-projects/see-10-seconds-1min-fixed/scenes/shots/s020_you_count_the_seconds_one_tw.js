// s020 — "You count the seconds. One. Two. Ten." [SCHOOL HALLWAY] · act — FIXED:
// was the stock act template at 0.42W with no countdown. Now: counts on his
// fingers (pointUp→holdFront→think) at 0.30W, scale 1.5, with the number tile.
// Word times (words.json): "One." is spoken at shot-local 1.81s; "Two." and
// "Ten." fall after the 60s cut, so only the '1' tile appears in this minute.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { tileCount } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s020', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'pointUp'], [1.3, 'holdFront'], [2.5, 'think']]), t);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', rim });
  });
  tileCount(g, t, [[1.81, '1']], { x: E.W * 0.72, y: E.H * 0.42, size: V(300, 320), hold: 0.66 });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
} });

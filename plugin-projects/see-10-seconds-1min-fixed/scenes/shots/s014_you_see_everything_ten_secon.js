// s014 — "You see everything ten seconds before it happens." [SCHOOL HALLWAY] · look — FIXED:
// was point→think→stand at scale 1.9 but with no breathe. Now: same close-up
// (scale 1.9, centre) WITH breathe, plus his own future self — a faint,
// breathing Kian (alpha 0.30) pointing ahead at the end of the hall — the
// thing he sees ten seconds early.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s014', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.point, t, 1, 3), expr: 'neutral', alpha: 0.30, rim });
    const pose = breathe(posesAt(t, [[0, 'point'], [1.1, 'think'], [2.2, 'stand']]), t);
    drawFigure(g, { x: E.W * 0.50, y: GY, s: V(1.9, 2.0), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'worried', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
} });

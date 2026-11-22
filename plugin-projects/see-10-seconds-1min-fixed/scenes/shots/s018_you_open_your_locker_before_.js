// s018 — "You open your locker before the bell rings." [SCHOOL HALLWAY] · act — FIXED:
// was the stock act template at 0.42W (nowhere near a locker). Now: Kian
// stands AT the left lockers (0.16W), reaches for one, pulls books out
// (reach→holdFront→point, books appear in his hand at 0.9s).
import { E, V, registerShot, layer, rr } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { handPos } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s018', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'reach'], [0.8, 'holdFront'], [1.5, 'point']]), t);
    const kian = { x: E.W * 0.16, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', rim };
    drawFigure(g, kian);
    if (t > 0.9) {
      const [hx, hy] = handPos(kian);
      rr(g, hx - 30, hy - 14, 60, 12, 3); g.fillStyle = '#e07856'; g.fill();
      rr(g, hx - 26, hy - 2, 52, 12, 3); g.fillStyle = '#9fd8ff'; g.fill();
    }
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
} });

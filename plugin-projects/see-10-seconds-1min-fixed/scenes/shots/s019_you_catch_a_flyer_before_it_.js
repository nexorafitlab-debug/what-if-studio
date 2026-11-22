// s019 — "You catch a flyer before it hits the floor. No one saw." [SCHOOL HALLWAY] · catch — FIXED:
// was: a yellow ball falling at x=0.54W while Kian stood at 0.42W with his
// arms down — nothing met. Now: a real paper flyer falls from above TO his
// hand (handPos-anchored, like the s004 blade), he reaches for it
// (stand→reach→holdFront→stand) and holds it.
import { E, V, registerShot, layer, prog, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { handPos, drawFlyer } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s019', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'stand'], [0.7, 'reach'], [1.8, 'holdFront'], [2.8, 'stand']]), t);
    const kian = { x: E.W * 0.42, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', rim };
    drawFigure(g, kian);
    const [hx, hy] = handPos(kian);
    const fall = prog(t, 0.3, 1.5);
    if (fall < 1) {
      const fx = (E.W * 0.42 + 260) + (hx - (E.W * 0.42 + 260)) * ease.in(fall);
      const fy = (GY - 420) + (hy - (GY - 420)) * ease.in(fall);
      drawFlyer(g, fx, fy, 0.3 + fall * 0.8);
    } else {
      drawFlyer(g, hx + 8, hy - 4, 0.15);
    }
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
} });

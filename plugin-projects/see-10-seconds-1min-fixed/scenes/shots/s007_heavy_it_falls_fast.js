// s007 — "heavy. It falls fast." [BEDROOM - DAWN] · act — FIXED: was the stock
// act template. Now: the blade slips from his grip and drops to the floor —
// whole body crouches under the weight (holdFront→crouch→ready) and the blade
// falls from his hand (1110,636) to the floor (1140,850), spinning as it goes.
import { E, V, registerShot, layer, prog, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { fanBlade } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s007', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 2.2 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'holdFront'], [0.6, 'crouch'], [1.5, 'ready']]), t);
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', rim });
    const drop = prog(t, 0.6, 1.1);
    if (drop < 1) {
      const by = 636 + ease.in(drop) * (850 - 636);
      fanBlade(g, 1110 + drop * 30, by, 0.25 + drop * 2.5, 200, 26, '#3a2a36');
    } else {
      fanBlade(g, 1140, 850, 2.75, 200, 26, '#3a2a36');
    }
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });

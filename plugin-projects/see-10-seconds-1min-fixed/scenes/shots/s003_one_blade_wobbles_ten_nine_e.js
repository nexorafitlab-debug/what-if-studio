// s003 — "One blade wobbles. Ten Nine Eight." [BEDROOM - DAWN] · countdown — FIXED:
// was: stand→reach→holdFront→stand at 0.70W, tile dead-centre. Now: Kian sits
// on the bed edge, looks up (sitBack→pointUp→reach), fan wobbles hard; the
// number tile moves to the right (x=0.76W, size 260) so it clears the poster
// (ends 1302) and the wall clock (starts 1620) and never covers Kian's head.
import { E, V, registerShot, layer, prog, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { tileCount, fanBlade } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s003', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M, fan } = bedroomDawn(g, t, info, { fanSpeed: 3.4, wobble: 16 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'sitBack'], [0.9, 'pointUp'], [2.2, 'reach']]), t);
    drawFigure(g, { x: E.W * 0.42, y: GY + 40, s: V(1.5, 1.6), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'surprised', rim });
    // one blade detaches near the end of the shot and starts falling toward Kian
    const fall = prog(t, 2.9, 3.4);
    if (fall > 0) fanBlade(g, fan.x + 60, fan.y + ease.in(fall) * 300, 0.5 + fall * 2.2, 200, 26, '#3a2a36');
  });
  tileCount(g, t, [[1.39, '10'], [2.21, '9'], [3.03, '8']], { x: E.W * 0.76, y: E.H * 0.42, size: V(260, 280) });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });

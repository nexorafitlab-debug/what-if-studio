// s009 — "You sit back. You wait for the next wobble." [BEDROOM - DAWN] · sit — FIXED:
// was stand→sit→sitBack at 0.40W with no breathe. Now: sits, leans back, sits
// forward again watching the fan (sit→sitBack→sit) with breathe throughout;
// the fan slows and gives a small wobble.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s009', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 1.2, wobble: 4 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'sit'], [1.0, 'sitBack'], [2.2, 'sit']]), t);
    drawFigure(g, { x: E.W * 0.42, y: GY + 40, s: V(1.5, 1.6), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });

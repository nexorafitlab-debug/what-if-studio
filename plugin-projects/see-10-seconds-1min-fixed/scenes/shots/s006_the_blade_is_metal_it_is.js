// s006 — "The blade is metal. It is" [BEDROOM - DAWN] · act — FIXED: was the
// stock act template. Now: a closer look at the blade in his hands
// (explain→think, scale 1.6) — the blade is drawn at his front hand the whole
// shot, so it follows the hand as he turns it over.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { fanBlade, handPos } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s006', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 1.2 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'explain'], [1.2, 'think']]), t);
    const kian = { x: E.W * 0.55, y: GY, s: V(1.6, 1.7), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', rim };
    drawFigure(g, kian);
    const [hx, hy] = handPos(kian);
    fanBlade(g, hx + 10, hy - 6, 0.25, 200, 26, '#3a2a36');
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });

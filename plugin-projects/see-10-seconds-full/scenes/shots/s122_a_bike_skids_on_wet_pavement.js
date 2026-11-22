// s122 — "A bike skids on wet pavement." [STREET - ALLEY BEHIND SCHOOL] · act
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, headPos } from '/engine/rig2d.js';
import { alley } from '../sets/alley.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { beatBanner, hudScore } from '/engine/story.js';
registerShot('s122', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = alley(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = posesAt(t, [[0, 'stand'], [D * 0.3, 'talk'], [D * 0.6, 'point'], [D * 0.85, 'stand']]);
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: 'neutral', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 247.16, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 250 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }, { label: 'MISSES', value: 1 }] });
  beatBanner(g, t, { n: 17, title: 'THE BIKE', dur: D, y: E.H * 0.12 });
} });

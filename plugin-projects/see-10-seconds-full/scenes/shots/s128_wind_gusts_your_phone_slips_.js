// s128 — "Wind gusts. Your phone slips. Ten Nine Eight." [ROOFTOP - SUNSET] · countdown
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, headPos } from '/engine/rig2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';
import { tileCount } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { beatBanner, hudScore } from '/engine/story.js';
registerShot('s128', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = rooftop(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    tileCount(g, t, [[2.58, '10'], [3.02, '9'], [3.4, '8']], { x: E.W * 0.5, y: E.H * 0.40, size: V(300, 320) });
    const pose = posesAt(t, [[0, 'stand'], [D * 0.35, 'reach'], [D * 0.65, 'holdFront'], [D * 0.9, 'stand']]);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: 'determined', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 368.52, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 250 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }, { label: 'MISSES', value: 1 }] });
  beatBanner(g, t, { n: 18, title: 'THE MIRROR', dur: D, y: E.H * 0.12 });
} });

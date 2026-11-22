// s096 — "Mr. Harlow hasn't missed a cheater in twenty years." [EXAM HALL - ROW C] · imagine
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, headPos } from '/engine/rig2d.js';
import { examhall } from '../sets/examhall.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { beatBanner, hudScore, imagineGlow, imagineLabel, imagineVeil } from '/engine/story.js';
registerShot('s096', { draw(g, t, info) {
  const D = info.dur;
  imagineVeil(g, { a: 0.2 });
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = examhall(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = posesAt(t, [[0, 'sit'], [D * 0.4, 'sitBack'], [D * 0.8, 'sit']]);
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: 'smile', rim });
    const [hx, hy, hr] = headPos({ x: E.W * 0.42, y: GY, s: V(1.3, 1.4), pose });
    imagineGlow(g, hx, hy, hr, t);
    const pose2 = posesAt(t, [[0, 'sit'], [D * 0.5, 'sitBack']]);
    drawFigure(g, { x: E.W * 0.76, y: GY, s: V(1.15, 1.25), facing: -1, outfit: CAST.HARLOW.outfit, pose: pose2, expr: 'neutral', rim });
  });
  imagineLabel(g, t, { x: 70, y: 250 });
  dualCounter(g, info.globalT, { chapterStart: 247.16, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 340 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }] });
  beatBanner(g, t, { n: 13, title: 'THE PROCTOR', dur: D, y: E.H * 0.12 });
} });

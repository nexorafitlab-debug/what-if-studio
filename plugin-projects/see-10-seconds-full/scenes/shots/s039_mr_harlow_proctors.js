// s039 — "Mr. Harlow proctors." [EXAM HALL - ROW C] · act
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, exprAt, headPos } from '/engine/rig2d.js';
import { examhall } from '../sets/examhall.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { beatBanner, hudScore, nameTag } from '/engine/story.js';
registerShot('s039', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = examhall(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = posesAt(t, [[0, 'stand'], [D * 0.3, 'talk'], [D * 0.6, 'point'], [D * 0.85, 'stand']]);
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: exprAt(t, [[0, 'neutral'], [D * 0.3, 'thinking'], [D * 0.6, 'determined']]), rim });
    const pose2 = posesAt(t, [[0, 'stand'], [D * 0.4, 'talk'], [D * 0.8, 'stand']]);
    drawFigure(g, { x: E.W * 0.76, y: GY, s: V(1.15, 1.25), facing: -1, outfit: CAST.HARLOW.outfit, pose: pose2, expr: exprAt(t, [[0, 'neutral'], [D * 0.5, 'smile']]), rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 90.32, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 250 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 3 }] });
  beatBanner(g, t, { n: 5, title: 'THE PENCIL', dur: D, y: E.H * 0.12 });
  nameTag(g, { name: 'MR. HARLOW', role: 'PROCTOR', fact: 'NEVER MISSES A CHEATER', x: E.W * 0.42, y: E.H * 0.88 });
} });

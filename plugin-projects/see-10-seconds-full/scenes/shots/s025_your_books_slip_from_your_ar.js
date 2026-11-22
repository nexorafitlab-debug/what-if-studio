// s025 — "Your books slip from your arm. Three Two One." [LOCKER BAY - B WING] · countdown
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, exprAt, headPos } from '/engine/rig2d.js';
import { locker_bay } from '../sets/locker_bay.js';
import { CAST } from '../cast.js';
import { tileCount } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { beatBanner, hudScore } from '/engine/story.js';
registerShot('s025', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = locker_bay(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    tileCount(g, t, [[2.2, '3'], [2.56, '2'], [2.86, '1']], { x: E.W * 0.5, y: E.H * 0.40, size: V(300, 320) });
    const pose = posesAt(t, [[0, 'stand'], [D * 0.35, 'reach'], [D * 0.65, 'holdFront'], [D * 0.9, 'stand']]);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: exprAt(t, [[0, 'neutral'], [D * 0.3, 'surprised'], [D * 0.65, 'determined']]), rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 250 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
  beatBanner(g, t, { n: 3, title: 'THE LOCKER', dur: D, y: E.H * 0.12 });
} });

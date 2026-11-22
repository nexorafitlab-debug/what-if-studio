// s076 — "Harlow stares from the front row." [CLASSROOM 12 - MATH] · look
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, exprAt, headPos } from '/engine/rig2d.js';
import { classroom } from '../sets/classroom.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s076', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = classroom(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = posesAt(t, [[0, 'point'], [D * 0.35, 'think'], [D * 0.7, 'stand']]);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.9, 2.0), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: exprAt(t, [[0, 'determined'], [D * 0.35, 'thinking'], [D * 0.7, 'worried']]), rim });
    const pose2 = posesAt(t, [[0, 'stand'], [D * 0.5, 'talk']]);
    drawFigure(g, { x: E.W * 0.76, y: GY, s: V(1.0, 1.1), facing: -1, outfit: CAST.HARLOW.outfit, pose: pose2, expr: exprAt(t, [[0, 'neutral'], [D * 0.5, 'surprised']]), rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 90.32, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }] });
} });

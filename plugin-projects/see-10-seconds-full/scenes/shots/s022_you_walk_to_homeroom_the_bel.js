// s022 — "You walk to homeroom. The bell has not" [SCHOOL HALLWAY - 3RD FLOOR] · walk
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, exprAt, headPos } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { ghostTrail } from '/engine/fx2d.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s022', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const w = walkLocked(t, { x0: E.W * 0.10, stride: 52, stepDur: 0.5, facing: 1 });
    const wExpr = exprAt(t, [[0, 'neutral'], [D * 0.55, 'smile']]);
    ghostTrail(g, (gg, ox, oy) => drawFigure(gg, { x: w.x + ox, y: GY + oy, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: w.pose, expr: wExpr, rim }), { dx: -70, count: 2 });
    drawFigure(g, { x: w.x, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: w.pose, expr: wExpr, rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
} });

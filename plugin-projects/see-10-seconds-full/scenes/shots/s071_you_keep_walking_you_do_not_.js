// s071 — "You keep walking. You do not run." [STAIRWELL - C WING] · walk
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, headPos } from '/engine/rig2d.js';
import { stairwell } from '../sets/stairwell.js';
import { CAST } from '../cast.js';
import { ghostTrail } from '/engine/fx2d.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s071', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = stairwell(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const w = walkLocked(t, { x0: E.W * 0.10, stride: 52, stepDur: 0.5, facing: 1 });
    const wExpr = 'neutral';
    ghostTrail(g, (gg, ox, oy) => drawFigure(gg, { x: w.x + ox, y: GY + oy, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: w.pose, expr: wExpr, rim }), { dx: -70, count: 2 });
    drawFigure(g, { x: w.x, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: w.pose, expr: wExpr, rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 90.32, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }] });
} });

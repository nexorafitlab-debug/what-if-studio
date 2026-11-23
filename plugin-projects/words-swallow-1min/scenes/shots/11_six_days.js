import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolHallway } from '../sets/school_hallway.js';
registerShot('s011', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolHallway(g, t, info, {});
    // "Six days she has carried it." — Eli walks the hallway; students pass
    const w = walkLocked(t, { x0: E.W * 0.06, stride: 52, stepDur: 0.5, facing: 1 });
    drawFigure(g, { x: w.x, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: w.pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.2, 0.2], rim });
    const p1 = walkLocked(t, { x0: E.W * 0.88, stride: 48, stepDur: 0.52, facing: -1 });
    drawFigure(g, { x: p1.x, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.STU2.outfit, pose: p1.pose, expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12 });
    const p2 = walkLocked(t, { x0: E.W * 0.98, stride: 46, stepDur: 0.5, facing: -1 });
    drawFigure(g, { x: p2.x, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.STU5.outfit, pose: p2.pose, expr: 'smile', talk: 0, blink: (t % 3.7) < 0.12 });
  });
} });

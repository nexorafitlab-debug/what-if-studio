import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolHallway } from '../sets/school_hallway.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s017', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: 0, y: 0, s: V(1.5, 1.6), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolHallway(g, t, info, {});
    kaiFig.y = GY;
    // "Right where everyone can see it." — Kai walks the hallway, students stare
    const w = walkLocked(t, { x0: E.W * 0.10, stride: 52, stepDur: 0.5, facing: 1 });
    const stopX = E.W * 0.10 + (52 / 0.5) * 1.2;
    const walking = t < 1.2;
    kaiFig.x = walking ? w.x : stopX;
    kaiFig.pose = walking ? w.pose : breathe(posesAt(t, [[1.2, POSES.stand]]), t);
    drawFigure(g, { x: E.W * 0.78, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.STU1.outfit, pose: breathe(POSES.stand, t), expr: 'surprised', talk: 0, blink: (t % 3.7) < 0.12, look: [-0.5, 0] });
    drawFigure(g, { x: E.W * 0.90, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.STU2.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.point]]), t), expr: 'surprised', talk: 0, blink: (t % 3.7) < 0.12, look: [-0.5, 0] });
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'nervous'], [1.2, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.3, 0], rim });
  });
  const [cx, cy] = featherAnchor(kaiFig, 'collar');
  drawFeather(g, cx, cy, 70, { color: 'white', rot: -1.0 + Math.sin(t * 1.2) * 0.05 });
} });

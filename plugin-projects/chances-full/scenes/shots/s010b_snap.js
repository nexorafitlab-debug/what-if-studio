// s010 P2 — "You snap at Jay, your best friend." Kian arrives, points and snaps;
// Jay's pill JUMPS 7 to 6 on the snap (0.45s in).
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { schoolyard } from '../sets/schoolyard.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s011', { draw(g, t, info) {
  const cam = { z: 1.1, x: -40, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = schoolyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Jay: smiling until the snap, then hurt
    const jay = { x: E.W * 0.64, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(t < 0.45 ? POSES.stand : POSES.sad, t, 1, 2), expr: t > 0.45 ? 'surprised' : 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '7'], [0.45, '6']]), t);
    // Kian finishes the walk, then the accusing point
    const lx = E.W * 0.14 + Math.min(t + 1.42, 1.87) * 150;
    const kpose = t < 0.45 ? walkPose((t + 1.42) * Math.PI * 2 * 0.9) : breathe(POSES.point, t);
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: t > 0.45 ? 'angry' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

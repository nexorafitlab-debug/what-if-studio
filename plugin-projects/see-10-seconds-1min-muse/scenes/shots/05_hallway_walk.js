// s005 — "Kian. That's your name. Seventeen." Hallway wide, Kian walks in.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { goldLine } from '../_helpers.js';
registerShot('s005', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // background students standing by the lockers
    const st1 = { x: E.W * 0.78, y: GY, s: V(1.1, 1.2), facing: -1, outfit: CAST.STUDENT1.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim };
    drawFigure(g, st1);
    const st2 = { x: E.W * 0.88, y: GY, s: V(1.1, 1.2), facing: -1, outfit: CAST.STUDENT2.outfit, pose: breathe(POSES.stand, t, 1, 4), expr: 'neutral', rim };
    drawFigure(g, st2);
    // Kian walks in (left to right)
    const lx = E.W * 0.16 + t * 165;
    drawFigure(g, { x: lx, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: t > 2 ? 'smile' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  if (t > 0.3) goldLine(g, 'KIAN  ·  17', E.H * 0.52, V(72, 80));
} });

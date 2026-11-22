// s084 P2 — "At school, he looks through you." Jay walks past without seeing Kian.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
registerShot('s109', { draw(g, t, info) {
  const cam = { z: 1.1, x: 40, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jx = E.W * 0.82 - (t + 1.22) * 130;
    drawFigure(g, { x: jx, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: walkPose((t + 1.22) * Math.PI * 2 * 0.9 + 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.reach, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'HE LOOKS THROUGH YOU.', E.W / 2, E.H * 0.90, { size: V(44, 50), color: '#9fd8ff', glow: 22, glowColor: 'rgba(159,216,255,0.5)', spacing: 2, alpha: a });
} });

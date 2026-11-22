// s084 — "He does not answer your texts. At school, he looks through you." Hallway: Jay walks past, Kian reaches.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
registerShot('s108', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jx = E.W * 0.82 - t * 130;
    drawFigure(g, { x: jx, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: walkPose(t * Math.PI * 2 * 0.9 + 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const pose = breathe(posesAt(t, [[0, POSES.phone], [1.2, POSES.reach]]), t);
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'NO REPLY.', E.W / 2, E.H * 0.90, { size: V(48, 56), color: '#9fd8ff', glow: 22, glowColor: 'rgba(159,216,255,0.5)', spacing: 2, alpha: a });
} });

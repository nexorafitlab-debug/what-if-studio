// s044 P2 — "Not one." The two passers-by walk on, pills 8 and 7 still. Kian watches.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s049', { draw(g, t, info) {
  const cam = { z: 1.15, x: 30, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    for (const [cx, cast, val, dir] of [[0.24, CAST.PASSER1, '8', 1], [0.74, CAST.PASSER2, '7', -1]]) {
      const px = E.W * cx + dir * t * 60;
      const p = { x: px, y: GY, s: V(1.2, 1.3), facing: dir, outfit: cast.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
      drawFigure(g, p);
      const [hx, hy, hr] = headPos(p);
      chancePill(g, hx, hy, hr, val, t);
    }
    const pose = breathe(POSES.think, t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'NOT ONE.', E.W / 2, E.H * 0.90, { size: V(52, 58), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

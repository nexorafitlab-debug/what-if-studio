// s136 P2 — "No one says sorry. No one has to." Kian and Jay pass the ball back and forth, smiling.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { backyard } from '../sets/backyard.js';
import { CAST } from '../cast.js';
registerShot('s205', { draw(g, t, info) {
  const cam = { z: 1.1, x: -30, y: 30 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = backyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jx = E.W * 0.58 + Math.sin((t + 1.56) * 1.2) * 40;
    drawFigure(g, { x: jx, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.ready, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const lx = E.W * 0.24 + Math.sin((t + 1.56) * 1.2 + 1.5) * 40;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.8, 1.1));
  text(g, 'NO ONE HAS TO.', E.W / 2, E.H * 0.90, { size: V(48, 56), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

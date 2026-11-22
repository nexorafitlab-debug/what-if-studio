// s131 P2 — "Just a ball. Rolling to your feet." Kian holds the ball; no number anywhere.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { backyard } from '../sets/backyard.js';
import { CAST } from '../cast.js';
registerShot('s195', { draw(g, t, info) {
  const cam = { z: 1.3, x: 60, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = backyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.62, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.holdFront, t), expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'JUST A BALL.', E.W / 2, E.H * 0.90, { size: V(52, 58), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

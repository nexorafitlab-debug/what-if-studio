// s018 — "One chance left." Close on Jay, red pulsing 1.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s020', { draw(g, t, info) {
  const cam = { z: 1.7, x: 0, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.5, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.sad, t), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '1', t, { size: V(52, 60) });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'ONE CHANCE LEFT.', E.W / 2, E.H * 0.12, { size: V(56, 64), color: '#ff5a4a', glow: 26, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a });
} });

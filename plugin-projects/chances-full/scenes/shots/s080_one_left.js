// s080 — "His number is one. One chance left." Gym close: Jay, red pulsing 1, heartbeat.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s101', { draw(g, t, info) {
  const cam = { z: 1.5, x: 80, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.56, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '1', t);
    drawFigure(g, { x: E.W * 0.34, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'shocked', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.7, 1.0));
  text(g, 'ONE.', E.W / 2, E.H * 0.90, { size: V(64, 72), color: '#ff5a4a', glow: 30, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a });
} });

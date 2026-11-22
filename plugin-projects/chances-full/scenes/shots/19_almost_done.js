// s019 — "He is almost done with you." Kian sad; Jay has his back to him, red 1.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s021', { draw(g, t, info) {
  // cam y 140 pushes the gym scoreboard fully out of frame (at y 60 it was
  // half-clipped across the top edge)
  const cam = { z: 1.1, x: -60, y: 140 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian, head bowed
    drawFigure(g, { x: E.W * 0.36, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Jay, back half-turned, the red 1 still over him
    const jay = { x: E.W * 0.76, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'sad', look: [-0.8, 0], rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '1', t);
  });
  const a = clamp(prog(t, 0.5, 0.8));
  text(g, 'HE IS ALMOST DONE WITH YOU.', E.W / 2, E.H * 0.18, { size: V(44, 50), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

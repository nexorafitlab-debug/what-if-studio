// s061 P2 — "I can see your patience running out?" Kian, closer, asking the camera.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
registerShot('s071', { draw(g, t, info) {
  const cam = { z: 1.6, x: 0, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.talk], [0.9, POSES.shrug]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.45, 1.55), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'confused', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'YOUR PATIENCE IS RUNNING OUT.', E.W / 2, E.H * 0.80, { size: V(56, 64), color: '#ffe9a8', glow: 34, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

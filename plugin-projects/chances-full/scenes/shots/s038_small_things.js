// s038 — "Every small thing counts. Every single one." Hallway close: Kian stops, turns to camera.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
registerShot('s042', { draw(g, t, info) {
  const cam = { z: 1.5, x: 0, y: 140 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.talk], [1.0, POSES.point]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.45, 1.55), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.6, 0.9));
  text(g, 'EVERY SMALL THING COUNTS.', E.W / 2, E.H * 0.90, { size: V(44, 50), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

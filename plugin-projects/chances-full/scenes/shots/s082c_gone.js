// s082 P3 — "Gone. Like he is gone." The empty space above Jay's head; Kian lowers his hand.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
registerShot('s105', { draw(g, t, info) {
  const cam = { z: 1.5, x: 80, y: 140 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.58, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const pose = breathe(posesAt(t, [[0, POSES.reach], [0.9, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'GONE.', E.W / 2, E.H * 0.90, { size: V(64, 72), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

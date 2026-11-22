// s081 — "You watch it happen. One. Zero." Gym: Jay's pill JUMPS 1 to nothing — it vanishes.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s102', { draw(g, t, info) {
  const cam = { z: 1.4, x: 60, y: 110 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.58, y: GY, s: V(1.45, 1.55), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(t > 1.2 ? POSES.sad : POSES.stand, t, 1, 2), expr: t > 1.2 ? 'sad' : 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    const v = jumpValue(t, [[0, '1'], [2.2, '']]);
    if (v) chancePill(g, hx, hy, hr, v, t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.handsOnHead]]), t);
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'shocked', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 1.4, 1.7));
  text(g, 'ZERO.', E.W / 2, E.H * 0.90, { size: V(64, 72), color: '#ff5a4a', glow: 30, glowColor: 'rgba(255,90,74,0.55)', spacing: 2, alpha: a });
} });

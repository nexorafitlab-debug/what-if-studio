// s116 — "Wednesday. Thursday. Friday." Jay's house: Kian at the door on three days, text swaps with each day.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s165', { draw(g, t, info) {
  const cam = { z: 1.1, x: -40, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.reach], [1.0, POSES.sad], [2.0, POSES.stand]]), t);
    drawFigure(g, { x: E.W * 0.48, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const day = t < 1.0 ? 'WEDNESDAY.' : t < 2.0 ? 'THURSDAY.' : 'FRIDAY.';
  const a = clamp(prog(t % 1.0, 0.05, 0.25));
  text(g, day, E.W / 2, E.H * 0.16, { size: V(56, 64), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

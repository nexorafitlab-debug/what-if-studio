// s118 — "Day seven: rain. You stand there anyway. Soaked." Jay's house: Kian stands in the rain, head bowed.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s168', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.48, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'DAY SEVEN: RAIN.', E.W / 2, E.H * 0.16, { size: V(52, 58), color: '#9fd8ff', glow: 26, glowColor: 'rgba(159,216,255,0.5)', spacing: 2, alpha: a });
} });

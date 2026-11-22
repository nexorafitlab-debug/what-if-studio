// s093 — "He is used to it. That is the worst part. He is used to being done with." Bus stop close on Kian.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
registerShot('s122', { draw(g, t, info) {
  const cam = { z: 1.3, x: -40, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.sad], [1.4, POSES.handsOnHead]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.45, 1.55), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.6, 0.9));
  text(g, 'THE WORST PART.', E.W / 2, E.H * 0.16, { size: V(52, 58), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

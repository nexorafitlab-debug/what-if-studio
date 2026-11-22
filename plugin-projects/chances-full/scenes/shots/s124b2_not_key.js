// s124 P2 — "It is not a key. It is just showing up." Kian shrugs, then stands, steady.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s181', { draw(g, t, info) {
  const cam = { z: 1.3, x: 30, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // he shrugs, steadies, steps toward the door and knocks
    const lx = E.W * 0.5 + prog(t, 1.2, 2.5) * 60;
    const pose = breathe(posesAt(t, [[0, POSES.shrug], [0.5, POSES.stand], [1.6, POSES.pointUp], [2.2, POSES.stand]]), t);
    drawFigure(g, { x: lx, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.5, 0.8));
  text(g, 'IT IS JUST SHOWING UP.', E.W / 2, E.H * 0.90, { size: V(44, 50), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

// s124b P2 — "You do not say sorry. You just show up." Kian walks up the steps, steady.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s183', { draw(g, t, info) {
  const cam = { z: 1.1, x: -30, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const lx = E.W * 0.3 + t * 120;
    drawFigure(g, { x: lx, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.5, 0.8));
  text(g, 'YOU JUST SHOW UP.', E.W / 2, E.H * 0.90, { size: V(48, 56), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

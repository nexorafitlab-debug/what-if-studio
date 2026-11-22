// s045 P2 — "Good just waits." Kian on the park bench, looking up at the sky.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { park } from '../sets/park.js';
import { CAST } from '../cast.js';
registerShot('s051', { draw(g, t, info) {
  const cam = { z: 1.3, x: 20, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = park(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.think], [0.6, POSES.sit]]), t);
    drawFigure(g, { x: E.W * 0.46, y: GY + 40, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'GOOD JUST WAITS.', E.W / 2, E.H * 0.90, { size: V(48, 54), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

// s045 — "Good does not undo bad. Good just waits." Park bench: Kian sits, thinking it over.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { park } from '../sets/park.js';
import { CAST } from '../cast.js';
registerShot('s050', { draw(g, t, info) {
  const cam = { z: 1.2, x: -40, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = park(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.sit], [1.2, POSES.think]]), t);
    drawFigure(g, { x: E.W * 0.42, y: GY + 40, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.7, 1.0));
  text(g, 'GOOD DOES NOT UNDO BAD.', E.W / 2, E.H * 0.90, { size: V(44, 50), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

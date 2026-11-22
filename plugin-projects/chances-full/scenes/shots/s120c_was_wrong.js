// s120 P3 — "I was wrong. Forgive me later." Kian stands; the note's words appear, one line at a time.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s174', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.48, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  const note = t < 1.1 ? 'I WAS WRONG.' : 'FORGIVE ME LATER.';
  text(g, note, E.W / 2, E.H * 0.90, { size: V(48, 56), color: '#f2ead8', glow: 22, glowColor: 'rgba(242,234,216,0.5)', spacing: 2, alpha: a });
} });

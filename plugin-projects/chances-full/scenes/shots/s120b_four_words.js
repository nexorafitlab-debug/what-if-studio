// s120 P2 — "Four words." Kian crouches at the door, the note in his hand.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { jaysHouse } from '../sets/jays_house.js';
import { CAST } from '../cast.js';
registerShot('s173', { draw(g, t, info) {
  const cam = { z: 1.3, x: 40, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = jaysHouse(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.48, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.crouch, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'FOUR WORDS.', E.W / 2, E.H * 0.90, { size: V(52, 58), color: '#f2ead8', glow: 22, glowColor: 'rgba(242,234,216,0.5)', spacing: 2, alpha: a });
} });

// s007 — "Only your own future. Never off." Rule card in the hallway.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount, text, alpha } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
registerShot('s007', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.explain, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a1 = clamp(prog(t, 0.4, 0.8)), a2 = clamp(prog(t, 1.7, 2.1));
  text(g, 'ONLY YOUR OWN FUTURE.', E.W / 2, E.H * 0.24, { size: V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'NEVER OFF.', E.W / 2, E.H * 0.38, { size: V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a2 });
} });

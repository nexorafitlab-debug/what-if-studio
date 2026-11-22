// s111 P2 — "They will not." Kian sits up, sad, looking at nothing.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s158', { draw(g, t, info) {
  const cam = { z: 1.4, x: 0, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: GY + 30, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'THEY WILL NOT.', E.W / 2, E.H * 0.16, { size: V(52, 58), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

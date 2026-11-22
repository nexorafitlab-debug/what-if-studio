// s025 — "Because chances do not grow back." Kian looks at the phone in his hands.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { drawPhone, handPos } from '../_helpers.js';
registerShot('s027', { draw(g, t, info) {
  const cam = { z: 1.25, x: 0, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const s = V(1.35, 1.45), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const kian = { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.holdFront, t), expr: t > 0.8 ? 'smile' : 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    const [hx, hy] = handPos(kian);
    drawPhone(g, hx + 6, hy - 4, 0.1, 1.1);
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'CHANCES DO NOT GROW BACK.', E.W / 2, E.H * 0.2, { size: V(52, 60), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

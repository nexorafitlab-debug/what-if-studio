// s052 — "You eat her leftovers. The ones with her name on them." Kitchen: Kian at the fridge, container in hand.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s058', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.68, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(t > 1.6 ? POSES.sad : POSES.point, t, 1, 2), expr: t > 1.6 ? 'sad' : 'angry', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, '8', t);
    const pose = breathe(posesAt(t, [[0, POSES.holdFront], [1.2, POSES.shrug]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'DO NOT TOUCH — MIA', E.W / 2, E.H * 0.16, { size: V(40, 46), color: '#ffd76a', glow: 22, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

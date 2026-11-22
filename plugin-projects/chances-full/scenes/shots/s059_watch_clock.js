// s059 — "You watch her number like a clock. Every mistake ticks it down." Bedroom: Kian stares at Mia's 6.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s067', { draw(g, t, info) {
  const cam = { z: 1.4, x: 60, y: 110 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.62, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, '6', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.think]]), t);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.5, 0.8));
  text(g, 'LIKE A CLOCK.', E.W / 2, E.H * 0.16, { size: V(52, 58), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

// s067 P2 — "Her number stays six." Kian and Mia walk on together; her 6 holds.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s081', { draw(g, t, info) {
  const cam = { z: 1, x: 0, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mx = E.W * 0.42 + (t + 3.1) * 120;
    const mia = { x: mx, y: GY, s: V(1.25, 1.35), facing: 1, outfit: CAST.SISTER.outfit, pose: walkPose((t + 3.1) * Math.PI * 2 * 0.9 + 1.2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, '6', t);
    const lx = E.W * 0.2 + (t + 3.1) * 120;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose((t + 3.1) * Math.PI * 2 * 0.9), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'HER NUMBER STAYS SIX.', E.W / 2, E.H * 0.90, { size: V(44, 50), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

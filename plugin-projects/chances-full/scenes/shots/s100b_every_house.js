// s100 P2 — "Every house. Every room." Kian walks past another lit window, another number.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s136', { draw(g, t, info) {
  const cam = { z: 1.1, x: -40, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const ps = { x: E.W * 0.78, y: GY, s: V(1.2, 1.3), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, ps);
    const [hx, hy, hr] = headPos(ps);
    chancePill(g, hx, hy, hr, '5', t);
    const lx = E.W * 0.12 + (t + 3.64) * 130;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose((t + 3.64) * Math.PI * 2 * 0.8), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'EVERY HOUSE. EVERY ROOM.', E.W / 2, E.H * 0.16, { size: V(44, 50), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });

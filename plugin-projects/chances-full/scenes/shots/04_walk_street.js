// s004 — "Kian. That's your name." Morning street, Kian walks in left to right.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s004', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // a passer-by ahead, already wearing a number
    const ps = { x: E.W * 0.82, y: GY, s: V(1.1, 1.2), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim };
    drawFigure(g, ps);
    const [hx, hy, hr] = headPos(ps);
    chancePill(g, hx, hy, hr, '8', t);
    // Kian walks in (left to right)
    const lx = E.W * 0.12 + t * 170;
    drawFigure(g, { x: lx, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: t > 1.2 ? 'smile' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

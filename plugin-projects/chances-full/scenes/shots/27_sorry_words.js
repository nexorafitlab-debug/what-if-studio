// s027 — "Her number does not move. Still three. Sorry is just a word. The
// number does not listen to words." Mom's 3 holds. Text low, clear of the pill.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s029', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '3', t);
    const pose = breathe(posesAt(t, [[0, POSES.phone], [1.2, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'STILL THREE.', E.W / 2, E.H * 0.90, { size: V(52, 58), color: '#ffb347', glow: 26, glowColor: 'rgba(255,179,71,0.55)', spacing: 2, alpha: a });
} });

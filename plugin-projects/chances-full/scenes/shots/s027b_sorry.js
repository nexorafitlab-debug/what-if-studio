// s027 P2 — "Sorry is just a word." Kian lowers the phone; Mom's 3 does not move.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s030', { draw(g, t, info) {
  const cam = { z: 1.3, x: 30, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '3', t);
    const pose = breathe(posesAt(t, [[0, POSES.sad], [0.8, POSES.think]]), t);
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'SORRY IS JUST A WORD.', E.W / 2, E.H * 0.90, { size: V(48, 54), color: '#ffb347', glow: 26, glowColor: 'rgba(255,179,71,0.55)', spacing: 2, alpha: a });
} });

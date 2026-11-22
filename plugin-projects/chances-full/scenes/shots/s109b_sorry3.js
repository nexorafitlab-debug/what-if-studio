// s109 P2 — "You say sorry. Sorry. Sorry." Kian talks and talks; Mom's 2 does not move.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s153', { draw(g, t, info) {
  const cam = { z: 1.3, x: -30, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '2', t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.talk, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.4, 0.7));
  text(g, 'SORRY. SORRY. SORRY.', E.W / 2, E.H * 0.90, { size: V(44, 50), color: '#ffb347', glow: 26, glowColor: 'rgba(255,179,71,0.55)', spacing: 2, alpha: a });
} });

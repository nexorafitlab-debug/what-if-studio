// s023 — "Your mom's number? Three." Kitchen evening: Mom at the table, orange 3
// above her head. Kian stares. On screen: THREE.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s025', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Mom, behind the table, calm — she has no idea what hangs over her
    const mom = { x: E.W * 0.68, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '3', t);
    // Kian, realising — the lowest number he has seen all day
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.9, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 0.9 ? 'shocked' : 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 1.6, 1.9));
  text(g, 'THREE.', E.W / 2, E.H * 0.2, { size: V(96, 104), color: '#ffb347', glow: 30, glowColor: 'rgba(255,179,71,0.55)', spacing: 2, alpha: a });
} });

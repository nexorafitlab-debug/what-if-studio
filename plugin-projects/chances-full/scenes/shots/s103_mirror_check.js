// s103 — "You check the mirror. Your number was five." Bathroom: Kian steps to the mirror, reflection pill 5.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s140', { draw(g, t, info) {
  const cam = { z: 1.1, x: -60, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M, mirror } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const refl = { x: E.W * 0.42, y: mirror.y + mirror.h - 20, s: 1.15, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', alpha: 0.9, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, refl);
    const [hx, hy, hr] = headPos(refl);
    chancePill(g, hx, hy, hr, '5', t);
    const lx = E.W * 0.64 + t * 40;
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.think]]), t);
    drawFigure(g, { x: lx, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

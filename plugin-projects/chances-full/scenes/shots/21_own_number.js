// s021 — "Your own number. Above your own head." The mirror shows a pill above
// KIAN himself: 5. His own number — the first time he has ever seen it.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s023', { draw(g, t, info) {
  const cam = { z: 1.1, x: -60, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M, mirror } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the reflection inside the mirror: Kian, facing out, with a number over him
    const refl = { x: E.W * 0.42, y: mirror.y + mirror.h - 20, s: 1.15, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'shocked', alpha: 0.9, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, refl);
    const [hx, hy, hr] = headPos(refl);
    if (t > 0.4) chancePill(g, hx, hy, hr, '5', t);
    // Kian himself, facing the mirror, staring at his own number
    drawFigure(g, { x: E.W * 0.64, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t), expr: 'shocked', look: [-0.7, 0], talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

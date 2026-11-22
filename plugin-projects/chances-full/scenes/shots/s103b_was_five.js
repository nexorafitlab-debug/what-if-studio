// s103 P2 — "Your number was five." Close on the reflection: Kian's own 5, green.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s141', { draw(g, t, info) {
  const cam = { z: 1.3, x: -40, y: 20 };
  layer(g, cam, 1, (g) => {
    const { GY, M, mirror } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const refl = { x: E.W * 0.42, y: mirror.y + mirror.h - 20, s: 1.2, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', alpha: 0.9, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, refl);
    const [hx, hy, hr] = headPos(refl);
    chancePill(g, hx, hy, hr, '5', t);
    drawFigure(g, { x: E.W * 0.64, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.think, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

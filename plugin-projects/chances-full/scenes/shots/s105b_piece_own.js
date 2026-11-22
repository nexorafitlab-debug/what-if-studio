// s105 P2 — "You lost a piece of your own." Kian, hands on his head, staring at his 4.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s145', { draw(g, t, info) {
  const cam = { z: 1.3, x: -40, y: 60 }; // was z:1.4, x:0, y:80 — the tight zoom clipped the reflection's 4 pill off the top edge (seen in sheet still); matches s144's camera
  layer(g, cam, 1, (g) => {
    const { GY, M, mirror } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const refl = { x: E.W * 0.44, y: mirror.y + mirror.h - 20, s: 1.2, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', alpha: 0.9, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, refl);
    const [hx, hy, hr] = headPos(refl);
    chancePill(g, hx, hy, hr, '4', t);
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.handsOnHead, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });

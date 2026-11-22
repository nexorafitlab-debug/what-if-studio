// s051 — "You snap it in half. Nine. Eight." Bedroom: Mia's pill JUMPS 9 to 8 as Kian looks down.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s057', { draw(g, t, info) {
  const cam = { z: 1.3, x: 60, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.6, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(t > 1.0 ? POSES.sad : POSES.crossArms, t, 1, 2), expr: t > 1.0 ? 'sad' : 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '9'], [2.4, '8']]), t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.9, POSES.facepalm]]), t);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
